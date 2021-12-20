'user strict';

const nodemailer = require('nodemailer');
const user_email = process.env.EMAIL_ADDRESS; // 发件邮箱地址
const auth_code = process.env.EMAIL_PASSWORD; // 发件邮箱密钥
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

// helper用来放utils
module.exports = {

	// 请求成功
	success(msg='',dataInfo={}){
		this.ctx.status = 200;
		this.ctx.body = {
			flag: 1,
			msg,
			dataInfo
		}
	},

	// 请求信息直接渲染
	info(msg='',dataInfo={type: 'warning'}){
		this.ctx.status = 233;
		this.ctx.body = {
			flag: 0,
			msg,
			dataInfo
		}
	},
	// 请求失败
	fail(msg='',dataInfo={}){
		this.ctx.status = 250;
		this.ctx.body = {
			flag: 0,
			msg,
			dataInfo
		}
	},

	// 请求成功
	params(data = {}, params = {}){
		const { socket, args } = this.ctx;
        const id = socket.id;
		// 先合并各项到params中
		if (typeof data === 'string') {
			params.msg = data
		} else {
			params = data
		}
		// 抽离需要提取的项
		let { msg, msgMap, ...dataInfo } = params
		return {
            id: id, // 不为空，发送者socketid
			sendName: args[0].name, // 不为空，发送者名称
			sendId: args[0].userId, // 不为空，发送者用户id
            time: new Date().getTime(), // ，不为空，消息时间戳
            msg, // 可为空，消息字段
            msgMap, // 可为空，消息字段中需要显示的key
            dataInfo // 可为空，数据字段
        }
	},



	/**
	 * @author sqm
	 * @description 多表联查
	 * @param {*} key 可能需要处理的行
	 * @param {*} keys 需要处理的行
	 * @param {*} results 处理行的规则数组，与上一参数一一对应
	 * @backDes 按规则处理后的key值
	 */
	changeQueryKey(key = '', keys = [], results = []){
		if (keys.indexOf(key) !== -1) {
			key = `$${results[keys.indexOf(key)]}$` // 字表需要在字符串前后添加$符
		}
		return key
	},

	async sendMail({ email, subject, text, html }) {
		const mailOptions = {
		  from: user_email, // 发送者,与上面的user一致
		  to: email,   // 接收者,可以同时发送多个,以逗号隔开
		  subject: `LS后台——${subject}`,   // 标题
		  text: `来自 api.sunqm.com/page/back\n${text}`,   // 文本
		  html,
		};	
		try {
		  await transporter.sendMail(mailOptions);
		  return true;
		} catch (err) {
		  return false;
		}
	}
};