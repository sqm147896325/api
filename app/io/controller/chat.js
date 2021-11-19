'use strict';

const Controller = require('egg').Controller;

class ChatController extends Controller {
	// 初始化
	async init() {
		const { ctx, app } = this;
		const { helper } = ctx;
		await helper.ioSuccess('init', '初始化成功', null);
	}
	// 发送消息
	async message() {
		const { ctx, app } = this;
		const { helper } = ctx;
		await helper.ioSuccess('message', 'chat消息', null);
	}
	// 退出
	async exit() {
		const { ctx, app } = this;
		const { helper } = ctx;
		await helper.ioSuccess('exit', 'chat退出', null);
	}
}

module.exports = ChatController;