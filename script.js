$(document).ready(function(){
    var forecast = 'http://api.wunderground.com/api/db467f1cecc63029/forecast/q/';
    var temp ='http://api.wunderground.com/api/db467f1cecc63029/geolookup/conditions/q/';
    var something = 'http://api.sba.gov/geodata/city_links_for_state_of/fl.json';

    $('button').click(function(){
      /*
        * use a function
        * call for a city look up
        * call a state look up
        * need to return a tem from another call
        * maybe just one input where city state and zip can be entered
      */
      var city = $('.city').val();
      var state = $('.state').val().toUpperCase();
      if(city !== '' && state !== ''){
        var knew = forecast+state+'/'+city+'.json';
        $.ajax({
          url:knew,
          dataType:'jsonp',
          success:function(data){
            var something = data.forecast.simpleforecast.forecastday[0];
            console.log(something);
            var pop = something.pop;
            var smile = something.icon_url;
            var cond = something.conditions;
            $('h1').append('<img src='+smile+' </img>');
            $('h1').append('Today '+cond);
            $('h1').append('Prep '+pop);
          }
        });
      }else{
        console.log('Please enter something that can be used');
      }
    });

});


// jQuery(document).ready(function($) {
//   var geolookup = "http://api.wunderground.com/api/db467f1cecc63029/geolookup/conditions/q/FL/Orlando.json";
//   var hourly = 'http://api.wunderground.com/api/db467f1cecc63029/hourly/q/FL/Orlando.json';
//   var forecast = 'http://api.wunderground.com/api/db467f1cecc63029/forecast/q/FL/Orlando.json';
//   $.ajax({
//   url : forecast,
//   dataType : "jsonp",
//   success : function(data) {
//   // var location = parsed_json['location']['city'];
//   // var temp_f = parsed_json['current_observation']['temp_f'];
//   //console.log("Current temperature in " + location + " is: " + temp_f);
//   var something = data.forecast.simpleforecast.forecastday[0].icon_url;
//   // console.log(data.forecast.simpleforecast.forecastday[0]);
//   console.log(something);
//   $('h1').append('<img src='+something+' </img>');
//   }
//   });
// });
