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
		  type: DataTypes.INTEGER,
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
		await User.sync();
		console.log("模型User同步完毕！");
	})();

	return User;

};