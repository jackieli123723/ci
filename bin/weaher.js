#!/usr/bin/env node

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// /!\ author:jackieli /!\
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const program = require('commander')
const chalk = require('chalk')
const version = require('../package').version
program
  .version(version, '-v, --version')
  .option('-c, --city', 'cityCode or cityName')
  .option('-j, --json', 'weather data stdout format is json')
  .option('-t, --table', 'weather data stdout format is table chart')
  .option('-d, --day', 'weather data is seven data default')
  .option('-hourly', 'weather data forecast is 24 hours per time is one data')
  .option('-date', 'weather data forecast is time Hourly forecast')


program.on('--help', function() {
  console.log('');
  console.log('Examples:');
  console.log('');
  console.log('  $ weather --help');
  console.log('  $ weather -h');
  console.log('  $ weather -c <cityName> -j')
  console.log('  $ weather -c <cityName> -t')
  console.log('  $ weather -c <cityName> -t -hourly -date 11-09')
});


program.parse(process.argv);

if(!program.args.length) program.help();

const weather = require('../lib/weather.js')
weather.sevenData()


// if (!process.argv[2]) {
//   console.log(chalk.green('Weather ~ ' + require('../package').version));
//   console.log(chalk.red('Grabbing Weather Forecast Data'));
//   console.log(chalk.cyan('  $ ') + 'wci -city 北京 -day 7');
//   console.log(chalk.cyan('  $ ') + 'wci -city 成都 -day 7 -d ./out');
//   console.log(chalk.cyan('  $ ') + 'wci -city 成都 -day 7 -chart');
//   return;
// }






// ## process.argv 参数
// 启动 Node.js 进程：
// // 打印 process.argv。
// process.argv.forEach((val, index) => {
//   console.log(`${index}: ${val}`);
// });
// $ node process-args.js one two=three four
// 输出如下：

// 0: /usr/local/bin/node node位置
// 1: /Users/mjr/work/node/process-args.js 执行文件位置
// 2: one
// 3: two=three
// 4: four

// 角标要从2开始 数组 

// ###
// const options = require('minimist')(process.argv.slice(2));



//

//weather --city chengdu || 028 

//weather --city chengdu --douwnload csv 导出数据写入文件  json


//weather --city  --chart 可视化 图片 

//weather -c 北京 -json 
//weather -c 北京 -table 

//mdcli 

// if (require.main === module) {
//   cli.run();
// }

// module.exports = cli;
// 


