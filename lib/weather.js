const argv = require("yargs").argv;
const colors = require("colors");
const fs = require("fs");
const path = require("path");
const city = require("../city/index.js");
const utils = require("../config/utils.js");
const flattenArr = utils.flattenArr;
const getFutureWeatherDate = utils.getFutureWeatherDate;
const weekDayInfo = utils.weekDayInfo;
const uniqueDate = utils.uniqueDate;
const axioFortyDayWeatherUrl = utils.axioFortyDayWeatherUrl;
const filterWeatherDataMonth = utils.filterWeatherDataMonth;
const stdoutMessage = utils.stdoutMessage;
const tableDraw = utils.tableDraw;
const tableDrawHourly = utils.tableDrawHourly;
const tableDrawFifteen = utils.tableDrawFifteen;
const tableDrawForty = utils.tableDrawForty;
const wraperAxiosNow = utils.wraperAxiosNow;
const wraperAxiosWarn = utils.wraperAxiosWarn;
const wraperAxiosHour = utils.wraperAxiosHour;
const wraperAxiosAir = utils.wraperAxiosAir;
const wraperAxiosSeven = utils.wraperAxiosSeven;
const wraperAxiosSevenSimple = utils.wraperAxiosSevenSimple;
const wraperAxiosFifteen = utils.wraperAxiosFifteen;
const wraperAxiosForty = utils.wraperAxiosForty;
const wraperAxiosFortyProxy = utils.wraperAxiosFortyProxy;
const tableDrawToday = utils.tableDrawToday;
const tableDrawTodayHourly = utils.tableDrawTodayHourly;
const carLimitNumber = utils.carLimitNumber;

let cityCode = typeof argv.c == "number" ? argv.c : city[argv.c];
let outFormatJson = argv.json || argv.j;
let outFormatTable = argv.table || argv.t;
let day = argv.day || argv.d;
let weatherHourly = argv.hourly;
let weatherDate = argv.date;
let weatherDouwnload = argv.download; // table-txt  json-json

let weatherDataFile = argv.outfile || "./";

let dirs = path.join(process.cwd(), "logs");
if (!fs.existsSync(dirs)) {
  fs.mkdirSync(dirs);
}

let fileName = new Date().getTime();
let dir = dirs + "/" + fileName + ".txt";

if (!cityCode || cityCode == "") {
  process.stdout.write(
    colors.red(
      " City code  or city name must be necessary or cityname or citycode is invalid"
    )
  );
  process.exit(0);
}

if (outFormatJson && outFormatTable) {
  process.stdout.write(colors.red("stdout can use only one way  -t or -j "));
  process.exit(0);
}

if (outFormatJson == undefined && outFormatTable == undefined) {
  outFormatTable = true;

  if (!weatherHourly && !weatherDate) {
    process.stdout.write(
      colors.red(" --hourly --date must be necessary together")
    );
    process.exit(0);
  }
}

const Weather = {
  init: function () {
    if (!day || day == 1) {
      this.todayData();
    } else if (day == 7) {
      this.sevenData();
    } else if (day == 15) {
      this.fifteenData();
    } else if (day == 40) {
      this.fortyData();
    }
  },

  todayData: function () {
    let now = wraperAxiosNow(cityCode);
    let warn = wraperAxiosWarn(cityCode);
    let hour = wraperAxiosHour(cityCode);
    let air = wraperAxiosAir(cityCode);
    let car = carLimitNumber(cityCode);
    return Promise.all([now, warn, hour, air, car])
      .then((results) => {
        results[0].limitnumber = results[4].reallimitnumber;
        let succes = {
          msg: "操作成功",
          code: 200,
          data: {
            ...results[0],
            ...results[1],
            ...results[2],
            ...results[3],
          },
        };
        if (outFormatJson) {
          console.log("\r");
          stdoutMessage(succes);
          console.log("\r");
        }

        if (outFormatTable) {
          console.log("\r");
          console.log(colors.magenta("**********实时天气预报实况**********"));
          console.log("\r");
          tableDrawToday(succes.data);
          console.log("\r");
        }

        if (outFormatTable && weatherHourly) {
          console.log("\r");
          console.log(
            colors.magenta("**********24小时逐小时天气预报**********")
          );
          console.log("\r");
          tableDrawTodayHourly(succes.data.forecastList);
          console.log("\r");
        }

        function writeFile(file, data, encoding) {
          return new Promise((resolve, reject) => {
            fs.writeFile(file, data, encoding, (error) =>
              error ? reject(error) : resolve()
            );
          });
        }

        if (weatherDouwnload) {
          writeFile(dir, JSON.stringify(succes, null, 3), "utf-8")
            .then((data) => {
              console.log("\r\n");
              console.log("文件数据下载成功");
              process.exit(0);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch(function (error) {
        if (error && outFormatTable) {
          console.log(
            colors.red(
              (error && error.message) || "请检查网络是否通畅，稍后重试"
            )
          );
        }
        if (error && outFormatJson) {
          let hasError = error || {
            msg: (error && error.message) || "服务器内部错误",
            code: (error && error.code) || 500,
          };
          stdoutMessage(hasError);
          console.log("\r");
        }
      });
  },
  sevenData: function () {
    return wraperAxiosSeven(cityCode)
      .then((results) => {
        let data = results.list;
        if (outFormatTable) {
          if (weatherHourly && weatherDate) {
            console.log("\r");
            console.log(
              colors.magenta("**********天气预报逐小时天气预报**********")
            );
            console.log("\r");
            tableDrawHourly(data, weatherDate);
            console.log("\r");
          } else {
            console.log("\r");
            console.log(colors.magenta("**********7天天气预报**********"));
            console.log("\r");
            tableDraw(data);
            console.log("\r");
          }
        }

        if (outFormatJson) {
          let succes = {
            msg: "操作成功",
            code: 200,
            data: {
              ...results,
            },
          };
          console.log("\r");
          stdoutMessage(succes);
          console.log("\r");
        }
      })
      .catch(function (error) {
        if (error && outFormatTable) {
          console.log(
            colors.red(
              (error && error.message) || "请检查网络是否通畅，稍后重试"
            )
          );
        }
        if (error && outFormatJson) {
          let hasError = error || {
            msg: (error && error.message) || "服务器内部错误",
            code: (error && error.code) || 500,
          };
          stdoutMessage(hasError);
          console.log("\r");
        }
      });
  },
  fifteenData: function () {
    const sevenData = wraperAxiosSevenSimple(cityCode);
    const fifteenData = wraperAxiosFifteen(cityCode);
    return Promise.all([sevenData, fifteenData])
      .then((results) => {
        let concatData = results[0].list.concat(results[1].listFifteen);
        let futureDate = [];
        for (var i = 0; i < 15; i++) {
          futureDate.push(
            getFutureWeatherDate(i) + " " + weekDayInfo(getFutureWeatherDate(i))
          );
        }

        //组装 weatherDate
        concatData.forEach(function (item, index, arr) {
          arr[index]["weatherDate"] = futureDate[index];
        });

        let succes = {
          msg: "操作成功",
          code: 200,
          data: {
            list: concatData,
            uptime: results[0].uptime,
          },
        };

        if (outFormatJson) {
          console.log("\r");
          stdoutMessage(succes);
          console.log("\r");
        }

        if (outFormatTable) {
          console.log("\r");
          console.log(colors.magenta("**********15天天气预报**********"));
          console.log("\r");
          tableDrawFifteen(concatData);
          console.log("\r");
        }
      })
      .catch(function (error) {
        if (error && outFormatTable) {
          console.log(
            colors.red(
              (error && error.message) || "请检查网络是否通畅，稍后重试"
            )
          );
        }
        if (error && outFormatJson) {
          let hasError = error || {
            msg: (error && error.message) || "服务器内部错误",
            code: (error && error.code) || 500,
          };
          stdoutMessage(hasError);
          console.log("\r");
        }
      });
  },
  fortyData: function () {
    let fortyWeatherDate = [];
    let fortyWeatherData = [];
    for (let i = 0; i < 40; i++) {
      fortyWeatherDate.push(
        getFutureWeatherDate(i) + " " + weekDayInfo(getFutureWeatherDate(i))
      );
      fortyWeatherData.push(getFutureWeatherDate(i));
    }
    let promiseList = axioFortyDayWeatherUrl(
      cityCode,
      uniqueDate(fortyWeatherData)
    ).resassemble; //40 天分 最多三个数组 最少两个数组
    let data = [];
    for (let i = 0; i < promiseList.length; i++) {
      data.push(
        wraperAxiosForty(
          cityCode,
          promiseList[i]["year"],
          promiseList[i]["month"]
        )
      );
    }

    return Promise.all(data)
      .then((results) => {
        // console.log(results[0].listFortyData.length) //35 11月份
        // console.log(results[1].listFortyData.length) //42 12月份 取这个
        // console.log(results[2].listFortyData.length) //35 01月份
        let originWeatherDayData = [];
        for (let i = 0; i < results.length; i++) {
          if (results[i].listFortyData.length) {
            let tempData = filterWeatherDataMonth(results[i].listFortyData);
            originWeatherDayData.push(tempData);
          }
        }

        //二维数组扁平 去重 去除引用类型
        let hash = {};
        originWeatherDayData = flattenArr(originWeatherDayData).reduce(
          function (item, next) {
            hash[next.date] ? "" : (hash[next.date] = true && item.push(next));
            return item;
          },
          []
        );

        //组装日期
        originWeatherDayData &&
          originWeatherDayData.forEach((item, index, arr) => {
            item["weatherDate"] = fortyWeatherDate[index];
          });
        let succes = {
          msg: "操作成功",
          code: 200,
          data: {
            list: originWeatherDayData,
          },
        };

        if (outFormatJson) {
          console.log("\r");
          stdoutMessage(succes);
          console.log("\r");
        }

        if (outFormatTable) {
          console.log("\r");
          // console.log(JSON.stringify(originWeatherDayData, null, 3))
          console.log(colors.magenta("**********40天天气预报**********"));
          console.log("\r");
          tableDrawForty(originWeatherDayData);
          console.log("\r");
        }
      })
      .catch(function (error) {
        if (error && outFormatTable) {
          console.log(
            colors.red(
              (error && error.message) || "请检查网络是否通畅，稍后重试"
            )
          );
        }
        if (error && outFormatJson) {
          let hasError = error || {
            msg: (error && error.message) || "服务器内部错误",
            code: (error && error.code) || 500,
          };
          stdoutMessage(hasError);
          console.log("\r");
        }
      });
  },
};

module.exports = Weather;
