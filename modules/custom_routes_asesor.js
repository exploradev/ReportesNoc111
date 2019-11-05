middleware = require('./middlewares');
var mysql = require('mysql');
var connection = require('./db');
var connectionTMK = require('./db_tmk');
var moment = require('moment');


module.exports = function(app,io){

    //DEVUELVE LOS OPTION DE LA BASE DE SEPOMEX
    app.post('/getMunicipio', middleware.requireLogin, function (req, res) {
        var estado = req.body.estado;

        query = 'SELECT distinct(municipio) as municipio FROM sepomex where estado = ? order by municipio';
        inserts = [estado];
        query = mysql.format(query, inserts);
        response = [];
     
        connection.getConnection(function(err,conn){
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                results.forEach(element => {
                    var row = {
                        'municipio': element.municipio
                    }
                    response.push(row);
                });
                res.send(response);
            });
            conn.release();
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
        connection.getConnection(function(err,conn){
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                results.forEach(element => {
                    var row = {
                        'colonia': element.colonia
                    }
                    response.push(row);
                });
                res.send(response);
            });
            conn.release();
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
       
        connection.getConnection(function(err,conn){
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                results.forEach(element => {
                    var row = {
                        'cp': element.cp
                    }
                    response.push(row);
                });
                res.send(response);
            });
            conn.release();
        });
        
    });


    //------------------------------------------------------------
    //SE CONSULTA EXISTENCIA DE REPORTE ANTES DE LEVANTAR OTRO
    app.post('/consultaexistencia', middleware.requireLogin, function (req, res) {
        var telefono = req.body.telefono;
        var tiporeporte = req.body.tiporeporte;
       
        query = "SELECT telefono,falla FROM metadatos WHERE telefono = ? and falla = ? and estatus NOT IN('Cerrado')";
        inserts = [telefono, tiporeporte];
        query = mysql.format(query, inserts);
        response = [];
        connection.getConnection(function(err,conn){
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                var numRows = results.length;
                if (numRows > 0) {
                    res.send('existe');
                } else {
                    res.send('no existe');
                }
                //res.send(numRows);
            });
            conn.release();
        });
        
    });


    //------------------------------------------------------------


    //SE RECIBEN IDs DE USUARIOS CONECTADOS Y EL ID DE LA ULTIMA CAPTURA
    //PARA ASIGNARLA DEPENDIENDO DEL ALGORITMO
    function asignacion_propietario(captura){

        

        //sanitizo las variables
        if (captura == undefined || captura == null){
            captura = 0;
        }

        //obtengo la hora
        var d = new Date();
        var hours = d.getHours();

        //si la captura esta entre la 1 y 2pm
        if (hours > 12 && hours < 14){
            //buscar el id del que tenga menos registros de los noc vespertinos directo de db y asignarselo
            //comienza la query de consulta
            var query = "SELECT u.iduser as propietario, ifnull(count(m.estatus),0) as capturas FROM metadatos m right JOIN users u on u.iduser = m.propietario WHERE u.rol = 'noc' AND u.estatus = 'activo' AND u.turno = 'matutino' AND month(m.creado) = month(now())  group by u.iduser order by capturas asc limit 1";
            connection.getConnection(function(err,conn){
                conn.query(query, function (error, results, field) {
                    if (error) throw error;
                    //console.log(results);
                    let propietario = results[0].propietario;
                    //ejecuto segunda query en la que la asigno al noc que tenga menos capturas segun la consulta anteriormente realizada
                    var query = "UPDATE metadatos SET propietario = ? WHERE idmetadatos = ?";
                    var inserts = [propietario, captura];
                    query = mysql.format(query, inserts);
                    conn.query(query, function (error, results, field) {
                        if (error) throw error;
                        console.log("Asignado correctamente a iduser: " + propietario + " - la captura: " + captura);
                    }); //fin query de asignacion
                }); //fin query de consulta
                conn.release();
            });
            
        }else if(hours > 19 && hours < 24){ //si la captura esta entre las 8 y 11 pm
            //buscar el id del que tenga menos registros de los noc matutinos directo de db y asignarselo
            var query = "SELECT u.iduser as propietario, ifnull(count(m.estatus),0) as capturas FROM metadatos m right JOIN users u on u.iduser = m.propietario WHERE u.rol = 'noc' AND u.estatus = 'activo' AND u.turno = 'matutino' AND month(m.creado) = month(now())  group by u.iduser order by capturas asc limit 1";

            connection.getConnection(function(err,conn){
                conn.query(query, function (error, results, field) {
                    if (error) throw error;
                    //console.log(results);
                    let propietario = results[0].propietario;
                    //ejecuto segunda query en la que la asigno al noc que tenga menos capturas segun la consulta anteriormente realizada
                    var query = "UPDATE metadatos SET propietario = ? WHERE idmetadatos = ?";
                    var inserts = [propietario, captura];
                    query = mysql.format(query, inserts);
                    conn.query(query, function (error, results, field) {
                        if (error) throw error;
                        console.log("Asignado correctamente a iduser: " + propietario + " - la captura: " + captura);
                    }); //fin query de asignacion
                }); //fin query de consulta
                conn.release();
            })
            
        }else if(usuarios_conectados.length > 1){ //si hay conectados y la captura no esta entre los rangos anteriores
            //tratamiento de ids
            let usuarios_conectados_ids = [];
            usuarios_conectados.forEach((index)=>{
                usuarios_conectados_ids.push(index.idasesor);
            });
            //console.log(usuarios_conectados_ids);
            
            //comienza la query de consulta
            //console.log(usuarios_conectados_ids);
            var query = "SELECT u.iduser as propietario, ifnull(count(m.estatus),0) as capturas FROM metadatos m right JOIN users u on u.iduser = m.propietario WHERE u.iduser IN(?) AND month(m.creado) = month(now())  group by u.iduser order by capturas asc limit 1";
            var inserts = [usuarios_conectados_ids];
            query = mysql.format(query,inserts);
            connection.getConnection(function(err,conn){
                conn.query(query, function (error, results, field) {
                    if (error) throw error;
                    //console.log(results);
                    let propietario = results[0].propietario;

                    //ejecuto segunda query en la que la asigno al noc que tenga menos capturas segun la consulta anteriormente realizada
                    var query = "UPDATE metadatos SET propietario = ? WHERE idmetadatos = ?";
                    var inserts = [propietario, captura];
                    query = mysql.format(query, inserts);
                    conn.query(query, function (error, results, field) {
                        if (error) throw error;
                        console.log("Asignado correctamente a iduser: " + propietario + " - la captura: " + captura);
                    }); //fin query de asignacion
                }); //fin query de consulta
                conn.release();
            });
            
            //BUSCAR EL QUE TIENE MENOS DE LOS CONECTADOS
        }else{
            if(hours > 1 && hours < 13){ //si no hay conexiones entre los rangos ni fuera de ellos entonces
                //buscar el que tiene menos del turno matutino y asignarlo
                var query = "SELECT u.iduser as propietario, ifnull(count(m.estatus),0) as capturas FROM metadatos m right JOIN users u on u.iduser = m.propietario WHERE u.rol = 'noc' AND u.estatus = 'activo' AND u.turno = 'matutino' AND month(m.creado) = month(now())  group by u.iduser order by capturas asc limit 1";
                connection.getConnection(function(err,conn){
                    conn.query(query, function (error, results, field) {
                        if (error) throw error;
                        //console.log(results);
                        let propietario = results[0].propietario;
                        //ejecuto segunda query en la que la asigno al noc que tenga menos capturas segun la consulta anteriormente realizada
                        var query = "UPDATE metadatos SET propietario = ? WHERE idmetadatos = ?";
                        var inserts = [propietario, captura];
                        query = mysql.format(query, inserts);
                        conn.query(query, function (error, results, field) {
                            if (error) throw error;
                            console.log("Asignado correctamente a iduser: " + propietario + " - la captura: " + captura);
                        }); //fin query de asignacion
                    }); //fin query de consulta
                    conn.release();
                });
                
            }else if(hours > 14 && hours < 20){
                //buscar el que tiene menos del turno vespertino y asignarlo
                var query = "SELECT u.iduser as propietario, ifnull(count(m.estatus),0) as capturas FROM metadatos m right JOIN users u on u.iduser = m.propietario WHERE u.rol = 'noc' AND u.estatus = 'activo' AND u.turno = 'vespertino' AND month(m.creado) = month(now())  group by u.iduser order by capturas asc limit 1";
                connection.getConnection(function(err,conn){
                    conn.query(query, function (error, results, field) {
                        if (error) throw error;
                        //console.log(results);
                        let propietario = results[0].propietario;
                        //ejecuto segunda query en la que la asigno al noc que tenga menos capturas segun la consulta anteriormente realizada
                        var query = "UPDATE metadatos SET propietario = ? WHERE idmetadatos = ?";
                        var inserts = [propietario, captura];
                        query = mysql.format(query, inserts);
                        conn.query(query, function (error, results, field) {
                            if (error) throw error;
                            console.log("Asignado correctamente a iduser: " + propietario + " - la captura: " + captura);
                        }); //fin query de asignacion
                    }); //fin query de consulta
                    conn.release();
                });
                
            }
        }
        console.log(usuarios_conectados);
        console.log(captura);

        //DOY LA ALERTA DE INSERCION PARA ACTUALIZAR TABLAS
        io.emit('new', 'nueva_captura');
    }

    //SE AGREGA A BASE DE DATOS LOS DATOS DE LOS FORMULARIOS

    //COBERTURA OK DOBLE CAPA ANTI DUPLICADOS
    app.post('/guardar_cobertura', middleware.requireLogin, function (req, res) {
        let ipaddr = req.connection.remoteAddress
        //se reciben los parametros del lado del cliente

        var iduser = req.body.iduser;
        var telefono_afectado = req.body.telefono_afectado;
        var contacto = req.body.contacto;
        var nombreusuario = req.body.nombreusuario;
        var fechanaciemiento = req.body.fechanaciemiento;
        var lugarnacimiento = req.body.lugarnacimiento;
        var estado = req.body.estado;
        var municipio = req.body.municipio;
        var colonia = req.body.colonia;
        var cp = req.body.cp;
        var direccioncliente = req.body.direccioncliente;
        var descripcionzona = req.body.descripcionzona;
        var marcaequipo = req.body.marcaequipo;
        var modeloequipo = req.body.modeloequipo;
        var fechainiciofalla = req.body.fechainiciofalla;
        var falla = req.body.falla;
        var descripcionsituacion = req.body.descripcionsituacion;
        var tecnologia = req.body.tecnologia;
        var servicio = req.body.servicio;
        
        
        var tipodefallareportada = 'cobertura';
        var estatus = 'Nuevo';


        var last_id_inserted; //auxiliar para insertar id de la ultima query



        connection.getConnection(function(errors,connectit){
            
            var duplicidad = "SELECT * FROM metadatos WHERE month(now()) = month(creado) and telefono = ? and falla = ? and estatus <> 'Cerrado'";
            var inserts_duplicidad = [telefono_afectado,tipodefallareportada];
            duplicidad = mysql.format(duplicidad,inserts_duplicidad);

            connectit.query(duplicidad,function(errorr,results){
                if (results.length > 0){
                    res.send("EXISTE REGISTRO DEL MISMO TIPO EN LA DB");
                    console.log("Error al registrar nuevos datos, ya existe un registro similar");
                } else {
                    console.log("INGRESANDO TRANSACCION DE INSERCION UNICA");

                    connection.getConnection(function (err, pool) {
                        pool.beginTransaction(function (err) {
                            if (err) throw err;
                            var query = "INSERT INTO metadatos(ipaddr,estatus,iduser,falla,telefono,estado,municipio,colonia,cp) VALUES(?,?,?,?,?,?,?,?,?)";
                            var inserts = [ipaddr, estatus, iduser, tipodefallareportada, telefono_afectado, estado, municipio, colonia, cp];
                            query = mysql.format(query, inserts);

                            pool.query(query, function (err, result) {
                                if (err) {
                                    pool.rollback(function () {
                                        throw err;
                                    });
                                }
                                last_id_inserted = result.insertId;

                                //siguiente query

                                var query = "INSERT INTO cobertura(idmetadatos,telefono,contacto,usuario,fechanacimiento,lugarnacimiento,iniciofalla,direccion,desczona,equipomarca,equipomodelo,falla,descripcion,estado,municipio,colonia,cp,tecnologia,servicio) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                                var inserts = [last_id_inserted, telefono_afectado, contacto, nombreusuario, fechanaciemiento, lugarnacimiento, fechainiciofalla, direccioncliente, descripcionzona, marcaequipo, modeloequipo, falla, descripcionsituacion, estado, municipio, colonia, cp,tecnologia,servicio];
                                query = mysql.format(query, inserts);
                                pool.query(query, function (err, result) {
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
                                        console.log('Nuevo reporte de cobertura ID: ' + last_id_inserted);
                                        asignacion_propietario(last_id_inserted);
                                        res.send("Correcto");

                                    });//fin del commit
                                });//fin del query 2

                            });//fin de la query 1
                        }); //fin del begin transaction
                        pool.release();
                    }); //fin del get connection

                }
            });
            connectit.release();
        });


        //se ejecuta la query con transacciones
        

        

        //responder al cliente en caso de exito

        //esponder al cliente en caso de fallo



    });

    //ACLARACIONES OK DOBLE CAPA ANTI DUPLICADOS
    app.post('/guardar_aclaracion', middleware.requireLogin, function (req, res) {
        let ipaddr = req.connection.remoteAddress
        //se reciben los parametros del lado del cliente

        var iduser = req.body.iduser;
        var telefono_afectado = req.body.telefono_afectado;
        var contacto = req.body.contacto;
        var nombreusuario = req.body.nombreusuario;
        var fechainiciofalla = req.body.fechainiciofalla;
        var descripcionsituacion = req.body.descripcionsituacion;
        var estado = req.body.estado;
        var municipio = req.body.municipio;
        var colonia = req.body.colonia;
        var cp = req.body.cp;

        var tipodefallareportada = 'aclaraciones';
        var estatus = 'Nuevo';


        var last_id_inserted; //auxiliar para insertar id de la ultima query

        
        connection.getConnection(function (errors, connectit) {

            var duplicidad = "SELECT * FROM metadatos WHERE month(now()) = month(creado) and telefono = ? and falla = ? and estatus <> 'Cerrado'";
            var inserts_duplicidad = [telefono_afectado, tipodefallareportada];
            duplicidad = mysql.format(duplicidad, inserts_duplicidad);

            connectit.query(duplicidad, function (errorr, results) {
                if (results.length > 0) {
                    res.send("EXISTE REGISTRO DEL MISMO TIPO EN LA DB");
                    console.log("Error al registrar nuevos datos, ya existe un registro similar");
                } else {
                    console.log("INGRESANDO TRANSACCION DE INSERCION UNICA");

                    connection.getConnection(function (err, pool) {
                        pool.beginTransaction(function (err) {
                            if (err) throw err;
                            var query = "INSERT INTO metadatos(ipaddr,estatus,iduser,falla,telefono,estado,municipio,colonia,cp) VALUES(?,?,?,?,?,?,?,?,?)";
                            var inserts = [ipaddr,estatus, iduser, tipodefallareportada, telefono_afectado,  estado, municipio, colonia, cp];
                            query = mysql.format(query, inserts);

                            pool.query(query, function (err, result) {
                                if (err) {
                                    pool.rollback(function () {
                                        throw err;
                                    });
                                }
                                last_id_inserted = result.insertId;

                                //siguiente query

                                var query = "INSERT INTO aclaracion(idmetadatos,telefono,usuario,contacto,fecha,descripcion) VALUES(?,?,?,?,?,?)";
                                var inserts = [last_id_inserted, telefono_afectado, nombreusuario, contacto, fechainiciofalla, descripcionsituacion];
                                query = mysql.format(query, inserts);
                                pool.query(query, function (err, result) {
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
                                        console.log('Nuevo reporte de aclaracion ID: ' + last_id_inserted);
                                        asignacion_propietario(last_id_inserted);
                                        res.send("Correcto");

                                    });//fin del commit
                                });//fin del query 2

                            });//fin de la query 1
                        }); //fin del begin transaction
                        pool.release();
                    }); //fin del get connection

                }
            });
            connectit.release();
        });



       


    });

    //CALLBACK OK DOBLE CAPA ANTI DUPLICADOS
    app.post('/guardar_callback', middleware.requireLogin, function (req, res) {
        let ipaddr = req.connection.remoteAddress
        //se reciben los parametros del lado del cliente

        var iduser = req.body.iduser;
        var telefono_afectado = req.body.telefono_afectado;

        var contacto = req.body.contacto;
        var nombreusuario = req.body.nombreusuario;
        var motivo = req.body.motivo;
        var descripcionsituacion = req.body.descripcionsituacion;
        var estado = req.body.estado;
        var municipio = req.body.municipio;
        var colonia = req.body.colonia;
        var cp = req.body.cp;

        var tipodefallareportada = 'callback';
        var estatus = 'Nuevo';

        var last_id_inserted; //auxiliar para insertar id de la ultima query


        //VALIDAR SI LA INSERCION EXISTE, SINO NO HACERLA
        connection.getConnection(function(errors,connectit){
            
            var duplicidad = "SELECT * FROM metadatos WHERE month(now()) = month(creado) and telefono = ? and falla = ? and estatus <> 'Cerrado'";
            var inserts_duplicidad = [telefono_afectado,tipodefallareportada];
            duplicidad = mysql.format(duplicidad,inserts_duplicidad);

            connectit.query(duplicidad,function(errorr,results){
                if (results.length > 0){
                    res.send("EXISTE REGISTRO DEL MISMO TIPO EN LA DB");
                    console.log("Error al registrar nuevos datos, ya existe un registro similar");
                }else{
                    console.log("INGRESANDO TRANSACCION DE INSERCION UNICA");
                    //se ejecuta la query con transacciones
                    connection.getConnection(function (err, pool) {
                        pool.beginTransaction(function (err) {
                            if (err) throw err;
                            var query = "INSERT INTO metadatos(ipaddr,estatus,iduser,falla,telefono,estado,municipio,colonia,cp) VALUES(?,?,?,?,?,?,?,?,?)";
                            var inserts = [ipaddr,estatus, iduser, tipodefallareportada, telefono_afectado, estado, municipio, colonia, cp];
                            query = mysql.format(query, inserts);

                            pool.query(query, function (err, result) {
                                if (err) {
                                    pool.rollback(function () {
                                        throw err;
                                    });
                                }
                                last_id_inserted = result.insertId;

                                //siguiente query

                                var query = "INSERT INTO callback(idmetadatos,telefono,usuario,contacto,motivo,descripcion) VALUES(?,?,?,?,?,?)";
                                var inserts = [last_id_inserted, telefono_afectado, nombreusuario, contacto, motivo, descripcionsituacion];
                                query = mysql.format(query, inserts);
                                pool.query(query, function (err, result) {
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
                                        console.log('Nuevo reporte de callback ID: ' + last_id_inserted);
                                        asignacion_propietario(last_id_inserted);
                                        res.send("Correcto");

                                    });//fin del commit
                                });//fin del query 2

                            });//fin de la query 1
                        }); //fin del begin transaction
                        pool.release();
                    }); //fin del get connection
                }
            });

            connectit.release();
        });

        

        

        



    });

    //GENERAL OK DOBLE CAPA ANTI DUPLICADOS
    app.post('/guardar_general', middleware.requireLogin, function (req, res) {
        let ipaddr = req.connection.remoteAddress
        //se reciben los parametros del lado del cliente

        var iduser = req.body.iduser;
        var telefono_afectado = req.body.telefono_afectado;

        var contacto = req.body.contacto;
        var nombreusuario = req.body.nombreusuario;
        var descripcionsituacion = req.body.descripcionsituacion;
        var estado = req.body.estado;
        var municipio = req.body.municipio;
        var colonia = req.body.colonia;
        var cp = req.body.cp;

        var tipodefallareportada = 'general';
        var estatus = 'Nuevo';



        var last_id_inserted; //auxiliar para insertar id de la ultima query


        connection.getConnection(function (errors, connectit) {

            var duplicidad = "SELECT * FROM metadatos WHERE month(now()) = month(creado) and telefono = ? and falla = ? and estatus <> 'Cerrado'";
            var inserts_duplicidad = [telefono_afectado, tipodefallareportada];
            duplicidad = mysql.format(duplicidad, inserts_duplicidad);

            connectit.query(duplicidad, function (errorr, results) {
                if (results.length > 0) {
                    res.send("EXISTE REGISTRO DEL MISMO TIPO EN LA DB");
                    console.log("Error al registrar nuevos datos, ya existe un registro similar");
                } else {
                    console.log("INGRESANDO TRANSACCION DE INSERCION UNICA");

                    //se ejecuta la query con transacciones
                    connection.getConnection(function (err, pool) {
                        pool.beginTransaction(function (err) {
                            if (err) throw err;
                            var query = "INSERT INTO metadatos(ipaddr, estatus,iduser,falla,telefono,estado,municipio,colonia,cp) VALUES(?,?,?,?,?,?,?,?,?)";
                            var inserts = [ipaddr,estatus, iduser, tipodefallareportada, telefono_afectado, estado, municipio, colonia, cp];
                            query = mysql.format(query, inserts);

                            pool.query(query, function (err, result) {
                                if (err) {
                                    pool.rollback(function () {
                                        throw err;
                                    });
                                }
                                last_id_inserted = result.insertId;

                                //siguiente query

                                var query = "INSERT INTO general(idmetadatos,telefono,usuario,contacto,descripcion) VALUES(?,?,?,?,?)";
                                var inserts = [last_id_inserted, telefono_afectado, nombreusuario, contacto, descripcionsituacion];
                                query = mysql.format(query, inserts);
                                pool.query(query, function (err, result) {
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
                                        console.log('Nuevo reporte de Afectación general ID: ' + last_id_inserted);
                                        asignacion_propietario(last_id_inserted);
                                        res.send("Correcto");

                                    });//fin del commit
                                });//fin del query 2

                            });//fin de la query 1
                        }); //fin del begin transaction
                        pool.release();
                    }); //fin del get connection

                }
            });
            connectit.release();
        });

        

        //responder al cliente en caso de exito

        //esponder al cliente en caso de fallo



    });

    //ICCIDOK DOBLE CAPA ANTI DUPLICADOS
    app.post('/guardar_iccid', middleware.requireLogin, function (req, res) {
        let ipaddr = req.connection.remoteAddress
        //se reciben los parametros del lado del cliente

        var iduser = req.body.iduser;
        var telefono_afectado = req.body.telefono_afectado;

        var nombreusuario = req.body.nombreusuario;
        var contacto = req.body.contacto;
        var iccidvirtual = req.body.iccidvirtual;
        var iccidfisica = req.body.iccidfisica;
        var fzaventa = req.body.fzaventa;
        var cac = req.body.cac;
        var estado = req.body.estado;
        var municipio = req.body.municipio;
        var colonia = req.body.colonia;
        var cp = req.body.cp;


        var tipodefallareportada = 'iccid';
        var estatus = 'Nuevo';



        var last_id_inserted; //auxiliar para insertar id de la ultima query

        connection.getConnection(function (errors, connectit) {

            var duplicidad = "SELECT * FROM metadatos WHERE month(now()) = month(creado) and telefono = ? and falla = ? and estatus <> 'Cerrado'";
            var inserts_duplicidad = [telefono_afectado, tipodefallareportada];
            duplicidad = mysql.format(duplicidad, inserts_duplicidad);

            connectit.query(duplicidad, function (errorr, results) {
                if (results.length > 0) {
                    res.send("EXISTE REGISTRO DEL MISMO TIPO EN LA DB");
                    console.log("Error al registrar nuevos datos, ya existe un registro similar");
                } else {
                    console.log("INGRESANDO TRANSACCION DE INSERCION UNICA");

                    //se ejecuta la query con transacciones
                    connection.getConnection(function (err, pool) {
                        pool.beginTransaction(function (err) {
                            if (err) throw err;
                            var query = "INSERT INTO metadatos(ipaddr,estatus,iduser,falla,telefono,estado,municipio,colonia,cp) VALUES(?,?,?,?,?,?,?,?,?)";
                            var inserts = [ipaddr,estatus, iduser, tipodefallareportada, telefono_afectado, estado, municipio, colonia, cp];
                            query = mysql.format(query, inserts);

                            pool.query(query, function (err, result) {
                                if (err) {
                                    pool.rollback(function () {
                                        throw err;
                                    });
                                }
                                last_id_inserted = result.insertId;

                                //siguiente query

                                var query = "INSERT INTO iccid(idmetadatos,telefono,usuario,contacto,cac,iccidfisica,iccidvirtual,fzaventa) VALUES(?,?,?,?,?,?,?,?)";
                                var inserts = [last_id_inserted, telefono_afectado, nombreusuario, contacto, cac, iccidfisica, iccidvirtual, fzaventa];
                                query = mysql.format(query, inserts);
                                pool.query(query, function (err, result) {
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
                                        console.log('Nuevo reporte de Cambio de ICCID ID: ' + last_id_inserted);
                                        asignacion_propietario(last_id_inserted);
                                        res.send("Correcto");

                                    });//fin del commit
                                });//fin del query 2

                            });//fin de la query 1
                        }); //fin del begin transaction
                        pool.release();
                    }); //fin del get connection

                }
            });
            connectit.release();
        });

        

        //responder al cliente en caso de exito

        //esponder al cliente en caso de fallo



    });

    //LLAMADAS / SMS OK DOBLE CAPA ANTI DUPLICADOS
    app.post('/guardar_llamadas', middleware.requireLogin, function (req, res) {
        let ipaddr = req.connection.remoteAddress
        //se reciben los parametros del lado del cliente

        var iduser = req.body.iduser;
        var telefono_afectado = req.body.telefono_afectado;

        var nombreusuario = req.body.nombreusuario;
        var contacto = req.body.contacto;
        var mensajeerror = req.body.mensajeerror;
        var afectacion = req.body.afectacion;
        var tipored = req.body.tipored;
        var origen1 = req.body.origen1;
        var origen2 = req.body.origen2;
        var origen3 = req.body.origen3;
        var descripcionsituacion = req.body.descripcionsituacion;
        var estado = req.body.estado;
        var municipio = req.body.municipio;
        var colonia = req.body.colonia;
        var cp = req.body.cp;

        var tipodefallareportada = 'llamadas';
        var estatus = 'Nuevo';



        var last_id_inserted; //auxiliar para insertar id de la ultima query

        connection.getConnection(function (errors, connectit) {

            var duplicidad = "SELECT * FROM metadatos WHERE month(now()) = month(creado) and telefono = ? and falla = ? and estatus <> 'Cerrado'";
            var inserts_duplicidad = [telefono_afectado, tipodefallareportada];
            duplicidad = mysql.format(duplicidad, inserts_duplicidad);

            connectit.query(duplicidad, function (errorr, results) {
                if (results.length > 0) {
                    res.send("EXISTE REGISTRO DEL MISMO TIPO EN LA DB");
                    console.log("Error al registrar nuevos datos, ya existe un registro similar");
                } else {
                    console.log("INGRESANDO TRANSACCION DE INSERCION UNICA");

                    //se ejecuta la query con transacciones
                    connection.getConnection(function (err, pool) {
                        pool.beginTransaction(function (err) {
                            if (err) throw err;
                            var query = "INSERT INTO metadatos(ipaddr,estatus,iduser,falla,telefono,estado,municipio,colonia,cp) VALUES(?,?,?,?,?,?,?,?,?)";
                            var inserts = [ipaddr,estatus, iduser, tipodefallareportada, telefono_afectado, estado, municipio, colonia, cp];
                            query = mysql.format(query, inserts);

                            pool.query(query, function (err, result) {
                                if (err) {
                                    pool.rollback(function () {
                                        throw err;
                                    });
                                }
                                last_id_inserted = result.insertId;

                                //siguiente query

                                var query = "INSERT INTO llamadassms(idmetadatos,telefono,usuario,contacto,error,afectacion,tipored,origendestuno,origendestdos,origendesttres,descripcion) VALUES(?,?,?,?,?,?,?,?,?,?,?)";
                                var inserts = [last_id_inserted, telefono_afectado, nombreusuario, contacto, mensajeerror, afectacion, tipored, origen1, origen2, origen3, descripcionsituacion];
                                query = mysql.format(query, inserts);
                                pool.query(query, function (err, result) {
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
                                        console.log('Nuevo reporte de Llamadas / SMS ID: ' + last_id_inserted);
                                        asignacion_propietario(last_id_inserted);
                                        res.send("Correcto");

                                    });//fin del commit
                                });//fin del query 2

                            });//fin de la query 1
                        }); //fin del begin transaction
                        pool.release();
                    }); //fin del get connection

                }
            });
            connectit.release();
        });

        

        //responder al cliente en caso de exito

        //esponder al cliente en caso de fallo



    });

    //FALLAS EN NAVEGACIÓN
    app.post('/guardar_navegacion', middleware.requireLogin, function (req, res) {
        let ipaddr = req.connection.remoteAddress
        //se reciben los parametros del lado del cliente

        var iduser = req.body.iduser;
        var telefono_afectado = req.body.telefono_afectado;

        var nombreusuario = req.body.nombreusuario;
        var contacto = req.body.contacto;
        var mensajeerror = req.body.mensajeerror;
        var pruebasbasicas = req.body.pruebasbasicas;
        var tipored = req.body.tipored;
        var fechayhorainiciofalla = req.body.fechayhorainiciofalla;
        var descripcionsituacion = req.body.descripcionsituacion;
        var estado = req.body.estado;
        var municipio = req.body.municipio;
        var colonia = req.body.colonia;
        var cp = req.body.cp;

        var tipodefallareportada = 'navegacion';
        var estatus = 'Nuevo';



        var last_id_inserted; //auxiliar para insertar id de la ultima query

        connection.getConnection(function (errors, connectit) {

            var duplicidad = "SELECT * FROM metadatos WHERE month(now()) = month(creado) and telefono = ? and falla = ? and estatus <> 'Cerrado'";
            var inserts_duplicidad = [telefono_afectado, tipodefallareportada];
            duplicidad = mysql.format(duplicidad, inserts_duplicidad);

            connectit.query(duplicidad, function (errorr, results) {
                if (results.length > 0) {
                    res.send("EXISTE REGISTRO DEL MISMO TIPO EN LA DB");
                    console.log("Error al registrar nuevos datos, ya existe un registro similar");
                } else {
                    console.log("INGRESANDO TRANSACCION DE INSERCION UNICA");

                    //se ejecuta la query con transacciones
                    connection.getConnection(function (err, pool) {
                        pool.beginTransaction(function (err) {
                            if (err) throw err;
                            var query = "INSERT INTO metadatos(ipaddr,estatus,iduser,falla,telefono,estado,municipio,colonia,cp) VALUES(?,?,?,?,?,?,?,?,?)";
                            var inserts = [ipaddr,estatus, iduser, tipodefallareportada, telefono_afectado, estado, municipio, colonia, cp];
                            query = mysql.format(query, inserts);

                            pool.query(query, function (err, result) {
                                if (err) {
                                    pool.rollback(function () {
                                        throw err;
                                    });
                                }
                                last_id_inserted = result.insertId;

                                //siguiente query

                                var query = "INSERT INTO navegacion(idmetadatos,telefono,usuario,contacto,error,pruebasbasicas,tipored,fechahora,descripcion) VALUES(?,?,?,?,?,?,?,?,?)";
                                var inserts = [last_id_inserted, telefono_afectado, nombreusuario, contacto, mensajeerror, pruebasbasicas, tipored, fechayhorainiciofalla, descripcionsituacion];
                                query = mysql.format(query, inserts);
                                pool.query(query, function (err, result) {
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
                                        console.log('Nuevo reporte de Navegación ID: ' + last_id_inserted);
                                        asignacion_propietario(last_id_inserted);
                                        res.send("Correcto");

                                    });//fin del commit
                                });//fin del query 2

                            });//fin de la query 1
                        }); //fin del begin transaction
                        pool.release();
                    }); //fin del get connection

                }
            });
            connectit.release();
        });

        

        //responder al cliente en caso de exito

        //esponder al cliente en caso de fallo



    });

    //FALLAS EN RECARGAS
    app.post('/guardar_recargas', middleware.requireLogin, function (req, res) {
        let ipaddr = req.connection.remoteAddress
        //se reciben los parametros del lado del cliente

        var iduser = req.body.iduser;
        var telefono_afectado = req.body.telefono_afectado;

        var nombreusuario = req.body.nombreusuario;
        var mensajeerror = req.body.mensajeerror;
        var importe = req.body.importe;
        var metodocompra = req.body.metodocompra;
        var fechayhora = req.body.fechayhora;
        var metodocompra2 = req.body.metodocompra2;
        var fechayhora2 = req.body.fechayhora2;
        var metodocompra3 = req.body.metodocompra3;
        var fechayhora3 = req.body.fechayhora3;
        var descripcionsituacion = req.body.descripcionsituacion;
        var contacto = req.body.contacto;
        var estado = req.body.estado;
        var municipio = req.body.municipio;
        var colonia = req.body.colonia;
        var cp = req.body.cp;

        var tipodefallareportada = 'recargas';
        var estatus = 'Nuevo';



        var last_id_inserted; //auxiliar para insertar id de la ultima query

        connection.getConnection(function (errors, connectit) {

            var duplicidad = "SELECT * FROM metadatos WHERE month(now()) = month(creado) and telefono = ? and falla = ? and estatus <> 'Cerrado'";
            var inserts_duplicidad = [telefono_afectado, tipodefallareportada];
            duplicidad = mysql.format(duplicidad, inserts_duplicidad);

            connectit.query(duplicidad, function (errorr, results) {
                if (results.length > 0) {
                    res.send("EXISTE REGISTRO DEL MISMO TIPO EN LA DB");
                    console.log("Error al registrar nuevos datos, ya existe un registro similar");
                } else {
                    console.log("INGRESANDO TRANSACCION DE INSERCION UNICA");

                    //se ejecuta la query con transacciones
                    connection.getConnection(function (err, pool) {
                        pool.beginTransaction(function (err) {
                            if (err) throw err;
                            var query = "INSERT INTO metadatos(ipaddr,estatus,iduser,falla,telefono,estado,municipio,colonia,cp) VALUES(?,?,?,?,?,?,?,?,?)";
                            var inserts = [ipaddr,estatus, iduser, tipodefallareportada, telefono_afectado, estado, municipio, colonia, cp];
                            query = mysql.format(query, inserts);

                            pool.query(query, function (err, result) {
                                if (err) {
                                    pool.rollback(function () {
                                        throw err;
                                    });
                                }
                                last_id_inserted = result.insertId;

                                //siguiente query

                                var query = "INSERT INTO recargas(idmetadatos,telefono,usuario,error,importe,metodocompra,fechahora,metodocompra2,fechahora2,metodocompra3,fechahora3,descripcion,contacto) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)";
                                var inserts = [last_id_inserted, telefono_afectado, nombreusuario, mensajeerror, importe, metodocompra, fechayhora, metodocompra2, fechayhora2, metodocompra3, fechayhora3, descripcionsituacion, contacto];
                                query = mysql.format(query, inserts);
                                pool.query(query, function (err, result) {
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
                                        console.log('Nuevo reporte de Navegación ID: ' + last_id_inserted);
                                        asignacion_propietario(last_id_inserted);
                                        res.send("Correcto");

                                    });//fin del commit
                                });//fin del query 2

                            });//fin de la query 1
                        }); //fin del begin transaction
                        pool.release();
                    }); //fin del get connection

                }
            });
            connectit.release();
        });

        

        //responder al cliente en caso de exito

        //esponder al cliente en caso de fallo



    });

    //FALLAS EN PROMOCIONES
    app.post('/guardar_promociones', middleware.requireLogin, function (req, res) {
        let ipaddr = req.connection.remoteAddress
        //se reciben los parametros del lado del cliente

        var iduser = req.body.iduser;
        var telefono_afectado = req.body.telefono_afectado;

        var nombreusuario = req.body.nombreusuario;
        var contacto = req.body.contacto;
        var promocion = req.body.promocion;
        var fechainiciofalla = req.body.fechainiciofalla;
        var tipo = req.body.tipo;
        var descripcionsituacion = req.body.descripcionsituacion;
        var estado = req.body.estado;
        var municipio = req.body.municipio;
        var colonia = req.body.colonia;
        var cp = req.body.cp;

        var tipodefallareportada = 'promociones';
        var estatus = 'Nuevo';



        var last_id_inserted; //auxiliar para insertar id de la ultima query

        connection.getConnection(function (errors, connectit) {

            var duplicidad = "SELECT * FROM metadatos WHERE month(now()) = month(creado) and telefono = ? and falla = ? and estatus <> 'Cerrado'";
            var inserts_duplicidad = [telefono_afectado, tipodefallareportada];
            duplicidad = mysql.format(duplicidad, inserts_duplicidad);

            connectit.query(duplicidad, function (errorr, results) {
                if (results.length > 0) {
                    res.send("EXISTE REGISTRO DEL MISMO TIPO EN LA DB");
                    console.log("Error al registrar nuevos datos, ya existe un registro similar");
                } else {
                    console.log("INGRESANDO TRANSACCION DE INSERCION UNICA");

                    //se ejecuta la query con transacciones
                    connection.getConnection(function (err, pool) {
                        pool.beginTransaction(function (err) {
                            if (err) throw err;
                            var query = "INSERT INTO metadatos(ipaddr,estatus,iduser,falla,telefono,estado,municipio,colonia,cp) VALUES(?,?,?,?,?,?,?,?,?)";
                            var inserts = [ipaddr,estatus, iduser, tipodefallareportada, telefono_afectado, estado, municipio, colonia, cp];
                            query = mysql.format(query, inserts);

                            pool.query(query, function (err, result) {
                                if (err) {
                                    pool.rollback(function () {
                                        throw err;
                                    });
                                }
                                last_id_inserted = result.insertId;

                                //siguiente query

                                var query = "INSERT INTO promociones(idmetadatos,telefono,usuario,contacto,promocion,fecha,descripcion,tipo) VALUES(?,?,?,?,?,?,?,?)";
                                var inserts = [last_id_inserted, telefono_afectado, nombreusuario, contacto, promocion, fechainiciofalla, descripcionsituacion, tipo];
                                query = mysql.format(query, inserts);
                                pool.query(query, function (err, result) {
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
                                        console.log('Nuevo reporte de Promociones ID: ' + last_id_inserted);
                                        asignacion_propietario(last_id_inserted);
                                        res.send("Correcto");

                                    });//fin del commit
                                });//fin del query 2

                            });//fin de la query 1
                        }); //fin del begin transaction
                        pool.release();
                    }); //fin del get connection

                }
            });
            connectit.release();
        });

        

        //responder al cliente en caso de exito

        //esponder al cliente en caso de fallo



    });

    //FALLAS EN SERVICIOS
    app.post('/guardar_servicios', middleware.requireLogin, function (req, res) {
        let ipaddr = req.connection.remoteAddress
        //se reciben los parametros del lado del cliente

        var iduser = req.body.iduser;
        var telefono_afectado = req.body.telefono_afectado;

        var nombreusuario = req.body.nombreusuario;
        var contacto = req.body.contacto;
        var mensajeerror = req.body.mensajeerror;
        var servicio = req.body.servicio;
        var descripcionsituacion = req.body.descripcionsituacion;
        var estado = req.body.estado;
        var municipio = req.body.municipio;
        var colonia = req.body.colonia;
        var cp = req.body.cp;

        var tipodefallareportada = 'servicios';
        var estatus = 'Nuevo';



        var last_id_inserted; //auxiliar para insertar id de la ultima query

        connection.getConnection(function (errors, connectit) {

            var duplicidad = "SELECT * FROM metadatos WHERE month(now()) = month(creado) and telefono = ? and falla = ? and estatus <> 'Cerrado'";
            var inserts_duplicidad = [telefono_afectado, tipodefallareportada];
            duplicidad = mysql.format(duplicidad, inserts_duplicidad);

            connectit.query(duplicidad, function (errorr, results) {
                if (results.length > 0) {
                    res.send("EXISTE REGISTRO DEL MISMO TIPO EN LA DB");
                    console.log("Error al registrar nuevos datos, ya existe un registro similar");
                } else {
                    console.log("INGRESANDO TRANSACCION DE INSERCION UNICA");

                    //se ejecuta la query con transacciones
                    connection.getConnection(function (err, pool) {
                        pool.beginTransaction(function (err) {
                            if (err) throw err;
                            var query = "INSERT INTO metadatos(ipaddr,estatus,iduser,falla,telefono,estado,municipio,colonia,cp) VALUES(?,?,?,?,?,?,?,?,?)";
                            var inserts = [ipaddr,estatus, iduser, tipodefallareportada, telefono_afectado, estado, municipio, colonia, cp];
                            query = mysql.format(query, inserts);

                            pool.query(query, function (err, result) {
                                if (err) {
                                    pool.rollback(function () {
                                        throw err;
                                    });
                                }
                                last_id_inserted = result.insertId;

                                //siguiente query

                                var query = "INSERT INTO activacion(idmetadatos,telefono,usuario,contacto,error,servicio,descripcion) VALUES(?,?,?,?,?,?,?)";
                                var inserts = [last_id_inserted, telefono_afectado, nombreusuario, contacto, mensajeerror, servicio, descripcionsituacion];
                                query = mysql.format(query, inserts);
                                pool.query(query, function (err, result) {
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
                                        console.log('Nuevo reporte de Servicios ID: ' + last_id_inserted);
                                        asignacion_propietario(last_id_inserted);
                                        res.send("Correcto");

                                    });//fin del commit
                                });//fin del query 2

                            });//fin de la query 1
                        }); //fin del begin transaction
                        pool.release();
                    }); //fin del get connection

                }
            });
            connectit.release();
        });

        

        //responder al cliente en caso de exito

        //esponder al cliente en caso de fallo



    });
    
    //--------------------------------------------------------------------
    
    //SE CONSULTA EXISTENCIA DE REPORTES EXISTENTES POR NUMERO O FOLIO DB
    app.post('/buscar_numeroofolio', middleware.requireLogin, function (req, res) {
        var numeroofolio = req.body.numeroofolio;

        var query = 'SELECT m.idmetadatos,m.creado,u.nombre,m.ultseguimiento,m.falla,m.estatus,us.nombre as propietario,m.cerrado FROM metadatos m LEFT JOIN users u ON u.iduser = m.iduser LEFT JOIN users us ON us.iduser = m.propietario WHERE idmetadatos = ? OR telefono = ?';
        var inserts = [numeroofolio, numeroofolio];
        query = mysql.format(query,inserts);
        var response = [];
        connection.getConnection(function (err, conn) {
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                var numRows = results.length;
                if (numRows > 0) {
                    results.forEach(element => {
                        var row = {
                            'idmetadatos': element.idmetadatos,
                            'creado': element.creado,
                            'asesor': element.nombre,
                            'ultseguimiento': element.ultseguimiento,
                            'falla': element.falla,
                            'estatus': element.estatus,
                            'propietario': element.propietario,
                            'cerrado': element.cerrado,

                        }
                        response.push(row);
                    });
                    res.send(response);
                } else {
                    res.send('no existe');
                }

            });
            conn.release();
        });
        
    });
    
    //SE CONSULTA EL DETALLE SEGUN EL ID Y TIPO DE FALLA PASADO
    app.post('/get_detallescaptura', middleware.requireLogin, function (req, res) {
        var idmetadatos = req.body.idmetadatos;
        var tipofalla = req.body.tipofalla;

        switch (tipofalla) {
            case 'aclaraciones':
                var query = "SELECT * FROM aclaracion WHERE idmetadatos = ? LIMIT 1";
                break;
            case 'general':
                var query = "SELECT * FROM general WHERE idmetadatos = ? LIMIT 1";
                break;
            case 'cobertura':
                var query = "SELECT * FROM cobertura WHERE idmetadatos = ? LIMIT 1";
                break;
            case 'iccid':
                var query = "SELECT * FROM iccid WHERE idmetadatos = ? LIMIT 1";
                break;
            case 'llamadas':
                var query = "SELECT * FROM llamadassms WHERE idmetadatos = ? LIMIT 1";
                break;
            case 'navegacion':
                var query = "SELECT * FROM navegacion WHERE idmetadatos = ? LIMIT 1";
                break;
            case 'recargas':
                var query = "SELECT * FROM recargas WHERE idmetadatos = ? LIMIT 1";
                break;
            case 'promociones':
                var query = "SELECT * FROM promociones WHERE idmetadatos = ? LIMIT 1";
                break;
            case 'servicios':
                var query = "SELECT * FROM activacion WHERE idmetadatos = ? LIMIT 1";
                break;
            case 'callback':
                var query = "SELECT * FROM callback WHERE idmetadatos = ? LIMIT 1";
                break;
        }


        var inserts = [idmetadatos];
        query = mysql.format(query, inserts);
        var response = [];
        connection.getConnection(function (err, conn) {
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                res.send(results);
            });
            conn.release();
        });
        
    });

    //SE CONSULTA EL DETALLE SEGUN EL ID Y TIPO DE FALLA PASADO
    app.post('/get_detallesmetadatos', middleware.requireLogin, function (req, res) {
        var idmetadatos = req.body.idmetadatos;

        var query = "SELECT m.enproceso_time,m.solucionado_time,m.rechazado_time,m.cerrado ,m.estatus,m.idmetadatos,m.creado,u.nombre,m.falla,m.bit,m.cpd,m.usd,m.reporsis , m.estado, m.municipio, m.colonia, m.cp FROM metadatos m LEFT JOIN users u ON u.iduser = m.iduser WHERE idmetadatos = ? LIMIT 1";
        var inserts = [idmetadatos];
        query = mysql.format(query, inserts);
        connection.getConnection(function (err, conn) {
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                res.send(results);
            });
            conn.release();
        });
        
    });  
    
    app.post('/get_detallesobservaciones', middleware.requireLogin, function (req, res) {
        var idmetadatos = req.body.idmetadatos;

        var query = "SELECT o.creado,u.nombre,o.observacion,o.estatus FROM observaciones o LEFT JOIN users u ON o.noc = u.iduser WHERE idmetadatos = ? order by o.creado DESC";
        var inserts = [idmetadatos];
        query = mysql.format(query, inserts);
        connection.getConnection(function (err, conn) {
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                res.send(results);
            });
            conn.release();
        });
        
    });  


    //BACKEND DE MODULO DE SUPERVISORES, REPORTES SUPERVISORES
    app.post('/guardar_repsupervisor', middleware.requireLogin, function (req, res) {

        //se reciben los parametros del lado del cliente

        var iduser = req.body.iduser;
        var asunto = req.body.asunto;
        var numero = req.body.numero;
        var contacto = req.body.contacto;
        var descripcion = req.body.descripcion;
       
        var estatus = 'Nuevo';

        var query = "INSERT INTO supervision( asesor, asunto, numero, contacto, descripcion, estatus ) VALUES (?,?,?,?,?,?); ";
        var inserts = [iduser, asunto, numero, contacto, descripcion, estatus];
        query = mysql.format(query,inserts);
        connection.getConnection(function(err,conn){
            conn.query(query,function(error,results){
                if(error){
                    res.send(error.sqlMessage);
                    console.log("Error: "+ error.sqlMessage);
                }else{
                    res.send("Correcto");
                    console.log("Nuevo reporte a supervisor por asesor: " + iduser);
                    io.emit('new', 'nueva_captura_super');
                }
            });
            conn.release();
        });
    });
    
    //ENVIA REFERIDOS A LA BASE DE DATOS DE TELEMARKETING
    //OJO CON LA CONEXION
    app.post('/set_referido',middleware.requireLogin,function(req,res){
        console.log(req.body.nombre)
        console.log(req.body.numero)

        let query = "INSERT INTO refered SET asesor = ?, telefono = ?";
        let inserts = [req.body.nombre,req.body.numero];
        query = mysql.format(query,inserts);
        connectionTMK.getConnection(function (err, conn) {
            conn.query(query, function (error, results, field) {
                if (error){
                    res.send(error.sqlMessage)
                }else{
                    res.send("ok");
                }
            });
            conn.release();
        });
    });

    

    

    
    app.get('*', function (req, res) {
        res.status(404).send('Error 404');
    });
}