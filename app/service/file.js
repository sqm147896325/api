'use strict';

const Service = require("egg").Service;

class FileService extends Service {

	main = this.ctx.model.File;

	// 获取单个文件信息
	async read(id){
		const result = await this.main.findByPk(id,{});
		return result;
	}
	
	// 按需创建文件
	async create(name, size, fileType, path, url='/', md5='0', option={}){
		const result = await this.main.create({
			name,
			size,
			file_type: fileType,
			path,
			url,
			md5,
			keyword: option.keyword
		});	
		return result;
	}

	// 删除文件
	async del(id){
		const result = await this.main.update({ display: 0 },{
			where: {id}
		});
		if(result[0] == 0){
			// 未发生更新
			return false;
		}
		return true;
	}

	// // 读取文件夹
	// async dirRead(id){
	// 	const result = await this.main.findByPk(id,{});
	// 	return result;
	// }

	// // 按需创建文件夹
	// async dirCreate({},option={}){
	// 	const result = await this.main.create({});	
	// 	return result;
	// }

	// // 删除文件夹
	// async dirDelete(id){
	// 	const result = await this.main.update({ display: 0 },{
	// 		where: {id}
	// 	});
	// 	if(result[0] == 0){
	// 		// 未发生更新
	// 		return false;
	// 	}
	// 	return true;
	// }

}

module.exports = FileService;
