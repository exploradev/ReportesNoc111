var express = require('express');
var bodyParser = require('body-parser');
var session = require('client-sessions');
var app = express();

//NO CACHE
app.use(function (req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next()
});
//FIN DE NO CACHE

var server = app.listen(2264, function(){
  console.log('Explora264 running port 2264');
});

var io = require('socket.io').listen(server);


app.set('view engine', 'pug');
app.set('views' , __dirname + '/views');
app.use(express.static('statics'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  cookieName: 'session',
  secret: 'doranringludenlichemorellorabadonbootsnashor',
  duration: 24 * 60  * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  cookie: {
    
    ephemeral: true, // when true, cookie expires when the browser closes 
    
  }
}));

require('./modules/custom_routes_coordinador')(app, io);
require('./modules/custom_routes_super')(app, io);
require('./modules/custom_routes_noc')(app, io);
require('./modules/custom_routes_dashboard')(app, io);
require('./modules/custom_routes_sesiones')(app, io);
require('./modules/custom_routes_websockets')(app, io);
require('./modules/custom_routes_asesor')(app,io);


