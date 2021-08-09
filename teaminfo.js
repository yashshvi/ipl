const path=require('path');

const request=require('request'); // for data request response
console.log("before");
const cheerio=require('cheerio');
let fs=require('fs');

let teampath="D:\\pepcodings\\ipl";

let TeamDir = path.join(teampath,"teamfolder");
fs.mkdirSync(TeamDir);
function SingleMatch(url){
    request(url,cd);
}
function cd(error,response,html){
    if(error){
        console.error('error:', error);
      }else if(response.statusCode==404){
          console.log("page not found");
      }else{
        // console.log( html);
        datagive(html);
      }
}
function datagive(html){
    let searcht=cheerio.load(html);
    let inning=searcht('.Collapsible');
 let content="";
 for(let i=0;i<inning.length;i++){
    //  content=searcht(inning[i]).html();
    //  fs.writeFileSync(`inning${i+1}.html`,content);
    let heading =searcht(inning[i]).find('h5');
    let hans=searcht(heading).text();
    let TeamName=hans.split("INNINGS");
    // console.log(TeamName[0]);
    let teamfile=TeamName[0];
  let p1=Teamfolder(teamfile);  
//   console.log(p1); 
   let batting=searcht(inning[i]).find(".table.batsman tbody tr");
    // console.log(batting.length);
     for(let j=0;j<batting.length;j++){
        let cols=searcht(batting[j]).find('td');
        // console.log(cols.length);
        let content="";
        if(cols.length==8){
            let playername=searcht(cols[0]).text();
               playername.trim();
               content=playername +" "+searcht(cols[1]).text()+" "+searcht(cols[2]).text()+" "+searcht(cols[3]).text()
               +" "+searcht(cols[4]).text()+" "+searcht(cols[5]).text()+" "+
               searcht(cols[6]).text()+" "+searcht(cols[7]).text()+" "+searcht(cols[8]).text();
            console.log(content);
            PlayerFolder(playername,p1,content);
            
        }
     }
//    console.log("*************");  
 }
}
function Teamfolder(teamfile){
    let teamName= path.join(TeamDir,teamfile);
    if(!fs.existsSync(teamName)){
        fs.mkdirSync(teamName);
    }
    return teamName;
}
function PlayerFolder(name,p1,content){

let Playerfile=path.join(p1,name);
// let ans=path.join(Playerfile,".json");
if(!fs.existsSync(Playerfile)){
    let jsonwrite=JSON.stringify(content);
    fs.writeFileSync(Playerfile ,jsonwrite);    
    // fs.mkdirSync(Playerfile);
}
}
module.exports={
    pms:SingleMatch
}
 