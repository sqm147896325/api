'use strict';

const Controller = require('egg').Controller;

class ChatController extends Controller {
	// 初始化
	async init() {
		const { ctx, app } = this;
		await ctx.socket.emit('res', 'init');
	}
	// 发送消息
	async message() {
		const { ctx, app } = this;
		await ctx.socket.emit('res', 'message');
	}
	// 退出
	async exit() {
		const { ctx, app } = this;
		await ctx.socket.emit('res', 'exit');
	}
}

module.exports = ChatController;