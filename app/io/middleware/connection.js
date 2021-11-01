'use strict';

module.exports = () => {
    return async (ctx, next) => {
        const { app, socket, logger, helper } = ctx;
        const id = socket.id;
		console.log('有人连接')
        socket.emit('res', id);
        await next();
        console.log(id, 'disconnection!');
    };
};