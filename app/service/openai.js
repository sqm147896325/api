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

    // 用户对话记录
    // 创建一个空对象，用于存储每个用户的对话记录
    this.userMessages = {};
  }

  async index(prompt) {
    console.log('index暂不进行使用')
  }

  async converse(userId, message) {
    try {
      // 检查是否存在该用户的对话记录，如果不存在则创建一个新的空数组
      if (!this.userMessages[userId]) {
        this.userMessages[userId] = [];
      }

      // 获取该用户的对话记录数组
      const messages = this.userMessages[userId];

      // 添加用户消息到该用户的对话记录中
      messages.push({ role: 'user', content: message });

      const requestData = {
        model: 'gpt-3.5-turbo',
        messages,
      };

      const response = await this.openai.createChatCompletion(requestData);

      const reply = response.data.choices[0].message.content;

      // 添加助手回复到该用户的对话记录中
      messages.push({ role: 'assistant', content: reply });

      return reply;
    } catch (error) {
      console.error('Error in ChatGPT-3.5 Turbo integration:', error);
      // 处理错误
    }
  }

  getConversationHistory(userId) {
    // 检查该用户的对话记录是否存在
    if (this.userMessages[userId]) {
      // 返回该用户的对话记录数组
      return this.userMessages[userId];
    }

    // 如果对话记录不存在，则返回空数组
    return [];
  }
}

module.exports = OpenaiService;