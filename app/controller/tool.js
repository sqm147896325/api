'use strict';

const Controller = require('egg').Controller;

const nodemailer = require('nodemailer');

const user_email = 'sunqimeng@sunqm.com';
const auth_code = '9kTdeh5epJPgQLyS';

const transporter = nodemailer.createTransport({
    // service: 'qq',
    host: 'smtp.exmail.qq.com',
    secureConnection: true,
    port: 465,
    auth: {
        user: user_email, // 账号
        pass: auth_code, // 授权码

    },
});

class toolController extends Controller {
    async email() {
        const { ctx } = this;
		const { helper,params } = ctx;
        const mailOptions = {
            from: user_email, // 发送者,与上面的user一致
            to: params.email,   // 接收者,可以同时发送多个,以逗号隔开
            subject: '测试邮件',   // 标题
            text: '测试',   // 文本
            html: '',
        };
        try {
            await transporter.sendMail(mailOptions);
            helper.success('发送成功');
            return true;
        } catch (err) {
            console.log(err)
            helper.fail('发送失败');
            return false;
        }

    }
}

module.exports = toolController;
