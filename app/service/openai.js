'use strict';

const Service = require('egg').Service;
const { OpenAIClient, AzureKeyCredential } = require('@azure/openai')

class OpenaiService extends Service {
  constructor(ctx) {
    super(ctx);

    // 引入用户对话模型
    this.main = this.ctx.model.AiConversation;

    /* 使用@azure/openai创建配置 */
    const endpoint = 'https://madder-gpt4.openai.azure.com/';
    const azureApiKey = this.app.config.openai.azureApiKey;

    this.openai = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey)); // 创建openai实例
  }

  // openai进行对话
  async conversation(messages) {
    /* 使用@azure/openai的依赖 */
    const response = await this.openai.getChatCompletions('gpt-35-turbo-16k', messages);

    const reply = response.choices[0].message.content;
    return reply;
  }

  // openai生成图片
  async painter(prompt, size = '1024x1024', n = 1) {
    const response = await this.openai.getImages(prompt, size, n)
    
    return response.data 
  }
}

module.exports = OpenaiService;