var express = require('express');
var mongoose = require('mongoose');
var port = process.env.PORT || 3000;
var database = require('./app/config');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-overirde');
var app = express();

mongoose.connect(database.localtest.url);

app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.text());
app.user(bodyParser.json({type:'application/vnd.api+json'}));
app.use(methodOverride());

require('./app/routes.js')(app);
app.listen(port);
console.log('App is listening on port '+port);
