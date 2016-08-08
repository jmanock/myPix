// (function(){
//   $(document).ready(function(){
//     var url = 'http://api.wunderground.com/api/db467f1cecc63029/geolookup/conditions/q/';
//     /*
//       * Need to be able to put in state
//       * Need to be able to put in city
//       * Return temp
//       * Return rain %
//     */
//   });
// })();

jQuery(document).ready(function($) {
  var geolookup = "http://api.wunderground.com/api/db467f1cecc63029/geolookup/conditions/q/FL/Orlando.json";
  var hourly = 'http://api.wunderground.com/api/db467f1cecc63029/hourly/q/FL/Orlando.json';
  var forecast = 'http://api.wunderground.com/api/db467f1cecc63029/forecast/q/FL/Orlando.json';
  $.ajax({
  url : forecast,
  dataType : "jsonp",
  success : function(data) {
  // var location = parsed_json['location']['city'];
  // var temp_f = parsed_json['current_observation']['temp_f'];
  //console.log("Current temperature in " + location + " is: " + temp_f);
  var something = data.forecast.simpleforecast.forecastday[0].icon_url;
  // console.log(data.forecast.simpleforecast.forecastday[0]);
  console.log(something);
  $('h1').append('<img src='+something+' </img>');
  }
  });
});
