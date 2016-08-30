/* TODO
  *
*/
var request = require('request');
var cheerio = require('cheerio');
var prompt = require('prompt');
var url = 'http://www.flvoters.com';
var addons = '/by_name/index_pages/';

prompt.start();

prompt.get(['LastName','FirstName'], function(err, result){

  var lastName = result.LastName.toUpperCase();
  var firstName = result.FirstName.toUpperCase();
  var fullName = lastName + ', '+firstName;
  var firstLetter = result.LastName.charAt(0);
  var linkFl = url+addons+firstLetter+'.html';
console.log(fullName);
  request(linkFl, function(error, response, body){
    if(!error && response.statusCode === 200){

        var $ = cheerio.load(body);
        var secondLetterLookup = $('td font a');
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
        }
        nextPage(knew, other);
    }
    var a;
    function nextPage(knew, href){
      for(var i = 0; i<knew.length; i++){
        if(knew[i] === lastName){
          a = knew.indexOf(lastName);
          a = href[a-1];
        }
      }
    }
    request(a, function(error, response, body){
      if(!error && response.statusCode === 200){
        var $ = cheerio.load(body);
        var something = $('td font a');
        var mix = [];
        for(var i = 0; i<something.length; i++){
          var mine = $(something[i]).text();
          mine = mine.replace(/\r?\n|\r/g,"");
          mix.push(mine);

        }

      }
    });
  });

});
