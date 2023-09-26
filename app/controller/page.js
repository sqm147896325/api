'use strict';

const Controller = require('egg').Controller;

const fs = require('fs');

const path = require('path');

class PageController extends Controller {

    /**
     * @author sqm
     * @description 后台页面静态地址
     * @param {*}
     * @backDes
     */
	async back() {
        const { ctx } = this;
		const { helper } = ctx;
        this.ctx.set('Content-Type', 'text/html');
        try {
            this.ctx.body = await fs.readFileSync(path.join(this.app.baseDir, 'project/blog-back/dist/index.html'));
        } catch (error) {
            helper.fail('访问失败！')
        }
    }

    /**
     * @author sqm
     * @description 个人主页静态地址
     * @param {*}
     * @backDes
     */
    async home() {
        const { ctx } = this;
		const { helper } = ctx;
        this.ctx.set('Content-Type', 'text/html');
        try {
            this.ctx.body = await fs.readFileSync(path.join(this.app.baseDir, 'project/blog-home/dist/index.html'));
        } catch (error) {
            helper.fail('访问失败！')
        }
    }

    /**
     * @author sqm
     * @description 组件归集静态地址
     * @param {*}
     * @backDes
     */
    async com() {
        const { ctx } = this;
		const { helper } = ctx;
        this.ctx.set('Content-Type', 'text/html');
        try {
            this.ctx.body = await fs.readFileSync(path.join(this.app.baseDir, 'project/madder-com/dist/index.html'));
        } catch (error) {
            helper.fail('访问失败！')
        }
    }
}

module.exports = PageController;