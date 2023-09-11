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
        const { helper, params } = ctx;

        // 调用 OpenaiService 的 converse 方法进行对话交流
        const result = await service.openai.converse(params.userId, params.message);

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
        const { ctx, service } = this;
        const { helper, params } = ctx;

        // 调用 OpenaiService 的 getConversationHistory 方法获取对话记录
        const result = await service.openai.getConversationHistory(params.userId);

		helper.success( '', result );

    }

    /**
     * @author sqm
     * @description 删除对话数据
     * @param {String} userId 用于删除对话的用户id
     * @backDes 是否删除成功
     */
    async delConversationHistory() {
        const { ctx, service } = this;
		const { helper, params } = ctx;

        const result = await service.openai.delConversationHistory(params.userId);

        if(!result){
			helper.fail('删除失败');
			return false;
		}
		helper.success('删除成功',result);
    }
}

module.exports = OpenAiController;