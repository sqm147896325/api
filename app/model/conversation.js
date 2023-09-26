'use strict';
const { v1 } = require("uuid");


/* 
    对话表
*/

module.exports = app => {
    const {
        DataTypes,
        UUID,
        ENUM
    } = app.Sequelize;

    const Conversation = app.model.define('conversation', {
        uuid: {
            type: UUID,
            allowNull: false,
            primaryKey: true,
            comment: '对话索引',
            // 默认值回调需要通过sequelize来设置数据库生效
            defaultValue: () => {
                return v1().replace(/-/g, "");
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '用户ID',
            references: {
                model: 'user',
                key: 'id',
            },
        },
        type: {
            type: ENUM('ai', 'user', 'system', 'group'),
            allowNull: false,
            comment: '消息类型',
        },
        ai_overview: {
            type: DataTypes.STRING(200),
			allowNull: true,
			comment: "消息简述，仅当conversation_type为ai时存入第一次对话的简述"
        },
        ai_target: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: 'ai目标，仅当conversation_type为ai时存入该ai的类型',
        },
        user_target: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: '用户目标，仅当conversation_type为user时存入另一用户的uuid',
        },
        unread: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '消息未读个数',
            defaultValue: 0
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
		},
        display: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 1,
            comment: "是否删除"
        },
    }, {
        sequelize: app.sequelize,
        tableName: 'conversation',
        timestamps: false,
        indexes: [
        {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [
                { name: 'uuid' },
            ],
        },
        ],
    });

    (async function() {
        await Conversation.sync();
        console.log('对话表已创建');
    })();

    // 关联用户表
    Conversation.associate = function() {
        app.model.Conversation.belongsTo(app.model.User, { foreignKey: 'user_id', targetKey: 'id' });
    };

    return Conversation;
};