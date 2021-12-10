'use strict';

const Controller = require('egg').Controller;

class ApiController extends Controller {

    main = this.service.api;

    /**
     * @author sqm
     * @description 接口文档接口
     * @param {*}
     * @backDes 	编写时内容不要使用反斜杠
     */
    async index() {
        const { ctx } = this;
		const { helper } = ctx;
		if(!this.app.var.apiList){
			// 只在启动时调用一次该方法，并将其存入变量
			let res = await this.main.index();
			this.app.var.apiList = res;
			helper.success('查询成功',res);
			return true;
		};
        helper.success('查询成功',this.app.var.apiList);
    }
}

module.exports = ApiController;