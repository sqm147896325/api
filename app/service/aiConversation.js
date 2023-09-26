'use strict';

const Service = require('egg').Service;

const Op = require('sequelize').Op;		// 定义sequelize的运算符

class AiConversationService extends Service {

	main = this.ctx.model.AiConversation;

    // 创建ai对话表单条对话记录
    async create(uuid, userId, role, content) {
        await this.main.create({
            uuid,
            userId,
            role,
            content
        });
    }

    // 获取ai对话表的历史记录
    async getConversationHistory(uuid) {
        if (!uuid) {
            return []
        }
        const aiConversation = await this.main.findAll({
            where: {
                uuid,
                display: 1, 	// 只查询未删除的数据
            },
            order: [
                ['id', 'ASC'],
            ],
        });

        return aiConversation.map(conversation => ({
            role: conversation.role,
            content: conversation.content,
        }));
    }

}

module.exports = AiConversationService;
