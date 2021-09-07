'use strict';

const Controller = require('egg').Controller;

class MsgController extends Controller {
  async index() {
    const { ctx, app } = this;
    console.log(123)
    const message = ctx.args[0];
    await ctx.socket.emit('res', `Hi! I've got your message: ${message}`);
  }
}

module.exports = MsgController;