//http://d1.weather.com.cn/calendarFromMon/2019/101010100_201911.html?_=1573438622791

// Provisional headers are shown
// Referer: http://www.weather.com.cn/weather40dn/101010100.shtml
// User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36



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

const fortyDayWeatherUrl = utils.fortyDayWeatherUrl
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



router.prefix('/v1/api');
router.get('/weather/now/:cityCode', ctx => {
      const cityCode = ctx.params.cityCode
      const headers = {
       headers: {
        referer: `http://www.weather.com.cn/weather40dn/${cityCode}.shtml`, //源域名 Referer: http://www.weather.com.cn/weather1dn/101010100.shtml
         'Content-Type': 'text/html',
         'User-Agent':randomUserAgent()
      }
    }

    console.log(fortyDayWeatherUrl(cityCode))

    return axios.get(fortyDayWeatherUrl(cityCode),headers)
        .then(function (response) {
          const $ = cheerio.load(response.data,{ decodeEntities:false})

          let fortyWeather = $('html body').html().replace('var fc40 = ','')

          let data = JSON.parse(fortyWeather)

          console.log(data)

          ctx.body = {
                      "msg": "操作成功",
                      "code": 200,
                      "data": data
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


