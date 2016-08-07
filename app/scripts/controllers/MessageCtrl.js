(function(){
  function MessageCtrl($scope, MessageSrv, $cookies){
    $scope.send = function(){
      if($scope.messageContent !== ''){
        MessageSrv.addMessage(
          {
            content:$scope.messageContent,
            roomID:$scope.selectedRoom.$id,
            setAt:'default',
            username:$cookies.get('currentUser')
          }
        );
        $scope.messageContent = '';
      }
    };
  }
  angular
  .module('chatterBox')
  .controller('MessageCtrl', ['$scope', 'MessageSrv', '$cookies', MessageCtrl]);
})();
