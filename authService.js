var app = angular.module('firebaseLogin');
app.service('authService', function(){
  var firebaseUrl = 'https://toga.firebaseio.com/';
  var firebaseLogin = new Firebase(firebaseUrl);
  this.login = function(user, cb){
    firebaseLogin.authWithPassword({
      email:user.email,
      password:user.password
    }, function(err, authData){
      if(err){
        switch(err.code){
          case 'INVALID_EMAIL':
          break;
          case 'INVALID_PASSWORD':
          break;
          default:
        }
      }else if(authData){
        console.log('Logged In! User ID: '+ authData.uid);
        cb(authData);
      }
    });
  };
  this.register = function(user, cb){
    firebaseLogin.createUser({
      email:user.email,
      password:user.password
    }, function(error){
      if(error === null){
        console.log('User created successfully');
        firebaseLogin.authWithPassword({
          email:user.email,
          password:user.password
        }, function(err, authData){
          if(authData){
            authData.name = user.name;
            authData.timestamp = new Data().toISOString();
            firebaseLogin.child('users').child(authData.uid.replace('simplelogin:', '')).set(authData);
            cb(authData);
          }else{
            console.log('Something went wrong');
          }
        });
      }else{
        console.log('Error creating user:', error);
        return false;
      }
    });
  };
});
