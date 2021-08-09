const request=require('request'); // for data request response
console.log("before");
const cheerio=require('cheerio'); // for data extraction from url
// const request = require('request');
let TeamInfo=require('./teaminfo');
request('https://www.espncricinfo.com/series/ipl-2020-21-1210595',
 function (error, response, html) {
  if(error){
    console.error('error:', error);
  }else if(response.statusCode==404){
      console.log("page not found");
  }else{
    // console.log('body:', html);
    viewallfunction(html);
  }

});

function viewallfunction(html){
//search tool
let searchTool=cheerio.load(html);
let viewall=searchTool('a[data-hover="View All Results"]');
// console.log(viewall.text());
let link=viewall.attr("href"); //finding the value of href
// console.log(link);
let matchresultlink=`https://www.espncricinfo.com/${link}`;
// console.log(matchresultlink);
//now for link use request
request(matchresultlink,MatchPage);  
}
function MatchPage(error,response,html){
  if(error){
    console.log(error);
  }else if(response.statusCode==404){
    console.log("page not found");
  }else{
    //   console.log(html);
    ScoreCardFun(html);
  }
}
function ScoreCardFun(html){
    let stool=cheerio.load(html);
    let AllScoreLink=stool('a[data-hover="Scorecard"]');
    console.log(AllScoreLink.length);
    for(let i=0;i<AllScoreLink.length;i++){
        let link=stool(AllScoreLink[i]).attr("href");
        // console.log(link);
        let ScoreLink=`https://www.espncricinfo.com/${link}`;
        // console.log(ScoreLink);
        TeamInfo.pms(ScoreLink);       
    }
}
