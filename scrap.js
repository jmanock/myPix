var request = require('request');
var cheerio = require('cheerio');
var url = 'https://www.reddit.com/r/thatHappened/';
var sexting = [];
request(url, function(error, response, body){
  if(!error && response.statusCode === 200){
    var $ = cheerio.load(body);
    var imglink = $('a.thumbnail.may-blank.outbound');
    //var title = $('.title.may-blank.outbound');
    var title = $('.title .may-blank');

    imglink.each(function(i, link){
      var url = $(link).attr('href');
      //console.log(i, url);
    });
    title.each(function(i,link){
      var something = $(link).text();
      console.log(i,something);
    });
  }else{
    console.log('We fucked up or you fucked up');
  }
});
