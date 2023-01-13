'use strict';

const crypto = require('crypto-js');

module.exports = app => {

	// 获取数据类型
	// const { INTEGER, STRING, TEXT, DATE } = app.Sequelize;
	const DataTypes = app.Sequelize.DataTypes;

	// 定义模型
	const User = app.model.define('user', {
		id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			comment: "用户帐户"
		},
		username: {
			type: DataTypes.STRING(50),
			allowNull: false,
			comment: "用户名"
		},
		password: {
			type: DataTypes.STRING(50),
			allowNull: false,
			comment: "密码"
		},
		des: {
			type: DataTypes.STRING(200),
			allowNull: true,
			comment: "描述"
		},
		email: {
			type: DataTypes.STRING(50),
			allowNull: true,
			unique: true,
			comment: "邮箱"
		},
		tel: {
			type: DataTypes.BIGINT,
			allowNull: true,
			comment: "电话"
		},
		power: {
			type: DataTypes.TEXT,
			allowNull: true,
			comment: "权限"
		},
		token: {
			type: DataTypes.STRING(200),
			allowNull: true,
			comment: "token值"
		},
		salt: {
			type: DataTypes.STRING(50),
			allowNull: false,
			comment: "盐"
		},
		display: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			defaultValue: 1,
			comment: "是否启用"
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: app.Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
			comment: "创建时间"
		},
		updated_at: {
			type: DataTypes.DATE,
			allowNull: true,
			comment: "最后修改时间"
		}
	}, {
		sequelize: app.sequelize,
		tableName: 'user',
		timestamps: false,
		indexes: [
		  {
			name: "PRIMARY",
			unique: true,
			using: "BTREE",
			fields: [
			  { name: "id" },
			]
		  },
		]
	});

	// 如果没有表则创建表
	(async function () {
		await User.sync()
		.then(async () => {
			const users = await User.findAll();
			const salt = 'NewAdmin';
			const password = crypto.MD5('e10adc3949ba59abbe56e057f20f883e' + salt).toString(); // e10adc3949ba59abbe56e057f20f883e 为 123456 的 MD5, 初始加密后为 1723579d5ab8372d3e55f7b44a258530
			if (!users['0']) {
				// 如果用户表里没有数据，则创建管理员账户
				await User.create({
					id: 10000,
					username: 'admin',
					salt,
					password,
					power: JSON.stringify(['user']) // 初始拥有用户管理
				});
				console.log('创建了user表并初始化管理员')
			} else {
				// 已经存在数据了，不执行创建操作
			}
		})
	})();

	// 一个用户 有 多个博客
	User.associate = function() {
		app.model.User.hasMany(app.model.Blog, { foreignKey: 'author_id', targetKey: 'id' });
	}

	return User;

};