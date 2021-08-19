'use strict';

const Controller = require('egg').Controller;

class LoginController extends Controller {

	main = this.service.user;

	/**
	 * @author sqm
	 * @description 登录
	 * @param {id:String}		账号
	 * @param {password:String}	密码
	 * @backDes 返回token和用户信息
	 */	
	async login() {
		const { ctx } = this;
		const { params , body , helper } = ctx;
		const result = await this.main.login(params.id,params.password);
		if(!result){
			helper.fail('账号密码错误');
			return false;
		}
		// 注册token
		const token = this.app.jwt.sign({
			username: result.username,
			id: params.id
		}, this.app.config.jwt.secret, {
			expiresIn: '3 days'
		} );
		
		try {
			await this.main.updataToken(token,params.id);
			helper.success('登录成功',{
				token,
				userInfo:result
			});
		} catch (error) {
			helper.fail('token更新错误');
			return false;
		}
	}
}

module.exports = LoginController;
