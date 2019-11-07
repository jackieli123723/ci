const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()
const port = process.env.PORT || 4003 
const axios = require('axios')
const cheerio = require('cheerio')
const city = require('./city/index.js')
axios.defaults.headers.post['Content-Type'] = 'text/html';

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
    return axios.get('http://www.weather.com.cn/data/sk/'+cityCode+'.shtml')
        .then(function (response) {
          const $ = cheerio.load(response)

          console.log($)

          // let hasBody = $('body').html()
          // if(hasBody == ''){
          //      ctx.body = {
          //         "msg": "城市代码错误",
          //         "code": 500
          //      }
          //      return
          // }

       
          ctx.body = {
                      "msg": "操作成功",
                      "code": 200,
                      "data": {
                          "list":[]//结果集合
                         

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


