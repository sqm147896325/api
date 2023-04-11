'use strict';

const Service = require("egg").Service;

const crypto = require('crypto-js');

const Op = require('sequelize').Op;		// 定义sequelize的运算符

class UserService extends Service {

	main = this.ctx.model.User;

	// 登录
	async login(id,password){
		let whereKey = { id }
		if(id.includes('@')) {
			whereKey = { email: id }
		}
		const res = await this.main.findOne({
			where: whereKey,
			attributes: [ 'salt', 'id' ]
		})
		if (!res?.salt) {
			return false
		}
		const oldPassword = crypto.MD5(password + res.salt).toString();
		const result = await this.main.findOne({
			where: {
				id: res.id,
				password: oldPassword
			},
			attributes: [
				'id',
				'username',
				'des',
				'tel',
				'email',
				'power',
				'created_at',
				'updated_at'
			]
		});
		return result;
	}

	// 更新token
	async updataToken(token,id){
		const result = await this.main.update({token},{
			where:{id}
		});
		return result;
	}

	// 验证token是否被替换，静态方法
	async aloneToken(token,username,id){
		const result = await this.main.findOne({
			where:{token,username,id}
		});
		return result;
	}
	
	// 按需创建用户
	async create(username,password,option={}){
		const result = await this.main.create({
			username,
			password,
			salt: option.salt,
			email: option.email,
			tel: option.tel,
			des: option.des
		});	
		return result;
	}

	// 删除用户
	async del(id){
		const result = await this.main.update({ display: 0 },{
			where: {id}
		});
		if(result[0] == 0){
			// 未发生更新
			return false;
		}
		return true;
	}

	// 更新用户
	async update(id,option={}){
		// 可能没有值的地方插入时变为null
		const salt = this.ctx.helper.randomStr(8)
		const NewPassword = crypto.MD5(option.password + salt).toString();
		const result = await this.main.update({
			username: option.username,
			password: NewPassword,
			salt: salt,
			email: option.email || null,
			tel: option.tel || null,
			des: option.des || null
		},{
			where: {id:parseInt(id)}
		});
		// 更新之后清除token
		await this.updataToken('', id)
		if(result[0] == 0){
			// 未发生更新
			return false;
		}
		return true;
	}

	// 获取单个用户信息
	async read(id){
		const result = await this.main.findOne({
			where: {
				id, 
				display: 1, 	// 只查询未删除的数据
			},
			attributes: [
				'id',
				'username',
				'des',
				'tel',
				'email',
				'power',
				'created_at',
				'updated_at'
			]
		});
		return result;
	}

	// 获取盐值
	async getSalt(id) {
		const result = await this.main.findOne({
			where: {
				id, 
				display: 1, 	// 只查询未删除的数据
			},
			attributes: [
				'salt'
			]
		});
		return result.salt;
	}

	// 更新盐
	async updateSalt({id, password, salt}) {
		const result = await this.main.update({
			password,
			salt
		},{
			where: {
				id, 
				display: 1, 	// 只查询未删除的数据
			}
		});
		return result[0];
	}

	// 获取用户列表
	async getList(page=1,pagesize=10,key='id',query=''){
		const offset = (page-1)*pagesize;
		const limit = pagesize;
		const config = { 
			limit:parseInt(limit), 		// 查询条数
			offset:parseInt(offset), 	// 偏移量
			order: [ 'created_at', 'updated_at' ], // 排序规则
			// 查询条件
			where: {
				display: 1, 	// 只查询未删除的数据
				// sequelize查询，只要满足其一即可
				[Op.or]: {
					// 用%前后匹配
					[key]: { [Op.like] : `%${query}%`},
				}
			},
			// 指定返回的属性
			attributes: [
				'id',
				'username',
				'des',
				'tel',
				'email',
				'power',
				'created_at',
				'updated_at'
			]
		};
		const result = await this.main.findAndCountAll(config);
		return result;
	}

	// 设置用户权限
	async setPower(id,power){
		const result = await this.main.update({
			power,
		},{
			where: {id:parseInt(id)}
		});
		// 更新之后清除token
		await this.updataToken('', id)
		if(result[0] == 0){
			// 未发生更新
			return false;
		}
		return true;
	}
}

module.exports = UserService;