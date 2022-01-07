'use strict';

const sshServer = require('../../utils/sshServer');

const Controller = require('egg').Controller;

class TermController extends Controller {

	// 初始化
	async init() {
        const { ctx } = this
        sshServer({
            host: '127.0.0.1',
            port: 22,
            username: 'admin',
            password: '666666'
        }, ctx)
	}

    // res 事件在 sshServer 中已经定义了
    // res() {}
}

module.exports = TermController;