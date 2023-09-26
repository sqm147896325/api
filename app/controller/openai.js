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

        let uuid = params.uuid

        if (!uuid) {
            // 没有uuid为新创建的
            const res = await this.service.conversation.create(params.userId, 'ai')
            uuid = res.uuid
        }

        // 调用 OpenaiService 的 conversation 方法进行对话交流
        try {
            const result = await this.main.conversation(params.userId, params.message, uuid);

            // 返回对话的助手回复
            helper.success( '', { uuid: uuid, result: result } );
        } catch (error) {
            if (error.message === 'content_filter') {
                helper.info('内容不合规');
            } else {
                helper.info('服务器错误');
            }
        }


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
        const result = await this.main.getConversationHistory(params.uuid);

		helper.success( '', result );

    }

    async painter() {
        const { ctx } = this;
        const { helper, params } = ctx;
        let res = await this.main.painter(params.prompt, params.size, params.n)
        helper.success('', res)
    }

}

module.exports = OpenAiController;