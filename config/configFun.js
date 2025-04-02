/* 
    默认配置文件和产品配置文件打大同小异，维护这一个配置文件，使用userConfig参数自定义
*/

const path = require('path');

module.exports = (appInfo, userConfig = {}) => {
    	/**
	 * built-in config
	 * @type {Egg.EggAppConfig}
	 **/
	const config = exports = {};

	// use for cookie sign key, should change to your own and keep security
	config.keys = appInfo.name + '_';

	// 在这里添加中间件,执行顺序为数组顺序
	config.middleware = [ 'token' , 'params' ];

	// 打开前置代理模式
	config.proxy = true;
	// 解析真实ip
	config.ipHeaders = 'X-Real-Ip, X-Forwarded-For';

	// 程序端口设置
	config.cluster = {
		listen: {
			path: '',
			port: 9080,
			hostname: 'localhost',
		}
	};
	

	// 安全策略设置
	config.security = {
		csrf: {
			enable: false, 		// 开关功能配置
			ignoreJSON: true 	// 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
		},

		//白名单，指定前端地址
		// domainWhiteList: ["http://localhost:8080"],
		// domainWhiteList: '*',
	};
	
	// 跨域配置
	config.cors = { origin:'*', allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS' };

	// 数据库配置
	config.sequelize = {
		dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
		database: 'main',
		host: '127.0.0.1',
		port: '3306',
		username: process.env.SQL_NAME ? process.env.SQL_NAME : 'root',
		password: process.env.SQL_PASSWORD ? process.env.SQL_PASSWORD : '666666',
		timezone:'+08:00',
		define:{
			freezeTableName: true,		// Model 对应的表名将与model名相同
		},
		logging: false,
		dialectOptions: { charset: 'utf8mb4' }
	};

	config.redis = {
		// 单个数据库用client,多个数据库用clients
		client: {
			port: 6379,
			host: '127.0.0.1',
			password: process.env.SQL_PASSWORD ? process.env.SQL_PASSWORD : 'redis666666',
			db: 0,
		}
	}


	// jwt配置 
	config.jwt = { secret: 'sqm' };

	// 路由白名单
	config.tokenWL = [
		'/' ,
		'/login',
		'/file/downloadZip',
		'/file/fileLink',
		'/api/baidu',
		'/user/emailVerify',
		'/user/emailSetUser',
		'/page/*',
		'/webHook/*',
		'/home/*',
		'/mock/*',
	];

	config.multipart = {
		mode: 'file',		// 使用文件模式，这里还有stream模式更合理，不过使用较复杂
		fieldNameSize: 100,	// 表单 Field 文件名长度限制，默认100
		fieldSize: '100kb',	// 表单 Field 内容大小，默认100kb
		fields: 10,			// 表单 Field 最大个数
		fileSize: '500mb',	// 单个文件大小
		files: 10,			// 允许上传的最大文件数
		// 文件上传白名单，这里使用函数式使所有文件都可以上传
		whitelist: 	() => true
	};

	// 模板引擎配置
	config.view = {
		defaultViewEngine: 'ejs',	// 默认使用的模板引擎
		mapping:{
			'.html':'ejs' 			// '指定后缀':'指定模板引擎'
		}
	};

	// socket配置
	config.io = {
		init: {}, // passed to engine.io
		namespace: {
			'/': {
				connectionMiddleware: ['connection'],	// 进入时走的中间件
				packetMiddleware: [],	// 每次发消息走的中间件
			},
			'/msg': {
				connectionMiddleware: ['connection'],	// 进入时走的中间件
				packetMiddleware: [],	// 每次发消息走的中间件
			},
			'/chat': {
				connectionMiddleware: ['connection'],	// 进入时走的中间件
				packetMiddleware: [],	// 每次发消息走的中间件
			},
			'/term': {
				connectionMiddleware: ['connection'],	// 进入时走的中间件
				packetMiddleware: [],	// 每次发消息走的中间件
			}
		},
	};

	/* 使用内置的 egg-static 部署静态网页 */
	config.static = {
		dir: [
			{prefix: '/page/back/', dir: path.join(appInfo.baseDir, 'project/blog-back/dist')},
			{prefix: '/page/home/', dir: path.join(appInfo.baseDir, 'project/blog-home/dist')},
			{prefix: '/page/com/', dir: path.join(appInfo.baseDir, 'project/madder-com/dist')},
		]
	};

	/* 自定义配置 */
	config.openai = {
		apiKey: process.env.OPENAI_API_KEY
	}

	return {
		...config,
		...userConfig,
	};

}