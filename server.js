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



process.on('unhandledRejection', (reason, p) => {
  console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

process.on("uncaughtException", function (e) {
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

//预警

function todayWeatherWarning(cityCode) {
  let time = new Date().getTime()
  return `http://d1.weather.com.cn/dingzhi/${cityCode}.html?_=${time}`
}

//air

function todayWeatherAir(cityCode) {
  let time = new Date().getTime()
  return `http://d1.weather.com.cn/aqi_all/${cityCode}.html?_=${time}`
}


function wraperAxiosNow(cityCode) {
  return new Promise((resolve, reject) => {
    const headers = {
      headers: {
        referer: `http://www.weather.com.cn/weather1dn/${cityCode}.shtml`,
        'Content-Type': 'text/html',
        'User-Agent': randomUserAgent()
      }
    }

    axios.get(toDayWeatherUrl(cityCode), headers)
      .then(function (response) {
        const $ = cheerio.load(response.data, {
          decodeEntities: false
        })
        let timeWeather = $('html body').html().replace('var dataSK = ', '')

        let realWeatherObj = JSON.parse(timeWeather)

        resolve({
          ...realWeatherObj
        })
      })
      .catch(err => reject(err))
  })
}

function wraperAxiosWarn(cityCode) {
  return new Promise((resolve, reject) => {
    const headers = {
      headers: {
        referer: `http://www.weather.com.cn/weather1dn/${cityCode}.shtml`,
        'Content-Type': 'text/html',
        'User-Agent': randomUserAgent()
      }
    }
    axios.get(todayWeatherWarning(cityCode), headers)
      .then(function (response) {
        const $ = cheerio.load(response.data, {
          decodeEntities: false
        })
        let warnWeather = $('html body').html()
          .split(";")

        let cityDZ = jsonToObj(warnWeather[0].replace(`var cityDZ${cityCode} =`, ''))
        let alarmDZ = jsonToObj(warnWeather[1].replace(`var alarmDZ${cityCode} =`, ''))
        resolve({
          cityDZ,
          alarmDZ
        })
      })
      .catch(err => reject(err))
  })
}

function wraperAxiosHour(cityCode) {
  return new Promise((resolve, reject) => {
    const url = `http://www.weather.com.cn/weather1dn/${cityCode}.shtml`
    axios.get(url)
      .then(function (response) {
        const $ = cheerio.load(response.data, {
          decodeEntities: false
        })

        let todayData = $('.todayRight script').html()
          .replace("var hour3data=", "")
          .replace(/\n/g, "")
          .split(";")

        todayData.pop()

        //24小时
        // console.log(jsonToObj(todayData[0]))
        let forecastList1 = getPerTimeList((jsonToObj(todayData[0]))[0]).drgeeData
        let forecastList2 = getPerTimeList((jsonToObj(todayData[0]))[1]).drgeeData

        let forecastListob = forecastList1.concat(forecastList2)

        let forecastList = forecastListob.slice(0, 24)

        console.log(forecastList.length)

        let lifeAssistant = getLv(0, $)

        let sunup = jsonToObj(todayData[7].replace('var sunup =', ''))[1]
        let sunset = jsonToObj(todayData[8].replace('var sunset =', ''))[1]
        let max_degree = jsonToObj(todayData[3].replace('var eventDay =', ''))[2]
        let min_degree = jsonToObj(todayData[4].replace('var eventNight =', ''))[1]

        console.log(max_degree, min_degree, sunup, sunset)

        resolve({
          forecastList,
          lifeAssistant,
          max_degree,
          min_degree,
          sunup,
          sunset
        })
      })
      .catch(err => reject(err))
  })
}


function wraperAxiosAir(cityCode) {
  return new Promise((resolve, reject) => {
    const headers = {
      headers: {
        referer: `http://www.weather.com.cn/air/?city=${cityCode}`,
        'Content-Type': 'text/html',
        'User-Agent': randomUserAgent()
      }
    }
    axios.get(todayWeatherAir(cityCode), headers)
      .then(function (response) {
        const $ = cheerio.load(response.data, {
          decodeEntities: false
        })
        let air = $('html body').html()
          .replace("setAirData(", '')
          .replace(")", "")

        let airInfo = setAirData(jsonToObj(air))
        resolve({
          ...airInfo
        })
      })
      .catch(err => reject(err))
  })
}


function wraperAxiosSeven(cityCode) {
  return new Promise((resolve, reject) => {
    axios.get(sevenDayWeatherUrl(cityCode))
      .then(function (response) {
        const $ = cheerio.load(response.data, {
          decodeEntities: false
        })
        let hasBody = $('body').html()
        if (hasBody == '') {
          let errorInfo = {
            "msg": "城市代码错误",
            "code": 500
          }
          reject(errorInfo)
          return
        }

        //温度
        let temperatures = temperatureScriptData($(".blueFor-container script").html())

        //24小时 
        let hour3data = $(".details-container script").html()
          .replace("var hour3data=", "")
          .replace(/\n/g, "")
          .split(";")

        hour3data.pop()

        let data = [];
        //聚合7天数据 
        $('.date-container li').each(function (item, indx, arr) {
          let $this = $(this);
          let index = $this.index();
          let weatherContentDom = $(".blue-container .blue-item").eq(index)
          let weatherLifeDom = $(".weather_shzs .lv").eq(index)
          if (index > 0) {
            data.push({
              date: trim($this.find(".date").text()),
              dateInfo: trim($this.find(".date-info").text()),
              weatherDate: getFutureWeatherDate(index - 1) + ' ' + weekDayInfo(getFutureWeatherDate(index - 1)),
              day_weather: weatherContentDom.find(".item-icon").eq(0).attr("title"),
              night_weather: weatherContentDom.find(".item-icon").eq(1).attr("title"),
              weatherInfo: trim(weatherContentDom.find(".weather-info").text()),
              day_wind: weatherContentDom.find(".wind-container").find(".wind-icon").eq(0).attr("title"),
              night_wind: weatherContentDom.find(".wind-container").find(".wind-icon").eq(1).attr("title"),
              windInfo: trim(weatherContentDom.find(".wind-info").text()),
              forecastList: getPerTimeList((jsonToObj(hour3data[0]))[index - 1]).drgeeData, //算法转换
              sunup: getDegree(jsonToObj(temperatures[4]), index - 1),
              sunset: getDegree(jsonToObj(temperatures[5]), index - 1),
              max_degree: getDegree(jsonToObj(temperatures[0]), index),
              min_degree: getDegree(jsonToObj(temperatures[1]), index),
              lifeDate: getLife(index - 1, $),
              lifeAssistant: getLv(index - 1, $)
            });
          }
        })

        let list = data
        let uptime = trimdot(hour3data[2].replace("var uptime=", "")) + '| 数据来源 中央气象台'

        resolve({
          list,
          uptime
        })
      })
      .catch(err => reject(err))
  })
}


function wraperAxiosSevenSimple(cityCode) {
  return new Promise((resolve, reject) => {
    axios.get(sevenDayWeatherUrl(cityCode))
      .then(function (response) {
        const $ = cheerio.load(response.data, {
          decodeEntities: false
        })
        let hasBody = $('body').html()
        if (hasBody == '') {
          let errorInfo = {
            "msg": "城市代码错误",
            "code": 500
          }
          reject(errorInfo)
          return
        }

        //温度
        let temperatures = temperatureScriptData($(".blueFor-container script").html())

        //24小时 
        let hour3data = $(".details-container script").html()
          .replace("var hour3data=", "")
          .replace(/\n/g, "")
          .split(";")

        hour3data.pop()

        let data = [];
        //聚合7天数据 
        $('.date-container li').each(function (item, indx, arr) {
          let $this = $(this);
          let index = $this.index();
          let weatherContentDom = $(".blue-container .blue-item").eq(index)
          let weatherLifeDom = $(".weather_shzs .lv").eq(index)
          if (index > 0) {
            data.push({
              date: trim($this.find(".date").text()),
              dateInfo: trim($this.find(".date-info").text()),
              weatherDate: getFutureWeatherDate(index - 1) + ' ' + weekDayInfo(getFutureWeatherDate(index - 1)),
              day_weather: weatherContentDom.find(".item-icon").eq(0).attr("title"),
              night_weather: weatherContentDom.find(".item-icon").eq(1).attr("title"),
              weatherInfo: trim(weatherContentDom.find(".weather-info").text()),
              day_wind: weatherContentDom.find(".wind-container").find(".wind-icon").eq(0).attr("title"),
              night_wind: weatherContentDom.find(".wind-container").find(".wind-icon").eq(1).attr("title"),
              windInfo: trim(weatherContentDom.find(".wind-info").text()),
              max_degree: getDegree(jsonToObj(temperatures[0]), index),
              min_degree: getDegree(jsonToObj(temperatures[1]), index),
            });
          }
        })

        let list = data
        let uptime = trimdot(hour3data[2].replace("var uptime=", "")) + '| 数据来源 中央气象台'


        resolve({
          list,
          uptime
        })
      })
      .catch(err => reject(err))
  })
}




function wraperAxiosFifteen(cityCode) {
  return new Promise((resolve, reject) => {
    axios.get(fifteenDayWeatherUrl(cityCode))
      .then(function (response) {
        const $ = cheerio.load(response.data, {
          decodeEntities: false
        })
        let hasBody = $('body').html()

        if (hasBody == '') {
          let errorInfo = {
            "msg": "城市代码错误",
            "code": 500
          }
          reject(errorInfo)
          return
        }

        //温度
        let temperatures = temperatureScriptData($(".blueFor-container script").html())

        let data = [];
        //后面8天数据 
        $('.date-container li').each(function (item, indx, arr) {
          let $this = $(this);
          let index = $this.index();
          let weatherContentDom = $(".blue-container .blue-item").eq(index)
          let weatherLifeDom = $(".weather_shzs .lv").eq(index)

          data.push({
            date: trim($this.find(".date").text()),
            dateInfo: trim($this.find(".date-info").text()),
            day_weather: weatherContentDom.find(".item-icon").eq(0).attr("title"),
            night_weather: weatherContentDom.find(".item-icon").eq(1).attr("title"),
            weatherInfo: trim(weatherContentDom.find(".weather-info").text()),
            day_wind: weatherContentDom.find(".wind-container").find(".wind-icon").eq(0).attr("title"),
            night_wind: weatherContentDom.find(".wind-container").find(".wind-icon").eq(1).attr("title"),
            windInfo: trim(weatherContentDom.find(".wind-info").text()),
            max_degree: getDegree(jsonToObj(temperatures[2]), index),
            min_degree: getDegree(jsonToObj(temperatures[3]), index),
          });

        })

        let listFifteen = data
        resolve({
          listFifteen
        })
      })
      .catch(err => reject(err))
  })
}



function wraperAxiosForty(cityCode,year,month) {
  return new Promise((resolve, reject) => {
    const headers = {
      headers: {
        referer: `http://www.weather.com.cn/weather40dn/${cityCode}.shtml`,
        'Content-Type': 'text/html',
        'User-Agent': randomUserAgent()
      }
    }
    axios.get(fortyDayWeatherUrl(cityCode,year,month), headers)
      .then(function (response) {
        const $ = cheerio.load(response.data, {
          decodeEntities: false
        })
        let fc40 = $('html body').html()
          .replace("var fc40 = ", "")

        let listFortyData = jsonToObj(fc40)
        resolve({
          listFortyData
        })
      })
      .catch(err => reject(err))
  })
}


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

  let fortyWeatherData = []
  // for (var i = 0; i < 40; i++) {
  //   fortyWeatherData.push(getFutureWeatherDate(i) + ' ' + weekDayInfo(getFutureWeatherDate(i)))
  // }
  for (let i = 0; i < 40; i++) {
    fortyWeatherData.push(getFutureWeatherDate(i))
  }
  let promiseList = axioFortyDayWeatherUrl(cityCode,uniqueDate(fortyWeatherData)).resassemble //40 天分 最多三个数组 最少两个数组 
  let data = []
  for(let i=0;i<promiseList.length;i++){
    data.push(wraperAxiosForty(cityCode,promiseList[i]['year'],promiseList[i]['month']))
  }

  let nowTimeDate = getFutureWeatherDate(0).split('-').join('')
  console.log('nowTimeDate',nowTimeDate)

  // function getUserClickWeatherR(t, a) {
  //   var e = t;
  //   e = t > a ? a : t,
  //   clickTdFunction(e),
  //   // $("#table tbody tr td").eq(e).addClass("today");
  // }


 
  return Promise.all(data).then((results) => {
      console.log(results[0].listFortyData.length) //35 11月份
      console.log(results[1].listFortyData.length) //42 12月份
      console.log(results[2].listFortyData.length) //35 01月份

      // console.log(JSON.stringify(results,null,3))
      console.log(results.length)

      let list = []
      for(let i=0;i<results.length;i++){
        list = list.concat(...results[i].listFortyData)
      }
      console.log('list',list.length)
      ctx.body = {
        "msg": "操作成功",
        "code": 200,
        "data": {
          // "list": results[0].listFortyData
          "list":list
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