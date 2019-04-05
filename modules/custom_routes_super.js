middleware = require('./middlewares');
var mysql = require('mysql');
var connection = require('./db');
var moment = require('moment');


module.exports = function(app,io){

    

    //ALIMENTAR MODAL
    app.post('/getdatamodal', middleware.requireLogin, function (req, res) {
        var idrequest = req.body.idrequest;
        var query = "SELECT CONCAT(user.lastname, ' ' ,user.name) AS propietario, request.sisact as sisact, request.channel as canal, CONCAT(datacustomer.lastname,' ',datacustomer.name) AS cliente, datacustomer.contact_num AS contacto FROM request LEFT JOIN datacustomer ON request.idrequest = datacustomer.idrequest LEFT JOIN user ON user.iduser = request.iduser WHERE request.idrequest = ?";
        var inserts = [idrequest];
        var modaluserdata = [];
        var getComment = mysql.format(query, inserts);
        connection.query(getComment, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    'cliente': element.cliente,
                    'sisact': element.sisact,
                    'canal': element.canal,
                    'contacto': element.contacto,
                    'propietario': element.propietario
                }
                modaluserdata.push(row);
            });
            res.send(modaluserdata);
        });

    });

    //OPERACIONES CON LOS MODALES

    //RECHAZO
    app.post('/setreject', middleware.requireLogin, function (req, res) {
        var idrequest = req.body.idrequest;
        var motivo = req.body.motivo;

        var query = "UPDATE request SET reasoncorrected = ?, status = 'no finalizada' WHERE idrequest = ?";

        var inserts = [motivo,idrequest];
        

        var setreject = mysql.format(query, inserts);
        connection.getConnection(function (err, pool) {
            pool.beginTransaction(function (err) {
                if (err) throw err;
                pool.query(setreject, function (err, result) {
                    if (err) {
                        pool.rollback(function () {
                            throw err;
                        });
                    }
                    //en el ultimo update
                    pool.commit(function (err) {
                        if (err) {
                            pool.rollback(function () {
                                throw err;
                            });
                        }
                        console.log("Captura " + idrequest + " ha pasado a estatus de no finalizada con motivo: " + motivo);
                        res.send('Actualizado')
                    });//fin del commit
                });//fin del query a tabla request <------
            });// fin de beginTransaction
        }); //fin de getConnection

    });

    // RUTAS PARA INGRESAR TIMESTAMP AL DARLE SEGUIMIENTO POR PARTE DEL CERRADOR
    app.post('/setFirstStatusTimestamp', middleware.requireLogin, function (req, res) {
        var idrequest = req.body.idrequest;

        var queryselect = "SELECT firststatus FROM request WHERE idrequest = ?";
        var insertselect = [idrequest];
        var query_select = mysql.format(queryselect, insertselect);
        //console.log(query_select);
        connection.query(query_select, function (error, results) {
            if (error) throw error;
            //console.log(results[0].firststatus);
            if ((results[0].firststatus == null) || (results[0].firststatus == []) || (results[0].firststatus == '')){

                var query = "UPDATE request SET firststatus = now() WHERE idrequest = ?";
                var inserts = [idrequest];
                var query_timestamp = mysql.format(query, inserts);
                //console.log(query_timestamp);
                connection.query(query_timestamp, function (err, result) {
                    if (err) throw err;
                    res.send('ok');  
                    console.log('Primer seguimiento del cerrador a id' + idrequest);
                    
                });//fin del query a tabla request <------
                    
            }else{
                res.send('not timestamp');
            }

            
        });
        



        
        

    });

    //COMENTARIO
    app.post('/setcontinuity', middleware.requireLogin, function (req, res) {
        var observacion = req.body.observacion;
        var idrequest = req.body.idrequest;
        

        var query = "UPDATE request SET comntcontact = ? WHERE idrequest = ?";

        var inserts = [observacion, idrequest];


        var setcomentario = mysql.format(query, inserts);
        connection.getConnection(function (err, pool) {
            pool.beginTransaction(function (err) {
                if (err) throw err;
                pool.query(setcomentario, function (err, result) {
                    if (err) {
                        pool.rollback(function () {
                            throw err;
                        });
                    }
                    //en el ultimo update
                    pool.commit(function (err) {
                        if (err) {
                            pool.rollback(function () {
                                throw err;
                            });
                        }
                        console.log("Captura " + idrequest + " con seguimiento: " + observacion);
                        res.send('Actualizado')
                    });//fin del commit
                });//fin del query a tabla request <------
            });// fin de beginTransaction
        }); //fin de getConnection

    });

    //AGENDA
    app.post('/setScheduleForRequest', middleware.requireLogin, function (req, res) {
        var fecha = req.body.fecha;
        var cac = req.body.cac;
        var idrequest = req.body.idrequest;

        console.log(idrequest);
        var query = "UPDATE request SET scheduled = ?, cac = ? WHERE idrequest = ?";
        var inserts = [fecha, cac, idrequest];
        console.log(inserts);
        var updatestatus = mysql.format(query, inserts);

        connection.getConnection(function (err, pool) {
            pool.beginTransaction(function (err) {
                if (err) throw err;
                pool.query(updatestatus, function (err, result) {
                    if (err) {
                        pool.rollback(function () {
                            throw err;
                        });
                    }
                    //en el ultimo update
                    pool.commit(function (err) {
                        if (err) {
                            pool.rollback(function () {
                                throw err;
                            });
                        }
                        console.log('Captura ' + idrequest + ' se ha agendado a: ' + fecha + 'CAC: ' + cac);
                        res.send('Actualizado')
                    });//fin del commit
                });//fin del query a tabla request <------
            });// fin de beginTransaction
        }); //fin de getConnection
    });

    //MODIFICACION DE CANAL Y SISACT
    app.post('/setSisactCanal', middleware.requireLogin, function (req, res) {
        var idrequest = req.body.idrequest;
        var modificacion = req.body.modificacion;
        var atributodb = req.body.atributodb;

        if (atributodb == 'sisact') {
            var query = "UPDATE request SET sisact = ? WHERE idrequest = ?";
        } else if (atributodb == 'canal') {
            var query = "UPDATE request SET channel = ? WHERE idrequest = ?";
        }

        var inserts = [modificacion, idrequest];
        var updatestatus = mysql.format(query, inserts);

        connection.getConnection(function (err, pool) {
            pool.beginTransaction(function (err) {
                if (err) throw err;
                pool.query(updatestatus, function (err, result) {
                    if (err) {
                        pool.rollback(function () {
                            throw err;
                        });
                    }
                    //en el ultimo update
                    pool.commit(function (err) {
                        if (err) {
                            pool.rollback(function () {
                                throw err;
                            });
                        }
                        console.log(atributodb + ' actualizado ID: ' + idrequest + ' - modificado a : ' + modificacion);
                        res.send('Actualizado')
                    });//fin del commit
                });//fin del query a tabla request <------
            });// fin de beginTransaction
        }); //fin de getConnection
    });


    //OPERACIONES PARA ALIMENTAR TABLAS DE ESTADISTICAS DE ANALISTA CON AJAX Y WEBSOCKETS-----------


    app.post('/statisticscerrador', middleware.requireLogin, function (req, res) {
        
        var statistics_data = [];
        
        var current_day = moment().date();
        var current_month = moment().month() + 1;
        var current_year = moment().year();

        var current_date = current_year + "-" + current_month + "-" + current_day;
        var activadores = "SELECT SUM(CASE WHEN request.status IN ('aceptada','aceptadacc') AND month(request.captured) = month(now()) AND date(request.captured) != date(now()) AND ISNULL(request.scheduled) AND request.channel NOT IN ('C3RATX6TX','c3ratx6tx') THEN 1 ELSE 0 END) AS concentrado, SUM(CASE WHEN request.status IN ('aceptada','aceptadacc') AND date(request.captured) = date(now()) AND ISNULL(request.scheduled) AND request.channel NOT IN ('C3RATX6TX','c3ratx6tx') THEN 1 ELSE 0 END) AS aceptadassin, SUM(CASE WHEN request.status IN ('aceptada','aceptadacc') AND request.channel IN ('C3RATX6TX','c3ratx6tx') THEN 1 ELSE 0 END) AS aceptadasdom, SUM(CASE WHEN request.status IN ('aceptada','aceptadacc') AND request.scheduled != '' AND request.channel NOT IN ('C3RATX6TX','c3ratx6tx') THEN 1 ELSE 0 END) AS agendadas, SUM(CASE WHEN request.status = 'activa' AND date(request.activated) = date(now()) THEN 1 ELSE 0 END) AS activaciones FROM request";
        //var inserts = [current_date, current_date];
        //var query_statistics = mysql.format(activadores, inserts);
        connection.query(activadores, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    'concentrado': element.concentrado,
                    'aceptadassin': element.aceptadassin,
                    'aceptadasdom': element.aceptadasdom,
                    'agendadas': element.agendadas,
                    'activaciones': element.activaciones
                }
                statistics_data.push(row);
            });
            res.send(statistics_data);
        });
    }); //fin del /statisticcerrador

    

    //TABLAS-----------------------------------------------------------------------

    app.post('/cerradorconcentrado', middleware.requireLogin, function (req, res) {

        var tabla_pendientes = [];
        var current_day = moment().date();
        var current_month = moment().month() + 1;
        var current_year = moment().year();

        var current_date = current_year + "-" + current_month + "-" + current_day;
        var pendientes = "SELECT request.idrequest AS idregistro, request.captured AS fecha, CONCAT(datacustomer.lastname,' ',datacustomer.name) AS cliente, CONCAT(user.lastname,' ',user.name) AS vendedor, request.channel AS canal, request.sisact AS sisact, request.comntcontact AS comentario, datacustomer.contact_num AS contacto FROM request LEFT JOIN datacustomer ON datacustomer.idrequest = request.idrequest LEFT JOIN user ON user.iduser = request.iduser WHERE request.status IN ('aceptada','aceptadacc') AND month(request.captured) = month(now()) AND date(request.captured) != ? AND ISNULL(request.scheduled) AND request.channel NOT IN ('C3RATX6TX','c3ratx6tx') ORDER BY fecha DESC";
        var inserts = [current_date];
        var query_pendientes = mysql.format(pendientes, inserts);
        connection.query(query_pendientes, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    'idrequest': element.idregistro,
                    'fecha': moment(element.fecha).format('DD[/]MM[-]HH[:]mm'),
                    'cliente': element.cliente,
                    'vendedor': element.vendedor,
                    'canal': element.canal,
                    'sisact': element.sisact,
                    'comentario': element.comentario,
                    'contacto': element.contacto
                }
                tabla_pendientes.push(row);
            });
            res.send(tabla_pendientes);
        });
    }); //fin del /statisticsanalista

    app.post('/cerradoraceptadassin', middleware.requireLogin, function (req, res) {

        var tabla_pendientes = [];
        var current_day = moment().date();
        var current_month = moment().month()+1;
        var current_year = moment().year();

        var current_date = current_year + "-" + current_month + "-" + current_day;

        var pendientes = "SELECT request.idrequest AS idregistro, request.captured AS fecha, CONCAT(datacustomer.lastname,' ',datacustomer.name) AS cliente, CONCAT(user.lastname,' ',user.name) AS vendedor, request.channel AS canal, request.sisact AS sisact, request.comntcontact AS comentario, datacustomer.contact_num AS contacto FROM request LEFT JOIN datacustomer ON datacustomer.idrequest = request.idrequest LEFT JOIN user ON user.iduser = request.iduser WHERE request.status IN ('aceptada','aceptadacc') AND date(request.captured) = date(now()) AND ISNULL(request.scheduled) AND request.channel NOT IN ('C3RATX6TX','c3ratx6tx') ORDER BY fecha DESC";
        //var inserts = [current_date];
        
        //var query_pendientes = mysql.format(pendientes, inserts);
        connection.query(pendientes, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    'idrequest': element.idregistro,
                    'fecha': moment(element.fecha).format('DD[/]MM[-]HH[:]mm'),
                    'cliente': element.cliente,
                    'vendedor': element.vendedor,
                    'canal': element.canal,
                    'sisact': element.sisact,
                    'comentario': element.comentario,
                    'contacto': element.contacto
                }
                tabla_pendientes.push(row);
            });
            res.send(tabla_pendientes);
        });
    }); //fin del /aceptadas sinergia 

    app.post('/cerradoraceptadasdom', middleware.requireLogin, function (req, res) {
        var tabla_pendientes = [];
        
        var pendientes = "SELECT request.idrequest AS idregistro, request.captured AS fecha, CONCAT(datacustomer.lastname,' ',datacustomer.name) AS cliente, CONCAT(user.lastname,' ',user.name) AS vendedor, request.channel AS canal, request.sisact AS sisact, request.comntcontact AS comentario, datacustomer.contact_num AS contacto FROM request LEFT JOIN datacustomer ON datacustomer.idrequest = request.idrequest LEFT JOIN user ON user.iduser = request.iduser WHERE request.status IN ('aceptada','aceptadacc') AND request.channel IN ('C3RATX6TX','c3ratx6tx') ORDER BY fecha DESC";
        
        
        connection.query(pendientes, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    'idrequest': element.idregistro,
                    'fecha': moment(element.fecha).format('DD[/]MM[-]HH[:]mm'),
                    'cliente': element.cliente,
                    'vendedor': element.vendedor,
                    'canal': element.canal,
                    'sisact': element.sisact,
                    'comentario': element.comentario,
                    'contacto': element.contacto
                }
                tabla_pendientes.push(row);
            });
            res.send(tabla_pendientes);
        });
    }); //fin del /aceptada domicilio

    app.post('/cerradoragendadas', middleware.requireLogin, function (req, res) {
        //var userLoggedIn = req.body.userLoggedIn;
        var agenda = [];
        //var current_month = (moment().month()) + 1;

        var query_agenda = "SELECT request.idrequest as idrequest, CONCAT(datacustomer.lastname, ' ', datacustomer.name) AS cliente, CONCAT(user.lastname,' ',user.name) AS vendedor, datacustomer.contact_num AS contacto, request.scheduled AS agendada, request.created as capturada, request.sisact as sisact, request.channel as canal, request.cac as cac, request.comntcontact AS comentario FROM request LEFT JOIN datacustomer ON datacustomer.idrequest = request.idrequest LEFT JOIN user ON user.iduser = request.iduser WHERE request.status IN('aceptada', 'aceptadacc') AND request.scheduled != '' AND request.channel NOT IN ('C3RATX6TX','c3ratx6tx') order by timestamp(scheduled) asc";
        //var inserts = [userLoggedIn];
        //var query_agenda = mysql.format(statusagenda, inserts);
        connection.query(query_agenda, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    'idrequest': element.idrequest,
                    'capturada': moment(element.capturada).format('DD[/]MM HH[:]mm'),
                    'cliente': element.cliente,
                    'vendedor': element.vendedor,
                    'contacto': element.contacto,
                    'canal': element.canal,
                    'sisact': element.sisact,
                    'agendada': moment(element.agendada).format('DD[/]MM HH[:]mm') + " " + element.cac,
                    'comentario': element.comentario
                }
                agenda.push(row);
            });
            res.send(agenda);
        });
    }); //fin del /tablaagenda

    app.post('/cerradoractivadas', middleware.requireLogin, function (req, res) {

        var tabla_activadas = [];
        var current_day = (moment().date());
        var activadas = "SELECT request.idrequest AS idregistro, request.activated AS fecha, CONCAT(datacustomer.lastname,' ',datacustomer.name) AS cliente, CONCAT(user.lastname,' ',user.name) AS vendedor, user.shift AS turno, campaign.name AS campania, CONCAT(user2.lastname,' ',user2.name) AS analistaasignado, request.sisact AS sisact FROM request LEFT JOIN datacustomer ON datacustomer.idrequest = request.idrequest LEFT JOIN user ON user.iduser = request.iduser LEFT JOIN campaign ON campaign.idcampaign = user.idcampaign  LEFT JOIN user AS user2 ON request.assignedto = user2.iduser WHERE request.status = 'activa' AND date(request.activated) = date(now()) ORDER BY fecha DESC";
        //var inserts = [current_day];
        var query_activadas = mysql.format(activadas, inserts);
        connection.query(activadas, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    'idregistro': element.idregistro,
                    'fecha': moment(element.fecha).format('DD[/]MM[-]HH[:]mm'),
                    'cliente': element.cliente,
                    'vendedor': element.vendedor,
                    'turno': element.turno,
                    'campania': element.campania,
                    'sisact': element.sisact
                }
                tabla_activadas.push(row);
            });
            res.send(tabla_activadas);
        });
    }); //fin del /statisticsanalista



    

}// fin del archivo