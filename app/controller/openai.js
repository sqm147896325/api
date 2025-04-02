'use strict';

const Controller = require('egg').Controller;

class OpenaiController extends Controller {

	main = this.service.openai;

    /**
     * @author sqm
     * @description 对话
     * @param {String} userId 用于进行对话的用户id
     * @param {String} message 用户信息
     * @param {String} uuid 对话组id，为空时自动生成新的对话组
     * @backDes 当前对话返回
     */
    async conversation() {
        const { ctx } = this;
        const { helper, params } = ctx;

        // 限制调用次数
        let conversationsNum = await this.ctx.app.redis.get(params.userId + '_conversations')
        if (!isNaN(parseFloat(conversationsNum)) && isFinite(conversationsNum)) {
            conversationsNum = Number(conversationsNum || 0)
        } else {
            conversationsNum = 0
        }
        if (conversationsNum > 500) {
            helper.info('每日聊天数已超出，请24小时后重试或联系管理员重置');
            return false
        }
        this.ctx.app.redis.set(params.userId + '_conversations', conversationsNum + 1, 'Ex', (60 * 60 * 24)) 

        let uuid = params.uuid

        if (!uuid) {
            // 没有uuid为新创建的
            const res = await this.service.conversation.create(params.userId, 'ai')
            uuid = res.uuid
        }

        // 调用 OpenaiService 的 conversation 方法进行对话交流
        try {

            await this.service.aiConversation.create(uuid, params.userId, 'user', params.message); // 添加用户消息到用户对话表

            const messages = await this.service.aiConversation.getConversationHistory(uuid); // 获取该对话组历史消息
            
            const stream = await this.main.conversation(messages); // 调用openai进行对话

            // 设置 Server-Sent Events
            ctx.type = 'text/event-stream';
            ctx.set('Cache-Control', 'no-cache');
            ctx.set('Connection', 'keep-alive');
            ctx.status = 200; // 设置响应状态码

            // 写入头部信息
            ctx.res.write('event: header\n');
            let headerParams = {
                uuid
            }
            ctx.res.write(`data: ${JSON.stringify(headerParams)}\n\n`);

            // 设置消息数据块
            let replyContent = '';
            let thinkContent = '';
            let isAnswering = false;

            for await (const chunk of events) {
                if (!chunk.choices?.length) {
                    continue;
                }

                const delta = chunk.choices[0].delta;
                
                // 处理思考过程
                if (delta.reasoning_content) {
                    if (!thinkContent) {
                        thinkContent += '<think>'
                        ctx.res.write('event: message\n');
                        ctx.res.write(`data: ${JSON.stringify('<think>')}\n\n`)
                    }
                    ctx.res.write('event: message\n');
                    ctx.res.write(`data: ${JSON.stringify(delta.reasoning_content)}\n\n`)
                    thinkContent += delta.reasoning_content;
                } 
                // 处理正式回复
                else if (delta.content) {
                    if (!isAnswering) {
                        isAnswering = true;
                        if (thinkContent) {
                            thinkContent += '</think>'
                            ctx.res.write('event: message\n');
                            ctx.res.write(`data: ${JSON.stringify('</think>')}\n\n`)
                        }
                    }
                    ctx.res.write('event: message\n');
                    ctx.res.write(`data: ${JSON.stringify(delta.content)}\n\n`)
                    replyContent += delta.content;
                }
            }
            replyContent = thinkContent + replyContent; // 将思考内容和回复内容合并

            // 结束传输
            ctx.res.end();

            await this.service.aiConversation.create(uuid, params.userId, 'assistant', replyContent); // 添加助手回复到用户对话表
        } catch (error) {
            console.error(error)
            if (error.code === 'content_filter') {
                helper.info('内容不合规');
            } else {
                helper.info('服务器错误');
            }
        }
    }

    /**
     * @author sqm
     * @description 获取对话数据
     * @param {String} uuid 用于进行对话的对话组id
     * @backDes 对话数据
     */
    async getConversationHistory() {
        const { ctx } = this;
        const { helper, params } = ctx;

        // 调用 OpenaiService 的 getConversationHistory 方法获取对话记录
        const result = await this.service.aiConversation.getConversationHistory(params.uuid);

		helper.success( '', result );

    }

    /**
     * @author sqm
     * @description ai生成图片
     * @param {String} prompt 用于进行对话的对话组id
     * @param {String} size 图片尺寸大小，默认为1024x1024
     * @param {Number} n 生成的图片张数，默认为1
     * @backDes 对话数据
     */
    async painter() {
        const { ctx } = this;
        const { helper, params } = ctx;

        // 限制调用次数
        let painterNum = await this.app.redis.get(params.userId + '_conversations')
        if (!isNaN(parseFloat(painterNum)) && isFinite(painterNum)) {
            painterNum = Number(painterNum || 0)
        } else {
            painterNum = 0
        }
        if (painterNum > 2) {
            helper.info('每日绘画已超出，请24小时后重试或联系管理员重置');
            return false
        }
        this.app.redis.set(params.userId + '_conversations', painterNum + 1, 'Ex', (60 * 60 * 24)) 

        try {
            let res = await this.main.painter(params.prompt, params.size, params.n);
            helper.success('', res);
        } catch (error) {
            console.error(error)
            if (error.code === 'contentFilter') {
                helper.info('内容不合规');
            } else {
                helper.info('服务器错误');
            }
        }

    }

}

module.exports = OpenaiController;