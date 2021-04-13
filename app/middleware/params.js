'use strict';

// params中间件，将post与get请求的参数都放在params中
module.exports = options => {
	return async function params(ctx, next) {
		ctx.params = {
			...ctx.query, //get请求解析后
			...ctx.request.body //post请求解析后
		};
		await next();
	};
};