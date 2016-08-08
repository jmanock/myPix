$(document).ready(function(){
    /*
      * Need to be able to put in state
      * Need to be able to put in city
      * Return temp
      * Return rain %
    */
    var forecast = 'http://api.wunderground.com/api/db467f1cecc63029/forecast/q/';

    $('button').click(function(){
      // Should use another api to get states and cities
      // maybe even use zip code
      var city = $('.city').val();
      var state = $('.state').val().toUpperCase();
      if(city !== '' && state !== ''){
        var knew = forecast+state+'/'+city+'.json';
        $.ajax({
          url:knew,
          dataType:'jsonp',
          success:function(data){
            console.log(data.forecast.simpleforecast.forecastday[0]);
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
