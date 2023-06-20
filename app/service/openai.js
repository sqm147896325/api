'use strict';

const Service = require('egg').Service;
const { Configuration, OpenAIApi } = require('openai');
// const tunnel = require('tunnel');

class OpenaiService extends Service {
  constructor(ctx) {
    super(ctx);

    // 创建 OpenAI 配置
    this.configuration = new Configuration({
      apiKey: this.app.config.openai.apiKey,
    });

    // 创建 OpenAI 实例
    this.openai = new OpenAIApi(this.configuration);
  }

  async index(prompt) {
    try {
      // 定义聊天的起始和结束标记
      const messages = [
        {"role": "user", "content": prompt}
      ];

      // 构造请求数据
      const requestData = {
        model: 'gpt-3.5-turbo',
        messages,
      };

    //   // 配置代理选项
    //   const proxyOptions = {
    //     proxy: {
    //       host: this.app.config.v2ray.add,
    //       port: parseInt(this.app.config.v2ray.port),
    //       username: "",  // 如果有用户名和密码，请填写在这里
    //       password: "",  // 如果有用户名和密码，请填写在这里
    //       tls: {
    //         servername: this.app.config.v2ray.sni,
    //       },
    //     },
    //   };

    //   // 创建带有代理的 HTTP 代理隧道
    //   const agent = tunnel.httpsOverHttp(proxyOptions);

      // 发送请求给 ChatGPT-3.5 Turbo API，使用代理
      const response = await this.openai.createChatCompletion(requestData);

      // 从响应中提取回复
      const reply = response.data.choices[0].message.content;

      console.log('reply', response.data.choices)

      return reply;
    } catch (error) {
      console.error('Error in ChatGPT-3.5 Turbo integration:', error);
      // 处理错误
    }
  }
}

module.exports = OpenaiService;