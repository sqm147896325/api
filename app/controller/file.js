'use strict';
const fs = require('fs');

const Controller = require('egg').Controller;

class FileController extends Controller {

    main = this.service.file;

    /**
     * @author sqm
     * @description 读取单个文件
     * @param {uudi} Number 要读取的文件或文件夹id
     * @backDes 
     */
    async read() {
        const { ctx } = this;
		const { helper , params } = ctx;
		const res = await this.main.read(params.uuid,params['user_id']);
		if(res){
			helper.success('读取文件成功',res);
			return false;
		}
		helper.fail('读取文件失败',res);

    }

	/**
     * @author sqm
     * @description 上传文件,目前只支持单文件上传
     * @param {Number} parentId 父级文件夹id,如果是在根目录下创建则传0
	 * @param {String} md5 校验的md5码,文件夹为'0'
     * @param {String} name 文件或文件夹名
     * @param {String} size 文件大小,文件夹为0,如果没有则从文件中获取
     * @param {String} keyword 关键字,可选
     * @backDes 
     */
	async create() {
        const { ctx } = this;
		const { helper , params } = ctx;
		
		if(ctx.request.files){
			// 如果有files属性说明有文件传输，此时是文件
			try {
				const { name , parentId , keyword, user_id } = params; // 获取参数
				let path;
				if(parentId == 0){
					path = '/';
				} else {
					path = await this.main.getPath(parentId) + '/';	// 通过父id获取路径
				}

				// 构建文件结构
				let files = [];
				await ctx.request.files.map(async (e,i) => {
					const nowDate = (new Date).getTime();				// 获取时间戳追加在文件的真实路径中
					const temPath = e.filepath;		// 缓存文件的位置获取
					files[i] = {};
					files[i].parentId = parentId;
					files[i].name = /(.*)(\..*$)/.exec(e.filename)[1];
					files[i].file_type = /(.*)(\..*$)/.exec(e.filename)[2];
					files[i].path = path + files[i].name + nowDate + files[i].file_type
					files[i].size = await fs.statSync(temPath).size;
					files[i].url = '/';
					files[i]['user_id'] = user_id;
					await fs.copyFileSync(temPath,`app/public/static${files[i].path}`);	// 移动文件到父位置
				});

				const res = await this.main.create(files);
				if(res.length > 0){
					helper.success('创建文件成功');
					return false;
				}
				helper.fail('创建文件失败');
			} finally {
				// 清除临时文件
				await ctx.cleanupRequestFiles();
			};
		} else {
			// 否则是文件夹
			const { name , parentId, user_id } = params; // 获取参数
			let path;
			if(parentId == 0){
				path = '/'
			} else {
				path = await this.main.getPath(parentId) + '/';	// 通过父id获取路径
			}

			// 构建文件夹结构
			let files = [{
				parentId: parentId,
				name: name,
				user_id,
				file_type: 'dir',
				path: path + name + (new Date).getTime(),
				size: 0,
				url: '/',
			}]

			await fs.mkdirSync('app/public/static' + files[0].path );
			await fs.mkdirSync('app/public/trash' + files[0].path );
			const res = await this.main.create(files);
			if(res.length > 0){
				helper.success('创建文件夹成功');
				return false;
			}
			helper.fail('创建文件夹失败');
		}
    }

	/**
     * @author sqm
     * @description 删除文件
     * @param {Array} delArr 要删除的文件或文件夹uuid的数组
     * @backDes 
     */
	 async delete() {
        const { ctx } = this;
		const { helper , params } = ctx;
		console.log(params)
		try{
			await params.delArr.map(async e => {
				await this.main.del(e,params['user_id']);
			})
			helper.success('删除文件成功');
			return false;
		} catch(err) {
			console.log(err)
			helper.fail('删除文件失败',err);
		}
    }

	/**
     * @author sqm
     * @description 下载文件压缩包
     * @param {Array} downloadArr 要下载的文件或文件夹uuid的数组
     * @backDes 
     */
	 async downloadZip() {
        const { ctx } = this;
		const { helper , params } = ctx;
		try{
			let downloadArr = params.downloadArr.split(',')
			const { path, filename } = await this.main.downloadZip(downloadArr, params['user_id']);
			ctx.attachment(path);		// 相当于设置响应头
			const stats = await fs.statSync(path, {
				encoding: 'utf8',
			});
			ctx.response.set({
				'Content-Type': 'application/octet-stream',
				'Content-Disposition': `attachment; filename=${filename}`,
				'Content-Length': stats.size,
			});
			const readStream = ctx.body = fs.createReadStream(path);
			//读取文件发生错误事件
			readStream.on('error', (err) => {
				console.log('发生异常:', err);
			});
			//已打开要读取的文件事件
			readStream.on('open', (fd) => {
				console.log('文件已打开:', fd);
			});
			//文件已经就位，可用于读取事件
			readStream.on('ready', () => {
				console.log('文件已准备好..');
			});
			//文件读取中事件·····
			readStream.on('data', (chunk) => {
				console.log('读取文件数据:', chunk);
			});
			//文件读取完成事件
			readStream.on('end', () => {
				console.log('读取已完成..');
			});
			//文件已关闭事件
			readStream.on('close', () => {
				console.log('文件已关闭！');
				fs.unlink(path, () => {
					console.log(path, '文件删除完毕');
				})
			});
			return false;
		} catch(err) {
			helper.fail('下载文件失败',err);
		}
    }


	/**
     * @author sqm
     * @description 下载、预览单文件
     * @param {String} fileId 要下载的文件的uuid
     * @param {String} user_id 要下载的文件所属用户的uuid
     * @param {Any} download 是否调用下载的标志
     * @backDes 
     */
	async fileLink() {
		const { ctx } = this;
		const { helper , params } = ctx;
		try{
			const { path, filename } = await this.main.fileLink(params.fileId, params['user_id']);
			ctx.attachment(path);		// 相当于设置响应头
			const stats = await fs.statSync(path, {
				encoding: 'utf8',
			});
			let responseHeader = {
				'Content-Disposition': `inline; filename=${filename}`,
				'Content-Length': stats.size,
			}
			if (params.download) {
				// 如果有 download 标识，则进行下载
				responseHeader['Content-Type'] = 'application/octet-stream'
				responseHeader['Content-Disposition'] = `attachment; filename=${filename}`
			}
			ctx.response.set(responseHeader);
			ctx.body = fs.createReadStream(path);
		} catch(err) {
			helper.fail('下载文件失败',err);
		}
	}
}

module.exports = FileController;