'use strict';

// import configFun from './configFun.js'
const configFun = require('./configFun');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
	const config = configFun(appInfo)
	return config
};

