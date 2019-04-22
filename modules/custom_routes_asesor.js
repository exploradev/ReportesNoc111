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


    //------------------------------------------------------------
    //SE CONSULTA EXISTENCIA DE REPORTE ANTES DE LEVANTAR OTRO
    app.post('/consultaexistencia', middleware.requireLogin, function (req, res) {
        var telefono = req.body.telefono;
        var tiporeporte = req.body.tiporeporte;
       
        query = "SELECT telefono,falla FROM metadatos WHERE telefono = ? and falla = ? and estatus NOT IN('Cerrado')";
        inserts = [telefono, tiporeporte];
        query = mysql.format(query, inserts);
        response = [];
        connection.query(query, function (error, results, field) {
            if (error) throw error;
            var numRows = results.length;
            if(numRows > 0){
                res.send('existe');
            }else{
                res.send('no existe');
            }
            //res.send(numRows);
        });
    });


    //------------------------------------------------------------
    //SE AGREGA A BASE DE DATOS LOS DATOS DE LOS FORMULARIOS

    //COBERTURA
    app.post('/guardar_cobertura', middleware.requireLogin, function (req, res) {

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
        
        var tipodefallareportada = 'cobertura';
        var estatus = 'Nuevo';


        var last_id_inserted; //auxiliar para insertar id de la ultima query






        //se ejecuta la query con transacciones
        

        connection.getConnection(function (err, pool) {
            pool.beginTransaction(function (err) {
                if (err) throw err;
                var query = "INSERT INTO metadatos(estatus,iduser,falla,telefono) VALUES(?,?,?,?)";
                var inserts = [estatus, iduser, tipodefallareportada,telefono_afectado];
                query = mysql.format(query, inserts);

                pool.query(query, function (err, result) {
                    if (err) {
                        pool.rollback(function () {
                            throw err;
                        });
                    }
                    last_id_inserted = result.insertId;

                    //siguiente query

                    var query = "INSERT INTO cobertura(idmetadatos,telefono,contacto,usuario,fechanacimiento,lugarnacimiento,iniciofalla,estado,municipio,colonia,cp,direccion,desczona,equipomarca,equipomodelo,falla,descripcion) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                    var inserts = [last_id_inserted, telefono_afectado, contacto, nombreusuario, fechanaciemiento, lugarnacimiento, fechainiciofalla, estado, municipio, colonia, cp, direccioncliente, descripcionzona, marcaequipo, modeloequipo, falla, descripcionsituacion];
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
                            res.send("Correcto");

                        });//fin del commit
                    });//fin del query 2

                });//fin de la query 1
            }); //fin del begin transaction
        }); //fin del get connection

        //responder al cliente en caso de exito

        //esponder al cliente en caso de fallo



    });

    //ACLARACIONES
    app.post('/guardar_aclaracion', middleware.requireLogin, function (req, res) {

        //se reciben los parametros del lado del cliente

        var iduser = req.body.iduser;
        var telefono_afectado = req.body.telefono_afectado;
        var contacto = req.body.contacto;
        var nombreusuario = req.body.nombreusuario;
        var fechainiciofalla = req.body.fechainiciofalla;
        var descripcionsituacion = req.body.descripcionsituacion;

        var tipodefallareportada = 'aclaraciones';
        var estatus = 'Nuevo';


        var last_id_inserted; //auxiliar para insertar id de la ultima query






        //se ejecuta la query con transacciones


        connection.getConnection(function (err, pool) {
            pool.beginTransaction(function (err) {
                if (err) throw err;
                var query = "INSERT INTO metadatos(estatus,iduser,falla,telefono) VALUES(?,?,?,?)";
                var inserts = [estatus, iduser, tipodefallareportada, telefono_afectado];
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
                            res.send("Correcto");

                        });//fin del commit
                    });//fin del query 2

                });//fin de la query 1
            }); //fin del begin transaction
        }); //fin del get connection

        //responder al cliente en caso de exito

        //esponder al cliente en caso de fallo



    });

    //CALLBACK
    app.post('/guardar_callback', middleware.requireLogin, function (req, res) {

        //se reciben los parametros del lado del cliente

        var iduser = req.body.iduser;
        var telefono_afectado = req.body.telefono_afectado;

        var contacto = req.body.contacto;
        var nombreusuario = req.body.nombreusuario;
        var motivo = req.body.motivo;
        var descripcionsituacion = req.body.descripcionsituacion;

        var tipodefallareportada = 'callback';
        var estatus = 'Nuevo';



        var last_id_inserted; //auxiliar para insertar id de la ultima query

        //se ejecuta la query con transacciones
        connection.getConnection(function (err, pool) {
            pool.beginTransaction(function (err) {
                if (err) throw err;
                var query = "INSERT INTO metadatos(estatus,iduser,falla,telefono) VALUES(?,?,?,?)";
                var inserts = [estatus, iduser, tipodefallareportada, telefono_afectado];
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
                            res.send("Correcto");

                        });//fin del commit
                    });//fin del query 2

                });//fin de la query 1
            }); //fin del begin transaction
        }); //fin del get connection

        //responder al cliente en caso de exito

        //esponder al cliente en caso de fallo



    });

    //GENERAL
    app.post('/guardar_general', middleware.requireLogin, function (req, res) {

        //se reciben los parametros del lado del cliente

        var iduser = req.body.iduser;
        var telefono_afectado = req.body.telefono_afectado;

        var contacto = req.body.contacto;
        var nombreusuario = req.body.nombreusuario;
        var descripcionsituacion = req.body.descripcionsituacion;

        var tipodefallareportada = 'general';
        var estatus = 'Nuevo';



        var last_id_inserted; //auxiliar para insertar id de la ultima query

        //se ejecuta la query con transacciones
        connection.getConnection(function (err, pool) {
            pool.beginTransaction(function (err) {
                if (err) throw err;
                var query = "INSERT INTO metadatos(estatus,iduser,falla,telefono) VALUES(?,?,?,?)";
                var inserts = [estatus, iduser, tipodefallareportada, telefono_afectado];
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
                    var inserts = [last_id_inserted, telefono_afectado, nombreusuario, contacto,descripcionsituacion];
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
                            res.send("Correcto");

                        });//fin del commit
                    });//fin del query 2

                });//fin de la query 1
            }); //fin del begin transaction
        }); //fin del get connection

        //responder al cliente en caso de exito

        //esponder al cliente en caso de fallo



    });

    //ICCID
    app.post('/guardar_iccid', middleware.requireLogin, function (req, res) {

        //se reciben los parametros del lado del cliente

        var iduser = req.body.iduser;
        var telefono_afectado = req.body.telefono_afectado;

        var nombreusuario = req.body.nombreusuario;
        var contacto = req.body.contacto;
        var iccidvirtual = req.body.iccidvirtual;
        var iccidfisica = req.body.iccidfisica;
        var cac = req.body.cac;

        var tipodefallareportada = 'iccid';
        var estatus = 'Nuevo';



        var last_id_inserted; //auxiliar para insertar id de la ultima query

        //se ejecuta la query con transacciones
        connection.getConnection(function (err, pool) {
            pool.beginTransaction(function (err) {
                if (err) throw err;
                var query = "INSERT INTO metadatos(estatus,iduser,falla,telefono) VALUES(?,?,?,?)";
                var inserts = [estatus, iduser, tipodefallareportada, telefono_afectado];
                query = mysql.format(query, inserts);

                pool.query(query, function (err, result) {
                    if (err) {
                        pool.rollback(function () {
                            throw err;
                        });
                    }
                    last_id_inserted = result.insertId;

                    //siguiente query

                    var query = "INSERT INTO iccid(idmetadatos,telefono,usuario,contacto,cac,iccidfisica,iccidvirtual) VALUES(?,?,?,?,?,?,?)";
                    var inserts = [last_id_inserted, telefono_afectado, nombreusuario, contacto, cac, iccidfisica, iccidvirtual];
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
                            res.send("Correcto");

                        });//fin del commit
                    });//fin del query 2

                });//fin de la query 1
            }); //fin del begin transaction
        }); //fin del get connection

        //responder al cliente en caso de exito

        //esponder al cliente en caso de fallo



    });

    //LLAMADAS / SMS
    app.post('/guardar_llamadas', middleware.requireLogin, function (req, res) {

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

        var tipodefallareportada = 'llamadas';
        var estatus = 'Nuevo';



        var last_id_inserted; //auxiliar para insertar id de la ultima query

        //se ejecuta la query con transacciones
        connection.getConnection(function (err, pool) {
            pool.beginTransaction(function (err) {
                if (err) throw err;
                var query = "INSERT INTO metadatos(estatus,iduser,falla,telefono) VALUES(?,?,?,?)";
                var inserts = [estatus, iduser, tipodefallareportada, telefono_afectado];
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
                            res.send("Correcto");

                        });//fin del commit
                    });//fin del query 2

                });//fin de la query 1
            }); //fin del begin transaction
        }); //fin del get connection

        //responder al cliente en caso de exito

        //esponder al cliente en caso de fallo



    });

    //FALLAS EN NAVEGACIÓN
    app.post('/guardar_navegacion', middleware.requireLogin, function (req, res) {

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

        var tipodefallareportada = 'navegacion';
        var estatus = 'Nuevo';



        var last_id_inserted; //auxiliar para insertar id de la ultima query

        //se ejecuta la query con transacciones
        connection.getConnection(function (err, pool) {
            pool.beginTransaction(function (err) {
                if (err) throw err;
                var query = "INSERT INTO metadatos(estatus,iduser,falla,telefono) VALUES(?,?,?,?)";
                var inserts = [estatus, iduser, tipodefallareportada, telefono_afectado];
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
                            res.send("Correcto");

                        });//fin del commit
                    });//fin del query 2

                });//fin de la query 1
            }); //fin del begin transaction
        }); //fin del get connection

        //responder al cliente en caso de exito

        //esponder al cliente en caso de fallo



    });

    //FALLAS EN RECARGAS
    app.post('/guardar_recargas', middleware.requireLogin, function (req, res) {

        //se reciben los parametros del lado del cliente

        var iduser = req.body.iduser;
        var telefono_afectado = req.body.telefono_afectado;

        var nombreusuario = req.body.nombreusuario;
        var mensajeerror = req.body.mensajeerror;
        var importe = req.body.importe;
        var metodocompra = req.body.metodocompra;
        var fechayhora = req.body.fechayhora;
        var descripcionsituacion = req.body.descripcionsituacion;

        var tipodefallareportada = 'recargas';
        var estatus = 'Nuevo';



        var last_id_inserted; //auxiliar para insertar id de la ultima query

        //se ejecuta la query con transacciones
        connection.getConnection(function (err, pool) {
            pool.beginTransaction(function (err) {
                if (err) throw err;
                var query = "INSERT INTO metadatos(estatus,iduser,falla,telefono) VALUES(?,?,?,?)";
                var inserts = [estatus, iduser, tipodefallareportada, telefono_afectado];
                query = mysql.format(query, inserts);

                pool.query(query, function (err, result) {
                    if (err) {
                        pool.rollback(function () {
                            throw err;
                        });
                    }
                    last_id_inserted = result.insertId;

                    //siguiente query

                    var query = "INSERT INTO recargas(idmetadatos,telefono,usuario,error,importe,metodocompra,fechahora,descripcion) VALUES(?,?,?,?,?,?,?,?)";
                    var inserts = [last_id_inserted, telefono_afectado, nombreusuario, mensajeerror, importe, metodocompra, fechayhora, descripcionsituacion];
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
                            res.send("Correcto");

                        });//fin del commit
                    });//fin del query 2

                });//fin de la query 1
            }); //fin del begin transaction
        }); //fin del get connection

        //responder al cliente en caso de exito

        //esponder al cliente en caso de fallo



    });

    //FALLAS EN PROMOCIONES
    app.post('/guardar_promociones', middleware.requireLogin, function (req, res) {

        //se reciben los parametros del lado del cliente

        var iduser = req.body.iduser;
        var telefono_afectado = req.body.telefono_afectado;

        var nombreusuario = req.body.nombreusuario;
        var contacto = req.body.contacto;
        var promocion = req.body.promocion;
        var fechainiciofalla = req.body.fechainiciofalla;
        var descripcionsituacion = req.body.descripcionsituacion;

        var tipodefallareportada = 'promociones';
        var estatus = 'Nuevo';



        var last_id_inserted; //auxiliar para insertar id de la ultima query

        //se ejecuta la query con transacciones
        connection.getConnection(function (err, pool) {
            pool.beginTransaction(function (err) {
                if (err) throw err;
                var query = "INSERT INTO metadatos(estatus,iduser,falla,telefono) VALUES(?,?,?,?)";
                var inserts = [estatus, iduser, tipodefallareportada, telefono_afectado];
                query = mysql.format(query, inserts);

                pool.query(query, function (err, result) {
                    if (err) {
                        pool.rollback(function () {
                            throw err;
                        });
                    }
                    last_id_inserted = result.insertId;

                    //siguiente query

                    var query = "INSERT INTO promociones(idmetadatos,telefono,usuario,contacto,promocion,fecha,descripcion) VALUES(?,?,?,?,?,?,?)";
                    var inserts = [last_id_inserted, telefono_afectado, nombreusuario, contacto, promocion, fechainiciofalla, descripcionsituacion];
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
                            res.send("Correcto");

                        });//fin del commit
                    });//fin del query 2

                });//fin de la query 1
            }); //fin del begin transaction
        }); //fin del get connection

        //responder al cliente en caso de exito

        //esponder al cliente en caso de fallo



    });

    //FALLAS EN SERVICIOS
    app.post('/guardar_servicios', middleware.requireLogin, function (req, res) {

        //se reciben los parametros del lado del cliente

        var iduser = req.body.iduser;
        var telefono_afectado = req.body.telefono_afectado;

        var nombreusuario = req.body.nombreusuario;
        var contacto = req.body.contacto;
        var mensajeerror = req.body.mensajeerror;
        var servicio = req.body.servicio;
        var descripcionsituacion = req.body.descripcionsituacion;

        var tipodefallareportada = 'servicios';
        var estatus = 'Nuevo';



        var last_id_inserted; //auxiliar para insertar id de la ultima query

        //se ejecuta la query con transacciones
        connection.getConnection(function (err, pool) {
            pool.beginTransaction(function (err) {
                if (err) throw err;
                var query = "INSERT INTO metadatos(estatus,iduser,falla,telefono) VALUES(?,?,?,?)";
                var inserts = [estatus, iduser, tipodefallareportada, telefono_afectado];
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
                            res.send("Correcto");

                        });//fin del commit
                    });//fin del query 2

                });//fin de la query 1
            }); //fin del begin transaction
        }); //fin del get connection

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
        connection.query(query, function (error, results, field) {
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
        connection.query(query, function (error, results, field) {
            if (error) throw error;
            res.send(results);
        });
    });

    //SE CONSULTA EL DETALLE SEGUN EL ID Y TIPO DE FALLA PASADO
    app.post('/get_detallesmetadatos', middleware.requireLogin, function (req, res) {
        var idmetadatos = req.body.idmetadatos;

        var query = "SELECT m.idmetadatos,m.creado,u.nombre,m.falla FROM metadatos m LEFT JOIN users u ON u.iduser = m.iduser WHERE idmetadatos = ? LIMIT 1";
        var inserts = [idmetadatos];
        query = mysql.format(query, inserts);
        connection.query(query, function (error, results, field) {
            if (error) throw error;
            res.send(results);
        });
    });  
    
    app.post('/get_detallesobservaciones', middleware.requireLogin, function (req, res) {
        var idmetadatos = req.body.idmetadatos;

        var query = "SELECT o.creado,u.nombre,o.observacion,o.estatus FROM observaciones o LEFT JOIN users u ON o.noc = u.iduser WHERE idmetadatos = ? order by o.creado DESC"
        var inserts = [idmetadatos];
        query = mysql.format(query, inserts);
        connection.query(query, function (error, results, field) {
            if (error) throw error;
            res.send(results);
        });
    });  

    
    

    

    
    app.get('*', function (req, res) {
        res.status(404).send('Error 404');
    });
}