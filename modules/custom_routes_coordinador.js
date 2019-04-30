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

    


}// fin del archivo
