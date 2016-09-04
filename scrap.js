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
    /*
      * Better Way
        * Return the list of 10 - 20 names that could be the one
          - Maybe return fullName and otherFullName as list
        * Request that page
          * return dob and address from request page
          * link to click to google maps
      * Need to figure out how to not look at the middle name
      * Print to page
      * google maps
    */
    var finalNamesArray = [];
    var $ = cheerio.load(body);
    var namesLookUp = $('td font a');
    var cutString;

    for(var i = 0; i<namesLookUp.length; i++){
      cutString = $(namesLookUp[i]).text();
      if(cutString.length > 26){
        cutString = cutString.slice(27);
        finalNamesArray.push(cutString);
      }
    }
    finalNamesArray.push(otherFullName);
    finalNamesArray.sort();
    console.log(finalNamesArray);
  }

  function ilterNames(namesArray){
    var cutString;
    var knew = [];
    for(var i = 0; i<namesArray.length; i++){
      // if(namesArray[i].length > 27){
      //   cutString = namesArray[i].slice(27);
      //   knew.push(cutString);
      // }else if(namesArray[i] === 'Next page' || namesArray[i] === 'Home page' || namesArray[i] === 'Previous page' || namesArray[i] === fullName){
      //   // This needs to remove the links
      //
      // }else{
      //   cutString = namesArray[i];
      //   knew.push(cutString);
      // }
      console.log(namesArray[i]);

    }
    // Have to get rid of the white space in front of the names
    knew.push(otherFullName);
    knew.sort();

  }
});
