'use strict';

const Controller = require('egg').Controller;
class toolController extends Controller {
    async email() {
        const { ctx } = this;
		const { helper,params } = ctx;
        const res = await helper.sendMail({
            email: params.email,
            subject: params.subject, // 标题
            text: ctx.params.text, // 文本
            html: ctx.params.html,
        })
        if(res) {
            helper.success('发送成功');
        } else {
            helper.fail('发送失败');
        }
    }

    async emailVerify() {
        const { ctx } = this;
		const { helper,params } = ctx;
        console.log(ctx.session)
        // const res = await helper.sendMail({
        //     email: params.email,
        //     subject: params.subject, // 标题
        //     text: ctx.params.text, // 文本
        //     html: ctx.params.html,
        // })
        // if(res) {
        //     helper.success('发送成功');
        // } else {
        //     helper.fail('发送失败');
        // }
    }
}

module.exports = toolController;
