const fs = require("fs")
const path = require("path")


const paths =  path.resolve(__dirname, './city/json');

let result = []

fs.readdir(paths,function(err,files){
	if(err){
		console.log(err)
		return
	}


	files.forEach(function(file) {
		var srcPath = path.join(paths, file)
        
          fs.readFile(srcPath,'utf-8',function(err,data){
		    if(err) {
		    console.log(err);
		    return
		    }
		    console.log(data)

		  }) 

		  // var data = fs.readFileSync(srcPath,'utf-8')

		  // result.push(JSON.parse(data))
		  // console.log(result)
		  
    })
 
}) 




