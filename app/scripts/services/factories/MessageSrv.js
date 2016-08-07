(function(){
  function MessageSrv($firebaseArray){
    var firebaseRef = new Firebase('https://toga.fireabseio.com/');
    var messages = $firebaseArray(firebaseRef.child('messages'));
    var MessageSrv = {};
    MessageSrv.getAllMessages = function(){
      return messages;
    };
    MessageSrv.getMessage = function(id){
      return messages[id];
    };
    MessageSrv.addMessage = function(message){
      messages.$add(message);
    };
    MessageSrv.updateMessage = function(id){
      messages.$save(id);
    };
    MessageSrv.removeMessage = function(id){
      messages.$remove(id);
    };
    return MessageSrv;
  }
  angular
  .module('chatterBox')
  .factory('MessageSrv', ['$firebaseArray', MessageSrv]);
})();
