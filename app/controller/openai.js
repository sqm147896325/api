'use strict';

const Controller = require('egg').Controller;

class OpenAiController extends Controller {

    main = this.service.openai;

    /**
     * @author sqm
     * @description 接口文档接口
     * @param {*}
     * @backDes 	编写时内容不要使用反斜杠
     */
    async index() {
        const { ctx } = this;
		const { helper, params } = ctx;
        let res = await this.main.index(params.message);
        helper.success('查询成功',res);
    }
}

module.exports = OpenAiController;