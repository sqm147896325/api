'use strict';

const Controller = require('egg').Controller;

/* 
服务端监听事件定义
	init 初始化事件
	msg 模块同名主要事件，根据dataInfo中type不同类型服务端系统执行不同操作
客户端监听事件定义
	res 响应事件
	233 前端给出提示事件
	250 前端给出错误提示事件
	msg 模块同名主要事件，根据dataInfo中type不同类型执行客户端系统执行不同操作
*/

class MsgController extends Controller {
	
	/**
	 * @description 消息模块初始化，使其加入消息房间与同id房间
	 * @param {userName:number} 用户名
	 * @param {userId:number} 用户id 
	 * @param {time:number} 时间搓 
	 * @backDes
	 */	
	async init() {
		const { ctx } = this
		const { helper, args, socket } = ctx
		socket.join(args[0].userId); // 加入用户名相同的房间
		socket.leave(socket.id) // 退出默认房间
		const clientIp = ctx.request.ip
		console.log(socket)
		// this.logger.debug(socket);

		const msgData = {
			ip: clientIp,
			deviceNum: socket.adapter.rooms[args[0].userId].length, // 已登录设备数
			onlineUser: Object.keys(socket.adapter.rooms).length, // 在线用户数
			// onlineAll: socket.server.engine.clientsCount, // 总连接数
		}
		const msgMap = {
			ip: 'ip地址',
			deviceNum: '已登录设备数',
			onlineUser: '在线用户数'
		}
		socket.to(args[0].userId).emit('233', helper.params( '其他设备登录', { msgMap, ...msgData }));
		socket.emit('res', helper.params('初始化成功'));
	}

	/**
	 * @description 消息模块主要方法 
	 * @param {type:string} 对应事件类型
	 * @param {*} 不确定参数
	 * @backDes
	 */	
	async msg() {
		const { ctx } = this
		const { helper, args } = ctx
		this[args[0].type]()
		socket.emit('res', helper.params('msg主要方法'))
	}

	/**
	 * @description: 群发
	 * @param {msg:string} 要发送的消息
	 * @param {room:string} 要发送的房间
	 * @param {status:string} 使用哪个监听事件
	 * @return {*}
	 */	
	async mass() {
		const { ctx } = this
		const { helper, args } = ctx
		socket.to(args[0].room).emit(args[0].status, helper.params(args[0].msg))
	}

	/**
	 * @description: 单发
	 * @param {msg:string} 要发送的消息
	 * @param {id:string} 要发送的id
	 * @param {status:string} 使用哪个监听事件
	 * @return {*}
	 */	
	 async single() {
		const { ctx } = this
		const { helper, args } = ctx
		socket.id(args[0].id).emit(args[0].status, helper.params(args[0].msg))
	}
}

module.exports = MsgController;