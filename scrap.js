/* TODO
  * Search box
    - Dynamicly searches names
    - Pulls up info
    - Have to select the right name
  * Google Maps
  * FIRST STEPS
    - Make a search box that does something
    - Make the search box tie in with node
*/
var request = require('request');
var cheerio = require('cheerio');
var prompt = require('prompt');
var url = 'http://www.flvoters.com';
var addons = '/by_name/index_pages/';

// request(url, function(error, response, body){
//   if(!error && response.statusCode === 200){
//     console.log(body);
//   }
// });

prompt.start();
/*
  * take the first letter of the last name print out the url
*/
prompt.get(['lastName' ], function(err, result){
  // Take the first letter
  var firstLetter = result.lastName.charAt(0);
  var something = url+addons+firstLetter+'.html';
  request(something, function(error, response, body){
    if(!error && response.statusCode === 200){
      console.log('Wow you are smart');
    }else{
      console.log('No you really are stupid');
    }
  });

  // console.log('FirstName: '+result.firstName);
  // console.log('LastName: '+result.lastName);

});
