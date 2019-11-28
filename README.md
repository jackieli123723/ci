
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

    ###

    $ tianqi -c 成都 -t -d 15 ||  weather -c 成都 -t -d 15





 ###   要解决的问题 cheerio 抓取svg    


 ####

 #!/usr/bin/env node
 

 ### weather 1天 7天 8-15天 40天 


衍生到小程序上 接口 ？

通过定位到微信上的location 来获取城市的天气预报 



//通过 参数 控制 返回 proxy 接口 


### 隐射表 
https://github.com/florije1988/cool_weather/blob/6ff6d83205568a4e757c36ea5c3a84ead37ccf50/README.md

直辖市：北京、上海、天津、重庆，比较特殊，从station到cityinfo的步骤是在00前5位后加入县市的id然后再加00

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


###

上面这个就是我现在在用的，返回的数据最全面，也是绝大多数博客中都会介绍的。另外还有两个接口比较简洁。

http://www.weather.com.cn/data/sk/101010100.html 这个接口返回的数据是实况数据，像下面这样的。


{
    "weatherinfo": {
        "city": "北京", // 城市中文名
        "cityid": "101010100", // 城市 ID
        "temp": "24", // 温度
        "WD": "西南风", // 风向
        "WS": "1级", // 风力
        "SD": "92%", // 湿度
        "WSE": "1", // ?
        "time": "19:15", // 发布时间
        "isRadar": "1", // 是否有雷达图
        "Radar": "JC_RADAR_AZ9010_JB" // 雷达图编号，雷达图的地址在 http://www.weather.com.cn/html/radar/雷达图编号.shtml
    }
}
　　还有一个接口http://www.weather.com.cn/data/cityinfo/101010100.html 这个接口返回的数据如下。


{
    "weatherinfo": {
        "city": "北京", // 城市中文名
        "cityid": "101010100", // 城市 ID
        "temp1": "22℃", // ?
        "temp2": "31℃", // ?
        "weather": "阴转晴", // 天气
        "img1": "n2.gif", // ? 天气图标编号
        "img2": "d0.gif", // ? 天气图标编号
        "ptime": "18:00" // 发布时间
    }
}


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

var n=24

var s = hour3data[0]


### 破解算法 重新组装  考虑温度趋势 

    function e(t, a) {
        var e = [];
        var temp = {};
            temp.itemOne = a.itemOne
            temp.wather = a.wather
            temp.windDY = a.windDY
            temp.windJB = a.windJB
            temp.template = a.template

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

.details-container .content-container .scroll-container .details-houers-container .details-item .item-icon {
    width: 35px;
    height: 35px;
    display: block;
    margin: 0 auto;
}

.d00 {
    background-position: 0 0
}

.d01 {
    background-position: -78px 0
}

.d02 {
    background-position: -160px 0
}

.d03 {
    background-position: -240px 0
}

.d04 {
    background-position: -320px 0
}

.d05 {
    background-position: -400px 0
}

.d06 {
    background-position: -480px 0
}

.d07 {
    background-position: -560px 0
}

.d08 {
    background-position: -640px 0
}

.d09 {
    background-position: -720px 0
}

.d10 {
    background-position: -800px 0
}

.d11 {
    background-position: -880px 0
}

.d12 {
    background-position: 0 -80px
}

.d13 {
    background-position: -80px -80px
}

.d14 {
    background-position: -160px -80px
}

.n01 {
    background-position: -640px -240px;
}
.housr_icons {
    background: url(https://i.tq121.com.cn/i/weather2017/weather_icon_b.png) no-repeat;
}


 itemOne: "" ？？ 这个是控制奇数偶数列 背景颜色 
template: "15" 时间点的天气温度
time: "08" 24小时时间点 
wather: "d01" icon 样式  
windDY: "无持续风向" 
windJB: "<3级"

https://i.tq121.com.cn/i/weather2017/weather_icon_w.png

https://i.tq121.com.cn/i/weather2017/weather_icon_b.png
破解后 
x
 ["08时", "11时", "14时", "17时", "20时", "23时", "02时", "05时"]

y

"[
   [
      {
         "itemOne": "",
         "wather": "d01",
         "windDY": "无持续风向",
         "windJB": "<3级"
      }
   ],
   [
      {
         "itemOne": "item-one",
         "wather": "d01",
         "windDY": "东风",
         "windJB": "<3级"
      }
   ],
   [
      {
         "itemOne": "",
         "wather": "d01",
         "windDY": "无持续风向",
         "windJB": "<3级"
      }
   ],
   [
      {
         "itemOne": "item-one",
         "wather": "d01",
         "windDY": "东北风",
         "windJB": "<3级"
      }
   ],
   [
      {
         "itemOne": "",
         "wather": "n01",
         "windDY": "无持续风向",
         "windJB": "<3级"
      }
   ],
   [
      {
         "itemOne": "item-one",
         "wather": "n01",
         "windDY": "东北风",
         "windJB": "<3级"
      }
   ],
   [
      {
         "itemOne": "",
         "wather": "n01",
         "windDY": "无持续风向",
         "windJB": "<3级"
      }
   ],
   [
      {
         "itemOne": "item-one",
         "wather": "n07",
         "windDY": "东北风",
         "windJB": "<3级"
      }
   ]
]"






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

 ###穿衣建议破解

 ```
var ct = $("#cy dt").find("em").html(),
  ct_hint_num = "",
  ct_hint = "";
"炎热" == ct || "热" == ct ? (ct_hint_num = "cyIcon1",
    ct_hint = "短袖") : "舒适" == ct ? (ct_hint_num = "cyIcon2",
    ct_hint = "衬衫") : "较舒适" == ct ? (ct_hint_num = "cyIcon3",
    ct_hint = "薄外套") : "较冷" == ct ? (ct_hint_num = "cyIcon4",
    ct_hint = "厚毛衣") : (ct_hint_num = "cyIcon5",
    ct_hint = "羽绒服"),
  $(".weather_shzs ul li span.cy").addClass(ct_hint_num),
  $("#cy dt").find("em").html(ct_hint),

 ```
function getClothes(str){
    var clothes = ''
    switch(str){
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


console.log(getClothes("较冷"))


###

function flatten (arr, curr) {
  if (Array.isArray(curr)) {
    arr.push(...curr)
  } else {
    arr.push(curr)
  }
  return arr
}



  var arr = [ [ { itemOne: '',
      wather: 'd01',
      windDY: '无持续风向',
      windJB: '<3级',
      template: '15' } ],
  [ { itemOne: 'item-one',
      wather: 'd01',
      windDY: '东风',
      windJB: '<3级',
      template: '18' } ],
  [ { itemOne: '',
      wather: 'd01',
      windDY: '无持续风向',
      windJB: '<3级',
      template: '21' } ],
  [ { itemOne: 'item-one',
      wather: 'd01',
      windDY: '东北风',
      windJB: '<3级',
      template: '21' } ],
  [ { itemOne: '',
      wather: 'n01',
      windDY: '无持续风向',
      windJB: '<3级',
      template: '18' } ],
  [ { itemOne: 'item-one',
      wather: 'n01',
      windDY: '东北风',
      windJB: '<3级',
      template: '16' } ],
  [ { itemOne: '',
      wather: 'n01',
      windDY: '无持续风向',
      windJB: '<3级',
      template: '14' } ],
  [ { itemOne: 'item-one',
      wather: 'n07',
      windDY: '东北风',
      windJB: '<3级',
      template: '14' } ] ]


console.log(arr.reduce(flatten, []))

[ { itemOne: '',
    wather: 'd01',
    windDY: '无持续风向',
    windJB: '<3级',
    template: '15' },
  { itemOne: 'item-one',
    wather: 'd01',
    windDY: '东风',
    windJB: '<3级',
    template: '18' },
  { itemOne: '',
    wather: 'd01',
    windDY: '无持续风向',
    windJB: '<3级',
    template: '21' },
  { itemOne: 'item-one',
    wather: 'd01',
    windDY: '东北风',
    windJB: '<3级',
    template: '21' },
  { itemOne: '',
    wather: 'n01',
    windDY: '无持续风向',
    windJB: '<3级',
    template: '18' },
  { itemOne: 'item-one',
    wather: 'n01',
    windDY: '东北风',
    windJB: '<3级',
    template: '16' },
  { itemOne: '',
    wather: 'n01',
    windDY: '无持续风向',
    windJB: '<3级',
    template: '14' },
  { itemOne: 'item-one',
    wather: 'n07',
    windDY: '东北风',
    windJB: '<3级',
    template: '14' } ]

    ###
    lenovo@lenovo-PC MINGW64 /e/jackieli/node-code-write-练习/node-cli-weather (master)
$ node ./bin/weaher.js  -c 101270101
{
    "msg": "操作成功",
    "code": 200,
    "data": {
        "list": [
            {
                "date": "6日",
                "dateInfo": "今天",
                "day_weather": "晴",
                "night_weather": "晴",
                "weatherInfo": "晴",
                "day_wind": "无持续风向",
                "night_wind": "无持续风向",
                "windInfo": "<3级",
                "forecastList": [
                    {
                        "itemOne": "",
                        "wather": "d02",
                        "windDY": "无持续风向",
                        "windJB": "<3级",
                        "degree": "14",
                        "time": "08"
                    },
                    {
                        "itemOne": "item-one",

