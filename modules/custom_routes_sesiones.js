middleware = require('./middlewares');
var mysql = require('mysql');
var connection = require('./db');
var moment = require('moment');


module.exports = function (app, io) {




//CONTROL DE SESIONES --------------------------------------------------------------


    

    //DASHBOARD -----------------------------------------------------------------------
    app.get('/dashboard', middleware.requireLogin, function (req, res) {
        if ((req.sessiondsc.profile === 6) || (req.sessiondsc.profile === 3)) {
            res.render('dashboard', {
                name: req.sessiondsc.name,
                campaign: req.sessiondsc.campaign,
                iduser: req.sessiondsc.iduser
            });
        } else {
            res.redirect('/');
        }
    });
    //DASHBOARD -----------------------------------------------------------------------

    app.get('/', middleware.login_iniciated, function (req, res) {
        res.render('index');
        //res.render('analista');
    });

    

    app.get('/coordinador', middleware.requireLogin, function (req, res) {
        if (req.sessiondsc.profile === 'coordinador') {
            res.render('coordinador/coordinador', {
                name: req.sessiondsc.name,
                iduser: req.sessiondsc.iduser
            });
        } else {
            res.redirect('/supervisor');
        }
    });

    app.get('/supervisor', middleware.requireLogin, function (req, res) {
        if (req.sessiondsc.profile === 'supervisor') {
            res.render('supervisor/supervisor', {
                name: req.sessiondsc.name,
                iduser: req.sessiondsc.iduser
            });
        } else {
            res.redirect('/noc');
        }
    });

    app.get('/noc', middleware.requireLogin, function (req, res) {
        if (req.sessiondsc.profile === 'noc') {
            res.render('noc/noc', {
                name: req.sessiondsc.name,
                iduser: req.sessiondsc.iduser
            });
        } else {
            res.redirect('/asesor');
        }
    });

    app.get('/asesor', middleware.requireLogin, function (req, res) {
        if (req.sessiondsc.profile === 'asesor') {
            res.render('asesor/asesor', {
                name: req.sessiondsc.name,
                iduser: req.sessiondsc.iduser
            });
        } else {
            res.redirect('/coordinador');
        }
    });




    app.post('/login', function (req, res) {
        var user = req.body.user;
        var password = req.body.password;
        var result = [];

        console.log("intentando login backend")

        //connection.connect();
        var query = "SELECT * FROM ?? WHERE ?? = ? LIMIT 1";
        var inserts = ['users', 'username', user];
        query = mysql.format(query, inserts);

        connection.getConnection(function(err,conn){
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                validate(results[0]);
            });
            conn.release();
        });
        

        //connection.end();
        

        function validate(rows) {
             console.log('Validando rows') 
            result = rows;
            if (result != undefined) {
                var mysql_username = result.username;
                var estatus = result.estatus;

                var mysql_profile = result.rol;
                var mysql_password = result.password;
                var mysql_id = result.iduser;
                var mysql_name = result.nombre;
                
                if ((mysql_password === password) && (estatus == 'activo')) {
                    req.sessiondsc.user = mysql_username;
                    req.sessiondsc.profile = mysql_profile;
                    req.sessiondsc.iduser = mysql_id;
                    req.sessiondsc.name = mysql_name;


                     console.log('Intentando enviar response') 
                    if (req.sessiondsc.profile == 'asesor') { //asesor
                        res.send('asesor');
                        timestamp_lastlogin(req.sessiondsc.iduser);
                    } else if (req.sessiondsc.profile == 'noc') { //analista
                        res.send('noc');
                        timestamp_lastlogin(req.sessiondsc.iduser);
                    } else if (req.sessiondsc.profile == 'supervisor') { //supervisor
                        res.send('supervisor');
                        timestamp_lastlogin(req.sessiondsc.iduser);
                    } else if (req.sessiondsc.profile == 'coordinador') { //cerrador
                        res.send('coordinador');
                        timestamp_lastlogin(req.sessiondsc.iduser);
                    } else {
                        res.send('Usuarios ok, pero la DB es inconsistente con algun dato:' + req.sessiondsc.profile)
                    }
                } else {
                    res.send('error');
                }
            } else {
                res.send('error');
            }

        }//fin de la funcion validate



        function timestamp_lastlogin(iduser) {
            var query = "UPDATE users SET ultimologin = now() WHERE iduser = ?";
            var inserts = [req.sessiondsc.iduser];
            query = mysql.format(query,inserts);
            connection.getConnection(function(err,conn){
                conn.query(query, function (error, results, field) {
                if (error) throw error;
                console.log('Usuario logueado: ' + iduser);
                });
                conn.release();
            });
            
        } // fin de la funcion timestamp_lastlogin
    });

    app.get('/logout', function (req, res) {
        req.sessiondsc.reset();
        //capturasFromNodeJS = "";
        res.redirect('/');

    });

}