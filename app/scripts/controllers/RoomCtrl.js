(function(){
  function RoomCtrl($scope, RoomSrv, $cookies, $window){
    $scope.rooms = RoomSrv.getAllRooms();
    $scope.selectedRoom = {name:'default'};
    $scope.roomSelected = false;
    $scope.messageContent = '';
    $scope.addRoom = function(room){
      RoomSrv.addRoom(room);
    };
    $scope.updateRoom = function(id){
      RoomSrv.updateRoom(id);
    };
    $scope.removeRoom = function(id){
      RoomSrv.removeRoom(id);
    };
    $scope.clearRooms = function(){
      RoomSrv.clearRooms();
    };
    $scope.getMessages = function($id){
      $scope.messages = RoomSrv.getMessages($id);
    };
    $scope.setSelected = function(id){
      $scope.selectedRoom = RoomSrv.getRoom(id);
      $scope.roomSelected = true;
    };
    $scope.$on('createNewRoom', function(event, args){
      $scope.addRoom({name:args});
    });
    $scope.clearCookies = function(){
      $cookies.remove('currentUser');
      $window.location.reload();
    };
  }
  angular
  .module('chatterBox')
  .controller('RoomCtrl', ['$scope', 'RoomSrv', '$cookies', '$window', RoomCtrl]);
})();
