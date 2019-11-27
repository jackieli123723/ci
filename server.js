const Koa = require('koa')
const Router = require('koa-router')
const Cors = require('@koa/cors');
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
const sevenDayWeatherUrl = utils.sevenDayWeatherUrl
const fifteenDayWeatherUrl = utils.fifteenDayWeatherUrl
const randomUserAgent = utils.randomUserAgent
const toDayWeatherUrl = utils.toDayWeatherUrl
const setAirData = utils.setAirData
const getFutureWeatherDate = utils.getFutureWeatherDate
const weekDayInfo = utils.weekDayInfo
const fortyDayWeatherUrl = utils.fortyDayWeatherUrl
const uniqueDate = utils.uniqueDate
const axioFortyDayWeatherUrl = utils.axioFortyDayWeatherUrl
const filterWeatherDataMonth = utils.filterWeatherDataMonth
const todayWeatherWarning = utils.todayWeatherWarning
const todayWeatherAir = utils.todayWeatherAir
const wraperAxiosNow = utils.wraperAxiosNow
const wraperAxiosWarn = utils.wraperAxiosWarn
const wraperAxiosHour = utils.wraperAxiosHour
const wraperAxiosAir = utils.wraperAxiosAir
const wraperAxiosSeven = utils.wraperAxiosSeven
const wraperAxiosSevenSimple = utils.wraperAxiosSevenSimple
const wraperAxiosFifteen = utils.wraperAxiosFifteen
const wraperAxiosForty = utils.wraperAxiosForty
const wraperAxiosFortyProxy = utils.wraperAxiosFortyProxy


process.on('unhandledRejection', (reason, p) => {
  console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

process.on("uncaughtException", function (e) {
  console.log(e);
});

app.use(Cors());
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


//api 版本
router.prefix('/v1/api');

//聚合  4个接口  拿到所有数据 
router.get('/weather/1d/:cityCode', (ctx) => {
  const cityCode = ctx.params.cityCode
  let now = wraperAxiosNow(cityCode)
  let warn = wraperAxiosWarn(cityCode)
  let hour = wraperAxiosHour(cityCode)
  let air = wraperAxiosAir(cityCode)
  return Promise.all([now, warn, hour, air]).then((results) => {
    ctx.body = {
      "msg": "操作成功",
      "code": 200,
      "data": {
        ...results[0],
        ...results[1],
        ...results[2],
        ...results[3]
      }
    }
  }).catch(function (err) {
    console.log(err);
    ctx.body = {
      "msg": "服务器内部错误",
      "code": 500
    }
  });
});



router.get('/weather/7d/:cityCode', ctx => {
  const cityCode = ctx.params.cityCode
  return wraperAxiosSeven(cityCode).then((results) => {
      ctx.body = {
        "msg": "操作成功",
        "code": 200,
        "data": {
          ...results
        }
      }
    })
    .catch(function (error) {
      console.log(error);
      ctx.body = error || {
        "msg": "服务器内部错误",
        "code": 500
      }
    });
});


router.get('/weather/15d/:cityCode', ctx => {
  const cityCode = ctx.params.cityCode
  const sevenData = wraperAxiosSevenSimple(cityCode)
  const fifteenData = wraperAxiosFifteen(cityCode)
  return Promise.all([sevenData, fifteenData]).then((results) => {
      let concatData = results[0].list.concat(results[1].listFifteen)
      let futureDate = []
      for (var i = 0; i < 15; i++) {
        futureDate.push(getFutureWeatherDate(i) + ' ' + weekDayInfo(getFutureWeatherDate(i)))
      }

      //组装 weatherDate
      concatData.forEach(function (item, index, arr) {
        arr[index]['weatherDate'] = futureDate[index]
      })

      ctx.body = {
        "msg": "操作成功",
        "code": 200,
        "data": {
          "list": concatData,
          "uptime": results[0].uptime
        }
      }
    })
    .catch(function (error) {
      console.log(error);
      ctx.body = error || {
        "msg": "服务器内部错误",
        "code": 500
      }
    });

});



router.get('/weather/40d/:cityCode', ctx => {
  const cityCode = ctx.params.cityCode
  let fortyWeatherDate = []
  let fortyWeatherData = []
  for (let i = 0; i < 40; i++) {
    fortyWeatherDate.push(getFutureWeatherDate(i) + ' ' + weekDayInfo(getFutureWeatherDate(i)))
    fortyWeatherData.push(getFutureWeatherDate(i))
  }
  let promiseList = axioFortyDayWeatherUrl(cityCode, uniqueDate(fortyWeatherData)).resassemble //40 天分 最多三个数组 最少两个数组 
  let data = []
  for (let i = 0; i < promiseList.length; i++) {
    data.push(wraperAxiosForty(cityCode, promiseList[i]['year'], promiseList[i]['month']))
  }

  // let nowTimeDate = getFutureWeatherDate(0).split('-').join('')
  // console.log('nowTimeDate', nowTimeDate)

  return Promise.all(data).then((results) => {
      // console.log(results[0].listFortyData.length) //35 11月份
      // console.log(results[1].listFortyData.length) //42 12月份 取这个 
      // console.log(results[2].listFortyData.length) //35 01月份
      let originWeatherDayData
      for (let i = 0; i < results.length; i++) {
        for (let j = 0; j < results[i].listFortyData.length; j++) {
          if (results[i].listFortyData.length == 42) {
            originWeatherDayData = filterWeatherDataMonth(results[i].listFortyData)
          }
        }
      }
      //组装日期 
      originWeatherDayData.forEach((item, index, arr) => {
        item['weatherDate'] = fortyWeatherDate[index]
      })
      ctx.body = {
        "msg": "操作成功",
        "code": 200,
        "data": {
          "list": originWeatherDayData,
          "uptime": originWeatherDayData[0].time
        }
      }
    })
    .catch(function (error) {
      console.log(error);
      ctx.body = error || {
        "msg": "服务器内部错误",
        "code": 500
      }
    });

});

app
  // .use(require('koa-body')())
  .use(router.allowedMethods())
  .use(router.routes());

app.listen(port, () => {
  console.log(`西门互联天气预报接口启动${port}`)
});