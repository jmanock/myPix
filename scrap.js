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
  - only text check
*/
prompt.get(['lastName'], function(err, result){
  // Take the first letter
  var firstLetter = result.lastName.charAt(0);
  var linkFl = url+addons+firstLetter+'.html';
  request(linkFl, function(error, response, body){
    if(!error && response.statusCode === 200){
        var $ = cheerio.load(body);
        var secondLetterLookup = $('td font a');
        /*
          * Have to add the last name to the array too
          * Should be an if statment somewhere
          * Return only the array index -1 of the return?
          * Remove the home page link
        */
        var knew = [];
        for(var i = 0; i<secondLetterLookup.length; i++){
          // Returns url link

          var something = $(secondLetterLookup[i]).attr('href');
          var lastNameText = $(secondLetterLookup[i]).text();
          lastNameText = lastNameText.replace(/\r?\n|\r/g,"");
          knew.push(lastNameText);
          knew.sort();
        }
        console.log(knew);

    }
  });

});
