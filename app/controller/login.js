'use strict';

const Controller = require('egg').Controller;

class LoginController extends Controller {

	main = this.service.user;

	async login() {
		const { ctx } = this;
		const { params , body } = ctx;
		const result = await this.main.login(params.id,params.password);
		if(!result){
			ctx.status = 250;
			ctx.body.msg = '账号密码错误';
			return false;
		}
		// 注册token
		const token = this.app.jwt.sign({
			username: result.username,
			id: params.id
		},this.app.config.jwt.secret );
		
		try {
			await this.main.updataToken(token,params.id);
		} catch (error) {
			ctx.status = 250;
			body.msg = 'token更新错误';
			return false;
		}
		body.flag = 1;
		body.dataInfo = {
			token,
			userInfo:result
		};
	}
}

module.exports = LoginController;
