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

prompt.start();
/*

*/
prompt.get(['lastName' ], function(err, result){
  // Take the first letter
  var firstLetter = result.lastName.charAt(0);
  var linkFl = url+addons+firstLetter+'.html';
  request(linkFl, function(error, response, body){
    if(!error && response.statusCode === 200){
        var $ = cheerio.load(body);
        var secondLetterLookup = $('td a');
        /*
          - First lets return just last names
        */
        for(var i = 0; i<secondLetterLookup.length; i++){
          // Returns url link
          var something = $(secondLetterLookup[i]).attr('href');
          // Returns text
          var sels = $(secondLetterLookup[i]).text();
          console.log(something, sels);
        }
    }
  });

});
