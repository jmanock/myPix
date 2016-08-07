(function(){
  function CookieHandler($cookies, $uibModal){
    var currentUser = $cookies.get('currentUser');
    if(!currentUser || currentUser === ''){
      var modalInstance = $uibModal.open({
        templateUrl:'templates/modals/loginModal.html',
        controller:'LoginModalCtrl',
        size:'sm',
        windowClass:'modal-window',
        backdrop:'static',
        keyboard:false
      });
    }
  }
  angular
  .module('chatterBox')
  .run(['$cookies', '$uibModal', CookieHandler]);
})();
