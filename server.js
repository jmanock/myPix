var Hapi = require('hapi');
var path = require('path'),
var port = process.env.PORT || 3000;
var server = new Hapi.Server(port);
var routes = {
  css:{
    method:'GET',
    path:'/styles/{path*}',
    handler:createDirectoryRoute('styles')
  },
  js:{
    method:'GET',
    path:'/scripts/{path*}',
    handler:createDirectoryRoute('scripts')
  },
  assets:{
    method:'GET',
    path:'/assets/{path*}',
    handler:createDirectoryRoute('assets')
  },
  templates:{
    method:'GET',
    path:'/templaters/{path*}',
    handler:createDirectoryRoute('templates')
  },
  spa:{
    method:'GET',
    path:'/{path*}',
    handler:{
      path.join(__dirname, '/dist/index.html')
    }
  }
};

server.route([routes.css, routes.js, routes.assets, routes.templates, routes.spa]);
server.start(onServerStarted);
