#!/usr/bin/env node


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// /!\ author:jackieli /!\
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


const chalk = require('chalk');


if (!process.argv[2]) {
  console.log(chalk.green('Weather ~ ' + require('../package').version));
  console.log(chalk.red('Grabbing Weather Forecast Data'));
  console.log(chalk.cyan('  $ ') + 'fanyi word');
  console.log(chalk.cyan('  $ ') + 'fanyi world peace');
  console.log(chalk.cyan('  $ ') + 'fanyi chinglish');
  return;
}




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


//mdcli 

// if (require.main === module) {
//   cli.run();
// }

// module.exports = cli;
// 


