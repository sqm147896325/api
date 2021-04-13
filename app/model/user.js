'use strict';

module.exports = app => {

	// 获取数据类型
	
	const { INTEGER, STRING, TEXT, DATE } = app.Sequelize;


	// 定义模型

	const User = app.model.define('user', {

		id: { type: INTEGER, primaryKey: true, autoIncrement: true },	// 自动生成，唯一标识

		username: STRING(50),		// 必选
		
		password: STRING(50),		// 必选

		des: STRING(200),			// 可选

		emil: STRING(50),			// 可选

		tel: INTEGER,				// 可选

		power: TEXT,				// 特殊，权限

		token: STRING(200),			// 特殊，token

		display: { type: INTEGER, defaultValue: 1 },	// 自动生成，是否展示，默认1显示

		created_at: DATE,			// 自动生成，创建时间

		updated_at: DATE,			// 自动生成，更新时间

	}, {

		// 禁用 created_at、updated_at 自动转换，使用 mysql 管理

		// 方便后续迁移 ORM 等需求

		timestamps: false,

	});

	return User;

};