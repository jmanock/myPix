var request = require('request');
var config = require('../config');
var Log = require('../logger');
var _ = require('lodash');

function _request(url, callback){
  Log.debug('Imgur::_request() - Getting data from url ' + url);
  request.get(url, function(err, res){
    if(err){
      Log.error('Imgur::_request() - ' + err);
      return callback(err);
    }
    if(res.statusCode !== 200){
      Log.error('Imgur::_request() - ' + res.body);
      return callback(res.body);
    }
    Log.debug('Imgur::_request() - data retrieved');
    callback(null, JSON.parse(res.body));
  });
}
var Imgur;
Imgur = {
  getData:function getData(url, options, callback){
    options = _.extend({}, config.imgur, options);
    var hash = url.match(new RegExp(/^https?:\/\/(www.)?imgur.com\/(?!gallery|a\/)([a-zA-Z0-9]+)/));
    var image = url.match(new RegExp(/^https?:\/\/(www.)?i.imgur.com\/([a-zA-Z0-9]+)\.(['jpg'|'gif'|'gifv'|'webm'|'png']+)/));
    var album = url.match(new RegExp(/^https?:\/\/(www.)?imgur.com\/a\/([a-zA-Z0-9]+)/));
    var payload = {};

    if(hash){
      payload = {type:'hash', url:options.urls.hash + '/'+hash[2]+'.json'};
    }else if(album){
      payload = {type:'album', url:options.urls.album + '/'+album[2]+'.json'};
    }else{
      payload = {type:'image', url:url};
    }
    Log.debug('Imgur::getData() - '+ payload.url+'is a' + payload.type);
    switch(payload.type){
      case 'hash':
      Log.debug('Imgur::getData()::hash - requesting data from imgur api');
      _request(payload.url, function(err, image){
        if(err){
          Log.error(err);
          return callback(err);
        }
        Log.debug('Imgur::getData()::hash - data retrieved', image.image.links.original);
        return callback(null, [{url:image.image.links.original, imagePath:options.imagePath}]);
      });
      break;
      case 'album':
      var _images = [];
      Log.debug('Imgur::getData()::album - requesting data from imgur api');
      _request(payload.url, function(err, images){
        if(err){
          Log.error(err);
          return callback(err);
        }
        images = images.album.images;
        for(var i = 0; i< images.length; i++){
          _images.push({url:images[i].links.original, imgPath:options.imgPath});
        }
        return callback(null, _images);
      });
      break;
      case 'image':
      default:
        return callback(null, [{url:payload.url, imgPath:options.imgPath}]);
    }
  }
};
module.exports = Imgur;
