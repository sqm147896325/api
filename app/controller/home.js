'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
	/**
	 * @author sqm
	 * @description 主页
	 * @param {*}
	 * @backDes 
	 */	
	async index() {
		const { ctx } = this;
		await ctx.render('index');
	};
}

module.exports = HomeController;
