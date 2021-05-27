'use strict';

const Service = require("egg").Service;

const fs = require("fs");

const path = require('path')

// 对获取到的文件进行处理
function formatContent(val, group) {
    val = val.replace(/[\t|\r|\n]*/g, '') // 去除其他多余的制表符
    val = val.replace(/^\s+|\s+$/g, ' ') // 使多个空格变为一个
    console.log('val', val)
    let method = new RegExp('\\/\\*\\*\\s(?<need>[^\\/]*)\\*\\/\\s*async*\\s*' + group[4]) // 匹配查找文件中对应的多行注释
    val = method.exec(val)
    if(val === null){
        // 没有匹配则为空数组
        val = []
    }
    val = val?.groups?.need || ''; // 对于匹配和没匹配到的兼容处理
    val = val.split('* @'); // 分割每一行
    val = val.filter(e => {
        // 去除无关空字符串
        return e!==''
    })
    let content = {}
    if(val.length !== 0){
        val.forEach((item1) => {
            if(item1.split(' ')[0] !== ''){
                if(!content[item1.split(' ')[0]]){
                    content[item1.split(' ')[0]] = []
                }
                content[item1.split(' ')[0]].push(item1.split(' ')[1])
            }
        })
    }
    for (const key in content) {
        if(content[key].length == 1){
            // 如果不是数组则直接改为string的键值对
            content[key] = content[key][0]
        }
    }
    return content
}

// 获取路由配置文件中的路由信息
async function getRouterReadFile() {
    const file = await fs.readFileSync(path.join(__dirname, '../router.js'), 'utf-8') // 获取路由文件内容
    const fileString = file.toString() // 将内容转为string
    const routerGroupExp = /router.([a-z]{3,6}).*;/g // 分组的正则表达式
    let routerGroup = fileString.match(routerGroupExp) // 使用表达式进行分组
    let routeExp = /router.([a-z]{3,6})\('(.*)',\scontroller.(.*)\.(.*)\)/ //分组匹配
    // routerGroup = []
    await routerGroup.forEach(async e => {
        // 对接口进行分组并提取关键字
        let group = routeExp.exec(e)
        const controllerFile = await fs.readFileSync(path.join(__dirname, `../controller/${group[3]}.js`), 'utf-8') // 获取路由文件内容
        let result = formatContent(controllerFile, group)
        routerGroup.push({
            method: group[1],
            path: group[2],
            // file: group[3],
            // fileFun: group[4],
            content: result
        })
    })
    return routerGroup
}

class ApiService extends Service {
    async index() {
        const res = await getRouterReadFile();
        console.log(res)
        return res
    }
}

module.exports = ApiService;