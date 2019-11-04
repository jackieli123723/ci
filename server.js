const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()
router.prefix('/v1/koa');
const port = process.env.PORT || 4003 
const axios = require('axios')
const cheerio = require('cheerio')


const utils = require('./config/utils');
const trim = utils.trim;
const trimdot = utils.trimdot;
const temperatureScriptData = utils.temperatureScriptData;
const getClothes = utils.getClothes
const getLife = utils.getLife
const getLv = utils.getLv




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


const cityCode = '101010100'

router.get('/city/:cityCode', ctx => {

    console.log('当前城市代码',ctx.params.cityCode)
    return axios.get('http://www.weather.com.cn/weathern/'+cityCode+'.shtml')
        .then(function (response) {
          const $ = cheerio.load(response.data,{ decodeEntities:false})

          let data = [];
          let weatherInfo = [];
          let temperatureData = [];
          let dayHour = [];
          let dayHourList = [];
          let updateTime = ''
          let lifeAdvices = []
          let lifeList = []
          var lifeAdviceDateList = [];

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
                          weatherStart:weatherContentDom.find(".item-icon").eq(0).attr("title"),
                          weatherEnd:weatherContentDom.find(".item-icon").eq(1).attr("title"),
                          weatherInfo:trim(weatherContentDom.find(".weather-info").text()),
                          windStart:weatherContentDom.find(".wind-container").find(".wind-icon").eq(0).attr("title"),
                          windEnd:weatherContentDom.find(".wind-container").find(".wind-icon").eq(1).attr("title"),
                          windInfo:trim(weatherContentDom.find(".wind-info").text()),
                          temperatureTimeList:[], //算法转换
                          sunup:"",
                          sunset:"",
                          lifeDate:getLife(index-1,$),
                          lifeAssistant:getLv(index-1,$)
                    });
                } 
          })

    
          
  
          //温度
          let temperatures = temperatureScriptData($(".blueFor-container script").html())
         

          //.details-container script 所有的绘制每隔1小时 3小时的数据
           
          let hour3data = $(".details-container script").html()
          .replace("var hour3data=","")
          .replace(/\n/g, "")
          .split(";")
          
          hour3data.pop()

          hour3data[1].replace("var hour3week=","")
          
       
         // console.log(JSON.stringify(hour3data,null,3),trimdot(hour3data[2].replace("var uptime=","")));

          //content-container scroll-container ul li 每天的24小时天气预报 每个点打点 

          $(".details-houers-container").eq(0).find("li").each(function(item,indx,arr){
                let $this = $(this);
                 dayHourList.push({
                      time:$this.text()
                 });
                
          }) 

          //hour3data 这个数据在变的 没刷新都不一样

          $(".weather_7d .houers-container").eq(0).find("li").each(function(item,indx,arr){
                     let $this = $(this);
                     dayHour.push({
                          time:$this.text()
                     });
                
          })


          // console.log($(".details-container script").html()) 

         // console.log($(".details-container script").html(),"\n\n")
          // console.log(data)
          // console.log(weatherInfo)
          // console.log(temperatureData)
          //  console.log(JSON.stringify(temperatureData,null,4),temperatureData.length);

          // <div id="drawO"/>
          // <div id= "drawT"/>
          //没有svg dom节点 

          //注意js 注入 抓不到 
            //      $(".details-houers-container").empty().html(y.join("")),
            // $(".houers-container").empty().html(x.join(""))

          // console.log(data,dayHourList,dayHour,$(".houers-container").html())

          var x = [
   "<li class=\"houer-item active\">08时</li>",
   "<li class=\"houer-item\">11时</li>",
   "<li class=\"houer-item\">14时</li>",
   "<li class=\"houer-item\">17时</li>",
   "<li class=\"houer-item\">20时</li>",
   "<li class=\"houer-item\">23时</li>",
   "<li class=\"houer-item\">02时</li>",
   "<li class=\"houer-item\">05时</li>"
]

var y = [
   "<li class=\"details-item \"><i class=\"item-icon housr_icons d01\"></i><div class=\"curor\"></div><p class=\"wind-info\">无持续风向</p><p class=\"wind-js\"><3级</p> </li>",
   "<li class=\"details-item item-one\"><i class=\"item-icon housr_icons d01\"></i><div class=\"curor\"></div><p class=\"wind-info\">东风</p><p class=\"wind-js\"><3级</p> </li>",
   "<li class=\"details-item \"><i class=\"item-icon housr_icons d01\"></i><div class=\"curor\"></div><p class=\"wind-info\">无持续风向</p><p class=\"wind-js\"><3级</p> </li>",
   "<li class=\"details-item item-one\"><i class=\"item-icon housr_icons d01\"></i><div class=\"curor\"></div><p class=\"wind-info\">东北风</p><p class=\"wind-js\"><3级</p> </li>",
   "<li class=\"details-item \"><i class=\"item-icon housr_icons n01\"></i><div class=\"curor\"></div><p class=\"wind-info\">无持续风向</p><p class=\"wind-js\"><3级</p> </li>",
   "<li class=\"details-item item-one\"><i class=\"item-icon housr_icons n01\"></i><div class=\"curor\"></div><p class=\"wind-info\">东北风</p><p class=\"wind-js\"><3级</p> </li>",
   "<li class=\"details-item \"><i class=\"item-icon housr_icons n01\"></i><div class=\"curor\"></div><p class=\"wind-info\">无持续风向</p><p class=\"wind-js\"><3级</p> </li>",
   "<li class=\"details-item item-one\"><i class=\"item-icon housr_icons n07\"></i><div class=\"curor\"></div><p class=\"wind-info\">东北风</p><p class=\"wind-js\"><3级</p> </li>"
]


       
          // x.forEach(function(item,indx,arr){
             
          //       console.log(item)
                
          // })

       

              ctx.body = {
                      "msg": "操作成功",
                      "code": 200,
                      "data": {
                          "list":data,//结果集合
                          // "weatherInfo":weatherInfo,
                          "temperatureData":temperatures,
                          "dayHour":dayHour,
                          "dayHourList":dayHourList,
                          "hour3data":"hour3data", //绘制每小时天气预报的折线图数据 
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
    console.log(`天气预报接口启动${port}`)
});


