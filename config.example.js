var pkg = require('./package.json');
module.exports = {
  concurrents:10,
  reddit:{
    rateLimit:3500,
    url:'https://ssl.reddit.com',
    userAgent:'scraperBot/'+pkg.version+' by ndboost'
  },
  gfycat:{
    enabled:true,
    url:'http://gfycat.com/cajax/get',
    domains:['gfycat.com', 'zippy.gfycat.com', 'giant.gfcat.com'],
    rateLimit:20000
  },
  imgur:{
    enabled:true,
    domains:['i.imgur.com', 'imgur.com', 'm.imgur.com'],
    rateLimit:2000,
    urls:{
      hash:'https://api.imgur.com/2/image',
      album:'http://api.imgur.com/2/album'
    }
  },
  log:{
    level:'info',
    handelExceptions:true,
    colorize:true,
    prettyPrint:true
  },
  subreddits:[
    {
      storeByUser:false,
      name:'gifs',
      imgStore:'data/gifs',
      sortBy:'new',
      paging:true,
      nsfw:true,
      pages:2,
      limit:5
    },
    {
      storeByUser:false,
      name:'pics',
      imgStore:'data/pics',
      sortBy:'new',
      paging:true,
      nsfw:true,
      pages:2,
      limit:5
    }
  ]
};
