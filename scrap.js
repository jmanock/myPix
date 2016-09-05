var request = require('request');
var cheerio = require('cheerio');
var prompt = require('prompt');
var url = 'http://www.flvoters.com';
var addons = '/by_name/index_pages/';

prompt.start();

prompt.get(['LastName','FirstName'], function(err, result){
  var lastName = result.LastName.toUpperCase();
  var firstName = result.FirstName.toUpperCase();
  var lowerFirstName = result.FirstName.toLowerCase();
  var lowerLastName = result.LastName.toLowerCase();
  var fullName = lastName + ', '+firstName;
  var otherFullName = result.FirstName + ' ' + result.LastName;
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
      //namesArray.sort();
    }

    if(namesArray.length < 200){
      nextPage(namesArray,hrefsArray);
    }else{
      lastPage(namesArray,hrefsArray);
    }
  }

  var call;
  function nextPage(namesArray,hrefsArray){
    namesArray.sort();
    for(var i = 0; i<namesArray.length && i<hrefsArray.length; i++){
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

  function lastPage(namesArray, hrefsArray){
    for(var i = 0; i<namesArray.length && i < hrefsArray.length; i++){
      if(fullName < namesArray[i]){
        var call = hrefsArray[i-2];
        return request(call, function(err,response, body){
          if(!err && response.statusCode === 200){
            filterNames(body);
            //doWork(body);
          }
        });
      }
    }
  }

  function filterNames(body){
    var finalNamesArray = [];
    var finalHrefsArray = [];
    var $ = cheerio.load(body);
    var namesLookUp = $('td font a');
    var hrefsLookUp;
    var cutString;

    for(var i = 0; i<namesLookUp.length; i++){
      hrefsLookUp = $(namesLookUp[i]).attr('href');
      cutString = $(namesLookUp[i]).text();
      cutString = cutString.toLowerCase();
      if(cutString.length > 26){
        cutString = cutString.slice(27);
        finalNamesArray.push(cutString);
      }
      finalHrefsArray.push(hrefsLookUp);
    }
    //finalNamesArray.push(otherFullName);
    finalNamesArray.sort();

    enders(finalNamesArray, finalHrefsArray);
  }
  function enders(finalNamesArray, finalHrefsArray){
    var firstNameCheck;
    var lastNameCheck;

    for(var i = 0; i<finalNamesArray.length && i<finalHrefsArray.length; i++){

      firstNameCheck = finalNamesArray[i].slice(0,lowerFirstName.length);
      lastNameCheck = finalNamesArray[i].slice(-lowerLastName.length);

      if(firstNameCheck === lowerFirstName && lastNameCheck === lowerLastName){
        // This need to send the results to a new request
        // Need to get the href tags

        console.log(finalNamesArray[i]);
        console.log(finalHrefsArray[i]);
      }

    }
  }
});
