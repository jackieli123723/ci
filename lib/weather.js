const axios = require('axios')
const cheerio = require('cheerio')
const chalk = require('chalk')
const Table = require('cli-table3')
const argv = require('yargs').argv

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
    return process.stdout.write(string)
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



const Weather = {

    init: function(){
       this.sevenData()
    },
    todayData: function(){

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