(function(){
  'use strict';
  angular
    .module('app.waitList')
    .controller('WaitListController', WaitListContriller);
    WaitListController.$inject = ['partyService', 'user'];
    function WaitListContriller(partyService, user){
      var vm = this;
      vm.parties = partyService.getPartiesByUser(user.uid);
    }
})();
