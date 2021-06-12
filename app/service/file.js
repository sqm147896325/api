'use strict';
const fs = require('fs')

const Service = require("egg").Service;

class FileService extends Service {

	main = this.ctx.model.File;

	// 获取单个文件信息
	async read(uuid){
		if( uuid != 0 ){
			// 父目录不是根目录
			const result = await this.main.findByPk(uuid,{
				where: {
					display: 1, 	// 只查询未删除的数据
				},
				attributes: [
					'uuid',
					'name',
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
				const content = await this.getItem(uuid);
				result.dataValues.content = content;
			} else {
				// 文件执行内容
				const content = fs.readFileSync('app/public/static/' + result.dataValues.path);
				delete result.dataValues.path;			// 不对外暴露内部目录结构
				result.dataValues.content = content;
			}
			return result;
		}
		// 父目录是根目录
		const content = await this.getItem(uuid);
		const result = {uuid: 0, name: 'root', size:0, file_type:'dir', keyword: 'root', content, upload_time:'2021-06-12T13:00:00.000Z'};
		return result;
	}

	// 通过父级id查询子集
	async getItem(parentId) {
		const result = await this.main.findAll({
			where: {
				parentId,		// 只查询父id对应的子集
				display: 1
			},
			attributes: [
				'uuid',
				'name',
				'size',
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
		const result = await this.main.findByPk(uuid,{
			where: {
				display: 1, 	// 只查询未删除的数据
			},
			attributes: [ 'path' ]
		});
		return result.dataValues.path;
	}
	
	// 按需创建文件
	async create(parentId ,name, size, fileType, path, keyword, url='/' , option={}){
		const result = await this.main.create({
			parentId,
			name,
			size,
			file_type: fileType,
			path,
			keyword,
			url,
			keyword: option.keyword
		});	
		return result;
	}

	// 删除文件
	async del(uuid){
		const result = await this.main.update({ display: 0 },{
			where: {uuid}
		});
		if(result[0] == 0){
			// 未发生更新
			return false;
		}
		return true;
	}
}

module.exports = FileService;
