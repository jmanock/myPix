var request = require('request');
var cheerio = require('cheerio');
var url = 'http://www.flvoters.com';

request(url, function(error, response, body){
  if(!error && response.statusCode === 200){
    console.log('HelloFriend');
  }else{
    console.log('Better check something else');
  }
});
