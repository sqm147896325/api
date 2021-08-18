'use strict';

module.exports = (options, app) => {
    return async function (ctx, next) {
        //拿到不需要验证的token的路由
        const tokenWL = app.config.tokenWL;
        //获取当前路由
        const url = ctx.path;
        //判断当前路由是否需要验证token
        let flag = tokenWL.includes(url);

        if (flag) {
			// 不需要验证
            await next();
        } else {
			// 需要验证
            //获取token,如果没有传入token，则为空
			let	token = ctx.headers.authorization ? ctx.headers.authorization.substring(7) : '';

            // 解析token
            try {
				// 解析出数据
                const decode = await app.jwt.verify(token, app.config.jwt.secret);

				// 验证是否与数据库中的token保持一致,不限制token同时登录可以注释以下代码
				// 在中间件中调用service需要使用serviceClasses，且只能使用静态方法
				const result = await ctx.service.user.aloneToken(token,decode.username,decode.id);
				if(!result){
					// 没有匹配数据token被替换
					ctx.status = 401;
					ctx.body = {
						flag: 0,
						msg: 'token被替换'
					}
					return false;
				}

				// 把数据放在state存储
				ctx.state.userInfo = decode;

            } catch (err) {
				console.log(err)
				// token错误定义
                ctx.status = 401;
                ctx.body = {
                    flag: 0,
                    msg: 'token失效或解析错误',
                    dataInfo: err
				}
				// 直接拦截使请求停止下发
				return false;
			}

			// 洋葱卷模型需要注意next()的位置 
			await next();

		}
	}
}