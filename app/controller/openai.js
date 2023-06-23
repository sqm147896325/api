'use strict';

const Controller = require('egg').Controller;

class OpenAiController extends Controller {

    /**
     * @author sqm
     * @description index入口，暂不使用
     * @param {*}
     * @backDes
     */
    async index() {
        const { ctx, service } = this;
		const { helper, params } = ctx;
        let res = await service.openai.index(params.message);
        helper.success('查询成功',res);
    }

    /**
     * @author sqm
     * @description 对话
     * @param {String} userId 用于进行对话的用户id
     * @param {String} message 用户信息
     * @backDes 当前对话返回
     */
    async converse() {
        const { ctx, service } = this;
        const { userId, message } = ctx.request.body;

        // 调用 OpenaiService 的 converse 方法进行对话交流
        const reply = await service.openai.converse(userId, message);

        // 返回对话的助手回复
        ctx.body = {
            reply,
        };
    }

    /**
     * @author sqm
     * @description 获取对话数据
     * @param {String} userId 用于进行对话的用户id
     * @backDes 对话数据
     */
    async getConversationHistory() {
        const { ctx, service } = this;
        const { userId } = ctx.params;

        // 调用 OpenaiService 的 getConversationHistory 方法获取对话记录
        const conversationHistory = await service.openai.getConversationHistory(userId);

        // 返回对话记录
        ctx.body = {
            conversationHistory,
        };
    }
}

module.exports = OpenAiController;