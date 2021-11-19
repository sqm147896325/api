'use strict';

module.exports = () => {
    return async (ctx, next) => {
        // 初次连接的时候进入该方法
        const { app, socket, logger } = ctx;
        const id = socket.id;
        console.log(id, 'connection!');
        await next();
        console.log(id, 'disconnection!');
    };
};