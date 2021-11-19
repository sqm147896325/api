'use strict';

const Controller = require('egg').Controller;

class MsgController extends Controller {
	// 初始化
	async init() {
		const { ctx, app } = this;
		const { helper } = ctx;
		await helper.ioSuccess('init', '初始化成功', null);
	}
	// 广播
	async broadcast() {
		const { ctx, app } = this;
		const { helper } = ctx;
		await helper.ioSuccess('broadcast', 'msg广播', null);
	}
	// 单独推送
	async push() {
		const { ctx, app } = this;
		const { helper } = ctx;
		await helper.ioSuccess('push', 'msg单独推送', null);
	}
	// 退出
	async exit() {
		const { ctx, app } = this;
		const { helper } = ctx;
		await helper.ioSuccess('exit', 'msg退出', null);
	}
}

module.exports = MsgController;