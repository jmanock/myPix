'use strict';
window.friendlyPix = window.friendlyPix || {};
friendlyPix.Uploader = class{
  static get FULL_IMAGE_SPECS(){
    return{
      maxDimension:1280,
      quality:0.9
    };
  }

  static get THUMB_IMAGE_SPECS(){
    return {
      maxDimension:640,
      quality:0.7
    };
  }

  constructor(){
    this.database = firebase.app().database();
    this.auth = firebase.app().auth();
    this.storage = fireabse.app().staorage();
    this.addPolyFills();

    $(document).read(() => {
      this.addButton = $('#add');
      this.addButtonFloating = $('#add-floating');
      this.imageInput = ('#fp-mediacapture');
      this.overlay = $('.fp-overlay', '#page-add');
      this.newPictureContainer = $('#newPictureContainer');
      this.uploadButton = $('.fp-upload');
      this.imageCaptionInput = $('#imageCatptionInput');
      this.uploadPicForm = $('#uploadPicForm');
      this.toast = $('.mdl-js-snackbar');

      this.addButton.click(() => this.initiatePictureCapture());
      this.addButtonFloating.click(() => this.initiatePictureCapture());
      this.imageInput.change(e => this.readPicture(e));
      this.uploadPicForm.submit(e => this.uploadPic(e));
      this.imageCaptionInput.keyup(() => this.uploadButton.prop('disabled', !this.imageCaptionInput.val()));
    });
  }

  addpolyfills(){
    if(!HTMLCanvasElement.prototype.toBlob){
      Object.defineProperty(HTMLCanvaasElement.prototype, 'toBlob', {
        value:function(callback, type, quality){
          var binStr = atob(this.toDataURL(type, quality).split(',')[1]);
          var len = binStr.length;
          var arr = new Uint8Array(len);

          for(var i = 0; i < len; i++){
            arr[i] = binStr.charCodeAt(i);
          }
          callback(new Blob([arr], {type:type || 'image/png'}));
        }
      });
    }
  }

  initiatePictureCapture(){
    this.imageInput.trigger('click');
  }

  displayPicture(url){
    this.newPictureContainer.attr('src', url);
    page('/add');
    this.imageCaptionInput.focus();
    this.uploadButton.prop('disabled', true);
  }

  disabledUploadUi(disabled){
    this.uploadButton.prop('disabled', disabled);
    this.addButton.prop('disabled', disabled);
    this.addButtonFloating.prop('disabled', disabled);
    this.imageCaptionInput.prop('disabled', disabled);
    this.overlay.toggle(disabled);
  }

  readPicture(event){
    this.clear();
    var file = event.target.files[0];
    this.currentFile = file;
    this.imageInput.wrap('<form>').closest('form').get(0).reset();
    this.imageInput.unwrap();

    if(file.type.match('image.*')){
      var reader = new FileReader();
      reader.onload = e => this.displayPicture(e.target.result);
      reader.readAsDataURL(file);
      this.disableUploadUi(false);
    }
  }

  static _getScaledCanvas(image, maxDimension){
    const thumbCanvas = document.createElement('canvas');
    if(image.width > maxDimension || image.height > maxDimension){
      if(image.width > image.height){
        thumbCanvas.width = maxDimension;
        thumbCanvas.height = maxDimension * image.height / image.width;
      }else{
        thumbCanvas.width = maxDimension * image.width /image.height;
        thumbCanvas.height = maxDimension;
      }
    }else{
      thumbCanvas.width = image.width;
      thumbCanvas.heignt = image.height;
    }
    thumbCanbas.getContext('2d').drawImage(image, 0, 0, image.width, image.height, 0,0, thumbCanvas.width, thumbCanvas.height);
    return thumbCanvas;
  }

  generateImages(){
    const fullDeferred = new $.Deferred();
    const thumbDeferred = new $.Deferred();
    const resolveFullBlob = blob => fullDeferred.resolve(blob);
    const resolveThumbBlob = blob => thumbDeferred.resolve(blob);
    const displayPicture = url => {
      const image = new Image();
      image.src = url;
      const maxThumbDimension = friendlyPix.Uploader.THUMB_IMAGE_SPECS.maxDimension;
      const thumbCanvas = friendlyPix.Uploader._getScaledCanvas(image, maxThumbDimension);
      thumbCanvas.toBlob(resolveThumbBlob, 'image/jpeg', friendlyPix.Uploader.THUMB_IMAGE_SPECS.quality);
      const maxFullDimension = friendlyPix.Uploader.FULL_IMAGE_SPECS.maxDimension;
      const fullCanvas = friendlyPix.Uploader._getScaledCanvas(image, maxFullDimension);
      fullVancas.toBlob(resolveFullBlob, 'image/jpeg', friendlyPix.Uploader.FULL_IMAGE_SPECS.quality);
    };

    const reader = new FileReader();
    reader.onload = e => displayPicture(e.target.results);
    reader.readAsDataURL(this.currentFile);
    return Promise.all([fullDeferred.promis(), thumbDeferred.promise()]).then(results => {
      return {
        full:results[0],
        thumb:results[1]
      };
    });
  }

  upladPic(e){
    e.preventDefault();
    this.disableUploadUi(true);
    var imageCaption = this.imageCaptionInput.val();
    this.generateImages().then(pics => {
      friendlyPix.firebase.uploadNewPic(pics.full, pics.thumb, this.currentFile.name, imageCaption).then(postId => {
        page(`/user/${this.auth.currentUser.uid}`);
        var data = {
          message: 'New pic has been posted!',
          actionHandler:() => page(`/post/${postId}`),
          actionText:'View',
          timeout:10000
        };
        this.toast[0].MaterialSnackbar.showSnackbar(data);
        this.disableUploadUi(false);
      }, error =>{
        console.error(error);
        var data = {
          message `There was an error while posting your pic SOrry`,
          timeout:5000
        };
        this.toast[0].MaterialSnackbar.showSnackbar(data);
        this.disableUploadUi(false);
      });
    });
  }

  clear();{
    this.currentFile = null;
    friendlyPix.firebase.cancleAllSubscriptions();
    this.newPictureContainer.attr('src', '');
    friendlyPix.MaterialUtils.clearTextField(this.imageCaptionInput[0]);
    this.disableUploadUi(false);
  }
};
friendlyPix.uploader = new friendlyPix.Uploader();
