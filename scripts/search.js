'use strict';
window.friendlyPix = window.friendlyPix || {};

friendlyPix.Search = class{
  static get MIN_CHARACTERS(){
    return 3;
  }

  static get NB_RESULTS_LIMIT(){
    return 10;
  }

  constructor(){
    this.database = firebase.app().database();
    $(document).ready(() => {
      this.searchField = $('#searchQuery');
      this.searchResults = $('#fp-searchResults');
      this.searchField.keyup(() => this.displaySearchResults());
      this.searchField.focus(() => this.displaySearchResults());
      this.searchField.click(() => this.displaySearchResults());
    });
  }

  displaySearchResults(){
    const searchString = this.searchField.val().toLowerCase().trim();
    if(searchString.length >= friendlyPix.Search.MIN_CHARACTERS){
      friendlyPix.firebase.searchUsers(searchString, friendlyPix.Search.NB_RESULTS_LIMIT).then(results => {
        this.searchResults.empty();
        const peopleIds = Object.keys(results);
        if(peopleIds.length > 0){
          this.searchResults.fadeIn();
          $('html').click(() => {
            $('html').unbind('click');
            this.searchResults.fadeOut();
          });
          peopleIds.forEach(peopleId => {
            const profile = results[peopleId];
            this.searchResults.append(friendlyPix.Search.createSearchResultHtml(peopleId, profile));
          });
        }else{
          this.searchResults.fadeOut();
        }
      });
    }else{
      this.searchResults.empty();
      this.searchResults.fadeOut();
    }
  }

  static createSearchResultHtml(peopleId, peopleProfile){
    return `
    <a class="fp-searchResultItem fp-usernamelink mdl-button mdl-js-button" href="/user/${peopleId}">
    <div class='fp-avatar' style='background-image:url(${peopleProfile.profile_picture || "/images/silhouette.jpg"})'></div>
    <div class='fp-username mdl-color-text--black'>${peopleProfile.full_name}</div></a>`;
  }
};
friendlyPix.search = new friendlyPix.Search();
