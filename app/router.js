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

	// 登录相关接口
    router.post('/login', controller.login.login);
    router.post('/exit', controller.login.exit);

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
    // 邮箱验证码
	router.post('/user/emailVerify', controller.user.emailVerify);
    // 邮箱验证码设置用户信息
	router.post('/user/emailSetUser', controller.user.emailSetUser);

    // 接口文档路由
    router.get('/api/index', controller.api.index);

	// 文件操作相关路由
	router.post('/file/index', controller.file.read);
	router.put('/file/index', controller.file.create);
    router.delete('/file/index', controller.file.delete);
    router.get('/file/downloadZip', controller.file.downloadZip);
    router.get('/file/fileLink', controller.file.fileLink);

	// webHook自动部署
	router.post('/webHook/index', controller.webHook.index);
	router.post('/webHook/back', controller.webHook.back);
	router.post('/webHook/home', controller.webHook.home);
	router.post('/webHook/com', controller.webHook.com);

    // 工具-邮箱接口
	router.post('/tool/email', controller.tool.email);
    // 工具-百度地图Api
	router.get('/api/openMap', controller.tool.openMap);

    // 打包页面资源访问
	router.get('/page/back', controller.page.back);
	router.get('/page/back/*', controller.page.back);
	router.get('/page/home', controller.page.home);
	router.get('/page/home/*', controller.page.home);
	router.get('/page/com', controller.page.com);
	router.get('/page/com/*', controller.page.com);


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

    // 终端模块-初始化
    io.of('/term').route('init', io.controller.term.init)
    // 终端模块-传输消息,不使用框架内监听直接使用socket内置方法监听
    // io.of('/term').route('res', io.controller.term.res)
    // 终端模块-关闭连接
    io.of('/term').route('exit', io.controller.term.exit)

    /* 博客主页模块，目前使用已有接口方法 */
    // 博客主页操作
    router.get('/home/getBlog', controller.blog.read);
    router.get('/home/blogList', controller.blog.getList);
    router.get('/home/blogKeyword', controller.blog.getKeyword);

    /* 对话相关路由 */
    router.get('/conversation/list', controller.conversation.list);
    router.put('/conversation/create', controller.conversation.create);
    router.delete('/conversation/delete', controller.conversation.delete);


    /* openai */
    router.post('/openai/conversation', controller.openai.conversation);
    router.post('/openai/getConversationHistory', controller.openai.getConversationHistory);
    router.post('/openai/painter', controller.openai.painter);
};
