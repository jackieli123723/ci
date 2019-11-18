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

const setAirData = utils.setAirData


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

//当天的数据接口实时
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



//预警

function todayWeatherWarning(cityCode){
  let time = new Date().getTime() 
  return `http://d1.weather.com.cn/dingzhi/${cityCode}.html?_=${time}`
}

//air

function todayWeatherAir(cityCode){
  let time = new Date().getTime()
  return `http://d1.weather.com.cn/aqi_all/${cityCode}.html?_=${time}`
}


function wraperAxiosNow(cityCode){
  return new Promise((resolve,reject) => {
        const headers = {
           headers: {
            referer: `http://www.weather.com.cn/weather1dn/${cityCode}.shtml`, 
             'Content-Type': 'text/html',
             'User-Agent':randomUserAgent()
          }
        }

        axios.get(toDayWeatherUrl(cityCode),headers)
                .then(function (response) {
                    const $ = cheerio.load(response.data,{ decodeEntities:false})
                    let timeWeather = $('html body').html().replace('var dataSK = ','')

                   let realWeatherObj = JSON.parse(timeWeather)

                    resolve({ ...realWeatherObj })
                })
                .catch(err => reject(err))
  })
}

function wraperAxiosWarn(cityCode){
  return new Promise((resolve,reject) => {
       const headers = {
           headers: {
            referer: `http://www.weather.com.cn/weather1dn/${cityCode}.shtml`,
             'Content-Type': 'text/html',
             'User-Agent':randomUserAgent()
          }
        }
        axios.get(todayWeatherWarning(cityCode),headers)
                .then(function (response) {
                    const $ = cheerio.load(response.data,{ decodeEntities:false})
                    let warnWeather = $('html body').html()
                     .split(";")   

                    let cityDZ = jsonToObj(warnWeather[0].replace(`var cityDZ${cityCode} =`,''))
                    let alarmDZ = jsonToObj(warnWeather[1].replace(`var alarmDZ${cityCode} =`,''))
                    resolve({ cityDZ, alarmDZ })
                })
                .catch(err => reject(err))
  })
}

function wraperAxiosHour(cityCode){
  return new Promise((resolve,reject) => {
        const url = `http://www.weather.com.cn/weather1dn/${cityCode}.shtml`
        axios.get(url)
                .then(function (response) {
                      const $ = cheerio.load(response.data,{ decodeEntities:false})

                    let todayData = $('.todayRight script').html()
                    .replace("var hour3data=","")
                    .replace(/\n/g, "")
                    .split(";")   

                    todayData.pop()       

                     //24小时
                    // console.log(jsonToObj(todayData[0]))
                    let forecastList1 = getPerTimeList((jsonToObj(todayData[0]))[0]).drgeeData
                    let forecastList2 = getPerTimeList((jsonToObj(todayData[0]))[1]).drgeeData
  
                    let forecastListob = forecastList1.concat(forecastList2)
                   
                    let forecastList = forecastListob.slice(0,24)

                    console.log(forecastList.length)

                    let lifeAssistant = getLv(0,$)

                   let sunup = jsonToObj(todayData[7].replace('var sunup =',''))[1]
                   let sunset = jsonToObj(todayData[8].replace('var sunset =',''))[1]
                   let max_degree = jsonToObj(todayData[3].replace('var eventDay =',''))[2]
                   let min_degree = jsonToObj(todayData[4].replace('var eventNight =',''))[1]

                   console.log(max_degree,min_degree,sunup,sunset)

                    resolve({ forecastList, lifeAssistant,max_degree,min_degree,sunup,sunset })
                })
                .catch(err => reject(err))
  })
}


function wraperAxiosAir(cityCode){
  return new Promise((resolve,reject) => {
       const headers = {
           headers: {
              referer: `http://www.weather.com.cn/air/?city=${cityCode}`,
             'Content-Type': 'text/html',
             'User-Agent':randomUserAgent()
          }
        }
        axios.get(todayWeatherAir(cityCode),headers)
                .then(function (response) {
                    const $ = cheerio.load(response.data,{ decodeEntities:false})
                    let air = $('html body').html()
                    .replace("setAirData(",'')
                    .replace(")","")

                    let airInfo = setAirData(jsonToObj(air))
                    resolve({...airInfo})
                })
                .catch(err => reject(err))
  })
}




router.get('/weather/warn/:cityCode', ctx => {
      const cityCode = ctx.params.cityCode
      const headers = {
       headers: {
        referer: `http://www.weather.com.cn/weather1dn/${cityCode}.shtml`, //源域名 Referer: http://www.weather.com.cn/weather1dn/101010100.shtml
         'Content-Type': 'text/html',
         'User-Agent':randomUserAgent()
      }
    }

    return axios.get(todayWeatherWarning(cityCode),headers)
        .then(function (response) {
            const $ = cheerio.load(response.data,{ decodeEntities:false})

            let warnWeather = $('html body').html()
           .split(";")   


            ctx.body = {
                      "msg": "操作成功",
                      "code": 200,
                      "data": {
                        'cityDZ':jsonToObj(warnWeather[0].replace(`var cityDZ${cityCode} =`,'')),
                        'alarmDZ':jsonToObj(warnWeather[1].replace(`var alarmDZ${cityCode} =`,'')),
                      }
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





//hour 

router.get('/weather/hour/:cityCode', ctx => {
    const cityCode = ctx.params.cityCode
    return axios.get(`http://www.weather.com.cn/weather1dn/${cityCode}.shtml`)
        .then(function (response) {
            const $ = cheerio.load(response.data,{ decodeEntities:false})

          let todayData = $('.todayRight script').html()
          .replace("var hour3data=","")
          .replace(/\n/g, "")
          .split(";")   

          todayData.pop()       

           //24小时
       
          console.log(jsonToObj(todayData[0]),todayData)


          //组装对象 

          let warperrObj

          ctx.body = {
                      "msg": "操作成功",
                      "code": 200,
                      "data": '',
                      'forecastList':getPerTimeList((jsonToObj(todayData[0]))[0]).drgeeData, //算法转换
                      "lifeAssistant":getLv(0,$)
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



//聚合  3个接口  拿到所有数据 

router.get('/weather/1d/:cityCode', (ctx) => {
   const cityCode = ctx.params.cityCode
   let now = wraperAxiosNow(cityCode)
   let warn = wraperAxiosWarn(cityCode)
   let hour = wraperAxiosHour(cityCode)
   let air = wraperAxiosAir(cityCode)


   return Promise.all([now, warn, hour,air]).then((results) => {
       // console.log("success")
       // console.log(results[0]);

        ctx.body = {
                      "msg": "操作成功",
                      "code": 200,
                      "data":{
                        ...results[0],
                        ...results[1],
                        ...results[2],
                        ...results[3]
                      }
                }

         

  }).catch(function(err){
        console.log(err);
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


