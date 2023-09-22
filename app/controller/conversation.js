'use strict';

const Controller = require('egg').Controller;

class ConversationController extends Controller {

	main = this.service.conversation;

    /**
	 * @author sqm
	 * @description 添加创建对话
	 * @backDes 
	 */	
    async create() {
        const { ctx } = this;
        const { params , body , helper } = ctx;
        const { id , name } = await this.main.create(params.userId, params.type, params.options);
        helper.info('添加成功',{ id , name });
    };

    /**
     * @author sqm
     * @description 获取对话列表
     * @backDes 当前对话返回
     */
    async list() {
        const { ctx } = this;
        const { helper, params } = ctx;
        if (!params.key) {
			params.key = 'type'
		}
		const keys = params.key.split(',')
        const result = await this.main.list(params.page, params.pagesize, keys, params.query || '');
        helper.success('', result);
    }

    /**
     * @author sqm
     * @description 删除对话数据
     * @param {String} uuid 用于删除的对话uuid
     * @backDes 是否删除成功
     */
    async delete() {
        const { ctx } = this;
        const { helper, params } = ctx;

        const result = await this.main.delete(params.uuid);

        if(!result){
            helper.fail('删除失败');
            return false;
        }
        helper.success('删除成功', result);
    }


}

module.exports = ConversationController;