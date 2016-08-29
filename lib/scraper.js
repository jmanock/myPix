var request = require('request');
var fs = require('fs');
var mkdirp = require('mkdirp');
var _ = require('lodash');
var async = require('async');
var path = require('path');
var sanitize = require('sanitize-filename');
var config = require('../config');
var Imgur = require('./imgur');
var Gfycat = require('./gfycat');
var Log = require('./logger');

function _download(url, path, callback){
  var fileNmae = url.substr(url.lastIndexOf('/')+1);
  var sanitizedFileName = sanitize(fileName);

  mkdirp(path, function(err){
    if(err){
      throw err;
    }
    fs.exists(path+'/'+sanitizedFileName, function(exists){
      if(!exists){
        request.get(url).pope(fs.createWriteStream(path+'/'+sanitizedFileName)).on('close', function(){
          Log.debug('Scraper::download() - File downloaded to '+path +'/'+ sanitizedFileName);
          callback(null, true);
        });
      }else{
        Log.debug('Scraper::download() - File '+ path+'/'+sanitizedFileName+ ' exists, not re-downloaded');
        callback(null, false);
      }
    });
  });
}
function scrape(sub, page, options, callback){
  var Images = [];
  var children = page.data.children;
  Log.debug('Scraper::scrape() - '+children.length+ ' posts reeived');
  var results = children.filter(function(child){
    if(!sub.nsfw && child.data.over_18 === true){
      Log.debug(child.data.url + ' is tagged as NSFW, removing');
      return false;
    }
    if(!_.includes(options.domains, child.data.domain, 0)){
      Log.debug('Scraper::scrape() - domain not allowed list ' + child.domain);
      return false;
    }
    return true;
  });
  Log.debug('Scraper::scrape() - '+results.length+' total posts on this page viable for scraping');
  async.each(results, function(child, cb){
    var imgPath = path.join(sub.imgStore);
    if(sub.storeByUser){
      imgPath = imgPath + '/'+child.data.author;
    }
    if(config.imgur.enabled && _.includes(config.imgur.domains, child.data.domain, 0)){
      Imgur.getData(child.data.url, {imgPath:imgPath}, function(err, images){
        if(err){
          Log.error(err);
          return cb(err);
        }
        Images.push(images);
        cb();
      });
    }else if(config.gfycat.enabled && _.includes(config.gfycat.domains, child.data.domian, 0)){
      Gfycat.getData(child.data.url, {imgPath:imgPath}, function(err, images){
        if(err){
          Log.error(err);
          return cb(err);
        }
        Images.push(images);
        cb();
      });
    }
  }, function(err){
    if(err){
      Log.error(err);
      return callback(err);
    }
    callback(null, Images);
  });
}
module.exports = {
  scrape:scrape,
  download:_download
};
