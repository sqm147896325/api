'use strict';

const Controller = require('egg').Controller;

class BlogController extends Controller {

	main = this.service.blog;

	// 获取某篇文章
	async read() {
		const { ctx } = this;
		const { params , body } = ctx;
		const result = await this.main.read(params.id);
		if(!result){
			ctx.status = 250;
			ctx.body.msg = '查询失败';
			return false;
		}
		body.flag = 1;
		body.dataInfo = result;
	};

	// 创建文章
	async create() {
		const { ctx } = this;
		const { params , body } = ctx;
 		const { id , username } = await this.main.create(params.author_id,params.author,params.title,params.content,{
			keyword: params.keyword,
			des: params.des
		});
		body.flag = 1;
		ctx.status = 233;					// 渲染信息状态码
		body.msg = '添加成功';				// 要渲染的信息
		body.dataInfo = { id , username };	// 返回创建的用户的id及用户名
	};

	// 删除文章
	async delete() {
		const { ctx } = this;
		const { params , body } = ctx
		const result =  await this.main.del(params.id);
		if(!result){
			ctx.status = 250;
			body.msg = '删除失败'
			return false;
		}
		body.flag = 1;
		body.msg = '删除成功';
	};

	// 更新文章
	async update() {
		const { ctx } = this;
		const { params , body } = ctx;
		const result =  await this.main.update(params.id,{
			title: params.title,
			content: params.content,
			des: params.des,
			keyword: params.keyword
		});
		if(!result){
			ctx.status = 250;
			body.msg = '更新失败'
			return false;
		}
		body.flag = 1;
		body.msg = '更新成功';
	};

	// 获取用户列表,支持模糊查询
	async getList() {
		const { ctx } = this;
		const { params , body } = ctx;
		const result = await this.main.getList(params.page,params.pagesize,params.key || 'id',params.query || '');
		body.flag = 1;
		body.dataInfo = result;
	};

}

module.exports = BlogController;
