'use strict';

const Controller = require('egg').Controller;

class ApiController extends Controller {

    main = this.service.api;

    async index() {
        this.main.index()
    }
}

module.exports = ApiController;