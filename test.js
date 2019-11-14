// var request = require('request');
// var options = {
//   url: 'http://jisutqybmf.market.alicloudapi.com/weather/query?cityid=24',
//   headers: {
//     'Authorization': 'APPCODE 3a3f7632d175489d8ea054970050b6a4'
//   }
// };
// function callback(error, response, body) {
//   if (!error && response.statusCode == 200) {
//     var info  = JSON.parse(body)
//     var allweather = info.result;
//     var city = allweather.city,
//         date = allweather.date,
//         week = allweather.week,
//         nowtemp = allweather.temp;
//     console.log("现在是天气预报时间:今天是",date,week);
//     console.log(city,"的温度是",nowtemp);
//   }
// }
// request(options, callback);

//has color
// const chalk = require('chalk')
// const colors = require('colors')

// var Table = require('cli-table3');
// var table = new Table({
//         head: ['Rank', 'Name', 'Symbol','Rank', 'Name', 'Symbol', 'Rank', 'Name', 'Symbol',
//             { hAlign:'center', content:' (USD)' }, 
//             { hAlign:'center', content:' Cap (USD)' }, 
//             { hAlign:'center', content:' (24h)' }
//         ]
//     });

//  const row = [ '1',
//   'Bitcoin',
//   'BTC',
//    'Bitcoin',
//   'BTC',
//    'Bitcoin',
//      'Bitcoin',
//   'BTC',
//    'Bitcoin',
//   { hAlign: 'right', content: colors.rainbow('1111') },
//   { hAlign: 'right', content: '$158,0' },
//   { hAlign: 'right', content: '\u001b[31m-0.21 %\u001b[39m' } ]

// table.push(row)

// console.log(chalk.green(table.toString()));

//max 12 列 

const chalk = require('chalk')
const colors = require('colors')

var Table = require('cli-table3');
var table = new Table({
        head: ['属性', '数值']
    });

 const row = [
   colors.rainbow('1111') ,colors.green('1111')
 ]

table.push(
    ['更新时间', '16:03']
  , ['平均温度', '5度']
);

console.log(chalk.green(table.toString()));

// 更新时间 16:03
// 平均温度  5度
// 最高温度 8度
// 最低温蒂 -3度 
// 空气质量 34/优秀
// 可吸入颗粒物(PM10) 82μg/m3
// 细颗粒物(PM2.5) 30μg/m3
// 一氧化碳(CO) 30mg/m3
// 二氧化氮(NO2) 30μg/m3
// 二氧化硫(SO2) 30μg/m3
// 预警 大风/寒潮  （可选）
// 风力 北风3级
// 空气湿度 16%
// 车辆限行 5和0 
// 今日日落 17:01 
// 明日日出 06:56
// 紫外线 中等
// 减肥 一颗星
// 血糖  易波动
// 穿衣  羽绒服
// 洗车   适宜
// 空气污染扩散 良





