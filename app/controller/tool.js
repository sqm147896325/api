'use strict';

const Controller = require('egg').Controller;
class toolController extends Controller {

    tool = this.service.tool

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

    /**
     * @author sqm
     * @description 调用百度地图api
     * @param {url:String}		'api.map.baidu.com'后拼接的地址
     * @param {data:Object}		对应服务所需要的参数，除去ak，详情见百度Web服务API
     * @backDes 
     */
    async openMap() {
        const { ctx } = this;
		const { helper, params } = ctx;
        const { url, ...data } = params
        const res = await this.tool.openMap(url, data)
        if (res.status === 0) {
            helper.success('获取成功', res.result)
        } else {
            helper.fail('获取失败', res.message);

        }
    }
}

module.exports = toolController;
