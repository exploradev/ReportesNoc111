middleware = require('./middlewares');
var mysql = require('mysql');
var connection = require('./db');
var moment = require('moment');


module.exports = function(app,io){

    

    

    moment.locale('es');


    //OPERACIONES CRUD MODAL------------------------------------------------------------

    app.post('/insertdata', middleware.requireLogin,function(req,res){
        var userLoggedIn = req.body.userLoggedIn;

        var tipodeactivacion = req.body.tipodeactivacion;
        var procedencia = req.body.procedencia;
        var numeroporasignar = req.body.numeroporasignar;
        var numeroamigrar = req.body.numeroamigrar;
        var referenciaacta = req.body.referenciaacta;
        var canal = req.body.canal;
        var plan = req.body.plan;
        var equipo = req.body.equipo;
        var costoamigo = req.body.costoamigo;
        var pagoinicial = req.body.pagoinicial;

        var sexo = req.body.sexo;
        var apellidoscliente = req.body.apellidoscliente;
        var nombrescliente = req.body.nombrescliente;
        var fechadenacimiento = req.body.fechadenacimiento;
        var numerodelcliente = req.body.numerodelcliente;
        var email = req.body.email;
        var rfc = req.body.rfc;
       
        var estado = req.body.estado;
        var ciudad = req.body.ciudad;
        var callecliente = req.body.callecliente;
        var numinterior = req.body.numinterior;
        var numexterior = req.body.numexterior;
        var cruzamientos = req.body.cruzamientos;
        var colonia = req.body.colonia;
        var codigopostal = req.body.codigopostal;
        var referencias = req.body.referencias;
        var numcelularofijo = req.body.numcelularofijo;
        var horariovisita = req.body.horariovisita;
       
        var nombreempresa = req.body.nombreempresa;
        var cargo = req.body.cargo;
        var celofijolaboral = req.body.celofijolaboral;
        var extensionlaboral = req.body.extensionlaboral;
        var horariovisitalaboral = req.body.horariovisitalaboral;
        
        var nombresref1 = req.body.nombresref1;
        var apellidosref1 = req.body.apellidosref1;
        var telref1 = req.body.telref1;
        var horarioref1 = req.body.horarioref1;
        var nombresref2 = req.body.nombresref2;
        var apellidosref2 = req.body.apellidosref2;
        var telref2 = req.body.telref2;
        var horarioref2 = req.body.horarioref2;
        var nombresref3 = req.body.nombresref3;
        var apellidosref3 = req.body.apellidosref3;
        var telref3 = req.body.telref3;
        var horarioref3 = req.body.horarioref3;

        var observaciones = req.body.observaciones;
        var statusofrequest = req.body.statusofrequest;
        


        if (plan == '') {
            plan = 1;
        }
        
        
        

        var last_id_inserted;
        connection.getConnection(function(err,pool){
            pool.beginTransaction(function(err){
                if (err) throw err;
                var insert_request = "INSERT INTO request(iduser,status) VALUES(?,?)";
                var inserts = [userLoggedIn, statusofrequest];
                query_request = mysql.format(insert_request, inserts);
                pool.query(query_request, function(err,result){
                    if (err) {
                        pool.rollback(function(){
                            throw err;
                        });
                    }
                    last_id_inserted = result.insertId;
                    
                    var insert_dataplan = "INSERT INTO dataplan(idrequest,type,origin,migrate_num,ref_account,canal,idplan,initialpay,pricelist,celphone) values(?,?,?,?,?,?,?,?,?,?)";
                    var inserts = [
                        last_id_inserted,
                        tipodeactivacion,
                        procedencia,
                        numeroamigrar,
                        referenciaacta,
                        canal,
                        plan,
                        pagoinicial,
                        costoamigo,
                        equipo,
                    ];
                    query_dataplan = mysql.format(insert_dataplan, inserts);

                    pool.query(query_dataplan, function (err, result) {
                        if (err) {
                            pool.rollback(function () {
                                throw err;
                            });
                        }
                        var insert_datacustomer = "INSERT INTO datacustomer(idrequest,gender,name,lastname,birthday,email,rfc,contact_num) values(?,?,?,?,?,?,?,?)";
                        var inserts = [
                            last_id_inserted,
                            sexo,
                            nombrescliente,
                            apellidoscliente,
                            fechadenacimiento,
                            email,
                            rfc,
                            numerodelcliente,
                        ];
                        query_datacustomer = mysql.format(insert_datacustomer, inserts);
                        
                        pool.query(query_datacustomer, function (err, result) {
                            if (err) {
                                pool.rollback(function () {
                                    throw err;
                                });
                            }
                            var insert_addresscustomer = "INSERT INTO addresscustomer(idrequest,state,city,street,num_int,num_ext,between_streets,reference,district, postalcode,local_phonenumber,availability) values(?,?,?,?,?,?,?,?,?,?,?,?)";
                            var inserts = [
                                last_id_inserted,
                                estado,
                                ciudad,
                                callecliente,
                                numinterior,
                                numexterior,
                                cruzamientos,
                                referencias,
                                colonia,
                                codigopostal,
                                numcelularofijo,
                                horariovisita
                            ];
                            
                            query_addresscustomer = mysql.format(insert_addresscustomer, inserts);
                            
                            pool.query(query_addresscustomer, function (err, result) {
                                if (err) {
                                    pool.rollback(function () {
                                        throw err;
                                    });
                                }
                                var insert_jobcustomer = "INSERT INTO jobcustomer(idrequest,name,job,phonenumber,extension,availability) values(?,?,?,?,?,?)";
                                var inserts = [
                                    last_id_inserted,
                                    nombreempresa,
                                    cargo,
                                    celofijolaboral,
                                    extensionlaboral,
                                    horariovisitalaboral
                                ];
                                query_jobcustomer = mysql.format(insert_jobcustomer, inserts);

                                pool.query(query_jobcustomer, function (err, result) {
                                    if (err) {
                                        pool.rollback(function () {
                                            throw err;
                                        });
                                    }
                                    var insert_reference = "INSERT INTO reference(idrequest,name,lastname,phonenumber,availability) values(?,?,?,?,?), (?,?,?,?,?), (?,?,?,?,?)";
                                    var inserts = [
                                        last_id_inserted,
                                        nombresref1,
                                        apellidosref1,
                                        telref1,
                                        horarioref1,
                                        last_id_inserted,
                                        nombresref2,
                                        apellidosref2,
                                        telref2,
                                        horarioref2,
                                        last_id_inserted,
                                        nombresref3,
                                        apellidosref3,
                                        telref3,
                                        horarioref3
                                    ];
                                    query_reference = mysql.format(insert_reference, inserts);

                                    pool.query(query_reference, function (err, result) {
                                        if (err) {
                                            pool.rollback(function () {
                                                throw err;
                                            });
                                        }
                                        var insert_observation = "INSERT INTO observation(idrequest, observation) values(?,?)";
                                        var inserts = [
                                            last_id_inserted,
                                            observaciones
                                        ];
                                        query_observation = mysql.format(insert_observation, inserts);

                                        pool.query(query_observation, function (err, result) {
                                            if (err) {
                                                pool.rollback(function () {
                                                    throw err;
                                                });
                                            }


                                            //en el ultimo insert
                                            pool.commit(function (err) {
                                                if (err) {
                                                    pool.rollback(function () {
                                                        throw err;
                                                    });
                                                }
                                                console.log('Nueva captura ID: ' + last_id_inserted);
                                                res.send(last_id_inserted.toString());
                                                
                                            });//fin del commit
                                        });//en el ultimo insert
                                    }); //fin del query a tabla dataplan
                                }); //fin del query a tabla reference
                            }); //fin del query a tabla addresscustomer
                        }); //fin del query a tabla datacustomer
                    }); //fin del query a tabla dataplan
                });//fin del query a tabla request <------
            });// fin de beginTransaction
        }); //fin de getConnection
        
    }); //fin de /insertdata

    app.post('/updatedata', middleware.requireLogin,function(req, res){
        var userLoggedIn = req.body.userLoggedIn;
        var last_id_inserted = req.body.valor_idrequest;

        var tipodeactivacion = req.body.tipodeactivacion;
        var procedencia = req.body.procedencia;
        var numeroporasignar = req.body.numeroporasignar;
        var numeroamigrar = req.body.numeroamigrar;
        var referenciaacta = req.body.referenciaacta;
        var canal = req.body.canal;
        var plan = req.body.plan;
        var equipo = req.body.equipo;
        var costoamigo = req.body.costoamigo;
        var pagoinicial = req.body.pagoinicial;

        var sexo = req.body.sexo;
        var apellidoscliente = req.body.apellidoscliente;
        var nombrescliente = req.body.nombrescliente;
        var fechadenacimiento = req.body.fechadenacimiento;
        var numerodelcliente = req.body.numerodelcliente;
        var email = req.body.email;
        var rfc = req.body.rfc;

        var estado = req.body.estado;
        var ciudad = req.body.ciudad;
        var callecliente = req.body.callecliente;
        var numinterior = req.body.numinterior;
        var numexterior = req.body.numexterior;
        var cruzamientos = req.body.cruzamientos;
        var colonia = req.body.colonia;
        var codigopostal = req.body.codigopostal;
        var referencias = req.body.referencias;
        var numcelularofijo = req.body.numcelularofijo;
        var horariovisita = req.body.horariovisita;

        var nombreempresa = req.body.nombreempresa;
        var cargo = req.body.cargo;
        var celofijolaboral = req.body.celofijolaboral;
        var extensionlaboral = req.body.extensionlaboral;
        var horariovisitalaboral = req.body.horariovisitalaboral;

        var nombresref1 = req.body.nombresref1;
        var apellidosref1 = req.body.apellidosref1;
        var telref1 = req.body.telref1;
        var horarioref1 = req.body.horarioref1;
        var nombresref2 = req.body.nombresref2;
        var apellidosref2 = req.body.apellidosref2;
        var telref2 = req.body.telref2;
        var horarioref2 = req.body.horarioref2;
        var nombresref3 = req.body.nombresref3;
        var apellidosref3 = req.body.apellidosref3;
        var telref3 = req.body.telref3;
        var horarioref3 = req.body.horarioref3;

        var observaciones = req.body.observaciones;
        var statusofrequest = req.body.statusofrequest;

        if (plan == '') {
            plan = 1;
        }

        
        
        connection.getConnection(function (err, pool) {
            pool.beginTransaction(function (err) {
                if (err) throw err;
                if(statusofrequest == 'corregir'){
                    var insert_request = "UPDATE request SET corrected = 1 WHERE idrequest = ?";
                    var inserts = [last_id_inserted];
                }else{
                    var insert_request = "UPDATE request SET status = ? WHERE idrequest = ?";
                    var inserts = [statusofrequest, last_id_inserted];
                }

                query_request = mysql.format(insert_request, inserts);
                pool.query(query_request, function (err, result) {
                    if (err) {
                        pool.rollback(function () {
                            throw err;
                        });
                    }
                    
                    
                    var insert_dataplan = "UPDATE dataplan SET type = ?,origin = ?,migrate_num = ?,ref_account = ?,canal = ?,idplan = ?,initialpay = ?,pricelist = ?,celphone = ? WHERE idrequest = ?";
                    var inserts = [
                        tipodeactivacion,
                        procedencia,
                        numeroamigrar,
                        referenciaacta,
                        canal,
                        plan,
                        pagoinicial,
                        costoamigo,
                        equipo,
                        last_id_inserted
                    ];
                    query_dataplan = mysql.format(insert_dataplan, inserts);

                    pool.query(query_dataplan, function (err, result) {
                        if (err) {
                            pool.rollback(function () {
                                throw err;
                            });
                        }
                        var insert_datacustomer = "UPDATE datacustomer SET gender=?,name=?,lastname=?,birthday=?,email=?,rfc=?,contact_num=? WHERE idrequest = ?";
                        var inserts = [
                            sexo,
                            nombrescliente,
                            apellidoscliente,
                            fechadenacimiento,
                            email,
                            rfc,
                            numerodelcliente,
                            last_id_inserted
                        ];
                        query_datacustomer = mysql.format(insert_datacustomer, inserts);

                        pool.query(query_datacustomer, function (err, result) {
                            if (err) {
                                pool.rollback(function () {
                                    throw err;
                                });
                            }
                            var insert_addresscustomer = "UPDATE addresscustomer SET state=?,city=?,street=?,num_int=?,num_ext=?,between_streets=?,reference=?,district=?,postalcode=?,local_phonenumber=?,availability=? WHERE idrequest = ?";
                            var inserts = [
                                estado,
                                ciudad,
                                callecliente,
                                numinterior,
                                numexterior,
                                cruzamientos,
                                referencias,
                                colonia,
                                codigopostal,
                                numcelularofijo,
                                horariovisita,
                                last_id_inserted
                            ];

                            query_addresscustomer = mysql.format(insert_addresscustomer, inserts);

                            pool.query(query_addresscustomer, function (err, result) {
                                if (err) {
                                    pool.rollback(function () {
                                        throw err;
                                    });
                                }
                                var insert_jobcustomer = "UPDATE jobcustomer SET name=?,job=?,phonenumber=?,extension=?,availability=? WHERE idrequest = ?";
                                var inserts = [
                                    nombreempresa,
                                    cargo,
                                    celofijolaboral,
                                    extensionlaboral,
                                    horariovisitalaboral,
                                    last_id_inserted
                                ];
                                query_jobcustomer = mysql.format(insert_jobcustomer, inserts);

                                pool.query(query_jobcustomer, function (err, result) {
                                    if (err) {
                                        pool.rollback(function () {
                                            throw err;
                                        });
                                    }
                                    var insert_observation = "UPDATE observation SET observation=? WHERE idrequest = ?";
                                    var inserts = [
                                        observaciones,
                                        last_id_inserted
                                    ];
                                    
                                    query_observation = mysql.format(insert_observation, inserts);
                                    pool.query(query_observation, function (err, result) {
                                        if (err) {
                                            pool.rollback(function () {
                                                throw err;
                                            });
                                        }
                                        //OBTENGO LOS ID RELACIONADOS AL IDREQUEST
                                        var query_getIDs = "SELECT id FROM reference WHERE idrequest = ? ";
                                        var inserts = [
                                            last_id_inserted
                                        ];
                                        
                                        query_reference = mysql.format(query_getIDs, inserts);
                                        pool.query(query_reference, function (err, result) {
                                            if (err) {
                                                pool.rollback(function () {
                                                    throw err;
                                                });
                                            }
                                            //GUARDO LOS ID RECUPERADOS EN VARIABLES PARA HACER EL UPDATE
                                            var id1 = result[0].id;
                                            var id2 = result[1].id;
                                            if (result[2]){
                                                var id3 = result[2].id;
                                            }else{
                                                var id3 = 0;
                                            }
                                            

                                            

                                            //ACTUALIZO EL PRIMER ID ---------------------------------
                                            var insert_reference = "UPDATE reference SET name=?,lastname=?,phonenumber=?,availability=? WHERE id = ?";
                                            var inserts = [
                                                nombresref1,
                                                apellidosref1,
                                                telref1,
                                                horarioref1,
                                                id1,
                                            ];

                                            query_updatereference = mysql.format(insert_reference, inserts);
                                            pool.query(query_updatereference, function (err, result) {
                                                if (err) {
                                                    pool.rollback(function () {
                                                        throw err;
                                                    });
                                                }
                                                //ACTUALIZO EL SEGUNDO ID ---------------------------------
                                                var insert_reference = "UPDATE reference SET name=?,lastname=?,phonenumber=?,availability=? WHERE id = ?";
                                                var inserts = [
                                                    nombresref2,
                                                    apellidosref2,
                                                    telref2,
                                                    horarioref2,
                                                    id2,
                                                ];

                                                query_updatereference = mysql.format(insert_reference, inserts);
                                                pool.query(query_updatereference, function (err, result) {
                                                    if (err) {
                                                        pool.rollback(function () {
                                                            throw err;
                                                        });
                                                    }
                                                    //ACTUALIZO EL TERCER ID ---------------------------------
                                                    var insert_reference = "UPDATE reference SET name=?,lastname=?,phonenumber=?,availability=? WHERE id = ?";
                                                    var inserts = [
                                                        nombresref3,
                                                        apellidosref3,
                                                        telref3,
                                                        horarioref3,
                                                        id3,
                                                    ];

                                                    query_updatereference = mysql.format(insert_reference, inserts);
                                                    pool.query(query_updatereference, function (err, result) {
                                                        if (err) {
                                                            pool.rollback(function () {
                                                                throw err;
                                                            });
                                                        }
                                                        pool.commit(function (err) {
                                                            if (err) {
                                                                pool.rollback(function () {
                                                                    throw err;
                                                                });
                                                            }
                                                            console.log('Actualizacion de captura ID: ' + last_id_inserted);
                                                            res.send('Actualizado');
                                                            
                                                        });//fin del bloque del commit
                                                    });//FIN DEL QUERY PARA HACER UPDATE AL TERCER ID INDIVIDUAL
                                                });//FIN DEL QUERY PARA HACER UPDATE AL SEGUNDO ID INDIVIDUAL
                                            });//FIN DEL QUERY PARA HACER UPDATE AL PRIMER ID INDIVIDUAL
                                        });//FIN DEL QUERY PARA OBTENER IDS INDIVIDUALES DE REFERENCIAS SEGUN IDREQUEST 
                                    }); //fin del query a tabla dataplan
                                }); //fin del query a tabla reference
                            }); //fin del query a tabla addresscustomer
                        }); //fin del query a tabla datacustomer
                    }); //fin del query a tabla dataplan
                });//fin del query a tabla request <------
            });// fin de beginTransaction
        }); //fin de getConnection
    }); //fin de /updatedata

    
    
    //OPERACIONES PARA ALIMENTAR TABLAS DE ESTADISTICAS DE ASESOR CON AJAX Y WEBSOCKETS-----------

    app.post('/feedactivadores', middleware.requireLogin, function (req, res) {
        
        var top10Activadores = [];
        var current_month = (moment().month()) + 1;
        var activadores = "SELECT CONCAT(user.lastname,' ', user.name) AS person_name, COUNT(*) AS quantity FROM request LEFT JOIN user ON user.iduser = request.iduser WHERE request.status = 'activa' and MONTH(request.activated) = ? GROUP BY person_name ORDER BY quantity DESC LIMIT 10";
        var inserts = [current_month];
        var query_activadores = mysql.format(activadores, inserts);
        connection.query(query_activadores, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    'person_name': element.person_name,
                    'quantity': element.quantity
                }
                top10Activadores.push(row);
            });
            res.send(top10Activadores);
        });
    }); //fin del /feedactivadores

    app.post('/feedcampanias', middleware.requireLogin, function (req, res) {
       
        var top10campanias = [];
        var current_month = (moment().month()) + 1;
        
        
        var campanias = "SELECT campaign.name AS campaign_name, COUNT(*) AS quantity FROM request LEFT JOIN user ON user.iduser = request.iduser LEFT JOIN campaign ON user.idcampaign = campaign.idcampaign WHERE request.status = 'activa' and MONTH(request.activated) = ? GROUP BY campaign_name ORDER BY quantity DESC LIMIT 10";

        var inserts = [current_month];
        var query_campanias = mysql.format(campanias, inserts);
        connection.query(query_campanias, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    'campaign_name': element.campaign_name,
                    'quantity': element.quantity
                }
                top10campanias.push(row);
            });
            res.send(top10campanias);
        });
    }); //fin del /feedactivadores

    app.post('/feedminidash', middleware.requireLogin, function (req, res) {
        var userLoggedIn = req.body.userLoggedIn;
        var minidashboarddata = [];
        var current_month = (moment().month()) + 1;

        
        var minidash = "SELECT SUM(CASE WHEN request.status = 'activa' AND request.iduser = ? AND MONTH(activated) = ? THEN 1 ELSE 0 END) AS activaciones, SUM(CASE WHEN request.status != 'borrador' AND request.iduser = ? AND MONTH(created) = ? THEN 1 ELSE 0 END) AS capturas, campaign.firstgoal AS meta FROM request LEFT JOIN user ON user.iduser = request.iduser LEFT JOIN campaign ON user.idcampaign = campaign.idcampaign WHERE request.iduser = ?";

        var inserts = [Number(userLoggedIn), current_month, Number(userLoggedIn), current_month, Number(userLoggedIn)];
        
        var query_minidash = mysql.format(minidash, inserts);
        
        connection.query(query_minidash, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    'activaciones': element.activaciones,
                    'capturas': element.capturas,
                    'meta': element.meta
                }
                minidashboarddata.push(row);
                
            });
            res.send(minidashboarddata);
        });
    }); //fin del /feedminidash

    app.post('/tablaborradores', middleware.requireLogin, function (req, res) {
        var userLoggedIn = req.body.userLoggedIn;
        var borradores = [];
        //var current_month = (moment().month()) + 1;

        var statusborrador = "SELECT request.idrequest AS idrequest, request.created AS fecha, CONCAT(datacustomer.lastname,' ',datacustomer.name) AS cliente, datacustomer.contact_num AS contacto FROM request LEFT JOIN datacustomer ON datacustomer.idrequest = request.idrequest WHERE request.status = 'borrador' and request.iduser = ? ORDER BY fecha DESC";
        var inserts = [userLoggedIn];
        var query_statusborrador = mysql.format(statusborrador, inserts);
        connection.query(query_statusborrador, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    'fecha': moment(element.fecha).format('DD[/]MM[-]HH[:]mm'),
                    'cliente': element.cliente,
                    'contacto': element.contacto,
                    'idrequest': element.idrequest
                }
                borradores.push(row);
            });
            res.send(borradores);
        });
    }); //fin del /tablaborradores

    app.post('/tablacapturas', middleware.requireLogin, function (req, res) {
        var userLoggedIn = req.body.userLoggedIn;
        var capturas = [];
        var current_month = (moment().month()) + 1;

        var statusborrador = "SELECT request.idrequest as idrequest, request.created AS fecha, CONCAT(datacustomer.lastname,' ',datacustomer.name) AS cliente, datacustomer.contact_num AS contacto, plan.name AS plan, request.status AS estatus FROM request LEFT JOIN datacustomer ON datacustomer.idrequest = request.idrequest LEFT JOIN dataplan ON dataplan.idrequest = request.idrequest LEFT JOIN plan ON plan.idplan = dataplan.idplan  WHERE request.status IN ('aceptada','aceptadacc','enviado','en espera') and request.iduser = ?  UNION        SELECT request.idrequest as idrequest, request.created AS fecha, CONCAT(datacustomer.lastname, ' ', datacustomer.name) AS cliente, datacustomer.contact_num AS contacto, plan.name AS plan, request.status AS estatus FROM request LEFT JOIN datacustomer ON datacustomer.idrequest = request.idrequest LEFT JOIN dataplan ON dataplan.idrequest = request.idrequest LEFT JOIN plan ON plan.idplan = dataplan.idplan  WHERE (request.status = 'activa' and MONTH(request.activated) = ? and request.iduser = ?) OR (request.status = 'no finalizada' and MONTH(request.created) = ? and request.iduser = ?) OR (request.status = 'rechazada' and MONTH(request.created) = ? and request.iduser = ?) ORDER BY estatus ASC";
        var inserts = [userLoggedIn, current_month, userLoggedIn, current_month, userLoggedIn, current_month, userLoggedIn];
        var query_capturas = mysql.format(statusborrador, inserts);
        //console.log(query_capturas);
        connection.query(query_capturas, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    'fecha': moment(element.fecha).format('DD[/]MM[-]HH[:]mm'),
                    'cliente': element.cliente,
                    'contacto': element.contacto,
                    'plan': element.plan,
                    'idrequest': element.idrequest,
                    'estatus': element.estatus
                }
                capturas.push(row);
            });
            res.send(capturas);
        });
    }); //fin del /tablaborradores

    app.post('/tablacorrecciones', middleware.requireLogin, function (req, res) {
        var userLoggedIn = req.body.userLoggedIn;
        var correcciones = [];
        //var current_month = (moment().month()) + 1;

        var statusborrador = "SELECT request.idrequest as idrequest, request.corrected AS corregido, request.created AS fecha, CONCAT(datacustomer.lastname,' ',datacustomer.name) AS cliente, datacustomer.contact_num AS contacto, plan.name AS plan, request.status AS estatus FROM request LEFT JOIN datacustomer ON datacustomer.idrequest = request.idrequest LEFT JOIN dataplan ON dataplan.idrequest = request.idrequest LEFT JOIN plan ON plan.idplan = dataplan.idplan  WHERE request.status != 'borrador' and request.status = 'corregir' and request.iduser = ? ORDER BY fecha DESC";
        var inserts = [userLoggedIn];
        var query_correcciones = mysql.format(statusborrador, inserts);
        connection.query(query_correcciones, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    'fecha': moment(element.fecha).format('DD[/]MM[-]HH[:]mm'),
                    'cliente': element.cliente,
                    'contacto': element.contacto,
                    'plan': element.plan,
                    'idrequest': element.idrequest,
                    'estatus': element.estatus,
                    'corregido':element.corregido
                }
                correcciones.push(row);
            });
            res.send(correcciones);
        });
    }); //fin del /tablacorrecciones

    app.post('/tablaagenda', middleware.requireLogin, function (req, res) {
        var userLoggedIn = req.body.userLoggedIn;
        var agenda = [];
        //var current_month = (moment().month()) + 1;

        var statusagenda = "SELECT request.idrequest as idrequest, CONCAT(datacustomer.lastname,' ',datacustomer.name) AS cliente, datacustomer.contact_num AS contacto, scheduled AS agendado FROM request LEFT JOIN datacustomer ON datacustomer.idrequest = request.idrequest WHERE request.status IN('aceptada','aceptadacc') AND scheduled != '' AND request.iduser = ? order by TIMESTAMP(scheduled) DESC";
        var inserts = [userLoggedIn];
        var query_agenda = mysql.format(statusagenda, inserts);
        connection.query(query_agenda, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    'agendado': moment(element.agendado).format('DD[/]MM'),
                    'cliente': element.cliente,
                    'contacto': element.contacto,
                    'hora': moment(element.agendado).format('HH[:]mm'),
                    'idrequest': element.idrequest
                }
                agenda.push(row);
            });
            res.send(agenda);
        });
    }); //fin del /tablaagenda

    // SELECT OPTIONS DEL MODAL---------------------------------------------------------------------

    app.post('/selectoptions', middleware.requireLogin, function (req, res) {
        
        var selectoptions = [];
        

        var planes = "SELECT idplan, name, keyname, term FROM plan WHERE active = 1";
        
        
        connection.query(planes, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    'idplan': element.idplan,
                    'name': element.name,
                    'keyname': element.keyname,
                    'term': element.term
                }
                selectoptions.push(row);
            });
            res.send(selectoptions);
        });
    }); //fin del /tablaborradores


    app.post('/getdatabysisact', middleware.requireLogin, function(req,res){
        var sisact = req.body.folio;
        //var canal = req.body.canal;
        var responseforsisact = []
        var data = "SELECT CONCAT(datacustomer.name,' ',datacustomer.lastname) as cliente, dataplan.canal as canal, dataplan.migrate_num as tipo, dataplan.ref_account as cuenta, dataplan.idplan as idplan, datacustomer.email as email, dataplan.celphone as equipo FROM request LEFT JOIN dataplan ON dataplan.idrequest = request.idrequest LEFT JOIN datacustomer ON datacustomer.idrequest = request.idrequest WHERE SISACT = ? LIMIT 1; "; 
        var inserts = [sisact];
        var query = mysql.format(data, inserts);
        connection.query(query, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    
                    'cliente': element.cliente,
                    //'canal': element.canal,
                    'tipo': element.tipo,
                    'cuenta': element.cuenta,
                    'idplan': element.idplan,
                    'email': element.email,
                    'equipo': element.equipo
                    
                }
                responseforsisact.push(row);
            });
            res.send(responseforsisact);
        });
    });

    //INSERCION Y ACTUALIZACION DE DATOS DE ENTREGA A DOMICILIO

    app.post('/insertdatadomicilio', middleware.requireLogin, function(req,res){

        //se reciben los parametros del lado del cliente

        var userLoggedIn = req.body.userLoggedIn;
        var cliente = req.body.cliente;
        //var fechaentrega = req.body.fechaentrega;
        //var horarioentrega = req.body.horarioentrega;
        var contacto = req.body.contacto;	
        var numamigrar = req.body.numamigrar;
        var destino = req.body.destino;
        var direccion = req.body.direccion;
        var colonia = req.body.colonia;
        var referencias = req.body.referencias;
        var folio = req.body.folio;
        //var canal = req.body.canal;
        var plan = req.body.plan;	
        var tipoactivacion = req.body.tipoactivacion;	
        var ctaconsolidar = req.body.ctaconsolidar;
        var email = req.body.email;
        var financiamiento = req.body.financiamiento;
        var equipo = req.body.equipo;
        var imei = req.body.imei;
        var concepto = req.body.concepto;
        var observaciones = req.body.observaciones;
        var statusofrequest = req.body.statusofrequest;

        


        var last_id_inserted_dom; //auxiliar para insertar id de la ultima query

    
       
    
       

        //se ejecuta la query con transacciones
        //INTENTAR PRIMERO CON PROMISES PARA EVITAR CALLBACK HELL
        
        connection.getConnection(function (err, pool) {
            pool.beginTransaction(function (err) {
                if (err) throw err;
                var query_metashipping = "INSERT INTO metashipping(status,iduser) VALUES(?,?)";
                var inserts_metashipping = [statusofrequest, userLoggedIn];
                var query_insert_metashipping = mysql.format(query_metashipping, inserts_metashipping);

                
                pool.query(query_insert_metashipping, function (err, result) {
                    if (err) {
                        pool.rollback(function () {
                            throw err;
                        });
                    }
                    last_id_inserted_dom = result.insertId;
                    
                    //siguiente query
                    
                    var query_datashipping = "INSERT INTO datashipping(sisact,idplan,type,account,email,fineq,phone,imei,concept,idshipping,additionalcomment) VALUES(?,?,?,?,?,?,?,?,?,?,?)";
                    var inserts_datashipping = [folio, plan, tipoactivacion, ctaconsolidar, email, financiamiento, equipo, imei, concepto, last_id_inserted_dom, observaciones];
                    var query_insert_datashipping = mysql.format(query_datashipping, inserts_datashipping);

                    pool.query(query_insert_datashipping, function (err, result) {
                        if (err) {
                            pool.rollback(function () {
                                throw err;
                            });//fin del throw err
                        }//fin del if

                        var query_shipping = "INSERT INTO shipping(clientname,contact,mainline,city,address,postalcode,reference,idshipping) VALUES(?,?,?,?,?,?,?,?)";
                        var inserts_shipping = [cliente, contacto, numamigrar, destino, direccion, colonia, referencias, last_id_inserted_dom];
                        var query_insert_shipping = mysql.format(query_shipping, inserts_shipping);

                        pool.query(query_insert_shipping, function (err, result) {
                            if (err) {
                                pool.rollback(function () {
                                    throw err;
                                });//fin del throw err
                            }//fin del if


                            //en el ultimo insert
                            pool.commit(function (err) {
                                if (err) {
                                    pool.rollback(function () {
                                        throw err;
                                    });
                                }
                                console.log('Nueva captura a domicilio ID: ' + last_id_inserted_dom);
                                res.send("Correcto");

                            });//fin del commit

                        });//fin de la tercer query
                    });//fin de la query 2
                });//fin de la query 1
            }); //fin del begin transaction
        }); //fin del get connection

        //responder al cliente en caso de exito

        //esponder al cliente en caso de fallo


       
    });

    //aca va el route de actualizacion que sera usado por parte del analista a domicilio

    //RUTA PARA CARGAR DATOS EN LA TABLA DE PREVISUALIZACION DE 
    app.post('/getPrevisualizacionDomicilio', middleware.requireLogin,function(req,res){
        var asesor = req.body.asesor;
        

        var response_previsualizacion = []
        var data = 'select metashipping.created , shipping.clientname, shipping.contact, metashipping.datewithprovider, metashipping.guidenumber, metashipping.idshipping, metashipping.status from metashipping left join shipping on metashipping.idshipping = shipping.idshipping where metashipping.iduser = ? AND ((month(metashipping.created) = month(now()) AND metashipping.status in ("Cambio a sinergia","Cancelada por cliente","Cancelada/Err.Asesor","Cancelada/Err.Mensajería","Confirmado/Pend.Envío","Guia entregada"))OR(metashipping.status in ("Cliente no contesta","Equipo no disponible","Err.Asesor/Nombre erroneo","Err.Asesor/No tiene ID","Guia enviada","No cuenta con pago","Pendiente","Trámite incompleto")))';
        var inserts = [asesor];
        var query = mysql.format(data, inserts);
        connection.query(query, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {

                    'capturada': moment(element.created).format('MMMM D YYYY, h:mm:ss a'),
                    'guia': element.guidenumber,
                    'fechadeenviodelequipo': moment(element.datewithprovider).format('MMMM D YYYY, h:mm:ss a'),
                    'cliente': element.clientname,
                    'numerodecontacto': element.contact,
                    'estatus': element.status,
                    'idshipping': element.idshipping

                }
                response_previsualizacion.push(row);
            });
            res.send(response_previsualizacion);
        });
    });

    app.post('/getDetalleDomicilio', middleware.requireLogin, function (req, res) {
        //recibir id de la captura a consultar
        var idshipping = req.body.idshipping;
        

        var response_previsualizacion = []
        var data = 'SELECT concat(us.name," ",us.lastname) as asesor, m.updatedstatus, s.clientname,s.scheduled,s.time,s.contact,s.mainline,s.city,s.address,s.postalcode,s.reference,d.sisact,p.idplan ,p.keyname, p.name, p.term, p.type as tipoplan, d.type, d.account, d.email, d.fineq, d.phone, d.imei, d.concept, d.additionalcomment, d.channel,  m.created, m.status, m.provider, m.guidenumber, m.comment, m.datewithprovider, m.iccid, m.invoice, m.activation_date, m.delivered_date FROM metashipping m LEFT JOIN shipping s ON m.idshipping = s.idshipping LEFT JOIN datashipping d ON m.idshipping = d.idshipping LEFT JOIN plan p ON d.idplan = p.idplan LEFT JOIN user us ON us.iduser = m.iduser WHERE m.idshipping = ? LIMIT 1';
        var inserts = [idshipping];
        var query = mysql.format(data, inserts);
        connection.query(query, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {

                    //'capturada': moment(element.created).format('MMMM D YYYY, h:mm:ss a'),
                    'asesor': element.asesor,

                    'clientname': element.clientname,
                    'scheduled': moment(element.scheduled).format('YYYY[/]MM[/]DD'),
                    'time': element.time,
                    'contact': element.contact,
                    'mainline': element.mainline,
                    'city': element.city,
                    'address': element.address,
                    'postalcode': element.postalcode,
                    'reference': element.reference,
                    //'idshipping': element.idshipping,

                    'sisact': element.sisact,
                    'idplan': element.idplan,
                    'keynameplan': element.keyname, //modificar query para tener clave
                    'nameplan': element.name, //modificar query para tener el nombre
                    'termplan': element.term, //modificar query para tener termino
                    'typeplan': element.tipoplan, //modificar query para tener el tipo
                    'type': element.type,
                    'account': element.account,
                    'email': element.email,
                    'fineq': element.fineq,
                    'phone': element.phone,
                    'imei': element.imei,
                    'concept': element.concept,
                    'additionalcomment': element.additionalcomment,
                    'channel': element.channel,

                    'created': moment(element.created).format('MMMM D YYYY, h:mm:ss a'),
                    'status': element.status,
                    //'updatedstatus': moment(element.updatedstatus).format('MMMM D YYYY, h:mm:ss a'),
                    'provider': element.provider,
                    'guidenumber': element.guidenumber,
                    'comment': element.comment,
                    'datestatus': moment(element.updatedstatus).format('YYYY[/]MM[/]DD'),
                    
                    //'iduser': element.iduser,
                    'datewithprovider': moment(element.datewithprovider).format('YYYY[/]MM[/]DD'),
                    'iccid': element.iccid,
                    'invoice': element.invoice,
                    
                    'activation_date': moment(element.activation_date).format('YYYY[/]MM[/]DD'),
                    'delivered_date': moment(element.delivered_date).format('YYYY[/]MM[/]DD')
                }
                response_previsualizacion.push(row);
            });
            res.send(response_previsualizacion);
        });
    });
    

    
    app.get('*', function (req, res) {
        res.status(404).send('Error 404');
    });
}