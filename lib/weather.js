const axios = require('axios')
const cheerio = require('cheerio')
const chalk = require('chalk')
const Table = require('cli-table3')
const argv = require('yargs').argv
const ora = require('ora')
const colors = require('colors')

const city = require('../city/index.js')
const utils = require('../config/utils.js')
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
const tableData = utils.tableData
const tabelDataHourly = utils.tabelDataHourly
const sevenDayWeatherUrl = utils.sevenDayWeatherUrl

 
const toDayWeatherUrl = utils.toDayWeatherUrl
const randomUserAgent = utils.randomUserAgent

const setAirData = utils.setAirData
const aqi = utils.aqi
const tabelDataHourlyToday = utils.tabelDataHourlyToday


let cityCode = typeof (argv.c)  == 'number' ? argv.c : city[argv.c]; 
let outFormatJson = argv.json || argv.j 
let outFormatTable = argv.table || argv.t 
let weatherHourly = argv.hourly
let weatherDate = argv.date 




console.log(weatherHourly,weatherDate)



if(!cityCode || cityCode == ''){
    process.stdout.write(chalk.red(' City code  or city name must be necessary'));
    process.exit(0)
}

if(outFormatJson && outFormatTable){
    process.stdout.write(chalk.red('stdout can use only one way  -t or -j '));
    process.exit(0)
}

if(outFormatJson == undefined && outFormatTable == undefined){
    outFormatTable = true

    if(!weatherHourly && !weatherDate){
      process.stdout.write(chalk.red(' --hourly --date must be necessary together'));
      process.exit(0)
}
}


const stdoutMessage = function(data){
    return process.stdout.write(chalk.green(JSON.stringify(data,null,2)))
}

const stdoutTable = function(string){
     process.stdout.write(string)
}



function tableDraw(data){
   let table = new Table({
    chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
           , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
           , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
           , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }            
  });
  for(var i=0;i<tableData(data).length;i++){
      table.push(tableData(data)[i])
  }       
  return stdoutTable(chalk.green(table.toString())); 

}

function tableDrawHourly(data,date){
  let table = new Table({
    chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
           , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
           , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
           , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }            
  });

  for(var i=0;i<tabelDataHourly(data,date).length;i++){
      table.push(tabelDataHourly(data,date)[i])
  }  

  return stdoutTable(chalk.green(table.toString()));  

}





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
                    // console.log(jsonToObj(todayData[0]),todayData)
                    let forecastList = getPerTimeList((jsonToObj(todayData[0]))[0]).drgeeData
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



function wrapperKey(obj,key,keyInfo,type){

  let reslut 
  if(type == '°C'){
     reslut = [keyInfo,obj[key]+type]
  }else if(type == 'aqi'){
     reslut = [keyInfo,obj[key]+'/'+aqi(obj[key])]
  }else if(type == 'mg' || type == 'μg'){
     reslut = [keyInfo,obj[key] + type +'/m3']
  }else{
     reslut = [keyInfo,obj[key]] 
  }
  return reslut 
}


function wrapperKeyLife(obj,key,keyInfo){
  let reslut = [keyInfo,obj[key]['level']] 
  return reslut 
}

function wrapperTodayWeather(obj){
     let result = []
      result.push(
        wrapperKey(obj,'time','更新时间'),
        wrapperKey(obj,'temp','平均温度','°C'),
        wrapperKey(obj,'max_degree','最高温度','°C'),
        wrapperKey(obj,'min_degree','最低温蒂','°C'),
        wrapperKey(obj,'aqi','空气质量','aqi'),
        wrapperKey(obj,'pm10','可吸入颗粒物(PM10)','μg'),
        wrapperKey(obj,'pm25','细颗粒物(PM2.5)','μg'),
        wrapperKey(obj,'co','一氧化碳(CO)','mg'),
        wrapperKey(obj,'no2','二氧化氮(NO2) ','μg'),
        wrapperKey(obj,'so2','二氧化硫(SO2)','μg'),
        wrapperKey(obj,'sd','空气相对湿度'),
        wrapperKey(obj,'limitnumber','车辆限行'),
        wrapperKey(obj,'sunset','明日日落'),
        wrapperKey(obj,'sunup','明日日出'),
        wrapperKeyLife(obj.lifeAssistant,'uv','紫外线'),
        wrapperKeyLife(obj.lifeAssistant,'gm','减肥'),
        wrapperKeyLife(obj.lifeAssistant,'bl','血糖'),
        wrapperKeyLife(obj.lifeAssistant,'cy','穿衣指南'),
        wrapperKeyLife(obj.lifeAssistant,'xc','洗车'),
        wrapperKeyLife(obj.lifeAssistant,'ks','空气污染扩散'),
    
      )  
     return result
}

function tableDrawToday(obj){
   let table = new Table({
        head: ['属性', '数值']
    });

  for(var i=0;i<wrapperTodayWeather(obj).length;i++){
      table.push(wrapperTodayWeather(obj)[i])
  }  
  console.log(chalk.green(table.toString()));
}

function tableDrawTodayHourly(data){
  let table = new Table({
    chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
           , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
           , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
           , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }            
  });

  for(var i=0;i<tabelDataHourlyToday(data).length;i++){
      table.push(tabelDataHourlyToday(data)[i])
  }  

  return stdoutTable(chalk.green(table.toString()));  

}

const Weather = {

    init: function(){
       // this.sevenData()
       this.todayData()
    },

    todayData: function(){

       let now = wraperAxiosNow(cityCode)
       let warn = wraperAxiosWarn(cityCode)
       let hour = wraperAxiosHour(cityCode)
       let air = wraperAxiosAir(cityCode)

       return Promise.all([now, warn, hour,air]).then((results) => {
             let succes = {
                    "msg": "操作成功",
                    "code": 200,
                    "data":{
                      ...results[0],
                      ...results[1],
                      ...results[2],
                      ...results[3]
                    }
              }

              //console.log(wrapperTodayWeather(succes.data))

                     tableDrawToday(succes.data)
                     console.log('\n')
                     console.log(chalk.cyan('逐小时天气预报'))
                      console.log('\n')
                     tableDrawTodayHourly(succes.data.forecastList)

              //stdoutMessage(succes) 

      }).catch(function(err){
            console.log(err);
             let hasError = {
                  "msg": "服务器内部错误",
                  "code": 500
            }
             stdoutMessage(hasError) 
      });

    },
    sevenData : function() {  
        return axios.get(sevenDayWeatherUrl(cityCode))
            .then(function (response) {
              const $ = cheerio.load(response.data,{ decodeEntities:false})
              let hasBody = $('body').html()
              if(hasBody == ''){
                   var noBody = {
                      "msg": "城市代码错误",
                      "code": 500
                   }
                    stdoutMessage(noBody)
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


             if(outFormatTable){

                  if(weatherHourly && weatherDate){
                    
                     tableDraw(data)
                     console.log('\r\n')
                     console.log(chalk.red('时间点天气预报'))
                     console.log('\r')
                    tableDrawHourly(data,weatherDate)
                  }else{
                    tableDraw(data)
                  }

              }

              if(outFormatJson){

                       let succes = {
                          "msg": "操作成功",
                          "code": 200,
                          "data": {
                              "list":data,//结果集合
                              "uptime":trimdot(hour3data[2].replace("var uptime=","")) + '| 数据来源 中央气象台'

                           }
                       }
                    stdoutMessage(succes) 
              }


        })
        .catch(function(error){
                   if(error && outFormatTable){
                        console.log(chalk.red(error && error.message ||  '请检查网络是否通畅，稍后重试'));
                   }
           
                   if(error && outFormatJson){
                           let hasError = {
                              "msg":  error && error.message || "服务器内部错误" ,
                              "code": error && error.code || 500
                           }
                           stdoutMessage(hasError)
                   }
                
        })

    },
    fifteenData:function(){

    },
    fortyData:function(){

    }
}

module.exports = Weather;