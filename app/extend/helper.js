'user strict';

// helper用来放utils
module.exports = {
	// 请求成功
	success(msg='',dataInfo={}){
		this.ctx.body = {
			flag: 1,
			msg,
			dataInfo
		}
	},

	// 请求信息直接渲染
	info(msg='',dataInfo={}){
		this.ctx.status = 233;
		this.ctx.body = {
			flag: 0,
			msg,
			dataInfo
		}
	},

	// 请求失败
	fail(msg='',dataInfo={}){
		this.ctx.status = 250;
		this.ctx.body = {
			flag: 0,
			msg,
			dataInfo
		}
	}
};