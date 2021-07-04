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
				const spawn = child.spawn( '/bin/sh', ['/home/sqm/server/api/script/autoDeploy.sh'], {cwd: null,detached:true});
				spawn.on('error',(err)=>{
					console.log('error',err);
				});
				spawn.on('message',(message)=>{
					console.log('message',message);
				});
				spawn.on('exit',(exit)=>{
					console.log('exit',exit);
				});
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