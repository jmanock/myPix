var request = require('request');
var cheerio = require('cheerio');
var url = 'https://www.reddit.com/r/thatHappened/';
var sexting = [];
request(url, function(error, response, body){
  if(!error && response.statusCode === 200){
    var $ = cheerio.load(body);
    var imglink = $('a.thumbnail.may-blank');

    //var title = $('.title.may-blank.outbound');
    var title = $('.title .may-blank');

    for(var i = 0; i<imglink.length && i<title.length; i++){
      var something = $(title[i]).text();
      var url = $(imglink[i]).attr('href');
      console.log(i, something, url);
    }
  }else{
    console.log('We fucked up or you fucked up');
  }

});
/*TODO
  * Store links, be able to move to the next page
  * Show pics
  * Maybe open after window is closed
*/
