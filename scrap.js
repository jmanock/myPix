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
  var linkFl = url + addons + firstLetter+'.html';

  request(linkFl, function(err, response, body){
    if(!err && response.statusCode === 200){
      doWork(body);
    }
  });
  function doWork(body){
    var $ = cheerio.load(body);
    var namesLookUp = $('td font a');
    var namesArray = [];
    var hrefsArray = [];

    namesArray.push(lastName);

    for(var i = 0; i<namesLookUp.length; i++){
      var hrefs = $(namesLookUp[i]).attr('href');
      var lastNamesList = $(namesLookUp[i]).text();
      lastNamesList = lastNamesList.replace(/\r?\n|\r/g,"");
      namesArray.push(lastNamesList);
      hrefsArray.push(hrefs);
      namesArray.sort();
    }
    // This needs to check what page i am on
    if(namesArray.length < 100){
      nextPage(namesArray,hrefsArray);
    }else{
      console.log(namesArray);
    }

  }
  var a;
  function nextPage(namesArray,hrefsArray){
    for(var i = 0; i<namesArray.length; i++){
      if(namesArray[i] === lastName){
        a = namesArray.indexOf(lastName);
        a = hrefsArray[a-1];
      }
    }
    request(a, function(err,response,body){
      if(!err && response.statusCode === 200){
        doWork(body);
      }
    })
  }
});
