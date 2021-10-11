'user strict';

// helper用来放utils
module.exports = {
	// 请求成功
	success(msg='',dataInfo={}){
		this.ctx.status = 200;
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
	},

	/**
	 * @author sqm
	 * @description 多表联查
	 * @param {*} key 可能需要处理的行
	 * @param {*} keys 需要处理的行
	 * @param {*} results 处理行的规则数组，与上一参数一一对应
	 * @backDes 按规则处理后的key值
	 */
	changeQueryKey(key = '', keys = [], results = []){
		if (keys.indexOf(key) !== -1) {
			key = `$${results[keys.indexOf(key)]}$` // 字表需要在字符串前后添加$符
		}
		return key
	}
};