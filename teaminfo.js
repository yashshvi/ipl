const path=require('path');
const request=require('request'); // for data request response
console.log("before");
const cheerio=require('cheerio');
let fs=require('fs');
// const path=require("path");
let xlsx=require('xlsx');
// let url="https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard";
// let teampath="D:\\pepcodings\\ipl";

// let TeamDir = path.join(teampath,"teamfolder");
// fs.mkdirSync(TeamDir);
function SingleMatch(url){
    request(url,cb);
}
// request(url,
    function cb(error,response,html){
    if(error){
        console.error('error:', error);
      }else if(response.statusCode==404){
          console.log("page not found");
      }else{
        // console.log( html);
        datagive(html);
      }
}
// );

function datagive(html){
    let searcht=cheerio.load(html);
    let date=searcht('.event .description');
    let result=searcht('.event .status-text span');
    let arr=date.text().split(",");
    let venue=arr[1];
    let day=arr[2];
    // console.log(venue.trim());
    // console.log(day.trim());
    // console.log(date.text());
    // console.log(result.text());    
    let inning=searcht('.Collapsible');
    let content="";
    for(let i=0;i<inning.length;i++){
        // content+=searcht(inning[i]).html();
        let teamname=searcht(inning[i]).find('h5').text();
        //  console.log(teamname.text());
        //  let t=teamname.text();
        //  console.log(t);
        let TeamName=teamname.split("INNINGS")[0].trim();
        // console.log(TeamName);
       let oppidx;
        if(i==0){
           oppidx=1;
         }else{
           oppidx=0;
         }
         let opponent=searcht(inning[oppidx]).find("h5").text();
         opponent=opponent.split("INNINGS")[0].trim();
         console.log("team 1 in first "+TeamName);
         console.log("team 2 in first "+opponent);
         let batting=searcht(inning[i]).find(".table.batsman tbody tr");
         // console.log(batting.length);
          for(let j=0;j<batting.length;j++){
             let cols=searcht(batting[j]).find('td');
             // console.log(cols.length);
            //  let content="";
             if(cols.length==8){  
                  let playername=searcht(cols[0]).text();
               let b= searcht(cols[2]).text();let r=searcht(cols[3]).text();
               let fours= searcht(cols[4]).text();let sixs=searcht(cols[5]).text();
               let sr=searcht(cols[6]).text();
               console.log(playername+b+r+fours+sixs+sr);
               ProcessPlayer(TeamName,playername,b,r,fours,sixs,sr);
             } 
            }   
    }
}
function ProcessPlayer(TeamName,playername,b,r,fours,sixs,sr){
let tpath=path.join(__dirname,"ipl",TeamName);
if(fs.existsSync(tpath)==false){
  fs.mkdirSync(tpath);
}
let filepath=path.join(tpath,playername+".xlsx");
let con=excelread(filepath,playername);
let plyerobj={
  TeamName,
  playername,
  b,
  r,
  fours,
  sixs,
  sr
}
con.push(plyerobj);
excelwrite(filepath,con,playername);

}
function excelwrite(filepath,json,sheetname){
let newWB=xlsx.utils.book_new();
// //json data->excel formale
let newWS=xlsx.utils.json_to_sheet(json);
// // ->newwb,ws,sheet name
xlsx.utils.book_append_sheet(newWB,newWS,sheetname);
// //filepath
xlsx.writeFile(newWB,filepath);
}
function excelread(filepath,sheetname){
  if(fs.existsSync(filepath)==false){
    return [];
  }
  let wb=xlsx.readFile(filepath);
// sheet
let exceldata=wb.Sheets[sheetname];
// sheet get data
let ans=xlsx.utils.sheet_to_json(exceldata);
return ans;
}


// function datagive1(html){
//     let searcht=cheerio.load(html);
//     let inning=searcht('.Collapsible');
//   let content="";
//   for(let i=0;i<inning.length;i++){
//     let heading =searcht(inning[i]).find('h5');
//     let hans=searcht(heading).text();
//     let TeamName=hans.split("INNINGS");
//     console.log(TeamName[0]);
//     let teamfile=TeamName[0];
//   let p1=Teamfolder(teamfile);  
// //   console.log(p1); 
//    let batting=searcht(inning[i]).find(".table.batsman tbody tr");
//     // console.log(batting.length);
//      for(let j=0;j<batting.length;j++){
//         let cols=searcht(batting[j]).find('td');
//         // console.log(cols.length);
//         let content="";
//         if(cols.length==8){
//             // let playername=searcht(cols[0]).text();
//             //    playername.trim();
//             //    content=playername +" "+searcht(cols[1]).text()+" "+searcht(cols[2]).text()+" "+searcht(cols[3]).text()
//             //    +" "+searcht(cols[4]).text()+" "+searcht(cols[5]).text()+" "+
//             //    searcht(cols[6]).text()+" "+searcht(cols[7]).text()+" "+searcht(cols[8]).text();
//             // console.log(content);
//             // PlayerFolder(playername,p1,content);
            
//         }
//      }
// //    console.log("*************");  
//  }
// }
// function Teamfolder(teamfile){
//     let teamName= path.join(TeamDir,teamfile);
//     if(!fs.existsSync(teamName)){
//         fs.mkdirSync(teamName);
//     }
//     return teamName;
// }
// function PlayerFolder(name,p1,content){

// let Playerfile=path.join(p1,name);
// // let ans=path.join(Playerfile,".json");
// if(!fs.existsSync(Playerfile)){
//     let jsonwrite=JSON.stringify(content);
//     fs.writeFileSync(Playerfile ,jsonwrite);    
//     // fs.mkdirSync(Playerfile);
// }
// }
module.exports={
    pms:SingleMatch
}
 