function trim(str){
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

function trimdot(str){
    return str.replace(/(^"*)|("$)/g, "");
}

function temperatureScriptData(str){
    let result = [];
    let temperature =  str.replace("var eventDay =","")
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


        
module.exports = {
    trim: trim,
    trimdot: trimdot,
    temperatureScriptData:temperatureScriptData,
    getClothes:getClothes,
    getLife:getLife,
    getLv:getLv
};
