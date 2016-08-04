'use strict';

window.friendlyPix = window.friendlyPix ||{};

friendlyPix.Feed = class {
  constructor(){
    this.posts = [];
    this.newPosts = {};
    this.auth = firebase.app().auth();

    $(document).ready(() => {
      this.pageFeed = $('#page-feed');
      this.feedImageContainer = $('.fp-image-container', this.pageFeed);
      this.noPostsMessage = $('.fp-no-posts', this.pageFeed);
      this.nextPageButton = $('.fp-next-page-button button');
      this.newPostsButton = $('.fp-new-posts-button button');

      this.newPostsButton.click(() => this.showNewPosts());
    });
  }

  addPosts(posts){
    const postIds = Object.keys(posts);
    for(let i = postIds.length -1; i >= 0; i--){
      this.noPostsMessage.hide();
      const postData = posts[postIds[i]];
      const post = friendlyPix.post.clone();
      this.posts.push(post);
      const postElement = post.fillPostData(postIds[i], postData.thumb_url || postData.url, postData.text, postData.author, postData.timestamp, null, null, postData.full_url);
      const existingPostElement = $(`.fp-post-${postIds[i]}`, this.feedImageContainer);
      if(existingPostElement.length){
        existingPostElement.replaceWith(postElement);
      }else{
        this.feedImageContainer.append(postElement.addClass(`fp-post-${postIds[i]}`));
      }
    }
  }

  toggleNextPageButton(nextPage){
    this.nextPageButton.unbind('click');
    if(nextPage){
      const loadMorePosts = () => {
        this.nextPageButton.prop('disabled', true);
        console.log('Loading next page of posts');
        nextPage().then(data => {
          this.addPosts(data.entries);
          this.toggleNextPageButton(data.nextPage);
        });
      };
      this.nextPageButton.show();
      friendlyPix.MaterialUtils.onEndScrol(100).then(loadMorePosts);
      this.nextPageButton.prop('disabled', false);
      this.nextPageButton.click(loadMorePosts);
    }else{
      this.nextPageButton.hide();
    }
  }

  showNewPosts(){
    const newPosts = this.newPosts;
    this.newPosts = {};
    this.newPostsButton.hide();
    const postKeys = Object.keys(newPosts);

    for(let i = 0; i < postKeys.length; i++){
      this.noPostsMessage.hide();
      const post = newPosts[postKeys[i]];
      const postElement = friendlyPix.post.clone();
      this.posts.push(postElement);
      this.feedImageContainer.prepend(postElement.fillPostData(postKeys[i], post.thumb_url || post.url, post.text, post.author, post.timestamp, null, null, post.full_url));
    }
  }

  showGeneralFeed(){
    this.clear();
    friendlyPix.firebase.getPosts().then(data => {
      const latestPostId = Object.keys(data.entries)[Object.keys(data.entries).length-1];
      friendlyPix.firebase.subscribeToGeneralFeed(
        (postId, postValue) => this.addNewPost(postId, postValue), latesPostId
      );
      this.addPosts(data.entries);
      this.toggleNextPageButton(data.nextPage);
    });
    friendlyPix.firebase.registerForPostsDeletion(postId => this.onPostDeleted(postId));
  }

  showHomeFeed(){
    this.clear();
    if(this.auth.currentUser){
      friendlyPix.firebase.updateHomeFeeds().then(() => {
        friendlyPix.firebase.getHomeFeedPosts().then(data => {
          const postIds = Object.keys(data.entries);
          if(postIds.length === 0){
            this.noPostsMessage.fadeIn();
          }
          const latestPostId = postIds[postIds.length -1];
          friendlyPix.firebase.subscribeToHomeFeed(
            (postId, postValue) => {
              this.addNewPost(postId, postValue);
            },latestPostId
          );
          this.addPosts(data.entries);
          this.toggleNextPageButton(data.nextPage);
        });
        friendlyPix.firebase.startHomeFeedLiveUpdaters();
        friendlyPix.firebase.registerForPostsDeletion(postId => this.onPostDeleted(postId));
      });
    }
  }

  onPostDeleted(postId){
    if(this.newPost[postId]){
      delete this.newPosts[postId];
      const nbNewPosts = Object.keys(this.newPosts).length;
      this.newPostsButton.text(`Display ${nbNewPosts} new posts`);
      if(nbNewPosts === 0){
        this.newPostsButton.hide();
      }
    }

    $(`.fp-post-${postId}`, this.pageFeed).remove();
  }

  addNewPost(postId, postValue){
    this.newPosts[postId] = postValue;
    this.newPostsButton.text(`Display ${Object.keys(this.newPosts).length} new posts`);
    this.newPostsButton.show();
  }

  clear(){
    $('.fp-post', this.feedImageContainer).remove();
    this.nextPageButton.hide();
    this.newPostsButton.hide();
    this.nextPageButton.unbind('click');
    friendlyPixMaterlUtils.stopOnEndScrolls();
    this.newPosts = {};
    this.noPostsMessage.hide();
    friendlyPix.firebase.cancelAllSubscriptions();
    this.posts.forEach(post => post.clear());
    this.post = [];
  }
};
friendlyPix.feed = new FriendlyPix.Feed();
