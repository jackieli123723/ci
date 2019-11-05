function trim(str){
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

function trimdot(str){
    return str.replace(/(^"*)|("$)/g, "");
}

function temperatureScriptData(str){
    let result = [];
    let temperature = str && str.replace("var eventDay =","")
          .replace("var eventNight =","")
          .replace("var fifDay =","")
          .replace("var fifNight =","")
          .replace("var sunup =","")
          .replace("var sunset =","")
          .replace("var blue =","")
          .replace(/\n/g, "")
          .split(";")
          
          temperature.pop()
          result.push(temperature)
          return result[0]
}        
 
function getClothes(str){
    //这里要区分其它指标 
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


function getLife(indexs,context){
    var $ = context
    var date = $('.shzsSevenDay ul li').eq(indexs).text()
    return date

}
function getLv(indexs,context){
    var $ = context
    var shzs =  $(".weather_shzs .lv").eq(indexs)
    var obj = {}
        obj["uv"] = []
        obj["gm"] = []
        obj["bl"] = []
        obj["cy"] = []
        obj["xc"] = []
        obj["ks"] = []
        let dlArr = []
        for(var i=0;i<6;i++){
           if(i !== 3){
               dlArr.push({
                "level":shzs.find("dl").eq(i).find("em").text(),
                "stars":shzs.find("dl").eq(i).find("p").find("i.active").length,
                "info":shzs.find("dl").eq(i).find("dd").text()
               })
           }else{
                dlArr.push({
                "level":getClothes(shzs.find("dl").eq(i).find("em").text()),
                "stars":shzs.find("dl").eq(i).find("p").find("i.active").length,
                "info":shzs.find("dl").eq(i).find("dd").text()
               })
           }
        }   
        obj["uv"] = dlArr[0]
        obj["gm"] = dlArr[1]
        obj["bl"] = dlArr[2]
        obj["cy"] =dlArr[3]
        obj["xc"] = dlArr[4]
        obj["ks"] = dlArr[5]
       
        return obj
}



function flatten (arr, curr) {
  if (Array.isArray(curr)) {
    arr.push(...curr)
  } else {
    arr.push(curr)
  }
  return arr
}

function jsonToObj(t){
     var e = "";
    return JSON.parse && (e = JSON.parse(t))
}

function getDegree(arr,index){
    return arr[index]
}


 function intervalData(t, a) {
        var e = [];
        var temp = {};
            temp['itemOne'] = a['itemOne']
            temp['wather'] = a['wather']
            temp['windDY'] = a['windDY']
            temp['windJB'] = a['windJB']
            temp['degree'] = a['degree'] //每个时段的温度绘制曲线
            temp['time'] = a['time']

        e.push(temp)
        return e
    }
    function timeFormat(t, a) {
        return a.time + "时"
    }
   function sourceData(t) {
        for (var a = [], e = ["无持续风向", "东北风", "东风", "东南风", "南风", "西南风", "西风", "西北风", "北风", "旋转风"], i = ["<3级", "3-4级", "4-5级", "5-6级", "6-7级", "7-8级", "8-9级", "9-10级", "10-11级", "11-12级"], n = 0; n < t.length; n++) {
            var r = t[n]
              , s = {}
              , l = r["jf"].slice(8, 10);
            s["time"] = l,
            s["degree"] = r.jb,
            s["wather"] = l > 5 && 20 > l ? "d" + r.ja : "n" + r.ja,
            s["windDY"] = e[r.jd],
            s["windJB"] = i[r.jc],
            s["itemOne"] = n % 2 ? "item-one" : "",
            a.push(s)
        }
        // console.log(a)
        return a
    }


    function getPerTimeList(s){
        var n = s.length
        for (var g = sourceData(s), y = [], x = [], b = 0; n > b; b++)
                y.push(intervalData(b, g[b])),
                x.push(timeFormat(b, g[b]));
                return {
                    timeData:x,
                    drgeeData:y.reduce(flatten, [])
                }
    }
        
module.exports = {
    trim: trim,
    trimdot: trimdot,
    temperatureScriptData:temperatureScriptData,
    getClothes:getClothes,
    getLife:getLife,
    getLv:getLv,
    flatten:flatten,
    jsonToObj:jsonToObj,
    getDegree:getDegree,
    intervalData:intervalData,
    timeFormat:timeFormat,
    sourceData:sourceData,
    getPerTimeList:getPerTimeList
};
