middleware = require('./middlewares');
var mysql = require('mysql');
var connection = require('./db');
var moment = require('moment');


module.exports = function(app,io){

    

    

    moment.locale('es');


    //OPERACIONES CRUD ------------------------
    

    

    
    app.get('*', function (req, res) {
        res.status(404).send('Error 404');
    });
}