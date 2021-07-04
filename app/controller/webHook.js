'use strict';
// 生成子进程
const child = require('child_process');

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
		console.log('ctx.headers["x-gitee-token"]',ctx.headers['x-gitee-token'])
		if(ctx.headers['x-gitee-token'] == process.env.SQL_PASSWORD){
			try {
				child.exec( 'sh ~/server/api/script/autoDeploy.sh', (err,sto) => {
					if(err){
						helper.fail('部署失败',err);
					}else{
						helper.success('部署成功',sto);
					}
				});
			} catch (error) {
				console.log('error',error);
			}
		}else{
			console.log('params',params);
			helper.success('密钥错误');
		};
    }
}

module.exports = ApiController;