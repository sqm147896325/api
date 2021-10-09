'use strict';

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
			allowNull: true
		},
		password: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		des: {
			type: DataTypes.STRING(200),
			allowNull: true
		},
		emil: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		tel: {
			type: DataTypes.BIGINT,
			allowNull: true
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
			if (!users['0']) {
				// 如果用户表里没有数据，则创建管理员账户
				await User.create({
					id: 10000,
					username: 'admin',
					password: '123456',
					power: JSON.stringify(['用户管理'])
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