// module.exports = app => {
//     // 开始前执行
//     app.beforeStart(async () => {
//     });
//     // 准备好执行
//     app.ready(async () => {
//       app.var = {};
//     });
//     // 关闭前执行
//     app.beforeClose(async () => {
//       console.log('关闭')
//       await app.redis.del('user') // 关闭服务时删除user表
//     });
// };

class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  configWillLoad() {
    // Ready to call configDidLoad,
    // Config, plugin files are referred,
    // this is the last chance to modify the config.
  }

  configDidLoad() {
    // Config, plugin files have been loaded.
  }

  async didLoad() {
    // All files have loaded, start plugin here.
  }

  async willReady() {
    // All plugins have started, can do some thing before app ready
  }

  async didReady() {
    // Worker is ready, can do some things
    // don't need to block the app boot.
    await this.app.redis.del('user'); // socket在线用户信息表
    this.app.var = {};
  }

  async serverDidReady() {
    // Server is listening.
  }

  async beforeClose() {
    // Do some thing before app close.
    console.log('关闭')
  }
}

module.exports = AppBootHook;