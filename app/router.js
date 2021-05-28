'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const {
      router,
      controller
    } = app;
    router.get('/', controller.home.index);

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

};
