const fs = require('fs');
const path = require("path");

const strAppend = '<link rel="icon" href="favicon.ico" />'; //需要插入的内容
const strReg = /<link rel="icon" href="favicon.ico" \/>/; //需要插入内容的正则表达式

const strLink = /(>)([\r\n\s]+)(<link)/;    //需要在此位置插入（引用外部css）
const strStyle = /(>)([\r\n\s]+)(<style)/;    //需要在此位置插入（内部css）
 
function readDir(pa){  
  fs.readdir(pa,(err,menu)=>{   
    if(!menu)  
      return;  
    menu.forEach((ele)=>{ 
      if(ele == 'node_modules' || ele.match(/append-favicon.js/)){          //忽略的文件和文件夹
        return;
      }else{
        fs.stat(pa+"/"+ele,(err,info)=>{ 
          if(info.isDirectory()){                               //文件夹则进入下一层
            readDir(pa+"/"+ele);  
          }else{  
            let pathTemp = path.join(pa,ele);
            let fileContent = fs.readFileSync(pathTemp, 'utf-8');  //读取页面内容

            if(fileContent.match(strReg)){                    //已有favicon不做处理
              return;
              //console.log("a");
            }else{
              if(fileContent.match(strLink)){                 //外部css页面
                let newCon = fileContent.replace(strLink, '$1$2'+strAppend+'$2$3');
                fs.writeFile(pathTemp, newCon,()=>{           //写入新内容
                  return;
                  //console.log("b");
                });
              }else if(fileContent.match(strStyle)){          //内部样式页面
                let newCon = fileContent.replace(strStyle, '$1$2'+strAppend+'$2$3');
                fs.writeFile(pathTemp, newCon,()=>{
                  return;
                  //console.log("c");
                });
              }else{
                return;
                //console.log("d");
              }
            }
          }     
        });
      } 
    });            
  }); 
}

readDir(path.join(__dirname)); 