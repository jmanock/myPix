(function(){
  'use strict';
  angular
    .module('app.auth')
    .directive('gzAuthForm', gzAuthForm);
    function gzAuthForm(){
      return{
        templateUrl:'app/auth/authForm.html',
        restrict:'E',
        controller:AuthFormController,
        controllerAs:'vm',
        bindToCOntroller:true,
        scope:{
          error:'=',
          formTitle:'@',
          submitAction:'&'
        }
      };
    }
    function AuthFormController(){
      var vm = this;
      vm.user = {
        email:'',
        password:''
      };
    }
})();
