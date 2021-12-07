'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const {
      router,
      controller,
      io
    } = app;

    /* 普通接口 */

    router.get('/', controller.home.index);

	// 登录接口
    router.post('/login', controller.login.login);

    // 博客相关路由
    router.get('/blog', controller.blog.read);
    router.post('/blog', controller.blog.update);
    router.put('/blog', controller.blog.create);
    router.delete('/blog', controller.blog.delete);
    router.get('/blog/list', controller.blog.getList);
    router.get('/blog/keyword', controller.blog.getKeyword);

    // 用户相关路由
    router.get('/user', controller.user.read);
    router.post('/user', controller.user.update);
    router.put('/user', controller.user.create);
    router.delete('/user', controller.user.delete);
    router.get('/user/list', controller.user.getList);
    router.post('/user/power', controller.user.setPower);

    // 接口文档路由
    router.get('/api/index', controller.api.index);

	// 文件操作相关路由
	router.post('/file/index', controller.file.read);
	router.put('/file/index', controller.file.create);
    router.delete('/file/index', controller.file.delete);
    router.get('/file/download', controller.file.download);

	// webHook自动部署
	router.post('/webHook/index', controller.webHook.index);
	router.post('/webHook/back', controller.webHook.back);

    // 工具-邮箱接口
	router.get('/tool/email', controller.tool.email);
    // 工具-邮箱验证码
	router.post('/tool/emailVerify', controller.tool.emailVerify);
    // 工具-百度Api
	router.get('/api/baidu', controller.tool.baidu);
	router.post('/api/baidu', controller.tool.baidu);

    // 打包页面资源访问
	router.get('/page/back/', controller.page.back);

    /* socket.io 模块，of对应的是url路径，route对应事件名称 */
	// 消息模块-初始连接
    io.of('/msg').route('init', io.controller.msg.init)
	// 消息模块-广播
    io.of('/msg').route('broadcast', io.controller.msg.broadcast)
	// 消息模块-单独推送
    io.of('/msg').route('push', io.controller.msg.push)
	// 消息模块-退出
    io.of('/msg').route('exit', io.controller.msg.exit)

	// 聊天模块-初始连接
    io.of('/chat').route('init', io.controller.chat.init)
	// 聊天模块-发送消息
    io.of('/chat').route('message', io.controller.chat.message)
	// 聊天模块-退出聊天室
    io.of('/chat').route('exit', io.controller.chat.exit)

};
