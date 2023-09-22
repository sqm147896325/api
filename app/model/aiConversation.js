'use strict';

module.exports = app => {
  const { DataTypes, UUID } = app.Sequelize;

  const AiConversation = app.model.define('ai_conversation', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: '对话ID',
    },
    uuid: {
      type: UUID,
      allowNull: false,
      comment: '所属对话uuid',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '用户ID',
      references: {
        model: 'user',
        key: 'id',
      },
    },
    role: {
      type: DataTypes.ENUM('user', 'assistant'),
      allowNull: false,
      comment: '角色（用户或助手）',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '消息内容',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: app.Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: '创建时间',
    },
    display: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			defaultValue: 1,
			comment: "是否删除"
		},
  }, {
    sequelize: app.sequelize,
    tableName: 'ai_conversation',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'id' },
        ],
      },
    ],
  });

  (async function() {
    await AiConversation.sync();
    console.log('用户对话表已创建');
  })();

  // 关联用户表
  AiConversation.associate = function() {
    app.model.AiConversation.belongsTo(app.model.User, { foreignKey: 'userId', targetKey: 'id' });
  };

  return AiConversation;
};