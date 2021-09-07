'use strict';

/** @type Egg.EggPlugin */
module.exports = {

	cors: {
		enable: true,
		package: 'egg-cors',
	},

	io: {
		enable: true,
		package: 'egg-socket.io',
	},

	jwt: {
		enable: true,
		package: 'egg-jwt',
	},

	sequelize: {
		enable: true,
		package: 'egg-sequelize',
	},

	ejs: {
		enable: true,
		package:'egg-view-ejs'
	}

};
