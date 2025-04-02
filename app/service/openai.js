'use strict';

const Service = require('egg').Service;
const OpenAI = require('openai')

class OpenaiService extends Service {
  constructor(ctx) {
    super(ctx);

    try {
      // 引入用户对话模型
      this.main = this.ctx.model.AiConversation;
  
      /* 创建配置 */
      const aiConfig = this.app.config.ai.deepSeek;

      this.openai = new OpenAI(aiConfig); // 创建openai实例
    } catch (error) {
      console.log('ai 初始化失败', error)
    }
  }

  // openai进行对话
  async conversation(messages) {
    /* 使用@azure/openai的依赖 */
    const events = await this.openai.chat.completions.create({
      model: 'deepseek-chat',
      messages,
      stream: true,
    });

    return events;
  }

  // openai生成图片
  async painter(prompt, size = '1024x1024', n = 1) {
    try {
      const model = "Dalle3";
      const response = await this.openai.images.generate({ model, prompt,  size, n })   
      return response.data
    } catch (error) {
      console.log('error', error)
      return error
    }    
  }
}

module.exports = OpenaiService;