middleware = require('./middlewares');
var mysql = require('mysql');
var connection = require('./db');
var moment = require('moment');


module.exports = function(app,io){


    //RENDER LISTA DE USUARIOS
    app.post('/get_userlist', middleware.requireLogin, function (req, res){
        query = "SELECT * from users";
        connection.getConnection(function(err,conn){
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                res.send(results);
            });
            conn.release();
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
            pool.release();
        }); //fin del get connection
    });

    //ACTUALIZACION DE USUARIOS
    app.post('/getSingleUser', middleware.requireLogin, function (req, res){
        var iduser = req.body.iduser;
        var query = "SELECT iduser,nombre,username,rol,turno,estatus from users where iduser = ? LIMIT 1";
        var inserts = [iduser];
        connection.getConnection(function(err,conn){
            query = mysql.format(query, inserts)
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                res.send(results);

            });
            conn.release();
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
            pool.release()
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

                    if (element.iccidvirtual) {
                        element.iccidvirtual = "'"+element.iccidvirtual;
                        

                    }

                    if (element.iccidfisica) {
                        element.iccidfisica = "'"+element.iccidfisica;
                        
                    }

                });
                res.send(results);

            });
        }else{
            var query = "SELECT * from ?? where creado between ? and ?";
            
            var inserts = [tipo, desde, hasta];
            query = mysql.format(query, inserts)
            connection.getConnection(function(err,conn){
                conn.query(query, function (error, results, field) {
                    if (error) throw error;
                    results.forEach(element => {
                        if (element.creado) {
                            element.creado = moment(element.creado).format('DD[/]MM[/]YYYY[ ]HH[:]mm[:]ss');
                        }
                    });
                    res.send(results);
                });
                conn.release();
            });
        }

        
        
    });

    app.post('/getTipificacion', middleware.requireLogin, function (req, res){
        var idmetadatos = req.body.idmetadatos;
        
        
        var query = "SELECT tipificacion from metadatos where idmetadatos = ? LIMIT 1";
        var inserts = [idmetadatos];
        query = mysql.format(query, inserts)
        connection.getConnection(function(err,conn){
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                res.send(results);
            });
            conn.release();
        });
        
    });

    app.post('/getTables', middleware.requireLogin, function (req, res) {
        var query = "SELECT tabla FROM tablasporexportar WHERE activa IN ('activa','falla1','falla2','falla3')";

        connection.getConnection(function(err,conn){
            conn.query(query, function (error, results, field) {
            if (error) throw error;
            res.send(results);
            });
            conn.release();
        });
    });

    //RUTA QUE CREA LA TABLA DINAMICAMENTE FALLAS MASIVAS
    app.post('/generartabla', middleware.requireLogin, function (req, res) {
        
        var newjson = req.body.estructura;
        var parametros = JSON.parse(newjson);
        var longitud = parametros.length;
        
        var inserts = [];
        inserts.push(parametros[1]);
        /*
        CREATE TABLE testtabla (
        id int(11) NOT NULL AUTO_INCREMENT,
        telefono varchar(200) DEFAULT NULL,
        ciudad varchar(200) DEFAULT NULL,
        estado varchar(200) DEFAULT NULL
        PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

        */

        //DEFINO LA QUERY PARA CREAR LA TABLA
        var query_head = "CREATE TABLE ?? (id int(11) NOT NULL AUTO_INCREMENT,asesor varchar(200) DEFAULT NULL, creado timestamp NULL DEFAULT CURRENT_TIMESTAMP,";
        var query_body = "";
        var query_footer = " PRIMARY KEY (id)) ENGINE = InnoDB DEFAULT CHARSET = utf8";

        //DEFINO LA VARIABLE DEL CONTENIDO
        var contentHTMLheader = '<div class="group-masivas"> <p class="titulocampo">';
        var contentHTMLfooter = '</p> <input class="inputsasesor campo_fallamasiva"/></div>';

        var contentHTML = "";
        for (i = 3; i < longitud; i++) {
            query_body += "?? varchar(200) DEFAULT NULL,"
            inserts.push(parametros[i]);

            //agregamos los campos al contenido del html como nombre del label
            contentHTML += contentHTMLheader;
            contentHTML += parametros[i];
            contentHTML += contentHTMLfooter;

        }

        var query = query_head + query_body + query_footer;
        
        query = mysql.format(query,inserts);
        console.log(query);
        //CREAR TABLA
        connection.getConnection(function(err,conn){
            conn.query(query, function (error, results, field) {
                if (error) {
                    res.send(error.sqlMessage);
                }else{
                    console.log("(1/2) TABLA CREADA CORRECTAMENTE");
                    //INGRESAR METADATOS A TABLASPOREXPORTAR CON ESTATUS ACTIVO
                    var ingresar = "INSERT INTO tablasporexportar(tabla,activa,tipo,descripcion,autor,contenido) VALUES(?,'inactivo','dinamica',?,?,?)";
                    var variables = [parametros[1], parametros[2], parametros[0], contentHTML];
                    var query = mysql.format(ingresar,variables);
                    conn.query(query,function(error,results,field){
                        if (error) {
                            res.send(error.sqlMessage);
                        }else{
                            console.log("(2/2) METADATOS DE TABLA INGRESADOS CORRECTAMENTE");
                            //SE ENVIA WEBSOCKET
                            res.send("TODO OK");
                            //io.emit('fallamasiva', 'Nueva falla masiva');
                        }//fin de else de ingreso a metadatos
                    });//fin de query de ingreso a metadatos
                }//fin de else de crear tabla
                
            });//fin de query crear tabla
            conn.release();
        });// fin del getConnection
    });

    app.post('/getTablesFallas', middleware.requireLogin, function (req, res) {
        var query = " SELECT t.idtablasporexportar,t.tabla,t.activa,t.creado,t.descripcion,u.nombre FROM tablasporexportar t LEFT JOIN users u ON u.iduser = t.autor WHERE tipo = 'dinamica' ";

        connection.getConnection(function (err, conn) {
            conn.query(query, function (error, results, field) {
                if (error) {
                    res.send("Error al hacer la consulta");
                } else {
                    res.send(results);
                }
            });
            conn.release();
        });
    });

    app.post('/activar_tabla', middleware.requireLogin, function (req, res) {

        var id = req.body.id;
        var numero = req.body.numero;

        var query_desactivar = "UPDATE tablasporexportar SET activa = 'inactivo' WHERE tipo = 'dinamica' and activa = ?";
        var insercion = [numero];
        query_desactivar = mysql.format(query_desactivar,insercion);

        var query_activar = "UPDATE tablasporexportar SET activa = ? WHERE tipo = 'dinamica' AND idtablasporexportar = ?";
        var inserts = [numero,id];
        query_activar = mysql.format(query_activar, inserts);

        connection.getConnection(function (err, conn) {
            conn.query(query_desactivar, function (error, results, field) {
                if (error) {
                    res.send(error);
                    console.log(error);
                } else {
                    conn.query(query_activar, function (error, results, field) {
                        if (error) {
                            res.send(error);
                            console.log(error);
                        } else {
                            res.send("ok")
                            io.emit('fallamasiva', 'Nueva falla masiva');
                        }
                    });
                }
            });
            conn.release();
        });
    });

    app.post('/desactivar_tabla', middleware.requireLogin, function (req, res) {

        var id = req.body.id;
        

        var query_desactivar = "UPDATE tablasporexportar SET activa = 'inactivo' WHERE tipo = 'dinamica' and idtablasporexportar = ?";
        var insercion = [id];
        query_desactivar = mysql.format(query_desactivar,insercion);

        

        connection.getConnection(function (err, conn) {
            conn.query(query_desactivar, function (error, results, field) {
                if (error) {
                    res.send(error);
                    console.log(error);
                } else {
                    res.send("ok")
                    io.emit('fallamasiva', 'Falla masiva desactivada');
                }
            });
            conn.release();
        });
    });

    app.post('/deshabilitar_tablas', middleware.requireLogin, function (req, res) {
        var query_desactivar = "UPDATE tablasporexportar SET activa = 'inactivo' WHERE tipo = 'dinamica'";

        connection.getConnection(function (err, conn) {
            conn.query(query_desactivar, function (error, results, field) {
                if (error) {
                    res.send(error);
                    console.log(error);
                } else {
                    res.send("ok");
                    io.emit('fallamasiva', 'Deshabilitadas todas las fallas masivas');
                }
            });
            conn.release();
        });
    });

    app.post('/validarFallasActivas', middleware.requireLogin, function (req, res) {
        var query = "SELECT activa FROM tablasporexportar WHERE activa in ('falla1','falla2','falla3') and tipo = 'dinamica'";
        connection.getConnection(function (err, conn) {
            conn.query(query, function (error, results, field) {
                if (error){
                    res.send("error consultando fallas masivas")
                    console.log(error);
                }else if(results.length > 0){
                    res.send(results);
                    //console.log(results.length);
                }else{
                    res.send("noexiste");
                }
                
                
            });
            conn.release();
        });
    });

    app.post('/getTablaMasivaActiva', middleware.requireLogin, function (req, res) {
        var query = " SELECT descripcion, contenido FROM tablasporexportar WHERE tipo = 'dinamica' and activa = ? order by creado desc limit 1 ";
        query = mysql.format(query,req.body.falla);
        connection.getConnection(function (err, conn) {
            conn.query(query, function (error, results, field) {
                if (error) {
                    console.log(error);
                } else {
                    res.send(results);
                }
            });
            conn.release();
        });
    });

    app.post('/guardarpool_fallamasiva', middleware.requireLogin, function (req, res) {
        
        var parametros = req.body.parametros;
        parametros = JSON.parse(parametros);
        console.log(parametros);
        //res.send("Correcto");


        //OBTENER NOMBRE DE LA TABLA ACTIVA
        //OBTENER FIELDNAME DE LA TABLA ACTIVA
        //INSERTAR A ESOS FIELDNAMES DE LA TABLA ACTIVA
        
        var query_getActiva = "SELECT tabla FROM tablasporexportar WHERE tipo = 'dinamica' AND activa = ? order by creado desc LIMIT 1";
        var insertss = [parametros[0]];
        query_getActiva = mysql.format(query_getActiva,insertss);

        var query_getNames = "SELECT * FROM ?? LIMIT 1";
        var names_array = [];
        
        console.log("COMENZANDO INSERCION DE REGISTRO DE FALLA MASIVA")

        connection.getConnection(function (err, conn) {
            //obtener tabla activa---------------------------------
            conn.query(query_getActiva, function (error, results, field) {
                if (error) {
                    res.send(error.sqlMessage);
                    console.log(error);
                } else {
                    var nombre_tabla = results[0]['tabla'];
                    console.log("TABLA ACTIVA: " + nombre_tabla);
                    var inserts = [nombre_tabla];
                    query_getNames = mysql.format(query_getNames,inserts);
                    //obtener los campos de la tabla activa ------------------------
                    conn.query(query_getNames, function (error, results, field) {
                        if (error) {
                            res.send(error.sqlMessage);
                            console.log(error);
                        } else {

                            //COMIENZA CONSTRUCCION DE QUERY INSERCION ///////////////////////////////////////////////////////////////////////////
                            Object.keys(field).forEach(function (key) {
                                var row = field[key];
                                names_array.push(row.name);
                            });
                            //los insert de nombres son: names_array
                            //los insert de valores son: parametros
                            //nombre de tabla es: nombre_tabla
                            //SE INSERTAN LOS DATOS
                            //INSERT INTO nombre_tabla(names_array) VALUES(parametros)
                            parametros.splice(0,1);
                            console.log(parametros);
                            var query_header = "INSERT INTO " + nombre_tabla+"(asesor";
                            //------------------------------------------------------
                            var query_body1 = "";
                            for(i=3;i<names_array.length;i++){
                                query_body1 += "," + names_array[i];
                            }
                            //------------------------------------------------------
                            var query_body2 = ") VALUES(";
                            for (i = 0; i < parametros.length; i++) {
                                if (i + 1 == parametros.length){
                                    query_body2 += "'" + parametros[i] + "'";
                                }else{
                                    query_body2 += "'" + parametros[i] + "',";
                                }
                            }
                            //-------------------------------------------------------
                            var query_footer = ")";
                            //--------------------------------------------------------
                            var finalquery = query_header + query_body1 + query_body2 + query_footer;
                            
                            conn.query(finalquery, function (error, results, field) {
                                if (error) {
                                    res.send(error.sqlMessage);
                                    console.log(error);
                                } else {
                                    res.send("Correcto");
                                    console.log("AGREGADO CORRECTAMENTE A SU TABLA DE FALLA MASIVA");
                                }
                            });
                            //FIN DE INSERCION
                        }
                    });
                }
            });
            conn.release();
        });
    });

    

    /*
    
    */


}// fin del archivo
