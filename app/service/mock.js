'use strict';
const mock = require("mockjs")

const mockJson = require('../mock.config.js')

const Service = require("egg").Service;

class MockService extends Service {

    // 登录
	async login(){
		return mock.mock(mockJson.login);
	}

    // 获取详情信息
	async getInfo(){
		return mock.mock(mockJson.getInfo);
	}

    // 列表查询接口
	async listSearch(){
		return mock.mock(mockJson.listSearch);
	}

    // 退出登录接口
	async logout(){
		return mock.mock(mockJson.logout);
	}
}

module.exports = MockService;