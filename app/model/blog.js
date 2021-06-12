'use strict';

module.exports = app => {

	// 获取数据类型

	const {
		INTEGER,
		STRING,
		TEXT,
		DATE
	} = app.Sequelize;

	// 定义模型
	const Blog = app.model.define('blog', {
		id: {
			autoIncrement: true,
			type: INTEGER,
			allowNull: false,
			primaryKey: true,
			comment: "文章id"
		},
		author_id: {
			type: INTEGER,
			allowNull: false,
			comment: "作者id"
		},
		author: {
			type: STRING(50),
			allowNull: false,
			comment: "作者名"
		},
		title: {
			type: STRING(50),
			allowNull: false,
			comment: "文章标题"
		},
		content: {
			type: TEXT,
			allowNull: false,
			comment: "内容"
		},
		des: {
			type: STRING(200),
			allowNull: true,
			comment: "文章描述"
		},
		keyword: {
			type: STRING(200),
			allowNull: true,
			comment: "文章关键字"
		},
		lenght: {
			type: INTEGER,
			allowNull: false,
			comment: "文章字数"
		},
		visited: {
			type: INTEGER,
			allowNull: false,
			defaultValue: 1,
			comment: "访问次数"
		},
		display: {
			type: INTEGER.UNSIGNED,
			allowNull: false,
			defaultValue: 1,
			comment: "是否启用"
		},
		created_at: {
			type: DATE,
			allowNull: false,
			defaultValue: app.Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
			comment: "创建时间"
		},
		updated_at: {
			type: DATE,
			allowNull: true,
			comment: "最后修改时间"
		}
	}, {
		sequelize: app.sequelize,
		tableName: 'blog',
		timestamps: false,
		indexes: [{
				name: "PRIMARY",
				unique: true,
				using: "BTREE",
				fields: [{
					name: "id"
				}, ]
			},
			{
				name: "blog_user",
				using: "BTREE",
				fields: [{
					name: "author_id"
				}, ]
			},
		]
	});

	// 如果没有表则创建表
	(async function () {
		await Blog.sync()
		.then(async () => {
			const blog = await Blog.findAll();
			if (!blog['0']) {
				// 如果文件表里没有数据
				console.log('创建了Blog表')
			} else {
				// 已经存在数据了，不执行创建操作
			}
		});
	})();

	return Blog;

};