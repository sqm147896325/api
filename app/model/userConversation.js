'use strict';

module.exports = app => {
  const { DataTypes } = app.Sequelize;

  const UserConversation = app.model.define('user_conversation', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: '对话ID',
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
  }, {
    sequelize: app.sequelize,
    tableName: 'user_conversation',
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
    await UserConversation.sync();
    console.log('用户对话表已创建');
  })();

  // 关联用户表
  UserConversation.associate = function() {
    app.model.UserConversation.belongsTo(app.model.User, { foreignKey: 'userId', targetKey: 'id' });
  };

  return UserConversation;
};