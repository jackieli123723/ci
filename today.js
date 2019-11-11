const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()
const port = process.env.PORT || 4003 
const axios = require('axios')
const cheerio = require('cheerio')
const city = require('./city/index.js')
const utils = require('./config/utils');
const trim = utils.trim;
const trimdot = utils.trimdot;
const temperatureScriptData = utils.temperatureScriptData;
const getClothes = utils.getClothes
const getLife = utils.getLife
const getLv = utils.getLv
const flatten = utils.flatten
const jsonToObj = utils.jsonToObj
const getDegree = utils.getDegree
const getPerTimeList = utils.getPerTimeList


const toDayWeatherUrl = utils.toDayWeatherUrl
const randomUserAgent = utils.randomUserAgent




process.on('unhandledRejection', (reason, p) => {
    console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

process.on("uncaughtException", function(e) {
  console.log(e);
});
// 错误捕获
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = err.message
    ctx.app.emit('error', err, ctx)
  }
})

// http://www.weather.com.cn/weather1dn/101010100.shtml
//实时 http://d1.weather.com.cn/sk_2d/101010100.html?_=1573170108252




router.prefix('/v1/api');
router.get('/weather/now/:cityCode', ctx => {
      const cityCode = ctx.params.cityCode
      const headers = {
       headers: {
        referer: `http://www.weather.com.cn/weather1dn/${cityCode}.shtml`, //源域名 Referer: http://www.weather.com.cn/weather1dn/101010100.shtml
         'Content-Type': 'text/html',
         'User-Agent':randomUserAgent()
      }
    }

    return axios.get(toDayWeatherUrl(cityCode),headers)
        .then(function (response) {
            const $ = cheerio.load(response.data,{ decodeEntities:false})

          let timeWeather = $('html body').html().replace('var dataSK = ','')

          let obj = JSON.parse(timeWeather)

          console.log(obj)

          ctx.body = {
                      "msg": "操作成功",
                      "code": 200,
                      "data": obj
                }

    })
    .catch(function (error) {
       console.log(error);
         ctx.body = {
              "msg": "服务器内部错误",
              "code": 500
        }
    }); 

});


app
    // .use(require('koa-body')())
    .use(router.allowedMethods())
    .use(router.routes());

app.listen(port,() => {
    console.log(`西门互联天气预报接口启动${port}`)
});


