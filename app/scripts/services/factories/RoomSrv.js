(function(){
  function RoomSrv($fireabseArray){
    var RoomSrv = {};
    var firebaseRef = new Firebase('https://toga.fireabseio.com/');
    var rooms = $fireabseArray(firebaseRef.child('rooms'));
    RoomSrv.getALlRooms = function(){
      return rooms;
    };
    RoomSrv.getRoom = function(id){
      return rooms[id];
    };
    RoomSrv.addRoom = function(room){
      rooms.$add(room);
    };
    RoomSrv.updateRoom = function(id){
      rooms.$save(id);
    };
    RoomSrv.removeRoom = function(id){
      rooms.$remove(id);
    };
    RoomSrv.getMessages = function(id){
      return $firebaseArray(firebaseRef.child('messages').orderByChild('roomID').equalTo(id));
    };
    RoomSrv.clearRooms = function(){
      firebaseRef.remove();
    };
    return RoomSrv;
  }
  angular
  .module('chatterBox')
  .factory('RoomSrv', ['$firebaseArray', RoomSrv]);
})();
