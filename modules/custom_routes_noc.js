middleware = require('./middlewares');
var mysql = require('mysql');
var connection = require('./db');
var moment = require('moment');


module.exports = function(app,io){

    /*io.on('connection', function (socket) {
        socket.on('refreshalldivs', function (msg) {
            io.emit('refreshalldivs', 'refhreshthemall');
        });
    });*/

    //OPERACIONES PARA ALIMENTAR TABLAS DE ESTADISTICAS DE ANALISTA CON AJAX Y WEBSOCKETS-----------

    app.post('/statisticsanalista', middleware.requireLogin, function (req, res) {
        
        var statistics_data = [];
        var current_month = (moment().date());
        var activadores = "SELECT SUM(CASE WHEN request.status = 'enviado' THEN 1 ELSE 0 END) AS pendientes, SUM(CASE WHEN request.status = 'en espera' THEN 1 ELSE 0 END) AS enesperaderespuesta, SUM(CASE WHEN request.status = 'aceptada' or request.status = 'aceptadacc' THEN 1 ELSE 0 END) AS aceptadas, SUM(CASE WHEN request.status = 'corregir' THEN 1 ELSE 0 END) AS corregir, SUM(CASE WHEN request.status = 'activa' AND date(request.activated) = date(now()) THEN 1 ELSE 0 END) AS activaciones FROM request";
        //var inserts = [current_month];
        //var query_statistics = mysql.format(activadores, inserts);
        connection.query(activadores, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    'pendientes': element.pendientes,
                    'enesperaderespuesta': element.enesperaderespuesta,
                    'aceptadas': element.aceptadas,
                    'correcciones': element.corregir,
                    'activaciones': element.activaciones
                }
                statistics_data.push(row);
            });
            res.send(statistics_data);
        });
    }); //fin del /statisticsanalista

    //TABLAS-----------------------------------------------------------------------

    app.post('/analistapendientes', middleware.requireLogin, function (req, res) {

        var tabla_pendientes = [];
        //var current_month = (moment().month()) + 1;
        var pendientes = "SELECT request.idrequest AS idregistro, request.created AS fecha, CONCAT(datacustomer.lastname,' ',datacustomer.name) AS cliente, CONCAT(user.lastname,' ',user.name) AS vendedor, user.shift AS turno, dataplan.type AS tipoactivacion, campaign.name AS campania, CONCAT(user2.lastname,' ',user2.name) AS analistaasignado FROM request LEFT JOIN datacustomer ON datacustomer.idrequest = request.idrequest LEFT JOIN user ON user.iduser = request.iduser LEFT JOIN dataplan ON dataplan.idrequest = request.idrequest LEFT JOIN campaign ON campaign.idcampaign = user.idcampaign  LEFT JOIN user AS user2 ON request.assignedto = user2.iduser WHERE request.status = 'enviado' ORDER BY fecha DESC";
        //var inserts = [current_month];
        //var query_pendientes = mysql.format(pendientes, inserts);
        connection.query(pendientes, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    'idregistro': element.idregistro,
                    'fecha': moment(element.fecha).format('DD[/]MM[-]HH[:]mm'),
                    'cliente': element.cliente,
                    'vendedor': element.vendedor,
                    'turno': element.turno,
                    'tipoactivacion': element.tipoactivacion,
                    'campania': element.campania,
                    'analistaasignado': element.analistaasignado

                }
                tabla_pendientes.push(row);
            });
            res.send(tabla_pendientes);
        });
    }); //fin del /statisticsanalista

    app.post('/analistaenespera', middleware.requireLogin, function (req, res) {

        var tabla_enespera = [];
        //var current_month = (moment().month()) + 1;
        var enespera = "SELECT request.idrequest AS idregistro, request.captured AS fecha, CONCAT(datacustomer.lastname,' ',datacustomer.name) AS cliente, CONCAT(user.lastname,' ',user.name) AS vendedor, campaign.name AS campania, request.sisact AS sisact, request.channel as canal FROM request LEFT JOIN datacustomer ON datacustomer.idrequest = request.idrequest LEFT JOIN user ON user.iduser = request.iduser LEFT JOIN campaign ON campaign.idcampaign = user.idcampaign WHERE request.status = 'en espera' ORDER BY fecha DESC";
        //var inserts = [current_month];
        //var query_pendientes = mysql.format(pendientes, inserts);
        connection.query(enespera, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    'idregistro': element.idregistro,
                    'fecha': moment(element.fecha).format('DD[/]MM[-]HH[:]mm'),
                    'cliente': element.cliente,
                    'vendedor': element.vendedor,
                    'canal': element.canal,
                    'campania': element.campania,
                    'sisact': element.sisact
                }
                tabla_enespera.push(row);
            });
            res.send(tabla_enespera);
        });
    }); //fin del /analistaenespera

    app.post('/analistaaceptadas', middleware.requireLogin, function (req, res) {
        var tabla_aceptadas = [];
        //var current_month = (moment().month()) + 1;
        var aceptadas = "SELECT request.idrequest AS idregistro, request.channel as canal,request.created AS fecha, CONCAT(datacustomer.lastname,' ',datacustomer.name) AS cliente, CONCAT(user.lastname,' ',user.name) AS vendedor, campaign.name AS campania, request.sisact AS sisact, request.scheduled AS agendada, request.cac AS cac FROM request LEFT JOIN datacustomer ON datacustomer.idrequest = request.idrequest LEFT JOIN user ON user.iduser = request.iduser LEFT JOIN campaign ON campaign.idcampaign = user.idcampaign WHERE request.status IN('aceptada','aceptadacc') and request.scheduled IS NULL ORDER BY fecha DESC";
        //var inserts = [current_month];
        //var query_pendientes = mysql.format(pendientes, inserts);
        connection.query(aceptadas, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    'idregistro': element.idregistro,
                    'fecha': moment(element.fecha).format('DD[/]MM[-]HH[:]mm'),
                    'cliente': element.cliente,
                    'vendedor': element.vendedor,
                    'campania': element.campania,
                    'sisact': element.sisact,
                    'agendada': element.agendada,
                    'cac': element.cac,
                    'canal': element.canal
                }
                
                tabla_aceptadas.push(row);
            });
            res.send(tabla_aceptadas);
        });
    }); //fin del /analistaenespera

    app.post('/analistaagenda', middleware.requireLogin, function (req, res) {
        //var userLoggedIn = req.body.userLoggedIn;
        var agenda = [];
        //var current_month = (moment().month()) + 1;

        var query_agenda = "SELECT request.idrequest as idrequest, CONCAT(datacustomer.lastname, ' ', datacustomer.name) AS cliente, CONCAT(user.lastname,' ',user.name) AS vendedor, datacustomer.contact_num AS contacto, scheduled AS agendado, request.sisact as sisact, request.channel as canal, request.cac as cac FROM request LEFT JOIN datacustomer ON datacustomer.idrequest = request.idrequest LEFT JOIN user ON user.iduser = request.iduser WHERE request.status IN('aceptada', 'aceptadacc') AND request.scheduled != '' order by timestamp(scheduled) asc";
        //var inserts = [userLoggedIn];
        //var query_agenda = mysql.format(statusagenda, inserts);
        connection.query(query_agenda, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    'agendada': moment(element.agendado).format('DD[/]MM HH[:]mm') + " " +element.cac,
                    'cliente': element.cliente,
                    'contacto': element.contacto,
                    'sisact': element.sisact,
                    'idregistro': element.idrequest,
                    'canal': element.canal,
                    'vendedor': element.vendedor
                }
                agenda.push(row);
            });
            res.send(agenda);
        });
    }); //fin del /tablaagenda

    app.post('/analistacorrecciones', middleware.requireLogin, function (req, res) {

        var tabla_correcciones = [];
        //var current_month = (moment().month()) + 1;
        var pendientes = "SELECT request.idrequest AS idregistro, request.created AS fecha, CONCAT(datacustomer.lastname,' ',datacustomer.name) AS cliente, CONCAT(user.lastname,' ',user.name) AS vendedor, user.shift AS turno, dataplan.type AS tipoactivacion, campaign.name AS campania, CONCAT(user2.lastname,' ',user2.name) AS analistaasignado, request.corrected AS corregido FROM request LEFT JOIN datacustomer ON datacustomer.idrequest = request.idrequest LEFT JOIN user ON user.iduser = request.iduser LEFT JOIN dataplan ON dataplan.idrequest = request.idrequest LEFT JOIN campaign ON campaign.idcampaign = user.idcampaign  LEFT JOIN user AS user2 ON request.assignedto = user2.iduser WHERE request.status = 'corregir' ORDER BY fecha DESC";
        //var inserts = [current_month];
        //var query_pendientes = mysql.format(pendientes, inserts);
        connection.query(pendientes, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    'idregistro': element.idregistro,
                    'fecha': moment(element.fecha).format('DD[/]MM[-]HH[:]mm'),
                    'cliente': element.cliente,
                    'vendedor': element.vendedor,
                    'turno': element.turno,
                    'tipoactivacion': element.tipoactivacion,
                    'campania': element.campania,
                    'analistaasignado': element.analistaasignado,
                    'corregido': element.corregido
                }
                tabla_correcciones.push(row);
            });
            res.send(tabla_correcciones);
        });
    }); //fin del /statisticsanalista

    app.post('/analistaactivadas', middleware.requireLogin, function (req, res) {

        var tabla_activadas = [];
        var current_day = (moment().date());
        var activadas = "SELECT request.idrequest AS idregistro, request.activated AS fecha, CONCAT(datacustomer.lastname,' ',datacustomer.name) AS cliente, CONCAT(user.lastname,' ',user.name) AS vendedor, user.shift AS turno, campaign.name AS campania, CONCAT(user2.lastname,' ',user2.name) AS analistaasignado, request.sisact AS sisact FROM request LEFT JOIN datacustomer ON datacustomer.idrequest = request.idrequest LEFT JOIN user ON user.iduser = request.iduser LEFT JOIN campaign ON campaign.idcampaign = user.idcampaign  LEFT JOIN user AS user2 ON request.assignedto = user2.iduser WHERE request.status = 'activa' AND date(request.activated) = date(now()) ORDER BY fecha DESC";
        //var inserts = [current_day];
        //var query_activadas = mysql.format(activadas, inserts);
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

    //HANDLERS PARA MOSTRAR DATOS DEL REQUEST
    app.post('/getdatarequest', middleware.requireLogin, function (req, res) {
        var idregistro = req.body.idregistro;
        var global_array = [];
        var inserts = [Number(idregistro)];
        //console.log(idregistro);

        var query = "SELECT request.comntcontact as comentario, request.created AS created, request.scheduled AS fechaagenda, request.cac AS cacagenda, CONCAT(user.lastname,' ',user.name) AS analistaasignado, request.status as status, request.sisact as sisact, request.channel as canal, request.reasonrejected as rechazo, request.reasonaccepted as aceptacion, request.reasoncorrected as correccion FROM request LEFT JOIN user ON request.assignedto = user.iduser WHERE idrequest = ? LIMIT 1";
        
        var query_request = mysql.format(query, inserts);
        connection.query(query_request, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    'created': moment(element.created).format('DD[/]MM[/]YYYY HH[:]mm'),
                    'analistaasignado': element.analistaasignado,
                    'status': element.status,
                    'sisact': element.sisact,
                    'canal2': element.canal,
                    'rechazo': element.rechazo,
                    'correccion': element.correccion,
                    'aceptacion': element.aceptacion,
                    'fechaagenda': element.fechaagenda,
                    'cacagenda': element.cacagenda,
                    'comentario': element.comentario

                }
                global_array.push(row);
            });
            var query = "SELECT * FROM datacustomer WHERE idrequest = ? LIMIT 1";

            var query_request = mysql.format(query, inserts);
            connection.query(query_request, function (error, results, field) {
                if (error) throw error;
                results.forEach(element => {
                    var row = {
                        'gender': element.gender,
                        'name': element.name,
                        'lastname': element.lastname,
                        'birthday': element.birthday,
                        'email': element.email,
                        'rfc': element.rfc,
                        'contact_num': element.contact_num
                    }
                    global_array.push(row);
                });
                var query = "SELECT dataplan.idplan AS idplan, dataplan.type AS tipo, dataplan.origin AS origen,                dataplan.migrate_num AS amigrar, dataplan.ref_account AS refacta,                        dataplan.canal AS canal, dataplan.initialpay AS pagoinicial,       dataplan.pricelist AS preciodelista,dataplan.celphone AS equipocelular,                plan.name AS nombreplan,plan.keyname AS claveplan, plan.term AS plazoplan FROM dataplan LEFT JOIN plan ON dataplan.idplan = plan.idplan WHERE idrequest = ? LIMIT 1";

                var query_request = mysql.format(query, inserts);
                connection.query(query_request, function (error, results, field) {
                    if (error) throw error;
                    results.forEach(element => {
                        var row = {
                            'tipo': element.tipo,
                            'origen': element.origen,
                            'amigrar': element.amigrar,
                            'refacta': element.refacta,
                            'canal': element.canal,
                            'pagoinicial': element.pagoinicial,
                            'preciodelista': element.preciodelista,
                            'equipocelular': element.equipocelular,
                            'nombreplan': element.nombreplan,
                            'claveplan': element.claveplan,
                            'plazoplan': element.plazoplan,
                            'idplan': element.idplan
                        }
                        global_array.push(row);
                    });
                    var query = "SELECT * FROM addresscustomer WHERE idrequest = ? LIMIT 1";

                    var query_request = mysql.format(query, inserts);
                    connection.query(query_request, function (error, results, field) {
                        if (error) throw error;
                        results.forEach(element => {
                            var row = {
                                'state': element.state,
                                'city': element.city,
                                'street': element.street,
                                'num_int': element.num_int,
                                'num_ext': element.num_ext,
                                'between_streets': element.between_streets,
                                'reference': element.reference,
                                'local_phonenumber': element.local_phonenumber,
                                'availability': element.availability,
                                'district': element.district,
                                'postalcode': element.postalcode
                            }
                            global_array.push(row);
                        });
                        var query = "SELECT * FROM jobcustomer WHERE idrequest = ? LIMIT 1";

                        var query_request = mysql.format(query, inserts);
                        connection.query(query_request, function (error, results, field) {
                            if (error) throw error;
                            results.forEach(element => {
                                var row = {
                                    'jobname': element.name,
                                    'job': element.job,
                                    'phonenumber': element.phonenumber,
                                    'extension': element.extension,
                                    'availability': element.availability

                                }
                                global_array.push(row);
                            });
                            var query = "SELECT * FROM reference WHERE idrequest = ? LIMIT 3";

                            var query_request = mysql.format(query, inserts);
                            connection.query(query_request, function (error, results, field) {
                                if (error) throw error;
                                results.forEach(element => {
                                    var row = {
                                        'refname': element.name,
                                        'reflastname': element.lastname,
                                        'refphonenumber': element.phonenumber,
                                        'refavailability': element.availability
                                    }
                                    global_array.push(row);
                                });
                                var query = "SELECT * FROM observation WHERE idrequest = ? LIMIT 1";

                                var query_request = mysql.format(query, inserts);
                                connection.query(query_request, function (error, results, field) {
                                    if (error) throw error;
                                    results.forEach(element => {
                                        var row = {
                                            'observation': element.observation
                                        }
                                        global_array.push(row);
                                    });
                                    res.send(global_array);
                                });//fin del septimo query
                            });//fin del sexto query
                        });//fin del quinto query
                    });//fin del cuarto query
                });//fin del tercer query
            });//fin del segundo query
        });// fin del primer query

        
        
            
            
                
        
        
        
        
    }); //fin del /getdatarequest

    app.post('/asigntoanalyst', middleware.requireLogin, function (req, res) {


        var iduser = req.body.iduser;
        var idrequest = req.body.idrequest;
        var query = "UPDATE request SET assignedto = ? WHERE idrequest = ?";
        var inserts = [iduser,idrequest];
        var update_assignedto = mysql.format(query, inserts);
        
        connection.getConnection(function (err, pool) {
            pool.beginTransaction(function (err) {
                if (err) throw err;
                pool.query(update_assignedto, function (err, result) {
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
                        console.log('Captura ' + idrequest + ' asignada a analista iduser: ' + iduser);
                        res.send('Actualizado')
                    });//fin del commit
                });//fin del query a tabla request <------
            });// fin de beginTransaction
        }); //fin de getConnection

    });


    

    app.post('/setrequesttoenespera', middleware.requireLogin, function (req, res) {


        var sisact = req.body.sisact;
        var canal = req.body.canal;
        var idrequest = req.body.idrequest;
        var status = req.body.status;
        console.log(idrequest);
        var query = "UPDATE request SET captured = now(), sisact = ?, channel = ?, status = ? WHERE idrequest = ?";
        var inserts = [sisact,canal, status, idrequest];

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
                        console.log('Captura '+idrequest+' ha pasado a estatus de en espera de respuesta');
                        res.send('Actualizado')
                    });//fin del commit
                });//fin del query a tabla request <------
            });// fin de beginTransaction
        }); //fin de getConnection

    });

    app.post('/setrequestcorregir', middleware.requireLogin, function (req, res) {



        var idrequest = req.body.idrequest;
        var correccion = req.body.correccion;
        var status = req.body.status;

        if (status == 'corregir') {
            var query = "UPDATE request SET assignedto = null,corrected = 0, reasoncorrected = ?, status = ? WHERE idrequest = ?";
        } else if (status == 'rechazada') {
            var query = "UPDATE request SET corrected = 0, reasonrejected = ?, status = ? WHERE idrequest = ?";
        }

        var inserts = [correccion, status, idrequest];

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
                        console.log('Captura ' + idrequest + ' ha pasado a estatus de ' + status);
                        res.send('Actualizado')
                    });//fin del commit
                });//fin del query a tabla request <------
            });// fin de beginTransaction
        }); //fin de getConnection

    });

    app.post('/justifyrejectorcorrection', middleware.requireLogin, function (req, res) {



        var idrequest = req.body.idrequest;
        var motivo = req.body.motivo;
        var status = req.body.status;

        if(status == 'aceptadacc'){
            var query = "UPDATE request SET corrected = 0, reasoncorrected = ?, status = ? WHERE idrequest = ?";
        }else if(status == 'rechazada' || status == 'no finalizada'){
            var query = "UPDATE request SET reasonrejected = ?, status = ? WHERE idrequest = ?";
        }else if(status == 'aceptada'){
            var query = "UPDATE request SET reasonaccepted = ?, status = ? WHERE idrequest = ?";
        }

        var inserts = [motivo, status, idrequest];

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
                        console.log('Captura ' + idrequest + ' ha pasado a estatus de ' + status + ' con motivo: ' + motivo);
                        res.send('Actualizado')
                    });//fin del commit
                });//fin del query a tabla request <------
            });// fin de beginTransaction
        }); //fin de getConnection

    });

    app.post('/setStatusFromTelcel', middleware.requireLogin, function (req, res) {
        var idrequest = req.body.idrequest;
        var status = req.body.status;
        

        if(status == 'activa'){
            var query = "UPDATE request SET status = ?, activated = now() WHERE idrequest = ?";
        }else{
            var query = "UPDATE request SET status = ? WHERE idrequest = ?";
        }
        
        var inserts = [status, idrequest];
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
                        console.log('Captura ' + idrequest + ' ha pasado a estatus de ' + status);
                        res.send('Actualizado')
                    });//fin del commit
                });//fin del query a tabla request <------
            });// fin de beginTransaction
        }); //fin de getConnection
    });

   

    

    app.post('/getComment', middleware.requireLogin, function (req, res) {
        var idrequest = req.body.idrequest;
        var query = "SELECT request.comntcontact as comentario, request.sisact as sisact, request.channel as canal, CONCAT(datacustomer.lastname,' ',datacustomer.name) AS cliente  FROM request LEFT JOIN datacustomer ON request.idrequest = datacustomer.idrequest WHERE request.idrequest = ?";
        var inserts = [idrequest];
        var comentarios = [];
        var getComment = mysql.format(query, inserts);
        connection.query(getComment, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    'cliente': element.cliente,
                    'comentario': element.comentario,
                    'sisact': element.sisact,
                    'canal': element.canal
                }
                comentarios.push(row);
            });
            res.send(comentarios);
        });
        
    });

    app.post('/setComment', middleware.requireLogin, function (req, res) {
        var idrequest = req.body.idrequest;
        var comentario_analista = req.body.comentario_analista;
        
        var query = "UPDATE request SET comntcontact = ? WHERE idrequest = ?";
      
        var inserts = [comentario_analista, idrequest];
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
                        console.log('Actualizado ID: ' + idrequest + ' - modificado comentario a : ' + comentario_analista);
                        res.send('Actualizado')
                    });//fin del commit
                });//fin del query a tabla request <------
            });// fin de beginTransaction
        }); //fin de getConnection
    });

    

}// fin del archivo