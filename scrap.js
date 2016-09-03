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
  var otherFullName = firstName + ' ' + lastName;
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

    namesArray.push(fullName);

    for(var i = 0; i<namesLookUp.length; i++){
      var hrefs = $(namesLookUp[i]).attr('href');
      var lastNamesList = $(namesLookUp[i]).text();
      lastNamesList = lastNamesList.replace(/\r?\n|\r/g,"");
      namesArray.push(lastNamesList);
      hrefsArray.push(hrefs);
      namesArray.sort();
    }

    // This should go from page two to page three
    if(namesArray.length < 202){
      nextPage(namesArray,hrefsArray);
    }else{
      /*

        * Get rid of the long list before name
        * Think of a way to have the middle name not count for a match
        *BUG
        - Two different names show up for some reason
      */

      filterNames(namesArray);
    }
  }

  var call;
  function nextPage(namesArray,hrefsArray){
    for(var i = 0; i<namesArray.length; i++){
      if(namesArray[i] === fullName){
        call = namesArray.indexOf(fullName);
        call = hrefsArray[call-1];
      }
    }

    request(call, function(err,response,body){
      if(!err && response.statusCode === 200){
        doWork(body);
      }
    });
  }
  function filterNames(namesArray){
    var cutString;
    var knew = [];
    for(var i = 0; i<namesArray.length; i++){
      if(namesArray[i].length > 27){
        cutString = namesArray[i].slice(27);
        knew.push(cutString);
      }else if(namesArray[i] === 'Next page' || namesArray[i] === 'Home page' || namesArray[i] === 'Previous page' || namesArray[i] === fullName){
        // This needs to remove the links

      }else{
        cutString = namesArray[i];
        knew.push(cutString);
      }

    }
    // Have to get rid of the white space in front of the names
    knew.push(otherFullName);
    knew.sort();
    //console.log(knew);

  }
});
