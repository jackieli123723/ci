const Koa = require("koa");
const Router = require("koa-router");
const Cors = require("@koa/cors");
const app = new Koa();
const router = new Router();
const port = process.env.PORT || 4003;
const utils = require("./config/utils");

const flattenArr = utils.flattenArr;
const getFutureWeatherDate = utils.getFutureWeatherDate;
const weekDayInfo = utils.weekDayInfo;
const uniqueDate = utils.uniqueDate;
const axioFortyDayWeatherUrl = utils.axioFortyDayWeatherUrl;
const filterWeatherDataMonth = utils.filterWeatherDataMonth;
const wraperAxiosNow = utils.wraperAxiosNow;
const wraperAxiosWarn = utils.wraperAxiosWarn;
const wraperAxiosHour = utils.wraperAxiosHour;
const wraperAxiosAir = utils.wraperAxiosAir;
const wraperAxiosSeven = utils.wraperAxiosSeven;
const wraperAxiosSevenSimple = utils.wraperAxiosSevenSimple;
const wraperAxiosFifteen = utils.wraperAxiosFifteen;
const wraperAxiosForty = utils.wraperAxiosForty;
const carLimitNumber = utils.carLimitNumber;

global.errorHandlerCodeStatus = {
  OK: 200,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  RequestTimeout: 408,
  Gone: 410,
  UnprocessableEntity: 422,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
};

process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

process.on("uncaughtException", function (e) {
  console.log(e);
});

//跨域
app.use(Cors());

//需求 把不存在的路由 也返回json
const handler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.response.status = err.statusCode || err.status || 500;
    ctx.response.body = {
      code: ctx.response.status,
      msg: err.message,
    };
    ctx.app.emit("error", err, ctx); //try catch 捕获了 使用ctx.app.emit()手动释放error事件，才能让监听函数监听到
  }
};

// 错误捕获 4xx or 5xx status codes
const errorHandler = async (ctx, next) => {
  await next();
  //way1
  const originStatus = ctx.status;
  const errorCodeList = Object.values(global.errorHandlerCodeStatus);
  let code = errorCodeList.filter((item) => {
    return item === parseInt(originStatus);
  });
  //这里要排除正常请求 200
  if (originStatus !== 200 && code) {
    ctx.throw(code[0]);
  }
  //way2 分别判断if 太多了 不优雅
  // if(parseInt(ctx.status) === 404 ){
  //   ctx.throw(404)
  // }
  // if(parseInt(ctx.status) === 500 ){
  //   ctx.throw(500)
  // }
};

const main = (ctx) => {
  ctx.throw(502);
};

app.use(handler);
// app.use(main) //模拟抛出4xx or 5xx status codes
app.use(errorHandler);

//错误日志输出
app.on("error", (err, ctx) => {
  console.error("server error", err.message);
});

//api 版本
router.prefix("/v1/api");

//聚合  4个接口  拿到所有数据
router.get("/weather/1d/:cityCode", (ctx) => {
  const cityCode = parseInt(ctx.params.cityCode, 10);
  let now = wraperAxiosNow(cityCode);
  let warn = wraperAxiosWarn(cityCode);
  let hour = wraperAxiosHour(cityCode);
  let air = wraperAxiosAir(cityCode);
  let car = carLimitNumber(cityCode);

  return Promise.all([now, warn, hour, air, car])
    .then((results) => {
      results[0].limitnumber = results[4].reallimitnumber;
      ctx.body = {
        msg: "操作成功",
        code: 200,
        data: {
          ...results[0],
          ...results[1],
          ...results[2],
          ...results[3],
        },
      };
    })
    .catch(function (error) {
      console.log(error);
      ctx.body = error || {
        msg: "服务器内部错误",
        code: 500,
      };
    });
});

router.get("/weather/7d/:cityCode", (ctx) => {
  const cityCode = parseInt(ctx.params.cityCode, 10);
  return wraperAxiosSeven(cityCode)
    .then((results) => {
      ctx.body = {
        msg: "操作成功",
        code: 200,
        data: {
          ...results,
        },
      };
    })
    .catch(function (error) {
      console.log(error);
      ctx.body = error || {
        msg: "服务器内部错误",
        code: 500,
      };
    });
});

router.get("/weather/15d/:cityCode", (ctx) => {
  const cityCode = parseInt(ctx.params.cityCode, 10);
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

      ctx.body = {
        msg: "操作成功",
        code: 200,
        data: {
          list: concatData,
          uptime: results[0].uptime,
        },
      };
    })
    .catch(function (error) {
      console.log(error);
      ctx.body = error || {
        msg: "服务器内部错误",
        code: 500,
      };
    });
});

router.get("/weather/40d/:cityCode", (ctx) => {
  const cityCode = parseInt(ctx.params.cityCode, 10);
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

  // let nowTimeDate = getFutureWeatherDate(0)
  //   .split("-")
  //   .join("");
  // console.log("nowTimeDate", nowTimeDate);
  // console.log(fortyWeatherData);
  // console.log(promiseList, data);

  return Promise.all(data)
    .then((results) => {
      // console.log("有几个跨度月份", results.length);
      // console.log(results[0].listFortyData.length); //35 11月份
      // console.log(results[1].listFortyData.length); //42 12月份 取这个
      // console.log(results[2].listFortyData.length); //35 01月份
      // console.log(JSON.stringify(results, null, 3));
      let originWeatherDayData = [];
      for (let i = 0; i < results.length; i++) {
        if (results[i].listFortyData.length) {
          let tempData = filterWeatherDataMonth(results[i].listFortyData);
          originWeatherDayData.push(tempData);
        }
      }

      //二维数组扁平 去重 去除引用类型
      let hash = {};
      originWeatherDayData = flattenArr(originWeatherDayData).reduce(function (
        item,
        next
      ) {
        hash[next.date] ? "" : (hash[next.date] = true && item.push(next));
        return item;
      },
      []);

      //组装日期
      originWeatherDayData &&
        originWeatherDayData.forEach((item, index, arr) => {
          item["weatherDate"] = fortyWeatherDate[index];
        });
      ctx.body = {
        msg: "操作成功",
        code: 200,
        data: {
          list: originWeatherDayData,
          uptime: originWeatherDayData[0].time,
        },
      };
    })
    .catch(function (error) {
      console.log(error);
      ctx.body = error || {
        msg: "服务器内部错误",
        code: 500,
      };
    });
});

app
  // .use(require('koa-body')())
  .use(router.allowedMethods())
  .use(router.routes());

app.listen(port, () => {
  console.log(`西门互联天气预报接口启动${port}`);
});
