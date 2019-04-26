middleware = require('./middlewares');
var mysql = require('mysql');
var connection = require('./db');
var moment = require('moment');


module.exports = function(app,io){

    app.post('/getNocs', middleware.requireLogin, function (req, res) {
        var query = "SELECT iduser, nombre from users where rol = 'noc' and estatus = 'activo'";
        connection.query(query, function (error, results, field) {
            if (error) throw error;
            res.send(results);
        });
    }); //fin del /getTotalReportes


    app.post('/reasignacion_propietario', middleware.requireLogin, function (req, res) {
        var iduser = req.body.iduser;
        var idmetadatos = req.body.idmetadatos;
        var query = "UPDATE metadatos SET propietario = ? WHERE idmetadatos = ?";
        var inserts = [iduser,idmetadatos];
        query = mysql.format(query,inserts);
        connection.query(query, function (error, results, field) {
            if (error) throw error;
            io.emit('new', 'nuevo_reasignacion');
            res.send("Correcto");
        });
    }); //fin del /getTotalReportes

    

}// fin del archivo