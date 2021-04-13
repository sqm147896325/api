'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {

	main = this.service.user;

	// 获取某一用户
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

	// 创建用户
	async create() {
		const { ctx } = this;
		const { params , body , helper } = ctx;
 		const { id , username } = await this.main.create(params.username,params.password,{
			emil: params.emil,
			tel: params.tel,
			des: params.des
		});
		helper.info('添加成功',{ id , username });
	};

	// 删除用户
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

	// 更新用户
	async update() {
		const { ctx } = this;
		const { params , body , helper } = ctx;
		const result =  await this.main.update(params.id,{
			username: params.username,
			password: params.password,
			emil: params.emil,
			tel: params.tel,
			des: params.des
		});
		if(!result){
			helper.fail('更新失败');
			return false;
		}
		helper.success('更新成功',result);
	};

	// 获取文章列表,支持模糊查询
	async getList() {
		const { ctx } = this;
		const { params , body , helper } = ctx;
		const result = await this.main.getList(params.page,params.pagesize,params.key || 'id',params.query || '');
		helper.success('',result);
	};

}

module.exports = UserController;
