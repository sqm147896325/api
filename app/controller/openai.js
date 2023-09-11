'use strict';

const Controller = require('egg').Controller;

class OpenAiController extends Controller {

	main = this.service.openai;

    /**
     * @author sqm
     * @description index入口，暂不使用
     * @param {*}
     * @backDes
     */
    async index() {
        const { ctx } = this;
		const { helper, params } = ctx;
        let res = await this.main.index(params.message);
        helper.success('查询成功', res);
    }

    /**
     * @author sqm
     * @description 对话
     * @param {String} userId 用于进行对话的用户id
     * @param {String} message 用户信息
     * @backDes 当前对话返回
     */
    async conversation() {
        const { ctx } = this;
        const { helper, params } = ctx;

        // 调用 OpenaiService 的 conversation 方法进行对话交流
        const result = await this.main.conversation(params.userId, params.message);

        // 返回对话的助手回复
		helper.success( '', result );

    }

    /**
     * @author sqm
     * @description 获取对话数据
     * @param {String} userId 用于进行对话的用户id
     * @backDes 对话数据
     */
    async getConversationHistory() {
        const { ctx } = this;
        const { helper, params } = ctx;

        // 调用 OpenaiService 的 getConversationHistory 方法获取对话记录
        const result = await this.main.getConversationHistory(params.userId);

		helper.success( '', result );

    }

}

module.exports = OpenAiController;