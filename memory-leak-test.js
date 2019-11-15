// const axios = require('axios')
// const r1 = axios.get('http://localhost:4003/v1/api/weather/all/101290101111')
// const r2 = axios.get('http://localhost:4003/v1/api/weather/all/101290101111')


// function test(){

// 	      return Promise.all([r1,r2]).then((results) => {
//              let succes = {
//                     "msg": "操作成功",
//                     "code": 200,
//                     "data":{
//                       ...results[0],
//                       ...results[1]
//                     }
//               }

//       })
// }
 
// test()
const axios = require('axios')
const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()
const port = process.env.PORT || 4004

const r1 = axios.get('http://localhost:4003/v1/api/weather/all/101290101111')
const r2 = axios.get('http://localhost:4003/v1/api/weather/all/101290101111')



// 加上这个两段异常捕获 cpu 稳定在 最高82%
process.on('unhandledRejection', (reason, p) => {
    console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

process.on("uncaughtException", function(e) {
  console.log(e);
});


router.prefix('/v1/api');

router.get('/weather/all/:cityCode', (ctx) => {
   	      return Promise.all([r1,r2]).then((results) => {
            ctx.body = {
                    "msg": "操作成功",
                    "code": 200,
                    "data":{
                      ...results[0],
                      ...results[1]
                    }
              }

      })


   	  //     .catch(function (error) {
		    //      console.log(error);
		    //      ctx.body = {
		    //           "msg": "服务器内部错误",
		    //           "code": 500
		    //     }
		    // }); 


});



// 错误捕获 开启放到这里 cpu 85降到 35 
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = err.message
    ctx.app.emit('error', err, ctx)
  }
})



app
    // .use(require('koa-body')())
    .use(router.allowedMethods())
    .use(router.routes());

app.listen(port,() => {
    console.log(`西门互联天气预报接口启动${port}`)
});

