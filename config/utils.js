const chalk = require('chalk')
function trim(str){
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

function trimdot(str){
    return str.replace(/(^"*)|("$)/g, "");
}

function temperatureScriptData(str){
    let result = [];
    let temperature = str && str.replace("var eventDay =","")
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

 // //白天晴  n00晚上晴  icon不一样 
function weatherType(wather){
  var weatherArr={
    0: "晴",
    1: "多云",
    2: "阴",
    3: "阵雨",
    4: "雷阵雨",
    5: "雷阵雨伴有冰雹",
    6: "雨夹雪",
    7: "小雨",
    8: "中雨",
    9: "大雨",
    "00": "晴", 
    "01": "多云", 
    "02": "阴", 
    "03": "阵雨", 
    "04": "雷阵雨", 
    "05": "雷阵雨伴有冰雹", 
    "06": "雨夹雪", 
    "07": "小雨", 
    "08": "中雨", 
    "09": "大雨",
    "10": "暴雨", 
    "11": "大暴雨", 
    "12": "特大暴雨", 
    "13": "阵雪", 
    "14": "小雪", 
    "15": "中雪", 
    "16": "大雪", 
    "17": "暴雪", 
    "18": "雾", 
    "19": "冻雨", 
    "20": "沙尘暴", 
    "21": "小到中雨", 
    "22": "中到大雨", 
    "23": "大到暴雨", 
    "24": "暴雨到大暴雨", 
    "25": "大暴雨到特大暴雨", 
    "26": "小到中雪", 
    "27": "中到大雪", 
    "28": "大到暴雪", 
    "29": "浮尘", 
    "30": "扬沙", 
    "31": "强沙尘暴", 
    "32":"强浓雾",
    "49":"强浓雾",
    "53": "霾", 
    "54": "中度霾", 
    "55": "重度霾", 
    "56": "严重霾", 
    "57": "大雾", 
    "58": "特强浓雾", 
    "97":"雨",
    "98":"雪",
    "99": "N/A",
    "301":"雨",
    "302":"雪"
}; 

var strArr = wather.split("")
strArr.shift()

var newStr = strArr.join('')

return weatherArr[newStr]

} 
function getClothes(str){
    //这里要区分其它指标 
    var clothes = ''
    switch(str){
      case "炎热":
      case '热':
        clothes = '短袖'
        break;  
      case "舒适":
        clothes = '衬衫'
        break;  
      case "较舒适":
       clothes = '薄外套'
       break;  
      case "较冷":
        clothes = '厚毛衣'
        break;  
      default:
        clothes = "羽绒服";
        break;
    } 
    return clothes
} 


function getLife(indexs,context){
    var $ = context
    var date = $('.shzsSevenDay ul li').eq(indexs).text()
    return date

}
function getLv(indexs,context){
    var $ = context
    var shzs =  $(".weather_shzs .lv").eq(indexs)
    var obj = {}
        obj["uv"] = []
        obj["gm"] = []
        obj["bl"] = []
        obj["cy"] = []
        obj["xc"] = []
        obj["ks"] = []
        let dlArr = []
        for(var i=0;i<6;i++){
           if(i !== 3){
               dlArr.push({
                "level":shzs.find("dl").eq(i).find("em").text(),
                "stars":shzs.find("dl").eq(i).find("p").find("i.active").length,
                "info":shzs.find("dl").eq(i).find("dd").text()
               })
           }else{
                dlArr.push({
                "level":getClothes(shzs.find("dl").eq(i).find("em").text()),
                "stars":shzs.find("dl").eq(i).find("p").find("i.active").length,
                "info":shzs.find("dl").eq(i).find("dd").text()
               })
           }
        }   
        obj["uv"] = dlArr[0]
        obj["gm"] = dlArr[1]
        obj["bl"] = dlArr[2]
        obj["cy"] =dlArr[3]
        obj["xc"] = dlArr[4]
        obj["ks"] = dlArr[5]
       
        return obj
}



function flatten (arr, curr) {
  if (Array.isArray(curr)) {
    arr.push(...curr)
  } else {
    arr.push(curr)
  }
  return arr
}

function jsonToObj(t){
     var e = "";
    return JSON.parse && (e = JSON.parse(t))
}

function getDegree(arr,index){
    return arr[index]
}


 function intervalData(t, a) {
        var e = [];
        var temp = {};
            temp['itemOne'] = a['itemOne']
            temp['wather'] = weatherType(a['wather'])
            temp['windDY'] = a['windDY']
            temp['windJB'] = a['windJB']
            temp['degree'] = a['degree'] //每个时段的温度绘制曲线
            temp['time'] = a['time']

        e.push(temp)
        return e
    }
    function timeFormat(t, a) {
        return a.time + "时"
    }
   function sourceData(t) {
        for (var a = [], e = ["无持续风向", "东北风", "东风", "东南风", "南风", "西南风", "西风", "西北风", "北风", "旋转风"], i = ["<3级", "3-4级", "4-5级", "5-6级", "6-7级", "7-8级", "8-9级", "9-10级", "10-11级", "11-12级"], n = 0; n < t.length; n++) {
            var r = t[n]
              , s = {}
              , l = r["jf"].slice(8, 10);
            s["time"] = l,
            s["degree"] = r.jb,
            s["wather"] = l > 5 && 20 > l ? "d" + r.ja : "n" + r.ja,
            s["windDY"] = e[r.jd],
            s["windJB"] = i[r.jc],
            s["itemOne"] = n % 2 ? "item-one" : "",
            a.push(s)
        }
        // console.log(a)
        return a
    }


    function getPerTimeList(s){
        var n = s.length
        for (var g = sourceData(s), y = [], x = [], b = 0; n > b; b++)
                y.push(intervalData(b, g[b])),
                x.push(timeFormat(b, g[b]));
                return {
                    timeData:x,
                    drgeeData:y.reduce(flatten, [])
                }
    }

  function tableData(list){
       let tableHead = ['日期', '最高温度', '最低温度','天气详情','白天天气','夜晚天气','风向级别','白天风向','夜晚风向','今日日落','明日日出']
       let tableData = []
       for(var i=0;i<list.length;i++){
            var temp = []
            temp.push(list[i].lifeDate,list[i].max_degree+'°C',list[i].min_degree+'°C',list[i].weatherInfo,list[i].day_weather,list[i].night_weather,list[i].windInfo,list[i].day_wind,list[i].night_wind,list[i].sunset,list[i].sunup)
            tableData.push(temp)
       }
      tableData.unshift(tableHead)
    // console.log(tableData)
     
     return tableData
   
    }


  function tabelDataHourly(data,date){
       let tableHead = ['逐小时预报','天气','温度','风向','风向级别']
       let tableData = []
       let list = []

       for(var j=0;j<data.length;j++){
           if(data[j]['lifeDate'] == date){
             list.push(data[j]['forecastList'])
           }
       }
       
       if(list.length == 0){
           console.log(chalk.red(' --date Invalid parameter value '));
           process.exit(0)
       }

       for(var i=0;i<list[0].length;i++){
            var temp = []
            temp.push(list[0][i].time+'时',list[0][i].wather,list[0][i].degree+'°C',list[0][i].windDY,list[0][i].windJB)
            tableData.push(temp)
       }
 
      let tableHeadIsHour = list[0].length > 8 ? '逐小时预报' : '逐3小时预报'
      tableHead[0] = tableHeadIsHour
      tableData.unshift(tableHead)

   
      // console.log(tableData)
       return tableData

   
  }  



   
module.exports = {
    trim: trim,
    trimdot: trimdot,
    temperatureScriptData:temperatureScriptData,
    getClothes:getClothes,
    getLife:getLife,
    getLv:getLv,
    flatten:flatten,
    jsonToObj:jsonToObj,
    getDegree:getDegree,
    intervalData:intervalData,
    timeFormat:timeFormat,
    sourceData:sourceData,
    getPerTimeList:getPerTimeList,
    tableData:tableData,
    weatherType:weatherType,
    tabelDataHourly:tabelDataHourly
};
