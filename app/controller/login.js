'use strict';

const Controller = require('egg').Controller;

const crypto = require('crypto-js');

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
		const { params , helper } = ctx;
		const result = await this.main.login(params.id,params.password);
		if(!result){
			helper.info('账号密码错误');
			return false;
		}
		// 注册token
		const token = this.app.jwt.sign({
			username: result.username,
			id: result.id
		}, this.app.config.jwt.secret, {
			expiresIn: '3 days'
		} );
		
		try {
			await this.main.updataToken(token,result.id);
			const salt = this.ctx.helper.randomStr(8)
			const NewPassword = crypto.MD5(params.password + salt).toString();
			await this.main.updateSalt({id: result.id, password: NewPassword, salt});
			helper.success('登录成功',{
				token,
				userInfo:result
			});
		} catch (error) {
			console.log(error)
			helper.fail('登录失败');
			return false;
		}
	}
}

module.exports = LoginController;
