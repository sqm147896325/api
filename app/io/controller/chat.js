'use strict';

const Controller = require('egg').Controller;

class ChatController extends Controller {
	// 初始化
	async init() {
		const { ctx, app } = this;
		const { helper, socket } = ctx;
		socket.emit('res', helper.params('init'))
	}
	// 发送消息
	async message() {
		const { ctx, app } = this;
		const { helper, socket } = ctx;
		socket.emit('res', helper.params('message'))
	}
	// 退出
	async exit() {
		const { ctx, app } = this;
		const { helper, socket } = ctx;
		socket.emit('res', helper.params('exit'))
	}
}

module.exports = ChatController;