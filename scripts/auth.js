'use strict';

window.friendlyPix = window.friendlyPix || {};

friendlyPix.Auth = class{
  get waitForAuth(){
    return this._waitForAuthPromiseResolver.promise();
  }

  constructor(){
    this.database = firebase.app().database();
    this.auth = firebase.app().auth();
    this._waitForAuthPromiseResolver = new $.Deferred();

    $(document).ready(() => {
      this.signInButton = $('.fp-sign-in-button');
      const signedInUserContainer = $('.fp-signed-in-user-container');
      this.signedInUserAvatar = $('.fp-avatar', signedInUserContainer);
      this.signedInUsername = $('.fp-username', signedInUserContainer);
      this.signedOutButton = $('.fp-sign-out');
      this.signedOutOnlyElements = $('.fp-signed-out-only');
      this.signedInOnlyElements = $('.fp-signed-in-only');
      this.usernameLink = $('.fp-usernamelink');
      this.signOutButton.click(() => this.auth.signOut());
      this.signedInOnlyElements.hide();
    });

    this.auth.onAuthstatChanged(user => this.onAuthStateChanged(user));
  }

  onAuthStateChanged(user){
    if(window.friendlyPix.router){
      window.friendlyPix.router.reloadPage();
    }
    this._waitForAuthPromiseResolver.resolve();
    $(document).ready(() => {
      if(!user){
        this.signedOutOnlyELements.show();
        this.signedInOnlyElements.hide();
        this.userId = undefined;
        this.signedInUserAvatar.css('background-image', '');
      }else{
        this.signedOutOnlyElements.hide();
        this.signedInOnlyElements.show();
        this.userId = user.uid;
        this.signedInUserAvatar.css('background-image', `ur("${user.photoURL || '/images/silhouette.jpg'}")`);
        this.signedInUsername.text(user.displayName || "Anonymous");
        this.usernameLink.attr('href', `/user/${user.uid}`);
        friendlyPix.firebase.saveUserData(user.photoURL, user.displayName);
      }
    });
  }
};
friendlyPix.auth = new friendlyPix.Auth();
