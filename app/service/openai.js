'use strict';

const Service = require('egg').Service;
// const { Configuration, OpenAIApi } = require('openai');
const { OpenAIClient, AzureKeyCredential } = require('@azure/openai')

class OpenaiService extends Service {
  constructor(ctx) {
    super(ctx);

    // 引入用户对话模型
    this.main = this.ctx.model.AiConversation;

    /* 使用openai创建配置 */
    // this.configuration = new Configuration({
    //   apiKey: this.app.config.openai.apiKey,
    //   basePath: 'https://147896325.uk/v1' // 这里是cf反代地址
    // });
    // this.openai = new OpenAIApi(this.configuration); // 创建 OpenAI 实例

    /* 使用@azure/openai创建配置 */
    const endpoint = 'https://sunqm.openai.azure.com/';
    const azureApiKey = this.app.config.openai.azureApiKey;

    this.openai = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey)); // 创建openai实例
  }

  async index(prompt) {
    console.log('index暂不进行使用')
  }

  async conversation(userId, message, uuid) {
    try {

      // 添加用户消息到用户对话表
      await this.main.create({
        uuid,
        userId,
        role: 'user',
        content: message,
      });

      const messages = await this.getConversationHistory(uuid);

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
      await this.main.create({
        uuid,
        userId,
        role: 'assistant',
        content: reply,
      });

      return reply;
    } catch (error) {
      if (error.code === 'content_filter') {
        throw new Error('content_filter')
      } else {
        throw error
      }
      // 处理错误
    }
  }

  async getConversationHistory(uuid) {
    try {
      const aiConversation = await this.main.findAll({
        where: {
          uuid,
          display: 1, 	// 只查询未删除的数据
        },
        order: [
          ['id', 'ASC'],
        ],
      });

      return aiConversation.map(conversation => ({
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