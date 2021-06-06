'use strict';

const Controller = require('egg').Controller;

class FileController extends Controller {

    main = this.service.file;

    /**
     * @author sqm
     * @description 读取单个文件
     * @param {*}
     * @backDes 
     */
    async read() {
        const { ctx } = this;
		const { helper , params } = ctx;
		const res = await this.main.dirRead(params.id);
		if(res){
			helper.success('读取文件成功',res);
			return false;
		}
		helper.fail('读取文件失败',res);

    }

	/**
     * @author sqm
     * @description 上传文件
     * @param {*}
     * @backDes 
     */
	 async create() {
        const { ctx } = this;
		const { helper , params } = ctx;
		const { parentId , name , size , fileType , path , keyword , md5  } = params; // 获取创建文件的目录名称和父级目录的Id
		const res = await this.main.create(name , size , fileType , path );
		if(res){
			helper.success('创建文件成功');
			return false;
		}
		helper.fail('创建文件失败');
    }

	/**
     * @author sqm
     * @description 删除文件
     * @param {*}
     * @backDes 
     */
	 async delete() {
        const { ctx } = this;
		const { helper , params } = ctx;
		const res = await this.main.dirRead(params.id);
		if(res){
			helper.success('删除文件成功',res);
			return false;
		}
		helper.fail('删除文件失败',res);
    }

	// /**
    //  * @author sqm
    //  * @description 读取文件夹/文件目录
    //  * @param {path}	
    //  * @backDes 
    //  */
	//  async dirRead() {
    //     const { ctx } = this;
	// 	const { helper , params } = ctx;
	// 	const res = await this.main.dirRead(params.id);
	// 	if(res){
	// 		helper.success('读取目录成功',res);
	// 		return false;
	// 	}
	// 	helper.fail('读取目录失败',res);
    // }

	// /**
    //  * @author sqm
    //  * @description 创建文件夹/文件目录
    //  * @param {path}	
    //  * @backDes 
    //  */
	//  async dirCreate() {
    //     const { ctx } = this;
	// 	const { helper , params } = ctx;
	// 	const { parentId , name , size , fileType , keyword , md5  } = params; // 获取创建文件的目录名称和父级目录的Id
	// 	const res = await this.main.dirCreate();
	// 	if(res){
	// 		helper.success('创建目录成功');
	// 		return false;
	// 	}
	// 	helper.fail('创建目录失败');
    // }

	// /**
    //  * @author sqm
    //  * @description 删除文件夹/文件目录
    //  * @param {path}	
    //  * @backDes 
    //  */
	//  async dirDelete() {
    //     const { ctx } = this;
	// 	const { helper , params } = ctx;
	// 	const res = await this.main.dirDelete(params.id);
	// 	if(res){
	// 		helper.info('删除目录成功');
	// 		return false;
	// 	}
	// 	helper.fail('删除目录失败');
    // }
}

module.exports = FileController;