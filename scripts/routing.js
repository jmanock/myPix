'use strict';
window.friendlyPix = window.friendlyPix || {};

friendlyPix.Router = class{
  constructor(){
    $(document).ready(() => {
      friendlyPix.auth.waitForAuth.then(() =>{
        this.pagesElements = $('[id^=page-]');
        this.splashLogin = $('#login', '#page-splash');

        if(window.location.pathname === '/add'){
          page('/');
        }
        const pipe = friendlyPix.Router.pipe;
        const displayPage = this.displayPage.bind(this);
        const loadUser = userId => friendlyPix.userPage.loadUser(userId);
        const showHomeFeed = () => friendlyPix.feed.showHomeFeed();
        const showGeneralFeed = () => friendlyPix.feed.showGeneralFeed();
        const clearFeed = () => friendlyPix.feed.clear();
        const showPost = postId => friendlyPix.post.loadPost(postId);

        page('/', pipe(showHomeFeed, null, true),
          pipe(displayPage, {pageId:'feed', onlyAuthed: true}));
        page('/feed', pipe(showGeneralFeed, null, true), pipe(displayPage, {pageId: 'feed'}));
        page('/posts/:[postId],' pipe(showPost, null, true), pipe(displayPage, {pageId:'post'}));
        page('/user/:userId', pipe(loadUser, null, true), pipe(displayPage, {pageId:'user-info'}));
        page('/about', pipe(clearFeed, null, true), pipe(displayPage, {pageId:'about'}));
        page('/add', pipe(displayPgae, {pageId:'add', onlyAuthed:true}));
        page('*', () => page('/'));
        page();
      });
    });
  }

  displayPage(attributes, context){
    const onlyAuthed = attributes.onlyAuthed;
    let pageId = attributes.pageId;

    if(onlyAuthed && !firebase.app().auth().currentUser){
      pageId = 'splash';
      this.splashLogin.show();
    }
    friendlyPix.Router.setLinkAsActive(contex.canonicalPath);
    this.pagesElements.each(function(index, element){
      if(element.id === 'page-'+pageId){
        $(element).show();
      }else if(element.id === 'page-splash'){
        $(element).fadeOut(1000);
      }eles{
        $(element).hide();
      }
    });
    friendlyPix.MaterialUtils.closeDrawer();
    friendlyPixRouter.scrollToTop();
  }
  reloadPage(){
    let path = window.location.pathname;
    if(path === ''){
      path = '/';
    }
    page(path);
  }

  static scrollToTop(){
    $('html, body').animate({scrollTop:0},0);
  }

  static pipe(funct, attribute, optContinue){
    return(context, next) =>{
      if(funct){
        const params = Object.eys(context.params);
        if(!attribute && params.length > 0){
          funct(context.params[params[0]], context);
        }else{
          funct(attribute, context);
        }
      }
      if(optContinue){
        next();
      }
    };
  }
  static setLinkAsActive(canonicalPath){
    if(canonicalPath === ''){
      canonicalPath = '/';
    }
    $('.is-active').removeClass('is-active');
    $(`[href="${canonicalPath}"]`).addClass('is-active');
  }
};
friendlyPix.router = new friendlyPix.Router();
