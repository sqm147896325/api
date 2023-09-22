'use strict';

const Service = require("egg").Service;

const Op = require('sequelize').Op;		// 定义sequelize的运算符

// 这个地方要注意，要引入该包下的Sequelize类才行
const { Sequelize } = require("sequelize")

class BlogService extends Service {

	main = this.ctx.model.Blog;
	
	// 按需创建文章
	async create(author_id,title,content,lenght,option={}){
		const result = await this.main.create({
			author_id,
			title,
			content,
			lenght,
			des: option.des,
			keyword: option.keyword,
		});	
		return result;
	}

	// 删除文章
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

	// 更新文章
	async update(id,option={}){
		const result = await this.main.update({
			title: option.title,
			content: option.content,
			des: option.des,
			keyword: option.keyword,
			lenght: option.lenght
		},{
			where: {id:parseInt(id)}
		});
		if(result[0] == 0){
			// 未发生更新
			return false;
		}
		return true;
	}

	// 获取单篇信息
	async read(id){
		const result = await this.main.findOne({
			where: {
				id,
				display: 1, 	// 只查询未删除的数据
			},
			include: [
				{
					model: this.app.model.User,
					where: { display: 1 },
					as: 'user',
					attributes: []
				}
			],
			attributes: [
				'id',
				'author_id',
				[Sequelize.col('user.username'), 'author'],
				'title',
				'content',
				'des',
				'keyword',
				'created_at',
				'updated_at',
				'lenght',
				'visited'
			],
			raw: true
		});
		return result;
	}

	// 获取博客列表，可以用作获取最新博客的接口
	async getList(page=1,pagesize=5,keys=['id'],query=''){
		const offset = (page-1)*pagesize;
		const limit = pagesize;
		const like = {} // 多字段模糊查询规则
		keys = keys.map(e => {
			let key = this.ctx.helper.changeQueryKey(e, ['author'], ['user.username']) // 连查 user 表，映射对应字段
			like[key] = { [Op.like] : `%${query}%`} // 用%前后匹配
			return key
		})
		const config = { 
			limit:parseInt(limit), 		// 查询条数
			offset:parseInt(offset), 	// 偏移量
			order: [ ['created_at', 'DESC'], 'updated_at' ], // 排序规则
			// 查询条件
			where: {
				display: 1, 	// 只查询未删除的数据
				// sequelize查询，只要满足其一即可
				[Op.or]: like
			},
			include: [
				{
					model: this.app.model.User,
					where: { display: 1 },
					as: 'user',
					attributes: []
				}
			],
			// 指定返回的属性
			attributes: [
				'id',
				'author_id',
				[Sequelize.col('user.username'), 'author'], // 将 user 表的 username 字段，映射为 author 返回
				'title',
				'des',
				'keyword',
				'created_at',
				'updated_at',
				'lenght',
				'visited'
			],
			raw: true
		};
		const result = await this.main.findAndCountAll(config);
		return result;
	}

	// 获取博客关键字，及关键字下博客数量
	async getKeyword(){
		const config = {
			order: [ ['created_at', 'DESC'], 'updated_at' ], // 排序规则
			// 查询条件
			where: {
				display: 1, 	// 只查询未删除的数据
			},
			// 指定返回的属性
			attributes: [ 'keyword' ]
		};
		let result = await this.main.findAll(config);
		result = result.map(e => {
			return e.keyword.split(',')
		})
		result = [].concat(...result); // 二维数组降维
		// result = [...new Set(result)]; // 数组去重
		function getRepeatNum(arr){
			// 统计数组中所有值出现的次数
			return arr.reduce((prev,next) => { 
				prev[next] = (prev[next] + 1) || 1; 
				return prev; 
			},{}); 
		}
		return getRepeatNum(result);
	}

}

module.exports = BlogService;
