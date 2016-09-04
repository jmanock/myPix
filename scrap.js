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
      * Would like to return dob with name link
    */
    var knew = [];
    var $ = cheerio.load(body);
    var namesLookUp = $('td font a');
    var something;
    var bbody = $('font');

    bbody.contents().filter(function(){
      return this.nodeType == 8;
    }).each(function(i,e){
      //console.log(i,e.nodeValue);
      // This could get id number with name
      // not sure how i can get dob out of this
      if(e.nodeValue === ' END '){

      }else{
         console.log(e.nodeValue);
        //console.log(e);
      }
    });

    for(var i = 0; i<namesLookUp.length; i++){
      something = $(namesLookUp[i]).text();
      something = something.slice(27);
      knew.push(something);
    }
  }

  function ilterNames(namesArray){
    /*
      * First a list of names
      * Maybe show the dob?
      * Add the otherFullName
      * Get the list down to < 10 names
        * Make sure they dont look at middle names
    */
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
