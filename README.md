
lenovo@lenovo-PC MINGW64 /e/jackieli/node-code-write-练习/node-cli-weather
$ node ./bin/weaher.js
Weather ~ 1.0.0
Grabbing Weather Forecast Data
  $ fanyi word
  $ fanyi world peace
  $ fanyi chinglish

lenovo@lenovo-PC MINGW64 /e/jackieli/node-code-write-练习/node-cli-weather
$ npm install -g





###

function deployHelper() {
  console.log('');
  console.log('-----> Helper: Deployment with PM2');
  console.log('');
  console.log('  Generate a sample ecosystem.config.js with the command');
  console.log('  $ pm2 ecosystem');
  console.log('  Then edit the file depending on your needs');
  console.log('');
  console.log('  Commands:');
  console.log('    setup                run remote setup commands');
  console.log('    update               update deploy to the latest release');
  console.log('    revert [n]           revert to [n]th last deployment or 1');
  console.log('    curr[ent]            output current release commit');
  console.log('    prev[ious]           output previous release commit');
  console.log('    exec|run <cmd>       execute the given <cmd>');
  console.log('    list                 list previous deploy commits');
  console.log('    [ref]                deploy to [ref], the "ref" setting, or latest tag');
  console.log('');
  console.log('');
  console.log('  Basic Examples:');
  console.log('');
  console.log('    First initialize remote production host:');
  console.log('    $ pm2 deploy ecosystem.config.js production setup');
  console.log('');
  console.log('    Then deploy new code:');
  console.log('    $ pm2 deploy ecosystem.config.js production');
  console.log('');
  console.log('    If I want to revert to the previous commit:');
  console.log('    $ pm2 deploy ecosystem.config.js production revert 1');
  console.log('');
  console.log('    Execute a command on remote server:');
  console.log('    $ pm2 deploy ecosystem.config.js production exec "pm2 restart all"');
  console.log('');
  console.log('    PM2 will look by default to the ecosystem.config.js file so you dont need to give the file name:');
  console.log('    $ pm2 deploy production');
  console.log('    Else you have to tell PM2 the name of your ecosystem file');
  console.log('');
  console.log('    More examples in https://github.com/Unitech/pm2');
  console.log('');
};

module.exports = function(CLI) {
  CLI.prototype.deploy = function(file, commands, cb) {
    var that = this;

    if (file == 'help') {
      deployHelper();
      return cb ? cb() : that.exitCli(cst.SUCCESS_EXIT);
    }

 ###   要解决的问题 cheerio 抓取svg    


 ####

 #!/usr/bin/env node
 

 ### weather 1天 7天 8-15天 40天 


衍生到小程序上 接口 ？

通过定位到微信上的location 来获取城市的天气预报 



//通过 参数 控制 返回 proxy 接口 


### 隐射表 
https://github.com/florije1988/cool_weather/blob/6ff6d83205568a4e757c36ea5c3a84ead37ccf50/README.md



http://www.weather.com.cn/weather/101280601.shtml 深圳 7天 
http://www.weather.com.cn/weather1d/101280601.shtml 深圳 1天
http://www.weather.com.cn/weather15d/101280601.shtml 深圳 15天
http://www.weather.com.cn/weather40d/101280601.shtml 深圳 40天




http://www.weather.com.cn/weather40d/101270101.shtml 成都
http://www.weather.com.cn/weather/101010100.shtml 北京  



## 新版 
http://www.weather.com.cn/weather1dn/101010100.shtml
http://www.weather.com.cn/weathern/101010100.shtml
http://www.weather.com.cn/weather15dn/101010100.shtml
http://www.weather.com.cn/weather40dn/101010100.shtml

## 天气预报 
101270101

###weixin

  "ad_info": {
            "nation_code": "156",
            "adcode": "510107",
            "city_code": "156510100",
            "name": "中国,四川省,成都市,武侯区",
            "location": {
                "lat": 30.64242,
                "lng": 104.043114
            },
            "nation": "中国",
            "province": "四川省",
            "city": "成都市",
            "district": "武侯区"
        },


上面的需要做一个转换 

微信定位你的cityCODE =-==>>> 天气预报的citycode 

  "uv":"",//紫外线
                  "gm":"",//减肥
                  "bl":"",//健臻·血糖
                  "cy":"",//穿衣    
                  "xc":"",//洗车
                  "ks":""//空气污染扩散


### 破解算法 重新组装 
    function e(t, a) {
        var e = [];
        var temp = {};
            temp.itemOne = a.itemOne
            temp.wather = a.wather
            temp.windDY = a.windDY
            temp.windJB = a.windJB

        e.push(temp)
        return e
    }
    function i(t, a) {
        return a.time + "时"
    }
   function a(t) {
        for (var a = [], e = ["无持续风向", "东北风", "东风", "东南风", "南风", "西南风", "西风", "西北风", "北风", "旋转风"], i = ["<3级", "3-4级", "4-5级", "5-6级", "6-7级", "7-8级", "8-9级", "9-10级", "10-11级", "11-12级"], n = 0; n < t.length; n++) {
            var r = t[n]
              , s = {}
              , l = r.jf.slice(8, 10);
            s.time = l,
            s.template = r.jb,
            s.wather = l > 5 && 20 > l ? "d" + r.ja : "n" + r.ja,
            s.windDY = e[r.jd],
            s.windJB = i[r.jc],
            s.itemOne = n % 2 ? "item-one" : "",
            a.push(s)
        }
        console.log(a)
        return a
    }
  
  var n =8;
  var s = [
    {
    "ja": "01",
    "jb": "15",
    "jc": "0",
    "jd": "0",
    "je": "93",
    "jf": "2019110308"
    },
    {
    "ja": "01",
    "jb": "18",
    "jc": "0",
    "jd": "2",
    "je": "74",
    "jf": "2019110311"
    },
    {
    "ja": "01",
    "jb": "21",
    "jc": "0",
    "jd": "0",
    "je": "56",
    "jf": "2019110314"
    },
    {
    "ja": "01",
    "jb": "21",
    "jc": "0",
    "jd": "1",
    "je": "49",
    "jf": "2019110317"
    },
    {
    "ja": "01",
    "jb": "18",
    "jc": "0",
    "jd": "0",
    "je": "72",
    "jf": "2019110320"
    },
    {
    "ja": "01",
    "jb": "16",
    "jc": "0",
    "jd": "1",
    "je": "74",
    "jf": "2019110323"
    },
    {
    "ja": "01",
    "jb": "14",
    "jc": "0",
    "jd": "0",
    "je": "76",
    "jf": "2019110402"
    },
    {
    "ja": "07",
    "jb": "14",
    "jc": "0",
    "jd": "1",
    "je": "82",
    "jf": "2019110405"
    }
  ]
  
    for (var g = a(s), y = [], x = [], b = 0; n > b; b++)
            y.push(e(b, g[b])),
            x.push(i(b, g[b]));
        $(".details-houers-container").empty().html(y.join("")),
        $(".houers-container").empty().html(x.join(""));


        x
["<li class="houer-item active">08时</li>", "<li class="houer-item">11时</li>", "<li class="houer-item">14时</li>", "<li class="houer-item">17时</li>", "<li class="houer-item">20时</li>", "<li class="houer-item">23时</li>", "<li class="houer-item">02时</li>", "<li class="houer-item">05时</li>"]


y
(8) ["<li class="details-item "><i class="item-icon hous…d-info">无持续风向</p><p class="wind-js"><3级</p> </li>", "<li class="details-item item-one"><i class="item-i…wind-info">东风</p><p class="wind-js"><3级</p> </li>", "<li class="details-item "><i class="item-icon hous…d-info">无持续风向</p><p class="wind-js"><3级</p> </li>", "<li class="details-item item-one"><i class="item-i…ind-info">东北风</p><p class="wind-js"><3级</p> </li>", "<li class="details-item "><i class="item-icon hous…d-info">无持续风向</p><p class="wind-js"><3级</p> </li>", "<li class="details-item item-one"><i class="item-i…ind-info">东北风</p><p class="wind-js"><3级</p> </li>", "<li class="details-item "><i class="item-icon hous…d-info">无持续风向</p><p class="wind-js"><3级</p> </li>", "<li class="details-item item-one"><i class="item-i…ind-info">东北风</p><p class="wind-js"><3级</p> </li>"]

 .details-container .content-container .scroll-container .details-houers-container .item-one {
    background-color: #fbfbfb;
}

 itemOne: "" ？？ 这个是控制奇数偶数列 背景颜色 
template: "15" 时间点的天气温度
time: "08" 24小时时间点 
wather: "d01" icon 样式  
windDY: "无持续风向" 
windJB: "<3级"




 ### hour3data 的数据格式是7个数组 
 分别长度 12 24 24 16 8 8 8



    function e(t, a) {
        var e = "";
        return e += '<li class="details-item ' + a.itemOne + '">' + '<i class="item-icon housr_icons ' + a.wather + '"></i>' + '<div class="curor"></div>' + '<p class="wind-info">' + a.windDY + "</p>" + '<p class="wind-js">' + a.windJB + "</p> " + "</li>"
    }
    function i(t, a) {
        return 0 === t ? '<li class="houer-item active">' + a.time + "时</li>" : '<li class="houer-item">' + a.time + "时</li>"
    }
   function a(t) {
        for (var a = [], e = ["无持续风向", "东北风", "东风", "东南风", "南风", "西南风", "西风", "西北风", "北风", "旋转风"], i = ["<3级", "3-4级", "4-5级", "5-6级", "6-7级", "7-8级", "8-9级", "9-10级", "10-11级", "11-12级"], n = 0; n < t.length; n++) {
            var r = t[n]
              , s = {}
              , l = r.jf.slice(8, 10);
            s.time = l,
            s.template = r.jb,
            s.wather = l > 5 && 20 > l ? "d" + r.ja : "n" + r.ja,
            s.windDY = e[r.jd],
            s.windJB = i[r.jc],
            s.itemOne = n % 2 ? "item-one" : "",
            a.push(s)
        }
        return a
    }
  
  var n =8;
  var s = [
    {
    "ja": "01",
    "jb": "15",
    "jc": "0",
    "jd": "0",
    "je": "93",
    "jf": "2019110308"
    },
    {
    "ja": "01",
    "jb": "18",
    "jc": "0",
    "jd": "2",
    "je": "74",
    "jf": "2019110311"
    },
    {
    "ja": "01",
    "jb": "21",
    "jc": "0",
    "jd": "0",
    "je": "56",
    "jf": "2019110314"
    },
    {
    "ja": "01",
    "jb": "21",
    "jc": "0",
    "jd": "1",
    "je": "49",
    "jf": "2019110317"
    },
    {
    "ja": "01",
    "jb": "18",
    "jc": "0",
    "jd": "0",
    "je": "72",
    "jf": "2019110320"
    },
    {
    "ja": "01",
    "jb": "16",
    "jc": "0",
    "jd": "1",
    "je": "74",
    "jf": "2019110323"
    },
    {
    "ja": "01",
    "jb": "14",
    "jc": "0",
    "jd": "0",
    "je": "76",
    "jf": "2019110402"
    },
    {
    "ja": "07",
    "jb": "14",
    "jc": "0",
    "jd": "1",
    "je": "82",
    "jf": "2019110405"
    }
  ]
  
    for (var g = a(s), y = [], x = [], b = 0; n > b; b++)
            y.push(e(b, g[b])),
            x.push(i(b, g[b]));