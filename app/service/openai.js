'use strict';

const Service = require('egg').Service;
const { Configuration, OpenAIApi } = require('openai');

class OpenaiService extends Service {
  constructor(ctx) {
    super(ctx);

    // 创建 OpenAI 配置
    this.configuration = new Configuration({
      apiKey: this.app.config.openai.apiKey,
      basePath: 'https://147896325.uk/v1' // 这里是cf反代地址
    });

    // 创建 OpenAI 实例
    this.openai = new OpenAIApi(this.configuration);

    // 引入用户对话模型
    this.UserConversation = this.ctx.model.UserConversation;
  }

  async index(prompt) {
    console.log('index暂不进行使用')
  }

  async converse(userId, message) {
    try {
      // 添加用户消息到用户对话表
      await this.UserConversation.create({
        userId,
        role: 'user',
        content: message,
      });

      const userConversation = await this.UserConversation.findAll({
        where: {
          userId,
        },
        order: [
          ['id', 'ASC'],
        ],
      });

      const messages = userConversation.map(conversation => ({
        role: conversation.role,
        content: conversation.content,
      }));

      const requestData = {
        model: 'gpt-3.5-turbo',
        messages,
      };

      const response = await this.openai.createChatCompletion(requestData);

      const reply = response.data.choices[0].message.content;

      // 添加助手回复到用户对话表
      await this.UserConversation.create({
        userId,
        role: 'assistant',
        content: reply,
      });

      return reply;
    } catch (error) {
      console.error('Error in ChatGPT-3.5 Turbo integration:', error);
      // 处理错误
    }
  }

  async getConversationHistory(userId) {
    try {
      const userConversation = await this.UserConversation.findAll({
        where: {
          userId,
        },
        order: [
          ['id', 'ASC'],
        ],
      });

      return userConversation.map(conversation => ({
        role: conversation.role,
        content: conversation.content,
      }));
    } catch (error) {
      console.error('Error retrieving conversation history:', error);
      // 处理错误
      return [];
    }
  }
}

module.exports = OpenaiService;