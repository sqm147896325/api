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
		if(ctx.headers['x-gitee-token'] === process.env.SQL_PASSWORD){
			const childrenProcess = child.spawn( 'sh', [' ~/server/api/script/autoDeploy.sh'], {
				cwd: '/home/sqm/server/api/',
				shell: process.env.ComSpec ? process.env.ComSpec : '/bin/sh',
				detached: true,
				stdio: 'ignore'
			});
			childrenProcess.unref();
			childrenProcess.on('error',error => {
				console.log('error',error)
			});
			childrenProcess.on('exit',error => {
				console.log('exit',error)
			})
			helper.success('部署成功');
			process.exit(1);
		}else{
			console.log('params',params);
			helper.success('密钥错误')
		}
    }
}

module.exports = ApiController;