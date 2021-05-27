'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {

	main = this.service.user;

	/**
	 * @author sqm
	 * @description 获取某一用户信息
	 * @param {id:String}	账号
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
	 * @description 创建用户
	 * @param {username:String}		用户名称
	 * @param {password:String}		用户密码
	 * @param {emil:String}			用户邮箱
	 * @param {tel:String}			用户电话
	 * @param {des:String}			用户描述
	 * @backDes 
	 */	
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

	/**
	 * @author sqm
	 * @description 删除用户
	 * @param {id:String}	账号
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
	 * @description 更新用户
	 * @param {id:String}			账号
	 * @param {username:String}		用户名称
	 * @param {password:String}		用户密码
	 * @param {emil:String}			用户邮箱
	 * @param {tel:String}			用户电话
	 * @param {des:String}			用户描述
	 * @backDes 
	 */	
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

	/**
	 * @author sqm
	 * @description 获取用户列表,支持模糊查询
	 * @param {page:Number}		用户列表页码
	 * @param {pagesize:Number}	用户列表每页大小
	 * @param {key:String}		查询的关键字
	 * @param {query:String}	需要查询的内容
	 * @backDes 
	 */	
	async getList() {
		const { ctx } = this;
		const { params , helper } = ctx;
		const result = await this.main.getList(params.page,params.pagesize,params.key || 'id',params.query || '');
		helper.success('',result);
	};

	/**
	 * @author sqm
	 * @description 设置某一用户权限
	 * @param {id:String}			账号
	 * @param {power:String}		权限
	 * @backDes 
	 */	
	async setPower(){
		const { ctx } = this;
		const { params , helper } = ctx;
		const result = await this.main.setPower(params.id,params.power);
		if(!result){
			helper.fail('更新失败');
			return false;
		}
		helper.info('更新成功',result);
	};

}

module.exports = UserController;
