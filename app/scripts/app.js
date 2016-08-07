(function(){
  function config($stateProvider, $locationProvider){
    $locationProvider
    .html5Mode({
      enabled:true,
      requireBase:false
    });
    $stateProvider
    .state('landing',{
      ulr:'/',
      controller:'RoomCtrl',
      templateUrl:'/templates/home.html'
    });
  }

  angular
  .module('chatterBox', ['ui.bootstrap', 'ui.router', 'firebase', 'formatTime', 'ngCookies'])
  .config(config);
})();
