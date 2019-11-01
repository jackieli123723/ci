const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()
router.prefix('/v1/koa');
const port = process.env.PORT || 4003 
const axios = require('axios')
const cheerio = require('cheerio')
function trim(str){
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

function trimdot(str){
    return str.replace(/(^"*)|("$)/g, "");
}

        
function temperatureScriptData(str){
    let result = [];
    let temperature =  str.replace("var eventDay =","")
          .replace("var eventNight =","")
          .replace("var fifDay =","")
          .replace("var fifNight =","")
          .replace("var sunup =","")
          .replace("var sunset =","")
          .replace("var blue =","")
          .replace(/\n/g, "")
          .split(";")
          
          temperature.pop()
          result.push(temperature)
          return result[0]
   
}        
 
        

// error handling
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

           

          function getLifeListUv(index){
               var res = {}
               res.level = $(".weather_shzs .lv").eq(index).find("em").eq(index).text()
               res.stars = $(".weather_shzs .lv").eq(index).find("p").eq(index).find("i.active").length
               res.info = $(".weather_shzs .lv").eq(index).find("dd").eq(index).text()
              return res 
          } 

           function getDl(index){
               var res = {}
               res.level = $(".weather_shzs .lv").eq(index).find("em").eq(index).text()
               res.stars = $(".weather_shzs .lv").eq(index).find("p").eq(index).find("i.active").length
               res.info = $(".weather_shzs .lv").eq(index).find("dd").eq(index).text()
              return res 
          } 

          $(".weather_shzs .lv").each(function(item,index,arr){
                var $this = $(this)
                var obj = {}

                var dlArr = []

                for(var i=0;i<6;i++){
                    var temp = []
                    temp.push({
                        "level":$this.find("dl").eq(i).find("em").text(),
                        "stars":$this.find("dl").eq(i).find("p").find("i.active").length,
                        "info":$this.find("dl").eq(i).find("dd").text()
                    })
                    dlArr.push(temp)
                }      
                console.log('dlArr',dlArr) 
          })




          $(".weather_shzs .shzsSevenDay ul li").each(function(item,indx,arr){
               let $this = $(this);
               let index = $this.index();
               let domText = $(".lv").eq(index)
              
               lifeAdvices.push({
                  "time":$this.text(),
                  "uv":getLifeListUv(index),//紫外线
                  "gm":"",//减肥
                  "bl":"",//健臻·血糖
                  "cy":"",//穿衣    
                  "xc":"",//洗车
                  "ks":""//空气污染扩散


               }) 
          })



        

          

          $('.date-container li').each(function(item,indx,arr){
                  let $this = $(this);
                  let index = $this.index();
                if(index > 0){
                      data.push({
                      date : trim($this.find(".date").text()),
                      dateInfo:trim($this.find(".date-info").text())
                    });
                } 
          })

          $(".blue-container .blue-item").each(function(item,indx,arr){
                let $this = $(this);
                  let index = $this.index();
                if(index > 0){
                      weatherInfo.push({
                      weatherStart:$this.find(".item-icon").eq(0).attr("title"),
                      weatherEnd:$this.find(".item-icon").eq(1).attr("title"),
                      weatherInfo:trim($this.find(".weather-info").text()),
                      windStart:$this.find(".wind-container").find(".wind-icon").eq(0).attr("title"),
                      windEnd:$this.find(".wind-container").find(".wind-icon").eq(1).attr("title"),
                      windInfo:trim($this.find(".wind-info").text())
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

          //hour3data 这个数据在变的 

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
                          "date":data,//结果集合
                          "weatherInfo":weatherInfo,
                          "temperatureData":temperatures,
                          "dayHour":dayHour,
                          "dayHourList":dayHourList,
                          "hour3data":"hour3data", //绘制每小时天气预报的折线图数据 
                          "lifeAdvices":lifeAdvices,
                          "lifeList":lifeList,
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


