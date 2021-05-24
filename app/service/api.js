'use strict';

const Service = require("egg").Service;

const fs = require("fs");

const path = require('path')

// 获取路由配置文件中的路由信息
async function getRouter() {
    const file = await fs.readFileSync(path.join(__dirname, '../router.js'), 'utf-8') // 获取路由文件内容
    const fileString = file.toString() // 将内容转为string
    const routerGroupExp = /router.([a-z]{3,6}).*;/g // 分组的正则表达式
    let routerGroup = fileString.match(routerGroupExp) // 使用表达式进行分组
    let routeExp = /router.([a-z]{3,6})\('(.*)',\scontroller.(.*)\.(.*)\)/ //分组匹配
    routerGroup = routerGroup.map(e => {
        // 对接口进行分组并提取关键字
        let group = routeExp.exec(e)
        return {
            method: group[1],
            path: group[2],
            file: group[3],
            fileFun: group[4]
        }
    })
    return routerGroup
}

class ApiService extends Service {
    async index() {
        const { ctx } = this;
		const { helper } = ctx;
        const res = await getRouter();
        helper.info('接口列表', res)
        
    }
}

module.exports = ApiService;