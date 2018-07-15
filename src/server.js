var express = require('express');
var express_app = express();
var server = express_app.listen(1000, function(){
  console.log('Started to listen on port 1000.')
});

// Log message
var lstr = '[ SVR ] ';

var socket = require('socket.io');

express_app.use(express.static('static'))
var io = socket(server)
