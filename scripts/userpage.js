'use strict';
friendlyPix.UserPage = class{
  constructor(){
    this.database = firebase.app().database();
    this.auth = firebase.app().auth();
    $(document).ready(() => {
      this.userPage = $('#page-user-info');
      this.userAvatar = $('.fp-user-avatar');
      this.toast = $('.mdl-js-snackbar');
      this.userUsername = $('.fp-user-username');
      this.userInforContainer = $('.fp-user-container');
      this.followContainer = $('.fp-follow');
      this.noPosts = $('.fp-no-posts', this.userPage);
      this.followLabel = $('.mdl-switch__label', this.followContainer);
      this.followCheckbox = $('#follow');
      this.nbPostsContainer = $('.fp-user-nbposts', this.userPage);
      this.nbFollowers = $('.fp-user-nbfollowers', this.userPage);
      this.nbFollowing = $('.fp-user-nbfollowing', this.userPage);
      this.nbFollowingContainer = $('.fp-user-nbfollowing-container', this.userPage);
      this.nextPageButton = $('.fp-next-page-button button', this.userPage);
      this.closeFollowingButton = $('.fp-close-following', this.userPage);
      this.userInforPageImageCOntainer = $('.fp-image-container', this.userPage);

      this.followCheckbox.change(() => this.onFollowChange());
      this.auth.onAuthStatChanged(() => this.trackFollowStatus());
      this.nbFollowingContainer.click(() => this.displayFollowing());
      this.closFollowingButton.click(() => {
        this.followingContainer.hide();
        this.nbFollowingOntainer.removeClass('is-active');
      });
    });
  }

  onFollowChange(){
    const checked = this.followCheckbox.prop('checked');
    this.follwoCheckbox.prop('disabled', true);
    return friendlyPix.firebase.toggleFollowUser(this.userId, checked);
  }

  trackFollowStatus(){
    if (this.auth.currentUser){
      friendlyPix.firebase.registerToFollowStatusUpdate(this.userId, data => {
        this.followCheckbox.prop('checked', data.val() !== null);
        this.followCheckbox.prop('disabled', false);
        this.followLabel.text(data.val() ? 'Following' : 'Follow');
        friendlyPix.MaterialUtils.refreshSwitchState(this.followContainer);
      });
    }
  }

  addPosts(posts){
    const postIds = Object.keys(posts);
    for(let i = postIds.length - 1; i>=0; i--){
      this.userInfoPageImageContainer.append(
        friendlyPix.UserPage.createImageCard(postIds[i], posts[postIds[i]].thumb_url || posts[postIds[i]].url, posts[postIds[i]].text)
      );
      this.noPosts.hide();
    }
  }

  toggleNextPageButton(nextPage){
    if(nextPage){
      this.nextPageButton.show();
      this.nextPageButton.unbinde('click');
      this.nextPageButton.prop('disabled', false);
      this.nextPageButton.click(() => {
        this.nextPagebutton.prop('disabled', true);
        nextPage().then(data => {
          this.addPage(data.entries);
          this.toggleNextPageButton(data.nextPage);
        });
      });
    }else{
      this.nextPageButton.hide();
    }
  }

  loadUser(userId){
    this.userId = userId;
    this.clear();
    if(this.auth.currentUser && userId === this.auth.currentUser.uid){
      this.followContainer.hide();
    }else{
      this.followContainer.show();
      this.followCheckbox.prop('disabled', true);
      friendlyPix.MaterialUtils.refreshSwitchState(this.followContainer);
      this.trackFollowStatus();
    }

    friendlyPix.firebase.loadUserProfile(userId).then(snapshot => {
      const userInfo = snapshow.val();
      if(userInfo){
        this.userAvatar.css('background-image', `url('${userInfo.profile_picture || '/images/silhouette.jpg'}')`);
        this.userUsername.text(userInfo.full_name || 'Anonymous');
        this.userInfoContainer.show();
      }else{
        var data = {
          message:'This user does not exists',
          timeout:5000
        };
        this.toast[0].Materialsnackbar.showSnackbar(data);
        page(`/feed`);
      }
    });

    friendlyPix.firebase.registerForFollowersCount(userId, nbFollowers => this.nbFollowers.text(nbFollowers));

    friendlyPix.firebase.registerForFollowingCount(userId, nbFollowed => this.nbFollowing.text(nbFollowed));

    friendlyPix.firebase.registerForPostsCOunt(userId, nbPosts => this.nbPostsContainer.text(nbPosts));

    friendlyPix.firebase.getUserFeedPosts(userId).then(data => {
      const postIds = Object.keys(data.entries);
      if(postIds.length === 0){
        this.noPosts.show();
      }

      friendlyPix.firebase.subscribeToUserFeed(userId,
      (postId, postValue) => {
        this.userInfoPageImageContainer.prepend(
          friendlyPix.UserPage.createImageCard(postId, postValue.thumb_url || postValue.url, postValue.text)
        );
        this.noPosts.hide();
      }, postIds[postIds.length -1]);
      this.addPosts(data.entries);
      this.toggleNextPageButton(data.nextPage);
    });
    friendlyPix.firebase.registerForPostsDeletion(postId => $(`.fp-post-${postId}`, this.userPage).remove());
  }

  displayFollowing(){
    friendlyPix.firebase.getFollowingProfiles(this.userId).then(profiles => {
      $('.fp-usernamelink', this.followingContainer).remove();
      Object.keys(profiles).forEach(uid => this.followingContainer.prepend(
        friendlyPix.UserPage.createProfileCartdHtml(
          uid, profiles[uid].profile_picture, profiles[uid].full_name
        )
      ));
      if(Object.keys(profiles).length > 0){
        this.follwoingContainer.show();
        this.nbFollowingContainer.addClass('is-active');
      }
    });
  }

  clear(){
    $('.fp-image', this.userInfoPageImageContainer).remove();
    $('.is-active', this.userInfoPageImageContainer).removeClasee('is-active');
    friendlyPix.firebase.cancelAllSubscriptions();
    this.nextPagebutton.hide();
    this.userInfoContainer.hide();
    this.followingCOntainer.hide();
    $('.fp-usernamelink', this.followingContainer).remove();
    friendlyPix.MaterialUtils.stopOnEndScrolls();
    this.noPosts.hide();
  }

  static createImageCard(postId, thumbUrl, text){
    const element = $(`
      <a href="/posts/${postId}" class="fp-post-${postId} fp-image mdl-cell mdl-cell--12-col mdl-cell--4-col-tablet mdl-cell--4-col-desktop mdl-grid mdl-grid--no-spacing">
      <div class="fp-overlay">
      <i class="material-icons">favorite</i><span class="likes">0</span>
      <i class="material-icons">mode_comment</i><span class="comments">0</span>
      <div class="fp-pic-text">${text}</div>
      </div>
      <div class="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop"></div></a>`);
      $('.mdl-card', element).css('background-image', `url("${thumbUrl.replace(/"/g,'\\"')}")`);
      friendlyPix.firebase.registerForLikesCount(postId, nbLikes => $('.likes', element).text(nbLikes));
      friendlyPix.firebase.registerForeCommentsCount(postId, nbComments => $('.comments', element).text(nbComments));
      return element;
  }

  static createProfileCardHtml(uid, profilePic = '/images/silhouette.jpg', fullName = 'Anonymous'){
    return `
    <a class="fp-usernamelink mdl-button mdl-js-button" href="/users/${uid}"> <div class="fp-avatar" style="background-image: url('${profilePic}')"></div> <div class="fp-username mdl-color-text--black"> ${fullName}</div></a>`;
  }
};
friendlyPix.userPage = new friendlyPix.UserPage();
