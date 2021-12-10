'user strict';

const Service = require("egg").Service;

class BaiDuService extends Service {

    baiduUrl = 'https://api.map.baidu.com'

    async openMap(url, data ) {
        const realData = { ak: process.env.BAIDU_AK, ...data }
        const res = await this.ctx.curl( this.baiduUrl + url, {
            data: realData,
            dataType: 'json'
        })
        return res.data
    }
}

module.exports = BaiDuService;