'use strict';

module.exports = () => {
    return async (ctx, next) => {
        const { app, socket, logger, helper } = ctx;
        const id = socket.id;
        const nsp = app.io.of('/');
        socket.emit('res', id);
        await next();
        // console.log('disconnection!');
    };
};