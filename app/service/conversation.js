'use strict';

const Service = require('egg').Service;

const Op = require('sequelize').Op;		// 定义sequelize的运算符

class ConversationService extends Service {

	main = this.ctx.model.Conversation;

    // 按需创建对话组
	async create(user_id, type, options={}){
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

    // 获取对话组列表
	async list(page=1,pagesize=5,keys=['user_id'],query=''){
		const offset = (page-1)*pagesize;
		const limit = pagesize;
		const like = {} // 多字段模糊查询规则
		keys.map(e => {
			let key = this.ctx.helper.changeQueryKey(e, ['author'], ['user.username']) // 连查 user 表，映射对应字段
			like[key] = { [Op.like] : `%${query}%`} // 用%前后匹配
			return key
		})
		const config = { 
			limit: parseInt(limit), 		// 查询条数
			offset: parseInt(offset), 	// 偏移量
			order: [ ['created_at', 'DESC'], 'updated_at' ], // 排序规则
			// 查询条件
			where: {
				display: 1, 	// 只查询未删除的数据
                // sequelize查询，只要满足其一即可
				[Op.or]: like
			},
			// 指定返回的属性
			attributes: [
				'uuid',
				'type',
				'ai_overview',
				'ai_target',
				'user_target',
				'unread',
				'created_at',
				'updated_at'
			],
			raw: true
		};
		const result = await this.main.findAndCountAll(config);
		return result;
	}

	// 删除对话组
    async delete(uuid) {
        const result = await this.main.update({ display: 0 },{
          where: { uuid }
        });
  
		return !!result[0] // 有更新结果 true 更新了，没更新结果 false 未更新
    }

}

module.exports = ConversationService;