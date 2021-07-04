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
				const childProcess = child.exec( 'sh ~/server/api/script/autoDeploy.sh', {
					detached: true
				},(err,sto) => {
					if(err){
						console.log('err',err);
						helper.fail('部署失败',err);
					}else{
						console.log('sto',sto);
						helper.success('部署成功',sto);
					}
				});
				childProcess.unref();
			} catch (error) {
				console.log('error',error);
				helper.fail('错误',error);
			}
		}else{
			console.log('params',params);
			helper.fail('密钥错误')
		};
    }
}

module.exports = ApiController;