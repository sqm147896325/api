'use strict';

const Service = require('egg').Service;
const { Configuration, OpenAIApi } = require('openai');

class OpenaiService extends Service {
  constructor(ctx) {
    super(ctx);

    /* 下面为cf反代work配置 */

    // const TELEGRAPH_URL = 'https://api.openai.com';

    // addEventListener('fetch', event => {
    //   event.respondWith(handleRequest(event.request))
    // })

    // async function handleRequest(request) {
    //   const url = new URL(request.url);
    //   url.host = TELEGRAPH_URL.replace(/^https?:\/\//, '');

    //   const modifiedRequest = new Request(url.toString(), {
    //     headers: request.headers,
    //     method: request.method,
    //     body: request.body,
    //     redirect: 'follow'
    //   });

    //   const response = await fetch(modifiedRequest);
    //   const modifiedResponse = new Response(response.body, response);

    //   // 添加允许跨域访问的响应头
    //   modifiedResponse.headers.set('Access-Control-Allow-Origin', '*');

    //   return modifiedResponse;
    // }

    // 创建 OpenAI 配置
    this.configuration = new Configuration({
      apiKey: this.app.config.openai.apiKey,
      basePath: 'https://147896325.uk/v1' // 这里放cf反代地址
    });

    // 创建 OpenAI 实例
    this.openai = new OpenAIApi(this.configuration);
  }

  async index(prompt) {
    try {
      // 定义聊天的起始和结束标记
      // todo messages是当前用户对话的记录应该存入
      const messages = [
        {"role": "user", "content": prompt}
      ];

      // 构造请求数据
      const requestData = {
        model: 'gpt-3.5-turbo',
        messages,
      };

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