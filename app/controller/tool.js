'use strict';

const Controller = require('egg').Controller;
class toolController extends Controller {

    tool = this.service.tool

    /**
     * @author sqm
     * @description 发送邮件
     * @param {email:String}		邮箱地址
     * @param {subject:String}		邮件标题
     * @param {text:String}		    邮件内容
     * @param {html:String}		    邮件html
     * @backDes 
     */
    async email() {
        const { ctx } = this;
		const { helper,params } = ctx;
        const res = await helper.sendMail({
            email: params.email,
            subject: params.subject, // 标题
            text: params.text, // 文本
            html: params.html,
        })
        if(res) {
            helper.info('发送成功', { type: 'success' });
        } else {
            helper.info('发送失败');
        }
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
            helper.success('获取成功', res.result);
        } else {
            helper.info('获取失败', res.message);

        }
    }
}

module.exports = toolController;