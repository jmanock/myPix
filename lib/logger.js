var winston = require('winston');
var config = require('../config');
var log = new winston.Logger({
  trasnsports:[new winston.transports.Console(config.log)]
});
module.exports = log;
