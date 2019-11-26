const chalk = require('chalk')
const colors = require('colors')

function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

function trimdot(str) {
  return str.replace(/(^"*)|("$)/g, "");
}

function temperatureScriptData(str) {
  let result = [];
  let temperature = str && str.replace("var eventDay =", "")
    .replace("var eventNight =", "")
    .replace("var fifDay =", "")
    .replace("var fifNight =", "")
    .replace("var sunup =", "")
    .replace("var sunset =", "")
    .replace("var blue =", "")
    .replace(/\n/g, "")
    .split(";")

  temperature.pop()
  result.push(temperature)
  return result[0]
}

// //白天晴  n00晚上晴  icon不一样 
function weatherType(wather) {
  var weatherArr = {
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
    "32": "强浓雾",
    "49": "强浓雾",
    "53": "霾",
    "54": "中度霾",
    "55": "重度霾",
    "56": "严重霾",
    "57": "大雾",
    "58": "特强浓雾",
    "97": "雨",
    "98": "雪",
    "99": "N/A",
    "301": "雨",
    "302": "雪"
  };

  var strArr = wather.split("")
  strArr.shift()

  var newStr = strArr.join('')

  return weatherArr[newStr]

}

function getClothes(str) {
  //这里要区分其它指标 
  var clothes = ''
  switch (str) {
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


function getLife(indexs, context) {
  var $ = context
  var date = $('.shzsSevenDay ul li').eq(indexs).text()
  return date

}

function getLv(indexs, context) {
  var $ = context
  var shzs = $(".weather_shzs .lv").eq(indexs)
  var obj = {}
  obj["uv"] = []
  obj["gm"] = []
  obj["bl"] = []
  obj["cy"] = []
  obj["xc"] = []
  obj["ks"] = []
  let dlArr = []
  for (var i = 0; i < 6; i++) {
    if (i !== 3) {
      dlArr.push({
        "level": shzs.find("dl").eq(i).find("em").text(),
        "stars": shzs.find("dl").eq(i).find("p").find("i.active").length,
        "info": shzs.find("dl").eq(i).find("dd").text()
      })
    } else {
      dlArr.push({
        "level": getClothes(shzs.find("dl").eq(i).find("em").text()),
        "stars": shzs.find("dl").eq(i).find("p").find("i.active").length,
        "info": shzs.find("dl").eq(i).find("dd").text()
      })
    }
  }
  obj["uv"] = dlArr[0]
  obj["gm"] = dlArr[1]
  obj["bl"] = dlArr[2]
  obj["cy"] = dlArr[3]
  obj["xc"] = dlArr[4]
  obj["ks"] = dlArr[5]

  return obj
}




function flatten(arr, curr) {
  if (Array.isArray(curr)) {
    arr.push(...curr)
  } else {
    arr.push(curr)
  }
  return arr
}

function jsonToObj(t) {
  var e = "";
  return JSON.parse && (e = JSON.parse(t))
}

function getDegree(arr, index) {
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
    var r = t[n],
      s = {},
      l = r["jf"].slice(8, 10);
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


function getPerTimeList(s) {
  var n = s.length
  for (var g = sourceData(s), y = [], x = [], b = 0; n > b; b++)
    y.push(intervalData(b, g[b])),
    x.push(timeFormat(b, g[b]));
  return {
    timeData: x,
    drgeeData: y.reduce(flatten, [])
  }
}

function tableData(list) {
  let tableHead = ['日期', '最高温度', '最低温度', '天气详情', '白天天气', '夜晚天气', '风向级别', '白天风向', '夜晚风向', '今日日落', '明日日出']
  let tableData = []
  for (let i = 0; i < list.length; i++) {
    let temp = []
    temp.push(list[i].weatherDate, list[i].max_degree + '°C', list[i].min_degree + '°C', list[i].weatherInfo, list[i].day_weather, list[i].night_weather, list[i].windInfo, list[i].day_wind, list[i].night_wind, list[i].sunset, list[i].sunup)
    tableData.push(temp)
  }
  tableData.unshift(tableHead)
  // console.log(tableData)

  return tableData

}


function tableSimpleDataFifteen(list) {
  let tableHead = ['日期', '最高温度', '最低温度', '天气详情', '白天天气', '夜晚天气', '风向级别', '白天风向', '夜晚风向']
  let tableData = []
  for (let i = 0; i < list.length; i++) {
    let temp = []
    temp.push(list[i].weatherDate, list[i].max_degree + '°C', list[i].min_degree + '°C', list[i].weatherInfo, list[i].day_weather, list[i].night_weather, list[i].windInfo, list[i].day_wind, list[i].night_wind)
    tableData.push(temp)
  }
  tableData.unshift(tableHead)
  // console.log(tableData)

  return tableData

}


function tabelDataHourly(data, date) {
  let tableHead = ['逐小时预报', '天气', '温度', '风向', '风向级别']
  let tableData = []
  let list = []

  for (var j = 0; j < data.length; j++) {
    if (data[j]['lifeDate'] == date) {
      list.push(data[j]['forecastList'])
    }
  }

  if (list.length == 0) {
    console.log(chalk.red(' --date Invalid parameter value '));
    process.exit(0)
  }

  for (var i = 0; i < list[0].length; i++) {
    var temp = []
    temp.push(list[0][i].time + '时', list[0][i].wather, list[0][i].degree + '°C', list[0][i].windDY, list[0][i].windJB)
    tableData.push(temp)
  }

  let tableHeadIsHour = list[0].length > 8 ? '逐小时预报' : '逐3小时预报'
  tableHead[0] = tableHeadIsHour
  tableData.unshift(tableHead)


  // console.log(tableData)
  return tableData


}


//today hourly
function tabelDataHourlyToday(data) {
  let tableHead = ['逐小时预报', '天气', '温度', '风向', '风向级别']
  let tableData = []
  let list = []

  for (var j = 0; j < data.length; j++) {
    list.push(data[j])
  }

  if (list.length == 0) {
    console.log(chalk.red(' --date Invalid parameter value '));
    process.exit(0)
  }

  for (var i = 0; i < list.length; i++) {
    var temp = []
    temp.push(list[i].time + '时', list[i].wather, list[i].degree + '°C', list[i].windDY, list[i].windJB)
    tableData.push(temp)
  }

  let tableHeadIsHour = list.length > 8 ? '逐小时预报' : '逐3小时预报'
  tableHead[0] = tableHeadIsHour
  tableData.unshift(tableHead)


  // console.log(tableData)
  return tableData


}

function toDayWeatherUrl(cityCode) {
  let time = new Date().getTime()
  return `http://d1.weather.com.cn/sk_2d/${cityCode}.html?_=${time}`
}


function sevenDayWeatherUrl(cityCode) {
  return `http://www.weather.com.cn/weathern/${cityCode}.shtml`
}



function fifteenDayWeatherUrl(cityCode) {
  let time = new Date().getTime()
  return `http://www.weather.com.cn/weather15dn/${cityCode}.shtml`
}


function fortyDayWeatherUrl(cityCode,year,month) {
  let time = new Date().getTime()
  return `http://d1.weather.com.cn/calendarFromMon/${year}/${cityCode}_${year}${month}.html?_=${time}`
}


function randomUserAgent() {
  const userAgentList = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
    'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) Mobile/14F89;GameHelper',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.4',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:46.0) Gecko/20100101 Firefox/46.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:46.0) Gecko/20100101 Firefox/46.0',
    'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)',
    'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)',
    'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)',
    'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Win64; x64; Trident/6.0)',
    'Mozilla/5.0 (Windows NT 6.3; Win64, x64; Trident/7.0; rv:11.0) like Gecko',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',
    'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Mobile Safari/537.36',
    'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586',
    'Mozilla/5.0 (iPad; CPU OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1'
  ]
  const num = Math.floor(Math.random() * userAgentList.length)
  return userAgentList[num]

}

const getLocalTime = () => {
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
}


//空气质量状况的指数 aqiInfo -优  ====  aqi: "34"
function aqi(t) {
  if (t) {
    //var levelNum = dataAQI.t1 <= 50 && "0" || dataAQI.t1 <= 100 && 1 || dataAQI.t1 <= 150 && 2 || dataAQI.t1 <= 200 && 3 || dataAQI.t1 <= 300 && 4 || dataAQI.t1 > 300 && 5 || 0
    var a = 50 >= t && "优" || 100 >= t && "良" || 150 >= t && "轻度污染" || 200 >= t && "中度污染" || 300 >= t && "重度污染" || t > 300 && "严重污染" || ""
    return a
  }
}


//空气指数算法
function setAirData(observe24h_data) {

  for (var obsData = observe24h_data.data, i = obsData.length - 1; i >= 0; i--)
    if (obsData[i] && obsData[i].t1) {
      dataAQI = obsData[i];
      break
    }
  if (!dataAQI)
    return

  return {
    "pm10": dataAQI.t4,
    "pm25": dataAQI.t3,
    "co": dataAQI.t5,
    "no2": dataAQI.t6,
    "so2": dataAQI.t9
  }
}


//未来15天日期算法 传入未来的天数 

function getFutureWeatherDate(n) {
  var n = n;
  var d = new Date();
  var year = d.getFullYear();
  var mon = d.getMonth() + 1;
  var day = d.getDate();
  if (day > n) {
    if (mon > 1) {
      mon = mon + 1;
    } else {
      year = year + 1;
      mon = 12;
    }
  }
  d.setDate(d.getDate() + n);
  year = d.getFullYear();
  mon = d.getMonth() + 1;
  day = d.getDate();
  s = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
  return s;
}

function getMonthDays(year, month) {
  return new Date(year, month, 0).getDate();
}

function getWeekday(year, month, day) {
  return new Date(year, month - 1, day).getDay();
}

function weekDayInfo(str) {
  let res = str.split("-")
  let index = getWeekday(res[0], res[1], res[2])
  let weekDayInfo = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return weekDayInfo[index]
}


//40天日期每月统计
function uniqueDate(arr) {
  let uniqueDateArray = arr.reduce(function (acc, name) {
    let arr = String(name).split('-');
    let temp = arr[0] + '-' + arr[1]
    if (temp in acc) {
      acc[temp]++;
    } else {
      acc[temp] = 1;
    }
    return acc;
  }, {});
  return uniqueDateArray
}
//爬取链接 
function axioFortyDayWeatherUrl(cityCode,obj) {
  let res = []
  let resassemble = []
  let axiosUrl = []
  for (let [key, value] of Object.entries(obj)) {
    let temp = new Array(3);
        temp[0] = key.split('-')[0];
        temp[1] = key.split('-')[1];
        temp[2] = value;
        res.push(temp)

  }
  for(let i=0,len=res.length;i<len;i++){
    resassemble.push({
      "year": res[i][0],
      "month": res[i][1],
      "day": res[i][2], 
    })
    axiosUrl.push(fortyDayWeatherUrl(cityCode,res[i][0],res[i][1]))
  }
  return {
    resassemble:resassemble,
    axiosUrl:axiosUrl
  } 
}


function regionFortyWeatherData(){
 //table data 
 
}



module.exports = {
  trim: trim,
  trimdot: trimdot,
  temperatureScriptData: temperatureScriptData,
  getClothes: getClothes,
  getLife: getLife,
  getLv: getLv,
  flatten: flatten,
  jsonToObj: jsonToObj,
  getDegree: getDegree,
  intervalData: intervalData,
  timeFormat: timeFormat,
  sourceData: sourceData,
  getPerTimeList: getPerTimeList,
  tableData: tableData,
  weatherType: weatherType,
  tabelDataHourly: tabelDataHourly,
  toDayWeatherUrl,
  sevenDayWeatherUrl,
  fifteenDayWeatherUrl,
  fortyDayWeatherUrl,
  randomUserAgent,
  aqi,
  setAirData,
  tabelDataHourlyToday,
  getLocalTime,
  getFutureWeatherDate,
  getWeekday,
  weekDayInfo,
  tableSimpleDataFifteen,
  uniqueDate,
  axioFortyDayWeatherUrl
};