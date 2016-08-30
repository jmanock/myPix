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

*/
prompt.get(['lastName' ], function(err, result){
  // Take the first letter
  var firstLetter = result.lastName.charAt(0);
  var linkFl = url+addons+firstLetter+'.html';
  request(linkFl, function(error, response, body){
    if(!error && response.statusCode === 200){
        // Now this needs to look up the rest of the name
        var $ = cheerio.load(body);
        var secondLetterLookup = $('td a').text();
        console.log(secondLetterLookup);
    }
  });

});
