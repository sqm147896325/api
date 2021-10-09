'use strict';

const Controller = require('egg').Controller;

class BlogController extends Controller {

	main = this.service.blog;

	/**
	 * @author sqm
	 * @description 获取某篇文章
	 * @param {id:Number}	文章id
	 * @backDes 
	 */
	async read() {
		const { ctx } = this;
		const { params , body , helper } = ctx;
		const result = await this.main.read(params.id);
		if(!result){
			helper.fail('查询失败');
			return false;
		}
		helper.success('查询成功',result);
	};

	/**
	 * @author sqm
	 * @description 添加创建文章
	 * @param {id:Number}		文章id
	 * @param {title:String}	文章标题
	 * @param {content:String}	文章内容
	 * @param {lenght:String}	文章长度
	 * @param {keyword:String}	查询关键字
	 * @param {des:String}		查询描述
	 * @backDes 
	 */	
	async create() {
		const { ctx } = this;
		const { params , body , helper } = ctx;
 		const { id , name } = await this.main.create(params.author_id,params.title,params.content,params.lenght,{
			keyword: params.keyword,
			des: params.des
		});
		helper.info('添加成功',{ id , name });
	};

	/**
	 * @author sqm
	 * @description 删除文章
	 * @param {id:Number}	文章id
	 * @backDes 
	 */
	async delete() {
		const { ctx } = this;
		const { params , body , helper } = ctx
		const result =  await this.main.del(params.id);
		if(!result){
			helper.fail('删除失败');
			return false;
		}
		helper.success('删除成功',result);
	};

	/**
	 * @author sqm
	 * @description 更新文章
	 * @param {id:Number}		文章id
	 * @param {title:String}	文章标题
	 * @param {content:String}	文章内容
	 * @param {des:String}		文章描述
	 * @param {keyword:String}	文章关键字
	 * @param {lenght:String}	文章长度
	 * @backDes 
	 */	
	async update() {
		const { ctx } = this;
		const { params , body , helper } = ctx;
		const result =  await this.main.update(params.id,{
			title: params.title,
			content: params.content,
			des: params.des,
			keyword: params.keyword,
			lenght: params.lenght
		});
		if(!result){
			helper.fail('更新失败');
			return false;
		}
		helper.info('更新成功',result);
	};

	/**
	 * @author sqm
	 * @description 获取博客列表,支持模糊查询
	 * @param {page:Number}		博客列表页码
	 * @param {pagesize:Number}	博客列表每页大小
	 * @param {key:String}		查询的关键字
	 * @param {query:String}	需要查询的内容
	 * @backDes 
	 */	
	async getList() {
		const { ctx } = this;
		const { params , body , helper } = ctx;
		const result = await this.main.getList(params.page,params.pagesize,params.key || 'id',params.query || '');
		helper.success('',result);
	};

	/**
	 * @author sqm
	 * @description 获取所有种类的博客标签及每个标签下的博客数量
	 * @param {*} 
	 * @backDes 
	 */	
	async getKeyword() {
		const { ctx } = this;
		const { params , body , helper } = ctx;
		const result = await this.main.getKeyword()
		helper.success('',result);
	}

}

module.exports = BlogController;
