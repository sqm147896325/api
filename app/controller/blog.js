'use strict';

const Controller = require('egg').Controller;

class BlogController extends Controller {

	main = this.service.blog;

	/**
	 * @description: 获取某篇文章
	 * @param {id:Number}		文章id
	 * @return {return:Object}	success或fail
	 * @Date Changed: 2021-5-24
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
	 * @description: 创建文章
	 * @param {id:Number}		文章id
	 * @param {author:String}	作者名称
	 * @param {title:String}	文章标题
	 * @param {content:String}	文章内容
	 * @param {lenght:String}	文章长度
	 * @param {keyword:String}	查询关键字
	 * @param {des:String}		查询描述
	 * @return {return:Object}	info
	 * @Date Changed: 2021-5-24
	 */	
	async create() {
		const { ctx } = this;
		const { params , body , helper } = ctx;
 		const { id , name } = await this.main.create(params.author_id,params.author,params.title,params.content,params.lenght,{
			keyword: params.keyword,
			des: params.des
		});
		helper.info('添加成功',{ id , name });
	};

	// 删除文章
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

	// 更新文章
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

	// 获取博客列表,支持模糊查询
	async getList() {
		const { ctx } = this;
		const { params , body , helper } = ctx;
		const result = await this.main.getList(params.page,params.pagesize,params.key || 'id',params.query || '');
		helper.success('',result);
	};

}

module.exports = BlogController;
