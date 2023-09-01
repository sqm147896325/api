'use strict';
const fs = require('fs');
const archiver = require('archiver');

const Service = require("egg").Service;

const Op = require('sequelize').Op;		// 定义sequelize的运算符

const staticPath = 'app/public/static' // 文件静态目录位置
const trashPath = 'app/public/trash' // 文件回收站位置
const zipTempPath = 'app/public/zipTemp' // 文件压缩缓存位置

class FileService extends Service {

	main = this.ctx.model.File;

	// 获取单个文件信息
	async read(uuid,user_id){
		if( uuid != 0 ){
			// 父目录不是根目录
			const result = await this.main.findOne({
				where: {
					uuid,
					display: 1, 	// 只查询未删除的数据
					user_id
				},
				attributes: [
					'uuid',
					'name',
					'user_id',
					'size',
					'file_type',
					'keyword',
					'url',
					'path',
					'upload_time'
				]
			});
			if(result.dataValues.file_type == 'dir'){
				// 文件夹执行内容
				const content = await this.getItem(uuid,user_id);
				result.dataValues.content = content;
			} else {
				// 文件执行内容
				const content = fs.readFileSync(staticPath + '/' + result.dataValues.path);
				delete result.dataValues.path;			// 不对外暴露内部目录结构
				result.dataValues.content = content;
			}
			return result;
		}
		// 父目录是根目录
		const content = await this.getItem(uuid,user_id);
		const result = {uuid: 0, name: 'root', size:0, file_type:'dir', keyword: 'root', content, upload_time:'2021-06-12T13:00:00.000Z'};
		return result;
	}

	// 通过父级id查询子集
	async getItem(parentId,user_id) {
		const result = await this.main.findAll({
			where: {
				parentId,		// 只查询父id对应的子集
				display: 1,
				user_id			// 只查对应用户下的
			},
			attributes: [
				'uuid',
				'name',
				'size',
				'user_id',
				'file_type',
				'upload_time'
			]
		});
		if(!result){
			return []
		}
		return result;
	}

	// 通过父级id查询其父路径
	async getPath(uuid) {
		const result = await this.main.findOne({
			where: {
				uuid,
				display: 1, 	// 只查询未删除的数据
			},
			attributes: [ 'path' ]
		});
		return result.dataValues.path;
	}

	// 创建文件或文件夹(单个或批量)
	async create(files){
		const result = await this.main.bulkCreate(files);	
		return result;
	}

	// 删除文件
	async del(uuid,user_id){
		const type = await this.main.findOne({
			where: { user_id, uuid },
			attributes: [ 'file_type', 'path' ]
		});
		// 如果类型为文件夹
		if(type['file_type'] == 'dir'){
			// 递归获取子集状态
			const itemArr = await this.main.findAll({
				where: {
					parentId: uuid,		// 只查询父id对应的子集
					display: 1
				},
				attributes: [ 'uuid' ]
			});
			// 递归更新子集状态
			await itemArr.map(async e => {
				this.del(e.uuid);
			})
		} else {
			// 类型为文件
			// 移动真实路径到trash中
			await fs.renameSync(`${staticPath}${type.path}`,`${trashPath}${type.path}`);
		}
		// 类型为文件或文件夹最后一步,更新当前删除状态
		const result = await this.main.update({ display: 0 },{
			where: {uuid}
		});
		if(result[0] == 0){
			// 未发生更新
			return false;
		}
		return true;
	}

	// 下载文件压缩包
	async downloadZip(arr,user_id) {
		// 获取文件路径
		let path = await this.main.findAll({
			where:{ uuid: { [Op.in]: arr }, user_id },
			attributes: [ 'path','file_type','name' ]
		})
		let filename = (new Date).getTime() + '.zip'; // 设置压缩路径
		let zipPath = `${zipTempPath}/${filename}`
		try {
			let output = fs.createWriteStream(zipPath); // 创建写入流
			let archive = archiver('zip', {
				zlib: { level: -1 }	// 设置压缩级别
			});
			archive.pipe(output)	// 使用管道连接两个流
			path.forEach(e => {
				// 根据路径匹配需要压缩的文件
				if( e['file_type'] == 'dir' ) {
					// 如果是目录，执行
					archive.directory(`${staticPath}/${e.path}/`,e.name);
				} else {
					// 如果是文件，执行
					archive.append(fs.createReadStream(`${staticPath}/${e.path}`),{name: e.name+e['file_type']});
				}
			});
			// 最终打包
			await archive.finalize();
		} catch (error) {
			console.log('压缩失败',error)
		}
		return {
			path: zipPath,
			filename: filename
		};
	}

	async fileLink(fileId, user_id) {
		// 获取文件路径
		let file = await this.main.findOne({
			where:{ uuid: fileId, user_id },
			attributes: [ 'path','file_type','name' ]
		})
		return {
			path: staticPath + file.path,
			filename: file.name + file.file_type
		}
	}
}

module.exports = FileService;
