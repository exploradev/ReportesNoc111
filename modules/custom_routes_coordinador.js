middleware = require('./middlewares');
var mysql = require('mysql');
var connection = require('./db');
var moment = require('moment');


module.exports = function(app,io){


    //RENDER LISTA DE USUARIOS
    app.post('/get_userlist', middleware.requireLogin, function (req, res){
        query = "SELECT * from users";
        connection.query(query, function (error, results, field) {
            if (error) throw error;
            res.send(results);
        });
    });

    //ALTA DE USUARIOS
    app.post('/guardar_nuevousuario', middleware.requireLogin, function (req, res) {

        //se reciben los parametros del lado del cliente

        var nombre = req.body.nombre;
        var username = req.body.username;
        var password = req.body.password;
        var rol = req.body.rol;
        var turno = req.body.turno;
        var estatus = req.body.estatus;

        

        //se ejecuta la query con transacciones
        connection.getConnection(function (err, pool) {
            pool.beginTransaction(function (err) {
                if (err) throw err;

                var query = "INSERT INTO users(nombre,username,password,rol,estatus,turno) VALUES(?,?,?,?,?,?)";
                var inserts = [nombre, username, password, rol, estatus, turno];
                query = mysql.format(query, inserts);
                pool.query(query, function (err, result) {
                    if (err) {
                        pool.rollback(function () {
                            res.send(err);
                            console.log("Ocurrio un error al guardar el usuario");
                        });
                    }else{
                        //en el ultimo insert
                        pool.commit(function (err) {
                            if (err) {
                                pool.rollback(function () {
                                    console.log("Ocurrio un error al guardar el usuario");
                                });
                            } else {
                                console.log('Nuevo usuario agregado');
                                res.send("Correcto");
                            }
                        });//fin del commit
                    }
                    

                    
                });//fin de la query 1
            }); //fin del begin transaction
        }); //fin del get connection
    });

    //ACTUALIZACION DE USUARIOS
    app.post('/getSingleUser', middleware.requireLogin, function (req, res){
        var iduser = req.body.iduser;
        var query = "SELECT iduser,nombre,username,rol,turno,estatus from users where iduser = ? LIMIT 1";
        var inserts = [iduser];
        query = mysql.format(query,inserts)
        connection.query(query, function (error, results, field) {
            if (error) throw error;
            res.send(results);
        });
    });


    //MODIFICACION DE USUARIOS
    app.post('/actualizar_usuario', middleware.requireLogin, function (req, res) {

        //se reciben los parametros del lado del cliente
        var iduser = req.body.iduser;
        var nombre = req.body.nombre;
        var username = req.body.username;
        var password = req.body.password;
        var rol = req.body.rol;
        var turno = req.body.turno;
        var estatus = req.body.estatus;

        if (password=="sincambios"){
            var query = "UPDATE users SET nombre = ?, username = ?, rol = ?, estatus = ?, turno = ? WHERE iduser = ?";
            var inserts = [nombre, username, rol, estatus, turno, iduser];
            query = mysql.format(query, inserts);
        }else{
            var query = "UPDATE users SET nombre = ?, username = ?, password = ?, rol = ?, estatus = ?, turno = ? WHERE iduser = ?";
            var inserts = [nombre, username, password, rol, estatus, turno, iduser];
            query = mysql.format(query, inserts);
        }

        //var last_id_inserted; //auxiliar para insertar id de la ultima query

        connection.getConnection(function (err, pool) {
            pool.beginTransaction(function (err) {
                if (err) throw err;

                
                pool.query(query, function (err, result) {
                    if (err) {
                        pool.rollback(function () {
                            res.send(err);
                            console.log("Ocurrio un error al guardar el usuario");
                        });
                    } else {
                        //en el ultimo insert
                        pool.commit(function (err) {
                            if (err) {
                                pool.rollback(function () {
                                    console.log("Ocurrio un error al guardar el usuario");
                                });
                            } else {
                                console.log('Nuevo usuario actualizado');
                                res.send("Correcto");
                            }
                        });//fin del commit
                    }



                });//fin de la query 1
            }); //fin del begin transaction
        }); //fin del get connection
    });

    //EXPORTAR REPORTES
    app.post('/getReport', middleware.requireLogin, function (req, res) {
        var tipo = req.body.tipo;
        var desde = req.body.desde;
        var hasta = req.body.hasta;

        //tablas estaticas
        var tablas_estaticas = ['aclaracion', 'activacion', 'callback', 'cobertura', 'general', 'iccid', 'llamadassms', 'navegacion', 'promociones', 'recargas'];

        if(tipo == "global"){
            tipo = "vista_metadatos";
            var query = "SELECT * from ?? where creado between ? and ?";
            var inserts = [tipo, desde, hasta];
            query = mysql.format(query, inserts);
            
            connection.query(query, function (error, results, field) {
                if (error) throw error;
                //se formatean horas
                results.forEach(element => {
                    if (element.creado){
                        element.creado = moment(element.creado).format('DD[/]MM[/]YYYY[ ]HH[:]mm[:]ss');
                        
                    }
                    if(element.ultseguimiento){
                        element.ultseguimiento = moment(element.ultseguimiento).format('DD[/]MM[/]YYYY[ ]HH[:]mm[:]ss');
                    }
                    if(element.cerrado){
                        element.cerrado = moment(element.cerrado).format('DD[/]MM[/]YYYY[ ]HH[:]mm[:]ss');
                    }
                });
                res.send(results);
            });
        } else if (tipo == 'users' || tipo == 'metadatos'){
            res.send("Error");
        }else if(tablas_estaticas.indexOf(tipo)!=-1){
            var query = "SELECT * FROM ?? aux LEFT JOIN vista_metadatos v on v.idmetadatos = aux.idmetadatos where v.creado between ? and ?";
            var inserts = [tipo, desde, hasta];
            query = mysql.format(query, inserts)
            connection.query(query, function (error, results, field) {
                if (error) throw error;
                results.forEach(element => {
                    if (element.creado) {
                        element.creado = moment(element.creado).format('DD[/]MM[/]YYYY[ ]HH[:]mm[:]ss');

                    }
                    if (element.ultseguimiento) {
                        element.ultseguimiento = moment(element.ultseguimiento).format('DD[/]MM[/]YYYY[ ]HH[:]mm[:]ss');
                    }
                    if (element.cerrado) {
                        element.cerrado = moment(element.cerrado).format('DD[/]MM[/]YYYY[ ]HH[:]mm[:]ss');
                    }
                });
                res.send(results);

            });
        }else{
            var query = "SELECT * from ?? where creado between ? and ?";
            
            var inserts = [tipo, desde, hasta];
            query = mysql.format(query, inserts)
            connection.query(query, function (error, results, field) {
                if (error) throw error;
                if (element.creado) {
                    element.creado = moment(element.creado).format('DD[/]MM[/]YYYY[ ]HH[:]mm[:]ss');

                }
                res.send(results);
                
            });
        }

        
        
    });

    app.post('/getTipificacion', middleware.requireLogin, function (req, res){
        var idmetadatos = req.body.idmetadatos;
        
        
        var query = "SELECT tipificacion from metadatos where idmetadatos = ? LIMIT 1";
        var inserts = [idmetadatos];
        query = mysql.format(query, inserts)
        connection.query(query, function (error, results, field) {
            if (error) throw error;
            res.send(results);
        });
    });

    app.post('/getTables', middleware.requireLogin, function (req, res){
        var query = "SELECT tabla FROM tablasporexportar WHERE activa = 'activa'";
        
        connection.query(query, function (error, results, field) {
            if (error) throw error;
            res.send(results);
        });
    });


}// fin del archivo
