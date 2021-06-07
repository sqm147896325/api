'use strict';
const uuidv1 = require("uuid/v1");

module.exports = app => {

	// 获取数据类型

	const {
		INTEGER,
		STRING,
		DATE,
		UUID
	} = app.Sequelize;

	// 定义模型
	const File = app.model.define('file', {
		uuid: {
		  type: UUID,
		  allowNull: false,
		  primaryKey: true,
		  comment: '文件id',
		  // 默认值回调需要通过sequelize来设置数据库生效
		  defaultValue: () => {
			return uuidv1().replace(/-/g, "");
		  }
		},
		name: {
		  type: STRING(50),
		  allowNull: false,
		  defaultValue: '',
		  comment: '文件名'
		},
		size: {
		  type: INTEGER,
		  allowNull: false,
		  comment: '文件大小'
		},
		file_type: {
		  type: STRING(50),
		  allowNull: false,
		  comment: '文件类型'
		},
		keyword: {
		  type: STRING(255),
		  allowNull: true,
		  comment: '关键字'
		},
		path: {
		  type: STRING(1024),
		  allowNull: false,
		  comment: '真实存储位置'
		},
		url: {
		  type: STRING(512),
		  allowNull: false,
		  comment: '网络存储位置'
		},
		upload_time: {
			type: DATE,
			allowNull: false,
			defaultValue: app.Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
			comment: "创建时间"
		},
		md5: {
		  type: STRING(1024),
		  allowNull: false,
		  comment: 'md5校验码'
		},
		display: {
			type: INTEGER.UNSIGNED,
			allowNull: false,
			defaultValue: 1,
			comment: "是否删除"
		},
	  }, {
		sequelize: app.sequelize,
		tableName: 'file',
		timestamps: false
	});

	// 如果没有表则创建表
	(async function () {
		await File.sync();
		console.log("模型File同步完毕！");
	})();

	return File;
}