(function(){
  function ModalInstanceCtrl($scope, $uibModalInstance){
    $scope.roomName = '';
    $scope.submit = function(){
      $uibModalInstance.close($scope.roomName);
    };
    $scope.close = function(){
      $uibModalInstance.dismiss('cancel');
    };
  }
  angular
  .module('chatterBox')
  .controller('ModalInstanceCtrl', ['$scope', '$uibModalInstance', ModalInstanceCtrl]);
})();
