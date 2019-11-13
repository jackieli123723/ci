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

var Table = require('cli-table3');
var table = new Table({ head: [] });
 
table.push(
    { 'Left Header 1': ['Value Row 1 Col 1','Value Row 1 Col 1'] }
  , { 'Left Header 2': ['Value Row 2 Col 1', 'Value Row 2 Col 2'] }
  
);
 
console.log(table.toString());