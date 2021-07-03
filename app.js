module.exports = app => {
    // 开始前执行
    app.beforeStart(async () => {
    });
    // 准备好执行
    app.ready(async () => {
		// 定义接收变量的对象，这里仅适用于egg单例
		app.var = {}
    });
    // 关闭前执行
    app.beforeClose(async () => {
    });
};