const axios = require('axios')
const cheerio = require('cheerio')
const chalk = require('chalk')
const Table = require('cli-table3')
const argv = require('yargs').argv
const ora = require('ora')
const colors = require('colors')
const fs = require('fs')
const path = require('path')
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
const getLocalTime = utils.getLocalTime
const fifteenDayWeatherUrl = utils.fifteenDayWeatherUrl
const getFutureWeatherDate = utils.getFutureWeatherDate
const weekDayInfo = utils.weekDayInfo
const tableSimpleDataFifteen = utils.tableSimpleDataFifteen





let cityCode = typeof (argv.c) == 'number' ? argv.c : city[argv.c];
let outFormatJson = argv.json || argv.j
let outFormatTable = argv.table || argv.t
let day = argv.day || argv.d
let weatherHourly = argv.hourly
let weatherDate = argv.date
let weatherDouwnload = argv.download // table-txt  json-json 

let weatherDataFile = argv.outfile || './'


let dirs = path.join(process.cwd(), "logs")
if (!fs.existsSync(dirs)) {
  fs.mkdirSync(dirs)
}




let fileName = new Date().getTime()
let dir = dirs + '/' + fileName + '.txt'
console.log(`当前工作目录是: ${process.cwd()}`);
console.log(`天气数据下载文件路径: ${dir}`);


//这个是判断文件目录的不存在 就创建文件目录 
// let exportFilePath = (path.resolve(__dirname,  argv.outfile) || path.resolve(__dirname, './outfile/'))
// if (!fs.existsSync(exportFilePath)) {
//     fs.mkdirSync(exportFilePath);
// }



// console.log(weatherHourly,weatherDate,weatherDouwnload)

console.log('day', day)


if (!cityCode || cityCode == '') {
  process.stdout.write(chalk.red(' City code  or city name must be necessary or cityname or citycode is invalid'));
  process.exit(0)
}

if (outFormatJson && outFormatTable) {
  process.stdout.write(chalk.red('stdout can use only one way  -t or -j '));
  process.exit(0)
}

if (outFormatJson == undefined && outFormatTable == undefined) {
  outFormatTable = true

  if (!weatherHourly && !weatherDate) {
    process.stdout.write(chalk.red(' --hourly --date must be necessary together'));
    process.exit(0)
  }
}




const stdoutMessage = function (data) {
  return process.stdout.write(chalk.green(JSON.stringify(data, null, 2)))
}

const stdoutTable = function (string) {
  process.stdout.write(string)
}


function tableDraw(data) {
  let table = new Table({
    chars: {
      'top': '═',
      'top-mid': '╤',
      'top-left': '╔',
      'top-right': '╗',
      'bottom': '═',
      'bottom-mid': '╧',
      'bottom-left': '╚',
      'bottom-right': '╝',
      'left': '║',
      'left-mid': '╟',
      'mid': '─',
      'mid-mid': '┼',
      'right': '║',
      'right-mid': '╢',
      'middle': '│'
    }
  });
  for (var i = 0; i < tableData(data).length; i++) {
    table.push(tableData(data)[i])
  }
  return stdoutTable(chalk.green(table.toString()));

}

function tableDrawHourly(data, date) {
  let table = new Table({
    chars: {
      'top': '═',
      'top-mid': '╤',
      'top-left': '╔',
      'top-right': '╗',
      'bottom': '═',
      'bottom-mid': '╧',
      'bottom-left': '╚',
      'bottom-right': '╝',
      'left': '║',
      'left-mid': '╟',
      'mid': '─',
      'mid-mid': '┼',
      'right': '║',
      'right-mid': '╢',
      'middle': '│'
    }
  });

  for (var i = 0; i < tabelDataHourly(data, date).length; i++) {
    table.push(tabelDataHourly(data, date)[i])
  }

  return stdoutTable(chalk.green(table.toString()));

}

function tableDrawFifteen(data) {
  let table = new Table({
    chars: {
      'top': '═',
      'top-mid': '╤',
      'top-left': '╔',
      'top-right': '╗',
      'bottom': '═',
      'bottom-mid': '╧',
      'bottom-left': '╚',
      'bottom-right': '╝',
      'left': '║',
      'left-mid': '╟',
      'mid': '─',
      'mid-mid': '┼',
      'right': '║',
      'right-mid': '╢',
      'middle': '│'
    }
  });

  for (var i = 0; i < tableSimpleDataFifteen(data).length; i++) {
    table.push(tableSimpleDataFifteen(data)[i])
  }

  return stdoutTable(chalk.green(table.toString()));
}





//预警

function todayWeatherWarning(cityCode) {
  let time = new Date().getTime()
  return `http://d1.weather.com.cn/dingzhi/${cityCode}.html?_=${time}`
}

//air

function todayWeatherAir(cityCode) {
  let time = new Date().getTime()
  return `http://d1.weather.com.cn/aqi_all/${cityCode}.html?_=${time}`
}


function wraperAxiosNow(cityCode) {
  return new Promise((resolve, reject) => {
    const headers = {
      headers: {
        referer: `http://www.weather.com.cn/weather1dn/${cityCode}.shtml`,
        'Content-Type': 'text/html',
        'User-Agent': randomUserAgent()
      }
    }

    axios.get(toDayWeatherUrl(cityCode), headers)
      .then(function (response) {
        const $ = cheerio.load(response.data, {
          decodeEntities: false
        })
        let timeWeather = $('html body').html().replace('var dataSK = ', '')
        let realWeatherObj = JSON.parse(timeWeather)
        resolve({
          ...realWeatherObj
        })
      })
      .catch(err => reject(err))
  })
}

function wraperAxiosWarn(cityCode) {
  return new Promise((resolve, reject) => {
    const headers = {
      headers: {
        referer: `http://www.weather.com.cn/weather1dn/${cityCode}.shtml`,
        'Content-Type': 'text/html',
        'User-Agent': randomUserAgent()
      }
    }
    axios.get(todayWeatherWarning(cityCode), headers)
      .then(function (response) {
        const $ = cheerio.load(response.data, {
          decodeEntities: false
        })
        let warnWeather = $('html body').html()
          .split(";")

        let cityDZ = jsonToObj(warnWeather[0].replace(`var cityDZ${cityCode} =`, ''))
        let alarmDZ = jsonToObj(warnWeather[1].replace(`var alarmDZ${cityCode} =`, ''))
        resolve({
          cityDZ,
          alarmDZ
        })
      })
      .catch(err => reject(err))
  })
}


function wraperAxiosHour(cityCode) {
  return new Promise((resolve, reject) => {
    const url = `http://www.weather.com.cn/weather1dn/${cityCode}.shtml`
    axios.get(url)
      .then(function (response) {
        const $ = cheerio.load(response.data, {
          decodeEntities: false
        })

        let todayData = $('.todayRight script').html()
          .replace("var hour3data=", "")
          .replace(/\n/g, "")
          .split(";")

        todayData.pop()

        //24小时
        // console.log(jsonToObj(todayData[0]))
        let forecastList1 = getPerTimeList((jsonToObj(todayData[0]))[0]).drgeeData
        let forecastList2 = getPerTimeList((jsonToObj(todayData[0]))[1]).drgeeData

        let forecastListob = forecastList1.concat(forecastList2)

        let forecastList = forecastListob.slice(0, 24)



        let lifeAssistant = getLv(0, $)

        let sunup = jsonToObj(todayData[7].replace('var sunup =', ''))[1]
        let sunset = jsonToObj(todayData[8].replace('var sunset =', ''))[1]
        let max_degree = jsonToObj(todayData[3].replace('var eventDay =', ''))[2]
        let min_degree = jsonToObj(todayData[4].replace('var eventNight =', ''))[1]

        // console.log(max_degree,min_degree,sunup,sunset)

        resolve({
          forecastList,
          lifeAssistant,
          max_degree,
          min_degree,
          sunup,
          sunset
        })
      })
      .catch(err => reject(err))
  })
}


function wraperAxiosAir(cityCode) {
  return new Promise((resolve, reject) => {
    const headers = {
      headers: {
        referer: `http://www.weather.com.cn/air/?city=${cityCode}`,
        'Content-Type': 'text/html',
        'User-Agent': randomUserAgent()
      }
    }
    axios.get(todayWeatherAir(cityCode), headers)
      .then(function (response) {
        const $ = cheerio.load(response.data, {
          decodeEntities: false
        })
        let air = $('html body').html()
          .replace("setAirData(", '')
          .replace(")", "")

        let airInfo = setAirData(jsonToObj(air))
        resolve({
          ...airInfo
        })
      })
      .catch(err => reject(err))
  })
}




function wraperAxiosSeven(cityCode) {
  return new Promise((resolve, reject) => {
    axios.get(sevenDayWeatherUrl(cityCode))
      .then(function (response) {
        const $ = cheerio.load(response.data, {
          decodeEntities: false
        })
        let hasBody = $('body').html()
        if (hasBody == '') {
          let errorInfo = {
            "msg": "城市代码错误",
            "code": 500
          }
          reject(errorInfo)
          return
        }

        //温度
        let temperatures = temperatureScriptData($(".blueFor-container script").html())

        //24小时 
        let hour3data = $(".details-container script").html()
          .replace("var hour3data=", "")
          .replace(/\n/g, "")
          .split(";")

        hour3data.pop()

        let data = [];
        //聚合7天数据 
        $('.date-container li').each(function (item, indx, arr) {
          let $this = $(this);
          let index = $this.index();
          let weatherContentDom = $(".blue-container .blue-item").eq(index)
          let weatherLifeDom = $(".weather_shzs .lv").eq(index)
          if (index > 0) {
            data.push({
              date: trim($this.find(".date").text()),
              dateInfo: trim($this.find(".date-info").text()),
              day_weather: weatherContentDom.find(".item-icon").eq(0).attr("title"),
              night_weather: weatherContentDom.find(".item-icon").eq(1).attr("title"),
              weatherInfo: trim(weatherContentDom.find(".weather-info").text()),
              day_wind: weatherContentDom.find(".wind-container").find(".wind-icon").eq(0).attr("title"),
              night_wind: weatherContentDom.find(".wind-container").find(".wind-icon").eq(1).attr("title"),
              windInfo: trim(weatherContentDom.find(".wind-info").text()),
              forecastList: getPerTimeList((jsonToObj(hour3data[0]))[index - 1]).drgeeData, //算法转换
              sunup: getDegree(jsonToObj(temperatures[4]), index - 1),
              sunset: getDegree(jsonToObj(temperatures[5]), index - 1),
              max_degree: getDegree(jsonToObj(temperatures[0]), index),
              min_degree: getDegree(jsonToObj(temperatures[1]), index),
              lifeDate: getLife(index - 1, $),
              lifeAssistant: getLv(index - 1, $)
            });
          }
        })

        let list = data
        let uptime = trimdot(hour3data[2].replace("var uptime=", "")) + '| 数据来源 中央气象台'

        resolve({
          list,
          uptime
        })
      })
      .catch(err => reject(err))
  })
}


function wraperAxiosSevenSimple(cityCode) {
  return new Promise((resolve, reject) => {
    axios.get(sevenDayWeatherUrl(cityCode))
      .then(function (response) {
        const $ = cheerio.load(response.data, {
          decodeEntities: false
        })
        let hasBody = $('body').html()
        if (hasBody == '') {
          let errorInfo = {
            "msg": "城市代码错误",
            "code": 500
          }
          reject(errorInfo)
          return
        }

        //温度
        let temperatures = temperatureScriptData($(".blueFor-container script").html())

        //24小时 
        let hour3data = $(".details-container script").html()
          .replace("var hour3data=", "")
          .replace(/\n/g, "")
          .split(";")

        hour3data.pop()

        let data = [];
        //聚合7天数据 
        $('.date-container li').each(function (item, indx, arr) {
          let $this = $(this);
          let index = $this.index();
          let weatherContentDom = $(".blue-container .blue-item").eq(index)
          let weatherLifeDom = $(".weather_shzs .lv").eq(index)
          if (index > 0) {
            data.push({
              date: trim($this.find(".date").text()),
              dateInfo: trim($this.find(".date-info").text()),
              day_weather: weatherContentDom.find(".item-icon").eq(0).attr("title"),
              night_weather: weatherContentDom.find(".item-icon").eq(1).attr("title"),
              weatherInfo: trim(weatherContentDom.find(".weather-info").text()),
              day_wind: weatherContentDom.find(".wind-container").find(".wind-icon").eq(0).attr("title"),
              night_wind: weatherContentDom.find(".wind-container").find(".wind-icon").eq(1).attr("title"),
              windInfo: trim(weatherContentDom.find(".wind-info").text()),
              max_degree: getDegree(jsonToObj(temperatures[0]), index),
              min_degree: getDegree(jsonToObj(temperatures[1]), index),
            });
          }
        })

        let list = data
        let uptime = trimdot(hour3data[2].replace("var uptime=", "")) + '| 数据来源 中央气象台'


        resolve({
          list,
          uptime
        })
      })
      .catch(err => reject(err))
  })
}




function wraperAxiosFifteen(cityCode) {
  return new Promise((resolve, reject) => {
    axios.get(fifteenDayWeatherUrl(cityCode))
      .then(function (response) {
        const $ = cheerio.load(response.data, {
          decodeEntities: false
        })
        let hasBody = $('body').html()

        if (hasBody == '') {
          let errorInfo = {
            "msg": "城市代码错误",
            "code": 500
          }
          reject(errorInfo)
          return
        }

        //温度
        let temperatures = temperatureScriptData($(".blueFor-container script").html())

        let data = [];
        //后面8天数据 
        $('.date-container li').each(function (item, indx, arr) {
          let $this = $(this);
          let index = $this.index();
          let weatherContentDom = $(".blue-container .blue-item").eq(index)
          let weatherLifeDom = $(".weather_shzs .lv").eq(index)

          data.push({
            date: trim($this.find(".date").text()),
            dateInfo: trim($this.find(".date-info").text()),
            day_weather: weatherContentDom.find(".item-icon").eq(0).attr("title"),
            night_weather: weatherContentDom.find(".item-icon").eq(1).attr("title"),
            weatherInfo: trim(weatherContentDom.find(".weather-info").text()),
            day_wind: weatherContentDom.find(".wind-container").find(".wind-icon").eq(0).attr("title"),
            night_wind: weatherContentDom.find(".wind-container").find(".wind-icon").eq(1).attr("title"),
            windInfo: trim(weatherContentDom.find(".wind-info").text()),
            max_degree: getDegree(jsonToObj(temperatures[2]), index),
            min_degree: getDegree(jsonToObj(temperatures[3]), index),
          });

        })

        let listFifteen = data
        resolve({
          listFifteen
        })
      })
      .catch(err => reject(err))
  })
}

function wrapperKey(obj, key, keyInfo, type) {

  let reslut
  if (type == '°C') {
    reslut = [keyInfo, obj[key] + type]
  } else if (type == 'aqi') {
    reslut = [keyInfo, obj[key] + '/' + aqi(obj[key])]
  } else if (type == 'mg' || type == 'μg') {
    reslut = [keyInfo, obj[key] + type + '/m3']
  } else {
    reslut = [keyInfo, (obj[key] !== '' ? obj[key] : '不限号')]
  }
  return reslut
}


function wrapperKeyLife(obj, key, keyInfo) {
  let reslut = [keyInfo, obj[key]['level']]
  return reslut
}


function wrapperKeyWind(obj, keyname, keynum, keyInfo) {
  let result = [keyInfo, obj[keyname] + ' ' + obj[keynum]]
  return result
}



function wrapperKeyAlarm(obj, key, keyInfo) {
  let result
  let info = []
  if (obj[key] && obj[key]['w'] && obj[key]['w'].length > 0) {
    for (var i = 0; i < obj[key]['w'].length; i++) {
      info.push(obj[key]['w'][i]['w5'] + '预警')
    }
  } else {
    info.push('暂无预警信息')
  }

  result = [keyInfo, info.join(' ')]

  // console.log(obj[key]['w'].length,info)

  return result
}

function wrapperTodayWeather(obj) {
  let result = []
  result.push(
    wrapperKey(obj, 'time', '天气实况更新时间'),
    wrapperKey(obj, 'temp', '平均温度', '°C'),
    wrapperKey(obj, 'max_degree', '最高温度', '°C'),
    wrapperKey(obj, 'min_degree', '最低温蒂', '°C'),
    wrapperKeyWind(obj, 'WD', 'WS', '风力'),
    wrapperKey(obj, 'sunset', '今日日落'),
    wrapperKey(obj, 'sunup', '明日日出'),
    wrapperKey(obj, 'limitnumber', '车辆限行'),
    wrapperKeyAlarm(obj, 'alarmDZ', '发布天气预警'),
    wrapperKey(obj, 'aqi', '空气质量', 'aqi'),
    wrapperKey(obj, 'pm10', '可吸入颗粒物(PM10)', 'μg'),
    wrapperKey(obj, 'pm25', '细颗粒物(PM2.5)', 'μg'),
    wrapperKey(obj, 'co', '一氧化碳(CO)', 'mg'),
    wrapperKey(obj, 'no2', '二氧化氮(NO2) ', 'μg'),
    wrapperKey(obj, 'so2', '二氧化硫(SO2)', 'μg'),
    wrapperKey(obj, 'sd', '空气相对湿度'),
    wrapperKeyLife(obj.lifeAssistant, 'uv', '紫外线'),
    wrapperKeyLife(obj.lifeAssistant, 'gm', '减肥'),
    wrapperKeyLife(obj.lifeAssistant, 'bl', '血糖'),
    wrapperKeyLife(obj.lifeAssistant, 'cy', '穿衣指南'),
    wrapperKeyLife(obj.lifeAssistant, 'xc', '洗车'),
    wrapperKeyLife(obj.lifeAssistant, 'ks', '空气污染扩散'),

  )
  return result
}

function tableDrawToday(obj) {
  // let table = new Table({
  //      head: ['属性', '数值']
  //  });

  let table = new Table({
    chars: {
      'top': '═',
      'top-mid': '╤',
      'top-left': '╔',
      'top-right': '╗',
      'bottom': '═',
      'bottom-mid': '╧',
      'bottom-left': '╚',
      'bottom-right': '╝',
      'left': '║',
      'left-mid': '╟',
      'mid': '─',
      'mid-mid': '┼',
      'right': '║',
      'right-mid': '╢',
      'middle': '│'
    }
  });
  table.push(['属性', '数值'])
  for (var i = 0; i < wrapperTodayWeather(obj).length; i++) {
    table.push(wrapperTodayWeather(obj)[i])
  }
  console.log(chalk.green(table.toString()));
}

function tableDrawTodayHourly(data) {
  let table = new Table({
    chars: {
      'top': '═',
      'top-mid': '╤',
      'top-left': '╔',
      'top-right': '╗',
      'bottom': '═',
      'bottom-mid': '╧',
      'bottom-left': '╚',
      'bottom-right': '╝',
      'left': '║',
      'left-mid': '╟',
      'mid': '─',
      'mid-mid': '┼',
      'right': '║',
      'right-mid': '╢',
      'middle': '│'
    }
  });

  for (var i = 0; i < tabelDataHourlyToday(data).length; i++) {
    table.push(tabelDataHourlyToday(data)[i])
  }

  return stdoutTable(chalk.green(table.toString()));

}

const Weather = {

    init: function () {

      if (!day || day == 1) {
        this.todayData()
        // this.fifteenData()
      } else if (day == 7) {
        this.sevenData()
      } else if (day == 15) {
        this.fifteenData()
      } else if (day == 40) {

      }

    },

    todayData: function () {

        let now = wraperAxiosNow(cityCode)
        let warn = wraperAxiosWarn(cityCode)
        let hour = wraperAxiosHour(cityCode)
        let air = wraperAxiosAir(cityCode)

        return Promise.all([now, warn, hour, air]).then((results) => {
              let succes = {
                "msg": "操作成功",
                "code": 200,
                "data": {
                  ...results[0],
                  ...results[1],
                  ...results[2],
                  ...results[3]
                }
              }

              console.log(chalk.cyan('**********实时天气预报实况**********'))
              console.log('\r')
              tableDrawToday(succes.data)
              console.log('\r')
              console.log(chalk.cyan('**********24小时逐小时天气预报**********'))
              console.log('\r')
              tableDrawTodayHourly(succes.data.forecastList)

              function writeFile(file, data, encoding) {
                return new Promise((resolve, reject) => {
                  fs.writeFile(
                    file,
                    data,
                    encoding,
                    error => error ? reject(error) : resolve()
                  );
                });
              }

              if (weatherDouwnload) {

                writeFile(dir, JSON.stringify(succes, null, 3), 'utf-8').then((data) => {
                  console.log('\r\n')
                  console.log('文件数据下载成功')
                  process.exit(0)
                }).catch((error) => {
                  console.log(error)
                })
              }

              //stdoutMessage(succes) 

    }).catch(function (err) {
      console.log(err);
      let hasError = {
        "msg": "服务器内部错误",
        "code": 500
      }
      stdoutMessage(hasError)
    });

  },
  sevenData: function () {
    return wraperAxiosSeven(cityCode).then((results) => {
        let data = results.list

        if (outFormatTable) {
          if (weatherHourly && weatherDate) {
            console.log(chalk.cyan('**********天气预报逐小时天气预报**********'))
            console.log('\r')
            tableDrawHourly(data, weatherDate)
          } else {
            console.log(chalk.cyan('**********7天天气预报**********'))
            console.log('\r')
            tableDraw(data)
          }
        }

        if (outFormatJson) {
          let succes = {
            "msg": "操作成功",
            "code": 200,
            "data": {
              ...results
            }
          }
          stdoutMessage(succes)
        }


      })
      .catch(function (error) {
        if (error && outFormatTable) {
          console.log(chalk.red(error && error.message || '请检查网络是否通畅，稍后重试'));
        }
        if (error && outFormatJson) {
          let hasError = error || {
            "msg": error && error.message || "服务器内部错误",
            "code": error && error.code || 500
          }
          stdoutMessage(hasError)
        }

      });

  },
  fifteenData: function () {
    const sevenData = wraperAxiosSevenSimple(cityCode)
    const fifteenData = wraperAxiosFifteen(cityCode)
    return Promise.all([sevenData, fifteenData]).then((results) => {
        let concatData = results[0].list.concat(results[1].listFifteen)
        let futureDate = []
        for (var i = 0; i < 15; i++) {
          futureDate.push(getFutureWeatherDate(i) + ' ' + weekDayInfo(getFutureWeatherDate(i)))
        }

        //组装 weatherDate
        concatData.forEach(function (item, index, arr) {
          arr[index]['weatherDate'] = futureDate[index]
        })


        let succes = {
          "msg": "操作成功",
          "code": 200,
          "data": {
            "list": concatData,
            "uptime": results[0].uptime
          }
        }


        console.log(chalk.cyan('**********15天天气预报**********'))
        console.log('\r')
        tableDrawFifteen(concatData)
        // stdoutMessage(succes) 
      })
      .catch(function (error) {
        let hasError = error || {
          "msg": "服务器内部错误",
          "code": 500
        }
        stdoutMessage(hasError)
      });

  },
  fortyData: function () {

  }
}

module.exports = Weather;