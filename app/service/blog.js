'use strict';

const Service = require("egg").Service;

class BlogService extends Service {

	main = this.ctx.model.Blog;
	
	// 按需创建文章
	async create(author_id,author,title,content,option={}){
		const result = await this.main.create({
			author_id,
			author,
			title,
			content,
			des: option.des,
			keyword: option.keyword
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
			keyword: option.keyword
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
		const result = await this.main.findByPk(id,{
			where: {
				display: 1, 	// 只查询未删除的数据
			},
			attributes: [
				'id',
				'author_id',
				'author',
				'title',
				'content',
				'des',
				'keyword',
				'created_at',
				'updated_at'
			]
		});
		return result;
	}

	// 获取用户列表
	async getList(page,pagesize,key='id',query=''){
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
				$or:{
					// 用%前后匹配
					[key]: { $like : `%${query}%`},
				}
			},
			// 指定返回的属性
			attributes: [
				'id',
				'author_id',
				'author',
				'title',
				'des',
				'keyword',
				'created_at',
				'updated_at'
			]
		};
		const result = await this.main.findAndCountAll(config);
		return result;
	}

}

module.exports = BlogService;
