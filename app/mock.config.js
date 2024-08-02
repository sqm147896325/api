'use strict';

module.exports = {
  login: {
    "data": {
      "code": 200,
      "msg": 'ok',
      "data": {
        "token": "mock token"
      }
    },
    "statusCode": 200,
    "header": {
      "content-type": "application/json; charset=utf-8"
    }
  },

  getInfo: {
    "data": {
      "code": 200,
      "msg": 'ok',
      "data": {
        "id|+1": "@integer(10000000000, 19999999999)", // id
        "name": "@ctitle(2, 3)", // 店名、用户名
        "phone": "18888888888", // 手机号
        "email": "@email()", // 邮箱
        "address": "@cword(10, 30)", // 详细地址
        "distance": "@integer(1, 200)", // 距离（km）
        "longitude": "@integer(100, 120)", // 经度
        "latitude": "@integer(20, 50)", // 维度
        "startTime": "@datetime()", // 开始时间
        "endTime": "@datetime()", // 结束时间
        "state": "@integer(0, 4)", // 状态 0 - 5
        "amount": "@float(0, 100, 2, 2)" // 金额、余额
      }
    },
    "statusCode": 200,
    "header": {
      "content-type": "application/json; charset=utf-8"
    }
  },

  listSearch: {
    "data": {
      "code": 200,
      "msg": 'ok',
      "data": {
        "records|10": [{
          "id|+1": 10000000000,
          "name": "@ctitle(2, 3)", // 店名、用户名
          "phone": "18888888888", // 手机号
          "email": "@email()", // 邮箱
          "address": "@cword(10, 30)", // 详细地址
          "distance": "@integer(1, 200)", // 距离（km）
          "longitude": "@integer(100, 120)", // 经度
          "latitude": "@integer(20, 50)", // 维度
          "startTime": "@datetime()", // 开始时间
          "endTime": "@datetime()", // 结束时间
          "state": "@integer(0, 4)", // 状态 0 - 5
          "amount": "@float(0, 100, 2, 2)" // 金额、余额
        }],
        "total": 30,
      }
    },
    "statusCode": 200,
    "header": {
      "content-type": "application/json; charset=utf-8"
    }
  },

  logout: {
    "data": {
      "code": 200,
      "msg": 'ok',
      "data": {
      }
    },
    "statusCode": 200,
    "header": {
      "content-type": "application/json; charset=utf-8"
    }
  },
}