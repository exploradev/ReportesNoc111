middleware = require('./middlewares');
var mysql = require('mysql');
var connection = require('./db');
var moment = require('moment');


module.exports = function (app, io) {




//CONTROL DE SESIONES --------------------------------------------------------------


    //Analista a domicilio -----------------------------------------------------------------------
    app.get('/domicilio', middleware.requireLogin, function (req, res) {
        if ((req.session.profile === 8)) {
            res.render('domicilio', {
                name: req.session.name,
                campaign: req.session.campaign,
                iduser: req.session.iduser
            });
        } else {
            res.redirect('/asesor');
        }
    });

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

    

    app.get('/supervisor', middleware.requireLogin, function (req, res) {
        if (req.session.profile === 3) {
            res.render('supervisor', {
                name: req.session.name,
                iduser: req.session.iduser
            });
        } else {
            res.redirect('/dashboard');
        }
    });

    app.get('/asesor', middleware.requireLogin, function (req, res) {
        if ((req.session.profile === 2) || (req.session.profile === 7)) {
            res.render('asesor', {
                name: req.session.name,
                campaign: req.session.campaign,
                iduser: req.session.iduser,
                rol: req.session.profile
            });
        } else {
            res.redirect('/analista');
        }
    });

    app.get('/analista', middleware.requireLogin, function (req, res) {
        if (req.session.profile === 4) {
            res.render('analista', {
                name: req.session.name,
                iduser: req.session.iduser
            });
        } else {
            res.redirect('/cerrador');
        }
    });

    app.get('/cerrador', middleware.requireLogin, function (req, res) {
        if (req.session.profile === 5) {
            res.render('cerrador', {
                name: req.session.name,
                iduser: req.session.iduser
            });
        } else {
            res.redirect('/supervisor');
        }
    });




    app.post('/login', function (req, res) {
        var user = req.body.user;
        var password = req.body.password;
        var result = [];



        //connection.connect();
        var query = "select user.iduser, user.idrol, user.name, user.lastname, user.username, user.password, user.active, campaign.name as campaign_name from ?? right join ?? on user.idcampaign = campaign.idcampaign  where user.?? = ? ";
        var inserts = ['user', 'campaign', 'username', user];
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
                var active = result.active;
                var mysql_profile = result.idrol;
                var mysql_password = result.password;
                var mysql_idcampagin = result.campaign_name;
                var mysql_id = result.iduser;
                var mysql_name = result.name;
                var mysql_surname = result.lastname;
                if ((mysql_password === password) && (active == 1)) {
                    req.session.user = mysql_username;
                    req.session.profile = mysql_profile;
                    req.session.iduser = mysql_id;
                    req.session.campaign = mysql_idcampagin;
                    req.session.name = mysql_name + " " + mysql_surname;



                    if (req.session.profile == '2') { //asesor
                        res.send('asesor');
                    } else if (req.session.profile == '4') { //analista
                        res.send('analista');
                    } else if (req.session.profile == '3') { //supervisor
                        res.send('supervisor');
                    } else if (req.session.profile == '5') { //cerrador
                        res.send('cerrador');
                    } else if (req.session.profile == '6') { //dashboard
                        res.send('dashboard');
                    } else if (req.session.profile == '7') { //capacitacion
                        res.send('asesor');
                    } else if (req.session.profile == '8') { //Analista domicilio
                        res.send('domicilio');
                    }
                } else {
                    res.send('error');
                }
            } else {
                res.send('error');
            }

        }//fin de la funcion validate
    });

    app.get('/logout', function (req, res) {
        req.session.reset();
        //capturasFromNodeJS = "";
        res.redirect('/');

    });

}