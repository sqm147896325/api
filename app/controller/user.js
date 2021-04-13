'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {

	main = this.service.user;

	// 获取某一用户
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

	// 创建用户
	async create() {
		const { ctx } = this;
		const { params , body } = ctx;
 		const { id , username } = await this.main.create(params.username,params.password,{
			emil: params.emil,
			tel: params.tel,
			des: params.des
		});
		body.flag = 1;
		ctx.status = 233;					// 渲染信息状态码
		body.msg = '添加成功';				// 要渲染的信息
		body.dataInfo = { id , username };	// 返回创建的用户的id及用户名
	};

	// 删除用户
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

	// 更新用户
	async update() {
		const { ctx } = this;
		const { params , body } = ctx;
		const result =  await this.main.update(params.id,{
			username: params.username,
			password: params.password,
			emil: params.emil,
			tel: params.tel,
			des: params.des
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

module.exports = UserController;
