'use strict';

const Controller = require('egg').Controller;

class MockController extends Controller {

	main = this.service.mock;

    /**
	 * @author sqm
	 * @description 登录接口
	 * @param {*}
	 * @backDes 
	 */	
	async login() {
		const result = await this.main.login()
		this.ctx.body = result.data
	};

	/**
	 * @author sqm
	 * @description 获取详情信息
	 * @param {*}
	 * @backDes
	 */	
	async getInfo() {
		const result = await this.main.getInfo();
		this.ctx.body = result.data
	};

    /**
	 * @author sqm
	 * @description 列表查询接口
	 * @param {*}
	 * @backDes
	 */	
	async listSearch() {
		const result = await this.main.listSearch()
		this.ctx.body = result.data
	};

    /**
	 * @author sqm
	 * @description 退出登录接口
	 * @param {*}
	 * @backDes
	 */	
	async logout() {
		const result = await this.main.logout()
		this.ctx.body = result.data
	};
}

module.exports = MockController;
