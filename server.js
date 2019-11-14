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
router.get('/weather/:cityCode', ctx => {
    const cityCode = ctx.params.cityCode
    return axios.get(sevenDayWeatherUrl(cityCode))
        .then(function (response) {
          const $ = cheerio.load(response.data,{ decodeEntities:false})

          let hasBody = $('body').html()
          if(hasBody == ''){
               ctx.body = {
                  "msg": "城市代码错误",
                  "code": 500
               }
               return
          }

          //温度
          let temperatures = temperatureScriptData($(".blueFor-container script").html())
         
          //24小时 
          let hour3data = $(".details-container script").html()
          .replace("var hour3data=","")
          .replace(/\n/g, "")
          .split(";")
          
          hour3data.pop()

          let data = [];
         //聚合7天数据 
          $('.date-container li').each(function(item,indx,arr){
                  let $this = $(this);
                  let index = $this.index();
                  let weatherContentDom = $(".blue-container .blue-item").eq(index)
                  let weatherLifeDom = $(".weather_shzs .lv").eq(index)
                  if(index > 0){
                      data.push({
                          date : trim($this.find(".date").text()),
                          dateInfo:trim($this.find(".date-info").text()),
                          day_weather:weatherContentDom.find(".item-icon").eq(0).attr("title"),
                          night_weather:weatherContentDom.find(".item-icon").eq(1).attr("title"),
                          weatherInfo:trim(weatherContentDom.find(".weather-info").text()),
                          day_wind:weatherContentDom.find(".wind-container").find(".wind-icon").eq(0).attr("title"),
                          night_wind:weatherContentDom.find(".wind-container").find(".wind-icon").eq(1).attr("title"),
                          windInfo:trim(weatherContentDom.find(".wind-info").text()),
                          forecastList:getPerTimeList((jsonToObj(hour3data[0]))[index-1]).drgeeData, //算法转换
                          sunup:getDegree(jsonToObj(temperatures[4]),index-1),
                          sunset:getDegree(jsonToObj(temperatures[5]),index-1),
                          max_degree:getDegree(jsonToObj(temperatures[0]),index),
                          min_degree:getDegree(jsonToObj(temperatures[1]),index),
                          lifeDate:getLife(index-1,$),
                          lifeAssistant:getLv(index-1,$)
                    });
                } 
          })
          
          ctx.body = {
                      "msg": "操作成功",
                      "code": 200,
                      "data": {
                          "list":data,//结果集合
                          "uptime":trimdot(hour3data[2].replace("var uptime=","")) + '| 数据来源 中央气象台'

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







app
    // .use(require('koa-body')())
    .use(router.allowedMethods())
    .use(router.routes());

app.listen(port,() => {
    console.log(`西门互联天气预报接口启动${port}`)
});


