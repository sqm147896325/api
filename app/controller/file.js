'use strict';
const fs = require('fs');

const Controller = require('egg').Controller;

class FileController extends Controller {

    main = this.service.file;

    /**
     * @author sqm
     * @description 读取单个文件
     * @param {uudi:Number}		要读取的文件或文件夹id
     * @backDes 
     */
    async read() {
        const { ctx } = this;
		const { helper , params } = ctx;
		const res = await this.main.read(params.uuid);
		if(res){
			helper.success('读取文件成功',res);
			return false;
		}
		helper.fail('读取文件失败',res);

    }

	/**
     * @author sqm
     * @description 上传文件(目前只支持单文件上传)
     * @param {parentId:Number}		父级文件夹id，如果是在根目录下创建则传0
	 * @param {md5:String}			校验的md5码/文件夹为'0'
     * @param {name:String}			文件或文件夹名
     * @param {size:String}			文件大小/文件夹为0(如果没有则从文件中获取)
     * @param {keyword:String}		关键字,可选
     * @backDes 
     */
	 async create() {
        const { ctx } = this;
		const { helper , params } = ctx;
		
		if(ctx.request.files){
			// 如果有files属性说明有文件传输，此时是文件
			try {
				const { name , parentId , keyword } = params; // 获取参数
				let path;
				if(parentId == 0){
					path = '/';
				} else {
					path = '/' + await this.main.getPath(parentId) + '/';	// 通过父id获取路径
				}
				const nowDate = (new Date).getTime();				// 获取时间戳追加在文件的真实路径中
				const fullName = ctx.request.files[0].filename;		// 获取内容
				const temPath = ctx.request.files[0].filepath;		// 缓存文件的位置获取
				const fileType = /(.*)(\..*$)/.exec(fullName)[2];	// 获取文件类型
				path = path + name + nowDate + fileType;			// 重新拼接得到文件存放路径
				const size = await fs.statSync(temPath).size;		// 读取文件大小，单位字节
				await fs.copyFileSync(temPath,`app/public/static${path}`);	// 移动文件到父位置
				const res = await this.main.create(parentId , name , size , fileType , path , keyword);
				if(res){
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
			const { name , parentId , keyword} = params; // 获取参数
			let path;
			if(parentId == 0){
				path = '/'
			} else {
				path = '/' + await this.main.getPath(parentId) + '/';	// 通过父id获取路径
			}
			const fileType = 'dir';		// 设置类型为文件夹
			const size = 0;
			path = path + name;
			await fs.mkdirSync('app/public/static' + path );
			const res = await this.main.create(parentId , name , size , fileType , path , keyword);
			if(res){
				helper.success('创建文件夹成功');
				return false;
			}
			helper.fail('创建文件夹失败');
		}
    }

	/**
     * @author sqm
     * @description 删除文件
     * @param {uuid:Number}		要删除的文件或文件夹uuid
     * @backDes 
     */
	 async delete() {
        const { ctx } = this;
		const { helper , params } = ctx;
		const res = await this.main.del(params.uuid);
		if(res){
			helper.success('删除文件成功',res);
			return false;
		}
		helper.fail('删除文件失败',res);
    }
}

module.exports = FileController;