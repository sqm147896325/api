/* eslint valid-jsdoc: "off" */

'use strict';

// import configFun from './configFun.js'
const configFun = require('./configFun');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
    let pwd = ''
    let username = ''
    if (process.argv[2] && JSON.parse(process.argv[2]).pwd && JSON.parse(process.argv[2]).username) {
        // egg 生命周期等地方无法异步传入密码，beta模式下用户名密码由node参数传入
        pwd = JSON.parse(process.argv[2]).pwd + ''
        username = JSON.parse(process.argv[2]).username + ''

        appInfo = configFun(appInfo, {
            sequelize: {
                dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
                database: 'main',
                host: 'sunqm.com',
                port: '3306',
                username: username,
                password: pwd,
                timezone:'+08:00',
                define:{
                    freezeTableName: true,		// Model 对应的表名将与model名相同
                },
                logging: false,
                dialectOptions: { charset: 'utf8mb4' }
            },
            redis: {
                // 单个数据库用client,多个数据库用clients
                client: {
                    port: 6379,
                    host: 'sunqm.com',
                    password: pwd,
                    db: 0,
                }
            }
        })
    } else {
        console.log('beta模式请输入 --pwd xxx --username xxx，当前以普通模式运行')
    }
	return appInfo
};

