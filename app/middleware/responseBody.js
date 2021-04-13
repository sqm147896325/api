'use strict';

// params中间件，将post与get请求的参数都放在params中
module.exports = options => {
	return async function params(ctx, next) {
		// 中间件，定义响应体格式
		// flag		0错误，1正确
		// msg		错误信息
		// dataInfo	正确对象
		ctx.body = {
			flag: 0,
			msg: '',
			dataInfo: {}
		};
		await next();
	};
};