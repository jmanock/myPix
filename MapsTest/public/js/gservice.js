angular.module('gservice',[])
.factory('gservice', function($rootScope, $http){
  var googleMapService = {};
  googleMapService.clickLat = 0;
  googleMapService.clickLong = 0;
  var locations = [];
  var lastMarker;
  var currentSelectedMarker;
  var selectedLat = 39.50;
  var selectedLong = -98.35;
  googleMpaService.refresh = function(latitude, longitude, filteredResults){
    locations = [];
    selectedLat = latitude;
    selectedLong = longitude;
    if(filteredResults){
      locations = convertToMapPoints(filteredResults);
      initialize(latitude, longitude, true);
    }else{
      $http.get('/users').success(function(response){
        locations = convertToMapPoints(response);
        initialize(latitude, longitude, false);
      }).error(function(){

      });
    }
  };
  var convertToMapPoints = function(response){
    var locations = [];
    for(var i = 0; i<response.length; i++){
      var user = response[i];
      var contentString = '<p><b>Username</b>: '+ user.username + '<br><b>Age</b>: '+user.age+'<br>'+'<b>Gender</b>: '+user.gender+ '<br><b>Favorite Language</b>: '+user.favlang+'</p>';
      locations.push(new Location(
        new google.maps.LatLng(user.location[1], user.location[0]),
        new google.maps.InfoWindow({
          content:contentString,
          maxWidth:320
        }),
        user.username,
        user.gender,
        user.age,
        user.favlang
      ));
    }
    return locations;
  };
  var Location = function(latlon, message, username, gender, age, favlang){
    this.latlon = latlon;
    this.message = message;
    this.username = username;
    this.gender = gender;
    this.age = age;
    this.favlang = favlang;
  };
  var initialize = function(latitude, longitude, filter){
    var myLatLng = {lat:selectedLat, lng:selectedLong};
    if(!map){
      var map = new google.maps.Map(document.getElementById('map'),{
        zoom:3,
        center:myLatLng
      });
    }
    if(filter){
      icon = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
    }else{
      icon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
    }
    location.forEach(function(n,i){
      var marker = new google.maps.Marker({
        position:n.latlon,
        map:map,
        title:'Big Map',
        icon:icon
      });
      google.maps.event.addListener(marker, 'click', function(e){
        currentSelectedMarker = n;
        n.message.open(map,marker);
      });
    });
    var initialLocation = new google.maps.LatLng(latitude, longitude);
    var marker = new google.maps.Marker({
      position:initialLocation,
      animation:google.maps.Animation.BOUNCE,
      map:map,
      icon:'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    });
    lastMarker = marker;
    map.panTo(new google.maps.LatLng(latitude, longitude));
    google.maps.event.addListener(map, 'click', function(e){
      var marker = new google.maps.Marker({
        position:e.latLng,
        animation:google.maps.Animation.BOUNCE,
        map:map,
        icon:'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
      });
      if(lastMarker){
        lastMarker.setMap(null);
      }
      lastMarker = marker;
      map.panTo(marker.position);
      googleMapService.clickLat = marker.getPosition().lat();
      googleMapService.clickLong = marker.getPosition().lng();
      $rootScope.$broadcast('clicked');
    });
  };
  google.maps.event.addDomListener(window, 'load', googlMapService.refresh(selectedLat, selectedLong));
  return googleMapService;
});
