'use strict';
// 生成子进程
const child = require('child_process');
// 脚本地址
const script = '~/server/api/script/autoDeploy.sh';
// 执行指令的地址
const currentPath = '~/server/api/';

const Controller = require('egg').Controller;

class ApiController extends Controller {

    /**
     * @author sqm
     * @description 自动部署接口
     * @param {*}
     * @backDes
     */
    async index() {
        const { ctx } = this;
		const { helper,params } = ctx;
		console.log('params',params);
		if(ctx.headers['x-gitee-token'] === process.env.SQL_PASSWORD){
			child.exec( 'sh ~/server/api/script/autoDeploy.sh', (err) => {
				console.log(err);
			})
			helper.success('部署成功');
		}else{
			console.log('params',params);
			helper.success('密钥错误');
		}
    }
}

module.exports = ApiController;