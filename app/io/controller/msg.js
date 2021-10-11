'use strict';

const Controller = require('egg').Controller;

class MsgController extends Controller {
	// 初始化
	async init() {
		const { ctx, app } = this;
		console.log(ctx.args)
		await ctx.socket.emit('res', 'init');
	}
	// 广播
	async broadcast() {
		const { ctx, app } = this;
		await ctx.socket.emit('res', 'broadcast');
	}
	// 单独推送
	async push() {
		const { ctx, app } = this;
		await ctx.socket.emit('res', 'push');
	}
	// 退出
	async exit() {
		const { ctx, app } = this;
		await ctx.socket.emit('res', 'exit');
	}
}

module.exports = MsgController;