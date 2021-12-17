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
            helper.success('发送成功');
        } else {
            helper.fail('发送失败');
        }
    }

    /**
     * @author sqm
     * @description 邮箱验证码
     * @param {email:String}		邮箱地址
     * @param {type:number}		    操作类型（0注册，1修改）
     * @backDes 
     */
    async emailVerify() {
        const { ctx, app } = this;
		const { helper,params } = ctx;
        const main = this.service.user;
        let { count } = await main.getList(1, 10, 'emil', params.email);
        if (params.type === '0' && count !== 0) {
            helper.fail('邮箱已被注册');
            return false
        } else if (params.type !== '0' && count === 0) {
            helper.fail('邮箱未注册');
            return false
        }
        let varStr = '1234567890abcdefghigklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
        let text = varStr[Number.parseInt(Math.random() * varStr.length)] + varStr[Number.parseInt(Math.random() * varStr.length)] + varStr[Number.parseInt(Math.random() * varStr.length)] + varStr[Number.parseInt(Math.random() * varStr.length)]
        const res = await helper.sendMail({
            email: params.email,
            subject: '验证码',
            text: `您的验证码为: ${text}`,
            html: null
        })
        if(res) {
            await app.redis.set(params.email, text, 'Ex', '1800');
            helper.success('发送成功');
        } else {
            helper.fail('发送失败');
        }
    }

    /**
     * @author sqm
     * @description 邮箱验证码设置用户信息
     * @param {email:String}		邮箱
     * @param {password:String}		用户密码
     * @param {verification:String}	验证码
     * @param {type:number}		    操作类型（0注册，1修改）
     * @backDes 
     */
     async emailSetUser() {
        const { ctx, app } = this;
		const { helper, params } = ctx;
        const verification = await app.redis.get(params.email);
        if (verification !== params.verification) {
            helper.fail('失败！验证码错误');
            return false
        }
        const main = this.service.user;
        console.log(params)
        if (params.type === '0') {
            const res = await main.create(params.email, params.password,{
                emil: params.email
            });
            console.log(res)
            helper.success(`创建成功`);
            // helper.success(`创建成功，账号为${id}`);
        } else {
            let { count, rows } = await main.getList(1, 10, 'emil', params.email);
            if (count === 0) {
                helper.fail('修改密码失败');
                return false
            }
            const flag = await main.update(rows[0].id, {
                password: params.password
            });
            if (flag) {
                helper.success('修改密码成功');
            } else {
                helper.fail('修改密码失败');
            }
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
            helper.success('获取成功', res.result)
        } else {
            helper.fail('获取失败', res.message);

        }
    }
}

module.exports = toolController;
