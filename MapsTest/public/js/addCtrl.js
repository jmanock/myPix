var addCtrl = angular.module('addCtrl', ['geolocation', 'gservice']);
addCtrl.controller('addCtrl', function($scope, $http, $rootScope, geolocation, gservice){
  $scope.formData = {};
  var coords = {};
  var lat = 0;
  var long = 0;
  $scope.formData.longitude = -98.350;
  $scope.formData.latitude = 39.500;
  geolocation.getLocation().then(function(data){
    coords = {lat:data.coords.latitude, long:data.coords.longitude};
    $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
    $scope.formData.latitude = parsFloat(coords.lat).toFixed(3);
    $scope.formData.htmlverified = 'Yep(thanks for giving us data)';
    gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
  });
  $rootScope.$on('clicked', function(){
    $scope.$apply(function(){
      $scope.formdata.latitude = parseFloat(gservice.clickLat).toFixed(3);
      $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
      $scope.formData.htmlverified = 'Nope (thanks for spaming the map)';
    });
  });
  $scope.refreshLoc = function(){
    geolocation.getLocation().then(function(data){
      coords = {lat:data.coords.latitude, long:data.coords.longitude};
      $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
      $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);
      $scope.formData.htmlverified = 'Yep (thanks for the data)';
      gservice.refresh(coords.lat, coords.long);
    });
  };
  $scope.createUser = function(){
    var userData = {
      username:$scope.formData.username,
      gender:$scope.formData.gender,
      age:$scope.formData.age,
      favlang:$scope.formData.favlang,
      location:[$scope.formData.longitude, $scope.formData.latitude],
      htmlverified:$scope.formData.htmlverified
    };
    $http.post('/users', userData).success(function(data){
      $scope.formData.username = '';
      $scope.formData.gender = '';
      $scope.formData.age = '';
      $scope.formData.favlang = '';
      gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
    }).error(function(data){
      console.log('Error:'+data);
    });
  };
});
