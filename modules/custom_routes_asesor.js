middleware = require('./middlewares');
var mysql = require('mysql');
var connection = require('./db');
var moment = require('moment');


module.exports = function(app,io){

    //DEVUELVE LOS OPTION DE LA BASE DE SEPOMEX
    app.post('/getMunicipio', middleware.requireLogin, function (req, res) {
        var estado = req.body.estado;

        query = 'SELECT distinct(municipio) as municipio FROM sepomex where estado = ? order by municipio';
        inserts = [estado];
        query = mysql.format(query, inserts);
        response = [];
        console.log(query);
        connection.query(query, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    'municipio': element.municipio
                }
                response.push(row);
            });
            res.send(response);
        });
    });

    //DEVUELVE LOS OPTION DE LA BASE DE SEPOMEX
    app.post('/getColonia', middleware.requireLogin, function (req, res){
        var municipio = req.body.municipio;
        var estado = req.body.estado;
        query = 'SELECT distinct(colonia) as colonia FROM sepomex where estado = ? and municipio = ? order by colonia';
        inserts = [estado,municipio];
        query = mysql.format(query,inserts);
        response = [];
        console.log(query);
        connection.query(query, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    'colonia': element.colonia
                }
                response.push(row);
            });
            res.send(response);
        });
    });

    //DEVUELVE LOS OPTION DE LA BASE DE SEPOMEX
    app.post('/getCP', middleware.requireLogin, function (req, res) {
        var estado = req.body.estado;
        var municipio = req.body.municipio;
        var colonia = req.body.colonia;
        query = 'SELECT cp FROM sepomex where estado = ? and municipio = ? and colonia = ? order by cp';
        inserts = [estado,municipio,colonia];
        query = mysql.format(query, inserts);
        response = [];
        console.log(query);
        connection.query(query, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    'cp': element.cp
                }
                response.push(row);
            });
            res.send(response);
        });
    });

    

    

    
    

    

    
    app.get('*', function (req, res) {
        res.status(404).send('Error 404');
    });
}