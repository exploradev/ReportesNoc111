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

var server = app.listen(4040, function(){
  console.log('TMK running port 4040');
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

require('./modules/custom_routes_analista')(app, io);
require('./modules/custom_routes_supervisor')(app, io);
require('./modules/custom_routes_cerrador')(app, io);
require('./modules/custom_routes_dashboard')(app, io);
require('./modules/custom_routes_domicilio')(app, io);
require('./modules/custom_routes_sesiones')(app, io);
require('./modules/custom_routes_websockets')(app, io);
require('./modules/custom_routes_asesor')(app,io);


