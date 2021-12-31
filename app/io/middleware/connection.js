'use strict';

module.exports = () => {
    return async (ctx, next) => {
        // 初次连接的时候进入该方法
        const { app, socket } = ctx;
        const id = socket.id;
        await next();
        if (socket.nsp.name === '/msg') {
            await app.redis.hdel('user', id) // 断开连接清除用户表对应信息
        }
    };
};