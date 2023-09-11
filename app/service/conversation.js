'use strict';

const Service = require('egg').Service;

class ConversationService extends Service {

	main = this.ctx.model.Conversation;

    // 按需创建对话
	async create(user_id, type, options={ ai_overview, ai_target, user_target, unread }){
		const result = await this.main.create({
			user_id,
			type,
			ai_overview: options.ai_overview,
			ai_target: options.ai_target,
			user_target: options.user_target,
            unread: options.unread
		});	
		return result;
	}

    // 获取对话列表
	async getList(userId,page=1,pagesize=5){
		const offset = (page-1)*pagesize;
		const limit = pagesize;
		const config = { 
			limit: parseInt(limit), 		// 查询条数
			offset: parseInt(offset), 	// 偏移量
			order: [ ['created_at', 'DESC'], 'updated_at' ], // 排序规则
			// 查询条件
			where: {
				display: 1, 	// 只查询未删除的数据
                user_id: userId
			},
			// 指定返回的属性
			attributes: [
				'type',
				'ai_overview',
				'ai_target',
				'user_target',
				'unread',
				'created_at',
				'updated_at',
				'lenght'
			],
			raw: true
		};
		const result = await this.main.findAndCountAll(config);
		return result;
	}

    async delete(uuid) {
        const result = await this.UserConversation.update({ display: 0 },{
          where: { uuid }
        });
  
        if(result[0] == 0){
          // 未发生更新
          return false;
        }
        return true;
    }

}

module.exports = ConversationService;