const colors = require("colors");
const axios = require("axios");
const cheerio = require("cheerio");
const Table = require("cli-table3");

function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

function trimdot(str) {
  return str.replace(/(^"*)|("$)/g, "");
}

function temperatureScriptData(str) {
  let result = [];
  let temperature =
    str &&
    str
      .replace("var eventDay =", "")
      .replace("var eventNight =", "")
      .replace("var fifDay =", "")
      .replace("var fifNight =", "")
      .replace("var sunup =", "")
      .replace("var sunset =", "")
      .replace("var blue =", "")
      .replace(/\n/g, "")
      .split(";");

  temperature.pop();
  result.push(temperature);
  return result[0];
}

// //白天晴  n00晚上晴  icon不一样
function weatherType(wather) {
  var weatherArr = {
    "": "-",
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

  var strArr = wather.split("");
  strArr.shift();

  var newStr = strArr.join("");

  return weatherArr[newStr];
}

function getClothes(str) {
  //这里要区分其它指标
  var clothes = "";
  switch (str) {
    case "炎热":
    case "热":
      clothes = "短袖";
      break;
    case "舒适":
      clothes = "衬衫";
      break;
    case "较舒适":
      clothes = "薄外套";
      break;
    case "较冷":
      clothes = "厚毛衣";
      break;
    default:
      clothes = "羽绒服";
      break;
  }
  return clothes;
}

function getLife(indexs, context) {
  var $ = context;
  var date = $(".shzsSevenDay ul li")
    .eq(indexs)
    .text();
  return date;
}

function getLv(indexs, context) {
  var $ = context;
  var shzs = $(".weather_shzs .lv").eq(indexs);
  var obj = {};
  obj["uv"] = [];
  obj["gm"] = [];
  obj["bl"] = [];
  obj["cy"] = [];
  obj["xc"] = [];
  obj["ks"] = [];
  let dlArr = [];
  for (var i = 0; i < 6; i++) {
    if (i !== 3) {
      dlArr.push({
        level: shzs
          .find("dl")
          .eq(i)
          .find("em")
          .text(),
        stars: shzs
          .find("dl")
          .eq(i)
          .find("p")
          .find("i.active").length,
        info: shzs
          .find("dl")
          .eq(i)
          .find("dd")
          .text()
      });
    } else {
      dlArr.push({
        level: getClothes(
          shzs
            .find("dl")
            .eq(i)
            .find("em")
            .text()
        ),
        stars: shzs
          .find("dl")
          .eq(i)
          .find("p")
          .find("i.active").length,
        info: shzs
          .find("dl")
          .eq(i)
          .find("dd")
          .text()
      });
    }
  }
  obj["uv"] = dlArr[0];
  obj["gm"] = dlArr[1];
  obj["bl"] = dlArr[2];
  obj["cy"] = dlArr[3];
  obj["xc"] = dlArr[4];
  obj["ks"] = dlArr[5];

  return obj;
}

function flatten(arr, curr) {
  if (Array.isArray(curr)) {
    arr.push(...curr);
  } else {
    arr.push(curr);
  }
  return arr;
}


function jsonToObj(t) {
  return JSON.parse(t);
}


function getDegree(arr, index) {
  return arr[index];
}

function intervalData(t, a) {
  var e = [];
  var temp = {};
  temp["itemOne"] = a["itemOne"];
  temp["wather"] = weatherType(a["wather"]);
  temp["windDY"] = a["windDY"];
  temp["windJB"] = a["windJB"];
  temp["degree"] = a["degree"]; //每个时段的温度绘制曲线
  temp["time"] = a["time"];

  e.push(temp);
  return e;
}

function timeFormat(t, a) {
  return a.time + "时";
}

function sourceData(t) {
  for (
    var a = [],
      e = [
        "无持续风向",
        "东北风",
        "东风",
        "东南风",
        "南风",
        "西南风",
        "西风",
        "西北风",
        "北风",
        "旋转风"
      ],
      i = [
        "<3级",
        "3-4级",
        "4-5级",
        "5-6级",
        "6-7级",
        "7-8级",
        "8-9级",
        "9-10级",
        "10-11级",
        "11-12级"
      ],
      n = 0;
    n < t.length;
    n++
  ) {
    var r = t[n],
      s = {},
      l = r["jf"].slice(8, 10);
    (s["time"] = l),
      (s["degree"] = r.jb),
      (s["wather"] = l > 5 && 20 > l ? "d" + r.ja : "n" + r.ja),
      (s["windDY"] = e[r.jd]),
      (s["windJB"] = i[r.jc]),
      (s["itemOne"] = n % 2 ? "item-one" : ""),
      a.push(s);
  }
  // console.log(a)
  return a;
}

function getPerTimeList(s) {
  var n = s.length;
  for (var g = sourceData(s), y = [], x = [], b = 0; n > b; b++)
    y.push(intervalData(b, g[b])), x.push(timeFormat(b, g[b]));
  return {
    timeData: x,
    drgeeData: y.reduce(flatten, [])
  };
}

function tableData(list) {
  let tableHead = [
    colors.cyan("日期"),
    colors.cyan("最高温度"),
    colors.cyan("最低温度"),
    colors.cyan("天气详情"),
    colors.cyan("白天天气"),
    colors.cyan("夜晚天气"),
    colors.cyan("风向级别"),
    colors.cyan("白天风向"),
    colors.cyan("夜晚风向"),
    colors.cyan("今日日落"),
    colors.cyan("明日日出")
  ];
  let tableData = [];
  for (let i = 0; i < list.length; i++) {
    let temp = [];
    temp.push(
      colors.green(list[i].weatherDate),
      colors.green(list[i].max_degree + "°C"),
      colors.green(list[i].min_degree + "°C"),
      colors.green(list[i].weatherInfo),
      colors.green(list[i].day_weather),
      colors.green(list[i].night_weather),
      colors.green(list[i].windInfo),
      colors.green(list[i].day_wind),
      colors.green(list[i].night_wind),
      colors.green(list[i].sunset),
      colors.green(list[i].sunup)
    );
    tableData.push(temp);
  }
  tableData.unshift(tableHead);
  // console.log(tableData)

  return tableData;
}

function tableSimpleDataFifteen(list) {
  let tableHead = [
    colors.cyan("日期"),
    colors.cyan("最高温度"),
    colors.cyan("最低温度"),
    colors.cyan("天气详情"),
    colors.cyan("白天天气"),
    colors.cyan("夜晚天气"),
    colors.cyan("风向级别"),
    colors.cyan("白天风向"),
    colors.cyan("夜晚风向")
  ];
  let tableData = [];
  for (let i = 0; i < list.length; i++) {
    let temp = [];
    temp.push(
      colors.green(list[i].weatherDate),
      colors.green(list[i].max_degree + "°C"),
      colors.green(list[i].min_degree + "°C"),
      colors.green(list[i].weatherInfo),
      colors.green(list[i].day_weather),
      colors.green(list[i].night_weather),
      colors.green(list[i].windInfo),
      colors.green(list[i].day_wind),
      colors.green(list[i].night_wind)
    );
    tableData.push(temp);
  }
  tableData.unshift(tableHead);
  // console.log(tableData)

  return tableData;
}

function tabelDataHourly(data, date) {
  let tableHead = [
    colors.yellow("逐小时预报"),
    colors.yellow("天气"),
    colors.yellow("温度"),
    colors.yellow("风向"),
    colors.yellow("风向级别")
  ];
  let tableHeadPerThreeHour = [
    colors.yellow("逐3小时预报"),
    colors.yellow("天气"),
    colors.yellow("温度"),
    colors.yellow("风向"),
    colors.yellow("风向级别")
  ];

  let tableData = [];
  let list = [];

  for (var j = 0; j < data.length; j++) {
    if (data[j]["lifeDate"] == date) {
      list.push(data[j]["forecastList"]);
    }
  }

  if (list.length == 0) {
    console.log(colors.red(" --date Invalid parameter value "));
    process.exit(0);
  }

  for (var i = 0; i < list[0].length; i++) {
    var temp = [];
    temp.push(
      colors.green(list[0][i].time + "时"),
      colors.green(list[0][i].wather),
      colors.green(list[0][i].degree + "°C"),
      colors.green(list[0][i].windDY),
      colors.green(list[0][i].windJB)
    );
    tableData.push(temp);
  }

  let tableHeadIsHour = list[0].length > 8 ? tableHead : tableHeadPerThreeHour;
  tableData.unshift(tableHeadIsHour);

  // console.log(tableData)
  return tableData;
}

//today hourly
function tabelDataHourlyToday(data) {
  let tableHead = [
    colors.yellow("逐小时预报"),
    colors.yellow("天气"),
    colors.yellow("温度"),
    colors.yellow("风向"),
    colors.yellow("风向级别")
  ];
  let tableHeadPerThreeHour = [
    colors.yellow("逐小时预报"),
    colors.yellow("天气"),
    colors.yellow("温度"),
    colors.yellow("风向"),
    colors.yellow("风向级别")
  ];
  let tableData = [];
  let list = [];

  for (var j = 0; j < data.length; j++) {
    list.push(data[j]);
  }

  if (list.length == 0) {
    console.log(colors.red(" --date Invalid parameter value "));
    process.exit(0);
  }

  for (var i = 0; i < list.length; i++) {
    var temp = [];
    temp.push(
      colors.green(list[i].time + "时"),
      colors.green(list[i].wather),
      colors.green(list[i].degree + "°C"),
      colors.green(list[i].windDY),
      colors.green(list[i].windJB)
    );
    tableData.push(temp);
  }

  let tableHeadIsHour = list.length > 8 ? tableHead : tableHeadPerThreeHour;
  tableData.unshift(tableHeadIsHour);

  // console.log(tableData)
  return tableData;
}

function toDayWeatherUrl(cityCode) {
  let time = new Date().getTime();
  return `http://d1.weather.com.cn/sk_2d/${cityCode}.html?_=${time}`;
}

function sevenDayWeatherUrl(cityCode) {
  return `http://www.weather.com.cn/weathern/${cityCode}.shtml`;
}

function fifteenDayWeatherUrl(cityCode) {
  let time = new Date().getTime();
  return `http://www.weather.com.cn/weather15dn/${cityCode}.shtml`;
}

function fortyDayWeatherUrl(cityCode, year, month) {
  let time = new Date().getTime();
  return `http://d1.weather.com.cn/calendarFromMon/${year}/${cityCode}_${year}${month}.html?_=${time}`;
}

function randomUserAgent() {
  const userAgentList = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1",
    "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) Mobile/14F89;GameHelper",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.4",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:46.0) Gecko/20100101 Firefox/46.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:46.0) Gecko/20100101 Firefox/46.0",
    "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)",
    "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)",
    "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)",
    "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Win64; x64; Trident/6.0)",
    "Mozilla/5.0 (Windows NT 6.3; Win64, x64; Trident/7.0; rv:11.0) like Gecko",
    "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1",
    "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36",
    "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Mobile Safari/537.36",
    "Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586",
    "Mozilla/5.0 (iPad; CPU OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1"
  ];
  const num = Math.floor(Math.random() * userAgentList.length);
  return userAgentList[num];
}

const getLocalTime = () => {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  return (
    year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second
  );
};

//空气质量状况的指数 aqiInfo -优  ====  aqi: "34"
function aqi(t) {
  if (t) {
    //var levelNum = dataAQI.t1 <= 50 && "0" || dataAQI.t1 <= 100 && 1 || dataAQI.t1 <= 150 && 2 || dataAQI.t1 <= 200 && 3 || dataAQI.t1 <= 300 && 4 || dataAQI.t1 > 300 && 5 || 0
    var a =
      (50 >= t && "优") ||
      (100 >= t && "良") ||
      (150 >= t && "轻度污染") ||
      (200 >= t && "中度污染") ||
      (300 >= t && "重度污染") ||
      (t > 300 && "严重污染") ||
      "";
    return a;
  }
}

//空气指数算法
function setAirData(observe24h_data) {
  for (var obsData = observe24h_data.data, i = obsData.length - 1; i >= 0; i--)
    if (obsData[i] && obsData[i].t1) {
      dataAQI = obsData[i];
      break;
    }
  if (!dataAQI) return;

  return {
    pm10: dataAQI.t4,
    pm25: dataAQI.t3,
    co: dataAQI.t5,
    no2: dataAQI.t6,
    so2: dataAQI.t9
  };
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
  s =
    year +
    "-" +
    (mon < 10 ? "0" + mon : mon) +
    "-" +
    (day < 10 ? "0" + day : day);
  return s;
}

function getMonthDays(year, month) {
  return new Date(year, month, 0).getDate();
}

function getWeekday(year, month, day) {
  return new Date(year, month - 1, day).getDay();
}

function weekDayInfo(str) {
  let res = str.split("-");
  let index = getWeekday(res[0], res[1], res[2]);
  let weekDayInfo = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return weekDayInfo[index];
}

//40天日期每月统计
function uniqueDate(arr) {
  let uniqueDateArray = arr.reduce(function(acc, name) {
    let arr = String(name).split("-");
    let temp = arr[0] + "-" + arr[1];
    if (temp in acc) {
      acc[temp]++;
    } else {
      acc[temp] = 1;
    }
    return acc;
  }, {});
  return uniqueDateArray;
}
//爬取链接
function axioFortyDayWeatherUrl(cityCode, obj) {
  let res = [];
  let resassemble = [];
  let axiosUrl = [];
  for (let [key, value] of Object.entries(obj)) {
    let temp = new Array(3);
    temp[0] = key.split("-")[0];
    temp[1] = key.split("-")[1];
    temp[2] = value;
    res.push(temp);
  }
  for (let i = 0, len = res.length; i < len; i++) {
    resassemble.push({
      year: res[i][0],
      month: res[i][1],
      day: res[i][2]
    });
    axiosUrl.push(fortyDayWeatherUrl(cityCode, res[i][0], res[i][1]));
  }
  return {
    resassemble: resassemble,
    axiosUrl: axiosUrl
  };
}

function filterWeatherDataMonth(arr) {
  return arr.filter((item, index, arr) => {
    return (
      item.cla == "d15 pre" ||
      item.cla == "d15" ||
      item.cla == "d40" ||
      item.cla == "d40 pre" ||
      item.cla == "d40 next"
    );
  });
}

function filterArrayMonth(arr, index, day) {
  return arr.slice(index, index + day);
}

function tableDataForty(list) {
  let tableHead = [
    colors.cyan("日期"),
    colors.cyan("最高温度"),
    colors.cyan("最低温度"),
    colors.cyan("天气详情"),
    colors.cyan("白天天气"),
    colors.cyan("夜晚天气"),
    colors.cyan("风向详情"),
    colors.cyan("降水概率")
  ];
  let tableData = [];
  for (let i = 0; i < list.length; i++) {
    let temp = [];
    temp.push(
      colors.green(list[i].weatherDate),
      colors.green(list[i].max + "°C"),
      colors.green(list[i].min + "°C"),
      colors.green(list[i].w1 == "" ? "-" : list[i].w1),
      colors.green(weatherType(list[i].c1)),
      colors.green(weatherType(list[i].c2)),
      colors.green(list[i].wd1 == "" ? "-" : list[i].wd1),
      colors.green(list[i].hgl)
    );
    tableData.push(temp);
  }
  tableData.unshift(tableHead);
  // console.log(tableData)

  return tableData;
}

const stdoutMessage = function(data) {
  return process.stdout.write(colors.green(JSON.stringify(data, null, 2)));
};

const stdoutTable = function(string) {
  return process.stdout.write(string);
};

function tableDraw(data) {
  let table = new Table({
    chars: {
      top: "═",
      "top-mid": "╤",
      "top-left": "╔",
      "top-right": "╗",
      bottom: "═",
      "bottom-mid": "╧",
      "bottom-left": "╚",
      "bottom-right": "╝",
      left: "║",
      "left-mid": "╟",
      mid: "─",
      "mid-mid": "┼",
      right: "║",
      "right-mid": "╢",
      middle: "│"
    }
  });
  for (var i = 0; i < tableData(data).length; i++) {
    table.push(tableData(data)[i]);
  }
  return stdoutTable(colors.green(table.toString()));
}

function tableDrawHourly(data, date) {
  let table = new Table({
    chars: {
      top: "═",
      "top-mid": "╤",
      "top-left": "╔",
      "top-right": "╗",
      bottom: "═",
      "bottom-mid": "╧",
      "bottom-left": "╚",
      "bottom-right": "╝",
      left: "║",
      "left-mid": "╟",
      mid: "─",
      "mid-mid": "┼",
      right: "║",
      "right-mid": "╢",
      middle: "│"
    }
  });

  for (var i = 0; i < tabelDataHourly(data, date).length; i++) {
    table.push(tabelDataHourly(data, date)[i]);
  }

  return stdoutTable(colors.green(table.toString()));
}

function tableDrawFifteen(data) {
  let table = new Table({
    chars: {
      top: "═",
      "top-mid": "╤",
      "top-left": "╔",
      "top-right": "╗",
      bottom: "═",
      "bottom-mid": "╧",
      "bottom-left": "╚",
      "bottom-right": "╝",
      left: "║",
      "left-mid": "╟",
      mid: "─",
      "mid-mid": "┼",
      right: "║",
      "right-mid": "╢",
      middle: "│"
    }
  });

  for (var i = 0; i < tableSimpleDataFifteen(data).length; i++) {
    table.push(tableSimpleDataFifteen(data)[i]);
  }

  return stdoutTable(colors.green(table.toString()));
}

function tableDrawForty(data) {
  let table = new Table({
    chars: {
      top: "═",
      "top-mid": "╤",
      "top-left": "╔",
      "top-right": "╗",
      bottom: "═",
      "bottom-mid": "╧",
      "bottom-left": "╚",
      "bottom-right": "╝",
      left: "║",
      "left-mid": "╟",
      mid: "─",
      "mid-mid": "┼",
      right: "║",
      "right-mid": "╢",
      middle: "│"
    }
  });

  for (var i = 0; i < tableDataForty(data).length; i++) {
    table.push(tableDataForty(data)[i]);
  }

  return stdoutTable(colors.green(table.toString()));
}

//预警

function todayWeatherWarning(cityCode) {
  let time = new Date().getTime();
  return `http://d1.weather.com.cn/dingzhi/${cityCode}.html?_=${time}`;
}

//air

function todayWeatherAir(cityCode) {
  let time = new Date().getTime();
  return `http://d1.weather.com.cn/aqi_all/${cityCode}.html?_=${time}`;
}

function wraperAxiosNow(cityCode) {
  return new Promise((resolve, reject) => {
    const headers = {
      headers: {
        referer: `http://www.weather.com.cn/weather1dn/${cityCode}.shtml`,
        "Content-Type": "text/html",
        "User-Agent": randomUserAgent()
      }
    };

    axios
      .get(toDayWeatherUrl(cityCode), headers)
      .then(function(response) {
        const $ = cheerio.load(response.data, {
          decodeEntities: false
        });

        let hasBody = $("body").html();
        if (hasBody == "") {
          let errorInfo = {
            msg: "城市代码错误",
            code: 500
          };
          reject(errorInfo);
          return;
        }

        let timeWeather = $("html body")
          .html()
          .replace("var dataSK = ", "");
        let realWeatherObj = JSON.parse(timeWeather);
        resolve({
          ...realWeatherObj
        });
      })
      .catch(err => reject(err));
  });
}

//天气预警
function wraperAxiosWarn(cityCode) {
  return new Promise((resolve, reject) => {
    const headers = {
      headers: {
        referer: `http://www.weather.com.cn/weather1dn/${cityCode}.shtml`,
        "Content-Type": "text/html",
        "User-Agent": randomUserAgent()
      }
    };
    axios
      .get(todayWeatherWarning(cityCode), headers)
      .then(function(response) {
        const $ = cheerio.load(response.data, {
          decodeEntities: false
        });
        let warnWeather = $("html body")
          .html()
          .split(";");

        let cityDZ = jsonToObj(
          warnWeather[0].replace(`var cityDZ${cityCode} =`, "")
        );
        let alarmDZ = jsonToObj(
          warnWeather[1].replace(`var alarmDZ${cityCode} =`, "")
        );
        resolve({
          cityDZ,
          alarmDZ
        });
      })
      .catch(err => reject(err));
  });
}

function wraperAxiosHour(cityCode) {
  return new Promise((resolve, reject) => {
    const url = `http://www.weather.com.cn/weather1dn/${cityCode}.shtml`;
    axios
      .get(url)
      .then(function(response) {
        const $ = cheerio.load(response.data, {
          decodeEntities: false
        });

        let hasBody = $("body").html();
        if (hasBody == "") {
          let errorInfo = {
            msg: "城市代码错误",
            code: 500
          };
          reject(errorInfo);
          return;
        }

        let todayData = $(".todayRight script")
          .html()
          .replace("var hour3data=", "")
          .replace(/\n/g, "")
          .split(";");

        todayData.pop();

        //24小时
        // console.log(jsonToObj(todayData[0]))
        let forecastList1 = getPerTimeList(jsonToObj(todayData[0])[0])
          .drgeeData;
        let forecastList2 = getPerTimeList(jsonToObj(todayData[0])[1])
          .drgeeData;

        let forecastListob = forecastList1.concat(forecastList2);

        let forecastList = forecastListob.slice(0, 24);

        let lifeAssistant = getLv(0, $);

        let sunup = jsonToObj(todayData[7].replace("var sunup =", ""))[1];
        let sunset = jsonToObj(todayData[8].replace("var sunset =", ""))[1];
        let max_degree = jsonToObj(
          todayData[3].replace("var eventDay =", "")
        )[2];
        let min_degree = jsonToObj(
          todayData[4].replace("var eventNight =", "")
        )[1];

        // console.log(max_degree,min_degree,sunup,sunset)

        resolve({
          forecastList,
          lifeAssistant,
          max_degree,
          min_degree,
          sunup,
          sunset
        });
      })
      .catch(err => reject(err));
  });
}

function wraperAxiosAir(cityCode) {
  return new Promise((resolve, reject) => {
    const headers = {
      headers: {
        referer: `http://www.weather.com.cn/air/?city=${cityCode}`,
        "Content-Type": "text/html",
        "User-Agent": randomUserAgent()
      }
    };
    axios
      .get(todayWeatherAir(cityCode), headers)
      .then(function(response) {
        const $ = cheerio.load(response.data, {
          decodeEntities: false
        });
        let air = $("html body")
          .html()
          .replace("setAirData(", "")
          .replace(")", "");

        let airInfo = setAirData(jsonToObj(air));
        resolve({
          ...airInfo
        });
      })
      .catch(err => reject(err));
  });
}

function wraperAxiosSeven(cityCode) {
  return new Promise((resolve, reject) => {
    axios
      .get(sevenDayWeatherUrl(cityCode))
      .then(function(response) {
        const $ = cheerio.load(response.data, {
          decodeEntities: false
        });
        let hasBody = $("body").html();
        if (hasBody == "") {
          let errorInfo = {
            msg: "城市代码错误",
            code: 500
          };
          reject(errorInfo);
          return;
        }

        //温度
        let temperatures = temperatureScriptData(
          $(".blueFor-container script").html()
        );

        //24小时
        let hour3data = $(".details-container script")
          .html()
          .replace("var hour3data=", "")
          .replace(/\n/g, "")
          .split(";");

        hour3data.pop();

        let data = [];
        //聚合7天数据
        $(".date-container li").each(function(item, indx, arr) {
          let $this = $(this);
          let index = $this.index();
          let weatherContentDom = $(".blue-container .blue-item").eq(index);
          let weatherLifeDom = $(".weather_shzs .lv").eq(index);
          if (index > 0) {
            data.push({
              date: trim($this.find(".date").text()),
              dateInfo: trim($this.find(".date-info").text()),
              weatherDate:
                getFutureWeatherDate(index - 1) +
                " " +
                weekDayInfo(getFutureWeatherDate(index - 1)),
              day_weather: weatherContentDom
                .find(".item-icon")
                .eq(0)
                .attr("title"),
              night_weather: weatherContentDom
                .find(".item-icon")
                .eq(1)
                .attr("title"),
              weatherInfo: trim(weatherContentDom.find(".weather-info").text()),
              day_wind: weatherContentDom
                .find(".wind-container")
                .find(".wind-icon")
                .eq(0)
                .attr("title"),
              night_wind: weatherContentDom
                .find(".wind-container")
                .find(".wind-icon")
                .eq(1)
                .attr("title"),
              windInfo: trim(weatherContentDom.find(".wind-info").text()),
              forecastList: getPerTimeList(jsonToObj(hour3data[0])[index - 1])
                .drgeeData, //算法转换
              sunup: getDegree(jsonToObj(temperatures[4]), index - 1),
              sunset: getDegree(jsonToObj(temperatures[5]), index - 1),
              max_degree: getDegree(jsonToObj(temperatures[0]), index),
              min_degree: getDegree(jsonToObj(temperatures[1]), index),
              lifeDate: getLife(index - 1, $),
              lifeAssistant: getLv(index - 1, $)
            });
          }
        });

        let list = data;
        let uptime =
          trimdot(hour3data[2].replace("var uptime=", "")) +
          "| 数据来源 中央气象台";

        resolve({
          list,
          uptime
        });
      })
      .catch(err => reject(err));
  });
}

function wraperAxiosSevenSimple(cityCode) {
  return new Promise((resolve, reject) => {
    axios
      .get(sevenDayWeatherUrl(cityCode))
      .then(function(response) {
        const $ = cheerio.load(response.data, {
          decodeEntities: false
        });
        let hasBody = $("body").html();
        if (hasBody == "") {
          let errorInfo = {
            msg: "城市代码错误",
            code: 500
          };
          reject(errorInfo);
          return;
        }

        //温度
        let temperatures = temperatureScriptData(
          $(".blueFor-container script").html()
        );

        //24小时
        let hour3data = $(".details-container script")
          .html()
          .replace("var hour3data=", "")
          .replace(/\n/g, "")
          .split(";");

        hour3data.pop();

        let data = [];
        //聚合7天数据
        $(".date-container li").each(function(item, indx, arr) {
          let $this = $(this);
          let index = $this.index();
          let weatherContentDom = $(".blue-container .blue-item").eq(index);
          let weatherLifeDom = $(".weather_shzs .lv").eq(index);
          if (index > 0) {
            data.push({
              date: trim($this.find(".date").text()),
              dateInfo: trim($this.find(".date-info").text()),
              weatherDate:
                getFutureWeatherDate(index - 1) +
                " " +
                weekDayInfo(getFutureWeatherDate(index - 1)),
              day_weather: weatherContentDom
                .find(".item-icon")
                .eq(0)
                .attr("title"),
              night_weather: weatherContentDom
                .find(".item-icon")
                .eq(1)
                .attr("title"),
              weatherInfo: trim(weatherContentDom.find(".weather-info").text()),
              day_wind: weatherContentDom
                .find(".wind-container")
                .find(".wind-icon")
                .eq(0)
                .attr("title"),
              night_wind: weatherContentDom
                .find(".wind-container")
                .find(".wind-icon")
                .eq(1)
                .attr("title"),
              windInfo: trim(weatherContentDom.find(".wind-info").text()),
              max_degree: getDegree(jsonToObj(temperatures[0]), index),
              min_degree: getDegree(jsonToObj(temperatures[1]), index)
            });
          }
        });

        let list = data;
        let uptime =
          trimdot(hour3data[2].replace("var uptime=", "")) +
          "| 数据来源 中央气象台";

        resolve({
          list,
          uptime
        });
      })
      .catch(err => reject(err));
  });
}

function wraperAxiosFifteen(cityCode) {
  return new Promise((resolve, reject) => {
    axios
      .get(fifteenDayWeatherUrl(cityCode))
      .then(function(response) {
        const $ = cheerio.load(response.data, {
          decodeEntities: false
        });
        let hasBody = $("body").html();

        if (hasBody == "") {
          let errorInfo = {
            msg: "城市代码错误",
            code: 500
          };
          reject(errorInfo);
          return;
        }

        //温度
        let temperatures = temperatureScriptData(
          $(".blueFor-container script").html()
        );

        let data = [];
        //后面8天数据
        $(".date-container li").each(function(item, indx, arr) {
          let $this = $(this);
          let index = $this.index();
          let weatherContentDom = $(".blue-container .blue-item").eq(index);
          let weatherLifeDom = $(".weather_shzs .lv").eq(index);

          data.push({
            date: trim($this.find(".date").text()),
            dateInfo: trim($this.find(".date-info").text()),
            weatherDate:
              getFutureWeatherDate(index) +
              " " +
              weekDayInfo(getFutureWeatherDate(index)),
            day_weather: weatherContentDom
              .find(".item-icon")
              .eq(0)
              .attr("title"),
            night_weather: weatherContentDom
              .find(".item-icon")
              .eq(1)
              .attr("title"),
            weatherInfo: trim(weatherContentDom.find(".weather-info").text()),
            day_wind: weatherContentDom
              .find(".wind-container")
              .find(".wind-icon")
              .eq(0)
              .attr("title"),
            night_wind: weatherContentDom
              .find(".wind-container")
              .find(".wind-icon")
              .eq(1)
              .attr("title"),
            windInfo: trim(weatherContentDom.find(".wind-info").text()),
            max_degree: getDegree(jsonToObj(temperatures[2]), index),
            min_degree: getDegree(jsonToObj(temperatures[3]), index)
          });
        });

        let listFifteen = data;
        resolve({
          listFifteen
        });
      })
      .catch(err => reject(err));
  });
}

//cli 数据是乱丢的 对不上   http://localhost:4003/v1/api/weather/40d/101010100
function wraperAxiosForty(cityCode, year, month) {
  return new Promise((resolve, reject) => {
    const headers = {
      headers: {
        referer: `http://www.weather.com.cn/weather40dn/${cityCode}.shtml`,
        "User-Agent": randomUserAgent()
      }
    };
    axios
      .get(fortyDayWeatherUrl(cityCode, year, month), headers)
      .then(function(response) {
        const $ = cheerio.load(response.data, {
          decodeEntities: false
        });

        let hasBody = "" + response.data.indexOf("fc40") > -1; //true标识 为城市数据

        if (!hasBody) {
          let errorInfo = {
            msg: "城市代码错误",
            code: 500
          };
          reject(errorInfo);
          return;
        }

        let fc40 = $("html body")
          .html()
          .replace("var fc40 = ", "");

        let listFortyData = fc40 && jsonToObj(fc40);

        resolve({
          listFortyData
        });
      })
      .catch(err => reject(err));
  });
}

//这个来测试数据真实性 代理本地的接口
function wraperAxiosFortyProxy(cityCode) {
  return new Promise((resolve, reject) => {
    const headers = {
      headers: {
        referer: `http://www.weather.com.cn/weather40dn/${cityCode}.shtml`,
        "Content-Type": "application/json; charset=utf-8",
        "User-Agent": randomUserAgent()
      }
    };
    axios
      .get(`http://localhost:4003/v1/api/weather/40d/${cityCode}`, headers)
      .then(function(response) {
        let listFortyData = response.data.data.list;
        resolve({
          listFortyData
        });
      })
      .catch(err => reject(err));
  });
}

function wrapperKey(obj, key, keyInfo, type) {
  let reslut;
  if (type == "°C") {
    reslut = [colors.green(keyInfo), colors.green(obj[key] + type)];
  } else if (type == "aqi") {
    reslut = [
      colors.green(keyInfo),
      colors.green(obj[key] + "/" + aqi(obj[key]))
    ];
  } else if (type == "mg" || type == "μg") {
    reslut = [colors.green(keyInfo), colors.green(obj[key] + type + "/m3")];
  } else if (type == "mm") {
    reslut = [colors.green(keyInfo), colors.green(obj[key] + type)];
  } else if (type == "hpa") {
    reslut = [colors.green(keyInfo), colors.green(obj[key] + type)];
  } else {
    reslut = [
      colors.green(keyInfo),
      obj[key] !== "" ? colors.green(obj[key]) : colors.red("不限号")
    ];
  }
  return reslut;
}

function wrapperKeyLife(obj, key, keyInfo) {
  let reslut = [colors.green(keyInfo), colors.green(obj[key]["level"])];
  return reslut;
}

function wrapperKeyWind(obj, keyname, keynum, keyInfo) {
  let result = [
    colors.green(keyInfo),
    colors.green(obj[keyname] + " " + obj[keynum])
  ];
  return result;
}

function wrapperKeyAlarm(obj, key, keyInfo) {
  let result;
  let info = [];
  if (obj[key] && obj[key]["w"] && obj[key]["w"].length > 0) {
    for (var i = 0; i < obj[key]["w"].length; i++) {
      info.push(obj[key]["w"][i]["w5"] + "预警");
    }
  } else {
    info.push("暂无预警信息");
  }

  result = [
    colors.green(keyInfo),
    info[0] == "暂无预警信息"
      ? colors.green("暂无预警信息")
      : colors.red(info.join(" "))
  ];

  // console.log(obj[key]['w'].length,info)

  return result;
}

function wrapperTodayWeather(obj) {
  let result = [];
  result.push(
    wrapperKey(obj, "time", "天气实况更新时间"),
    wrapperKey(obj, "temp", "平均温度", "°C"),
    wrapperKey(obj, "max_degree", "最高温度", "°C"),
    wrapperKey(obj, "min_degree", "最低温蒂", "°C"),
    wrapperKeyWind(obj, "WD", "WS", "风力"),
    wrapperKey(obj, "sunset", "今日日落"),
    wrapperKey(obj, "sunup", "明日日出"),
    wrapperKey(obj, "limitnumber", "车辆限行"),
    wrapperKeyAlarm(obj, "alarmDZ", "发布天气预警"),
    wrapperKey(obj, "aqi", "空气质量", "aqi"),
    wrapperKey(obj, "sd", "空气相对湿度"),
    wrapperKey(obj, "njd", "能见度"),
    wrapperKey(obj, "qy", "气压", "hpa"), //hpa
    wrapperKey(obj, "rain", "降雨量", "mm"), //mm
    wrapperKey(obj, "pm10", "可吸入颗粒物(PM10)", "μg"),
    wrapperKey(obj, "pm25", "细颗粒物(PM2.5)", "μg"),
    wrapperKey(obj, "co", "一氧化碳(CO)", "mg"),
    wrapperKey(obj, "no2", "二氧化氮(NO2) ", "μg"),
    wrapperKey(obj, "so2", "二氧化硫(SO2)", "μg"),
    wrapperKeyLife(obj.lifeAssistant, "uv", "紫外线"),
    wrapperKeyLife(obj.lifeAssistant, "gm", "减肥"),
    wrapperKeyLife(obj.lifeAssistant, "bl", "血糖"),
    wrapperKeyLife(obj.lifeAssistant, "cy", "穿衣指南"),
    wrapperKeyLife(obj.lifeAssistant, "xc", "洗车"),
    wrapperKeyLife(obj.lifeAssistant, "ks", "空气污染扩散")
  );
  return result;
}

function tableDrawToday(obj) {
  // let table = new Table({
  //      head: ['属性', '数值']
  //  });

  let table = new Table({
    chars: {
      top: "═",
      "top-mid": "╤",
      "top-left": "╔",
      "top-right": "╗",
      bottom: "═",
      "bottom-mid": "╧",
      "bottom-left": "╚",
      "bottom-right": "╝",
      left: "║",
      "left-mid": "╟",
      mid: "─",
      "mid-mid": "┼",
      right: "║",
      "right-mid": "╢",
      middle: "│"
    }
  });
  table.push([colors.cyan("属性"), colors.cyan("数值")]);
  for (var i = 0; i < wrapperTodayWeather(obj).length; i++) {
    table.push(wrapperTodayWeather(obj)[i]);
  }
  console.log(colors.green(table.toString()));
}

function tableDrawTodayHourly(data) {
  let table = new Table({
    chars: {
      top: "═",
      "top-mid": "╤",
      "top-left": "╔",
      "top-right": "╗",
      bottom: "═",
      "bottom-mid": "╧",
      "bottom-left": "╚",
      "bottom-right": "╝",
      left: "║",
      "left-mid": "╟",
      mid: "─",
      "mid-mid": "┼",
      right: "║",
      "right-mid": "╢",
      middle: "│"
    }
  });

  for (var i = 0; i < tabelDataHourlyToday(data).length; i++) {
    table.push(tabelDataHourlyToday(data)[i]);
  }

  return stdoutTable(colors.green(table.toString()));
}

module.exports = {
  trim,
  trimdot,
  temperatureScriptData,
  getClothes,
  getLife,
  getLv,
  flatten,
  jsonToObj,
  getDegree,
  intervalData,
  timeFormat,
  sourceData,
  getPerTimeList,
  tableData,
  weatherType,
  tabelDataHourly,
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
  axioFortyDayWeatherUrl,
  filterWeatherDataMonth,
  tableDataForty,
  stdoutMessage,
  stdoutTable,
  tableDraw,
  tableDrawHourly,
  tableDrawFifteen,
  tableDrawForty,
  todayWeatherWarning,
  todayWeatherAir,
  wraperAxiosNow,
  wraperAxiosWarn,
  wraperAxiosHour,
  wraperAxiosAir,
  wraperAxiosSeven,
  wraperAxiosSevenSimple,
  wraperAxiosFifteen,
  wraperAxiosForty,
  wraperAxiosFortyProxy,
  wrapperKey,
  wrapperKeyLife,
  wrapperKeyWind,
  wrapperKeyAlarm,
  wrapperTodayWeather,
  tableDrawToday,
  tableDrawTodayHourly
};
