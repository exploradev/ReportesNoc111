middleware = require('./middlewares');
var mysql = require('mysql');
var connection = require('./db');
var moment = require('moment');


module.exports = function (app, io) {




//CONTROL DE SESIONES --------------------------------------------------------------


    

    //DASHBOARD -----------------------------------------------------------------------
    app.get('/dashboard', middleware.requireLogin, function (req, res) {
        if ((req.session.profile === 6) || (req.session.profile === 3)) {
            res.render('dashboard', {
                name: req.session.name,
                campaign: req.session.campaign,
                iduser: req.session.iduser
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
        if (req.session.profile === 'coordinador') {
            res.render('coordinador', {
                name: req.session.name,
                iduser: req.session.iduser
            });
        } else {
            res.redirect('/supervisor');
        }
    });

    app.get('/supervisor', middleware.requireLogin, function (req, res) {
        if (req.session.profile === 'supervisor') {
            res.render('supervisor', {
                name: req.session.name,
                iduser: req.session.iduser
            });
        } else {
            res.redirect('/noc');
        }
    });

    app.get('/noc', middleware.requireLogin, function (req, res) {
        if (req.session.profile === 'noc') {
            res.render('noc', {
                name: req.session.name,
                iduser: req.session.iduser
            });
        } else {
            res.redirect('/asesor');
        }
    });

    app.get('/asesor', middleware.requireLogin, function (req, res) {
        if (req.session.profile === 'asesor') {
            res.render('asesor', {
                name: req.session.name,
                iduser: req.session.iduser
            });
        } else {
            res.redirect('/coordinador');
        }
    });




    app.post('/login', function (req, res) {
        var user = req.body.user;
        var password = req.body.password;
        var result = [];



        //connection.connect();
        var query = "SELECT * FROM ?? WHERE ?? = ? LIMIT 1";
        var inserts = ['users', 'username', user];
        query = mysql.format(query, inserts);

        connection.query(query, function (error, results, field) {
            if (error) throw error;
            validate(results[0]);

        });

        //connection.end();
        

        function validate(rows) {
            result = rows;
            if (result != undefined) {
                var mysql_username = result.username;
                var estatus = result.estatus;

                var mysql_profile = result.rol;
                var mysql_password = result.password;
                var mysql_id = result.iduser;
                var mysql_name = result.nombre;
                
                if ((mysql_password === password) && (estatus == 'activo')) {
                    req.session.user = mysql_username;
                    req.session.profile = mysql_profile;
                    req.session.iduser = mysql_id;
                    req.session.name = mysql_name;



                    if (req.session.profile == 'asesor') { //asesor
                        res.send('asesor');
                        timestamp_lastlogin(req.session.iduser);
                    } else if (req.session.profile == 'noc') { //analista
                        res.send('noc');
                        timestamp_lastlogin(req.session.iduser);
                    } else if (req.session.profile == 'supervisor') { //supervisor
                        res.send('supervisor');
                        timestamp_lastlogin(req.session.iduser);
                    } else if (req.session.profile == 'coordinador') { //cerrador
                        res.send('coordinador');
                        timestamp_lastlogin(req.session.iduser);
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
            var inserts = [req.session.iduser];
            query = mysql.format(query,inserts);
            connection.query(query, function (error, results, field) {
                if (error) throw error;
                console.log('Usuario logueado: ' + iduser);
            });
        } // fin de la funcion timestamp_lastlogin
    });

    app.get('/logout', function (req, res) {
        req.session.reset();
        //capturasFromNodeJS = "";
        res.redirect('/');

    });

}