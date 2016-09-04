var request = require('request');
var cheerio = require('cheerio');
var prompt = require('prompt');
var url = 'http://www.flvoters.com';
var addons = '/by_name/index_pages/';

prompt.start();
prompt.get(['LastName', 'FirstName'], function(err, result){
  var lastName = result.LastName.toUpperCase();
  var firstName = result.FirstName.toUpperCase();
  var fullName = lastName + ', '+ firstName;
  var otherFullName = firstName + ' '+ lastName;
  var firstLetter = result.LastName.charAt(0);
  var linkFl = url + addons + firstLetter +'.html';

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
    var something = [];
    namesArray.push(fullName);

    for(var i = 0; i<namesLookUp.length; i++){
      var hrefs = $(namesLookUp[i]).attr('href');
      var lastNamesList = $(namesLookUp[i]).text();
      lastNamesList = lastNamesList.replace(/\r?\n|r/g,"");
      namesArray.push(lastNamesList);
      hrefsArray.push(hrefs);

    }

    if(namesArray.length < 200){
      namesArray.sort();
      nextPage(namesArray, hrefsArray);
      // FIgured it out sort is not looking at commas
    }else{
      //filterNames(namesArray);
      helpMe(namesArray, hrefsArray);
    }
  }
  function helpMe(namesArray, hrefsArray){
    for(var i = 0; i<namesArray.length && i<hrefsArray.length; i++){
      if(fullName < namesArray[i]){
        // The first time its added find the index
        // Have to remove the name first
        return console.log(hrefsArray[i-2], namesArray[i]);
      }
      console.log(i,namesArray[i]);
    }

  }


  var call;

  function nextPage(namesArray, hrefsArray){
    for(var i = 0; i<namesArray.length; i++){
      if(namesArray[i] === fullName){
        call = namesArray.indexOf(fullName);
        call = hrefsArray[call -1];
      }

    }

    request(call, function(err, response, body){
      if(!err && response.statusCode === 200){
        doWork(body);
      }
    });
  }

});
