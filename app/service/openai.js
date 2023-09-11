'use strict';

const Service = require('egg').Service;
// const { Configuration, OpenAIApi } = require('openai');
const { OpenAIClient, AzureKeyCredential } = require('@azure/openai')

class OpenaiService extends Service {
  constructor(ctx) {
    super(ctx);

    // 引入用户对话模型
    this.UserConversation = this.ctx.model.UserConversation;

    /* 使用openai创建配置 */
    // this.configuration = new Configuration({
    //   apiKey: this.app.config.openai.apiKey,
    //   basePath: 'https://147896325.uk/v1' // 这里是cf反代地址
    // });
    // this.openai = new OpenAIApi(this.configuration); // 创建 OpenAI 实例

    /* 使用@azure/openai创建配置 */
    const endpoint = 'https://sunqm.openai.azure.com/';
    const azureApiKey = this.app.config.openai.azureApiKey;

    console.log('azureApiKey', azureApiKey)

    this.openai = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey)); // 创建openai实例
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

      /* 使用openai的依赖 */
      // const requestData = {
      //   model: 'gpt-3.5-turbo',
      //   messages,
      // };
      // const response = await this.openai.createChatCompletion(requestData);

      /* 使用@azure/openai的依赖 */
      const response = await this.openai.getChatCompletions('gpt-35-turbo-16k', messages);

      const reply = response.choices[0].message.content;

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