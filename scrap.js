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
  var lastName = result.lastName.toUpperCase();
  var firstLetter = result.lastName.charAt(0);
  var linkFl = url+addons+firstLetter+'.html';
  request(linkFl, function(error, response, body){
    if(!error && response.statusCode === 200){
        var $ = cheerio.load(body);
        var secondLetterLookup = $('td font a');
        /*
          * last name should get the link index -1
        */
        var knew = [];
        var other = [];
        knew.push(lastName);
        for(var i = 0; i<secondLetterLookup.length; i++){
          var href = $(secondLetterLookup[i]).attr('href');
          var lastNameText = $(secondLetterLookup[i]).text();
          lastNameText = lastNameText.replace(/\r?\n|\r/g,"");
          knew.push(lastNameText);
          other.push(href);
          knew.sort();
          something(knew, other);
        }
        var a;
        function something(knew, href){
          // I think i can sort the array then return the link
          for(var i = 0; i<knew.length; i++){
            if(knew[i] === lastName){
              a = knew.indexOf(lastName);
              a = href[a-1];
            }
          }
        }
        console.log(a);
    }
  });

});
