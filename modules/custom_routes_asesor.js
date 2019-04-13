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


    //------------------------------------------------------------
    //SE CONSULTA EXISTENCIA DE REPORTE ANTES DE LEVANTAR OTRO
    app.post('/consultaexistencia', middleware.requireLogin, function (req, res) {
        var telefono = req.body.telefono;
        var tiporeporte = req.body.tiporeporte;
       
        query = "SELECT telefono,falla FROM metadatos WHERE telefono = ? and falla = ? and estatus NOT IN('Cerrado')";
        inserts = [telefono, tiporeporte];
        query = mysql.format(query, inserts);
        response = [];
        console.log(query);
        connection.query(query, function (error, results, field) {
            if (error) throw error;
            var numRows = results.length;
            if(numRows > 0){
                res.send('existe');
            }else{
                res.send('no existe');
            }
            res.send(numRows);
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
        
        var tipodefallareportada = 'Cobertura';
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

        var tipodefallareportada = 'Aclaraciones';
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
    

    

    
    

    

    
    app.get('*', function (req, res) {
        res.status(404).send('Error 404');
    });
}