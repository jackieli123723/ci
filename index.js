//https://npm.runkit.com/goods-spider/libs/taobao.js?t=1572267662331

const axios = require('axios')
const cheerio = require('cheerio')
function trim(str){
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
axios.get('http://www.weather.com.cn/weathern/101010100.shtml')
    .then(function (response) {
      const $ = cheerio.load(response.data,{ decodeEntities:false})

      let data = [];
      let weatherInfo = [];
      let temperatureData = [];
      let dayHour = [];
      let dayHourList = []

      

      $('.date-container li').each(function(item,indx,arr){
      	    let $this = $(this);
      	    let index = $this.index();
            if(index > 0){
            	  data.push({
	              date : trim($this.find(".date").text()),
	              dateInfo:trim($this.find(".date-info").text())
	            });
            } 
      })

      $(".blue-container .blue-item").each(function(item,indx,arr){
            let $this = $(this);
      	    let index = $this.index();
            if(index > 0){
            	  weatherInfo.push({
            	  weatherStart:$this.find(".item-icon").eq(0).attr("title"),
            	  weatherEnd:$this.find(".item-icon").eq(1).attr("title"),
	              weatherInfo:trim($this.find(".weather-info").text()),
	              windStart:$this.find(".wind-container").find(".wind-icon").eq(0).attr("title"),
                  windEnd:$this.find(".wind-container").find(".wind-icon").eq(1).attr("title"),
	              windInfo:trim($this.find(".wind-info").text())
	            });
            } 
      })

      //温度
      let temperature = $(".blueFor-container script").html()
      .replace("var eventDay =","")
      .replace("var eventNight =","")
      .replace("var fifDay =","")
      .replace("var fifNight =","")
      .replace("var sunup =","")
      .replace("var sunset =","")
      .replace("var blue =","")
      .replace(/\n/g, "")
      .split(";")
      
      temperature.pop()
      temperatureData.push(temperature)

     
     // console.log(JSON.stringify(temperature,null,4),temperature.length);
      // .blueFor-container script

      //.details-container script 所有的绘制每隔1小时 3小时的数据
       
      let hourDot = $(".details-container script").html()
      .replace("var hour3data=","")
      .split(";")

   
     // console.log(JSON.stringify(hourDot,null,4),hourDot.length);

      //content-container scroll-container ul li 每天的24小时天气预报 每个点打点 

      $(".details-houers-container").eq(0).find("li").each(function(item,indx,arr){
            let $this = $(this);
             dayHourList.push({
            	  time:$this.text()
	         });
            
      })

      //hour3data 这个数据在变的 

      $(".weather_7d .houers-container").eq(0).find("li").each(function(item,indx,arr){
                 let $this = $(this);
             dayHour.push({
            	  time:$this.text()
	         });
            
      })


      // console.log($(".details-container script").html()) 

     // console.log($(".details-container script").html(),"\n\n")
      // console.log(data)
      // console.log(weatherInfo)
      // console.log(temperatureData)
      //  console.log(JSON.stringify(temperatureData,null,4),temperatureData.length);

      // <div id="drawO"/>
      // <div id= "drawT"/>
      //没有svg dom节点 

      //注意js 注入 抓不到 
        //      $(".details-houers-container").empty().html(y.join("")),
        // $(".houers-container").empty().html(x.join(""))

      console.log(data,dayHourList,dayHour,$(".houers-container").html())

})
.catch(function (error) {
  console.log(error);
}); 

//   var HOST = "wis.qq.com";
// function getCityId(province, city, district) {
//         var interface = "//" + HOST + "/city/getcode?source=pc";

//         return new Promise(function(resolve, reject) {
//             getData(encodeURI(interface + "&province=" + province + "&city=" + city + "&county=" + district), function(data) {
//                 if (data.status == "200") {
//                     resolve(data.data);
//                 }
//             })
//         });
// }
