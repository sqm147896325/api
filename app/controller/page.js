'use strict';

const Controller = require('egg').Controller;

const fs = require('fs');

const path = require('path');

class PageController extends Controller {

	async back() {
        const { ctx } = this;
		const { helper,params } = ctx;
        this.ctx.set('Content-Type', 'text/html');
        try {
            this.ctx.body = await fs.readFileSync(path.join(this.app.baseDir, 'project/blog-back/dist/index.html'));
        } catch (error) {
            helper.fail('访问失败！')
        }
    }
}

module.exports = PageController;