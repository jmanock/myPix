(function(){
  function LoginModalCtrl($scope, $uibModalInstance, $cookies){
    $scope.userName = '';
    $scope.submit = function(){
      $uibModalInstance.close($scope.userName);
      $cookies.put('currentUser', $scope.userName);
    };
    $scope.$on('modal.closing', function(event, reason, closed){
      if($scope.userName === ''){
        event.preventDefault();
      }
    });
  }
  angular
  .module('chatterBox')
  .controller('LoginModalCtrl', ['$scope', '$uibModalInstance', '$cookies', LoginModalCtrl]);
})();
