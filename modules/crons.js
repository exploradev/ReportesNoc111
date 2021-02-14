middleware = require('./middlewares');
var mysql = require('mysql');
var connection = require('./db');
var moment = require('moment');
var cron = require('node-cron');


module.exports = function(app,io){


    cron.schedule('0 7 * * *', () => { 
        llenar_asignaciones();
    });   

    // app.get('/asignar', middleware.requireLogin, (req, res) => {
    //     llenar_asignaciones();
    //     res.send('ok')
    // })

    let llenar_asignaciones = () => {
        //recorrer todos los tickets que no esten asignados,
        // si la creacion es en rango de 20hrs a 7hrs se agrega a los matutinos
        
        const obtener_capturas = () => {
            return new Promise((resolve,reject)=>{
                let query = `SELECT idmetadatos, creado FROM metadatos WHERE propietario is null`;
                connection.getConnection(function (err, conn) {
                    let connection_error = {
                        status: 'error',
                        mensaje: 'Error al conectar con la base de datos'
                    }
                    if (err) reject(connection_error.mensaje)
                    conn.query(query, function (error, results, field) {
                        if (error){
                            reject(error.sqlMessage)
                        }else{
                            
                            resolve(results)
                        }
                    });
                    conn.release();
                });
            });
        }
         
        
         
        const run = async () => {
           try{
                const capturas = await obtener_capturas();
                
                for(elemento of capturas){
                    let d = new Date(elemento.creado);
                    let hours = d.getHours();
                    if(hours >= 20 || hours <= 12){
                        asignar_captura_matutino(elemento.idmetadatos)
                    }else if(hours >= 13 || hours <= 19){
                        asignar_captura_vespertino(elemento.idmetadatos)
                    }
                }
                
            }catch(err){
                console.log(err);
            }
        }
        run();
        
    }


    let asignar_captura_matutino = (captura) => {
        const obtener_conteo = () => {
            return new Promise((resolve,reject)=>{
                let query = "SELECT u.iduser as propietario, ifnull(count(m.estatus),0) as capturas FROM metadatos m right JOIN users u on u.iduser = m.propietario WHERE u.rol = 'noc' AND u.estatus = 'activo' AND u.turno = 'matutino' AND month(m.creado) = month(now()) AND year(m.creado) = year(now()) group by u.iduser order by capturas asc limit 1";

                connection.getConnection(function(err,conn){
                    conn.query(query, function (error, results, field) {
                        if (error) reject(error)
                        //console.log(results);
                        resolve(results)
                    }); //fin query de consulta
                    conn.release();
                });
            });
        }
         
        const obtener_empleado_random = () => {
            return new Promise((resolve,reject)=>{
                let query = "SELECT u.iduser as propietario FROM users u WHERE u.rol = 'noc' AND u.estatus = 'activo' AND u.turno = 'matutino' limit 1";

                connection.getConnection(function(err,conn){
                    conn.query(query, function (error, results, field) {
                        if (error) reject(error)
                        //console.log(results);
                        resolve(results)
                    }); //fin query de consulta
                    conn.release();
                });
            });
        }

        const realizar_actualizacion = (propietario) => {
            return new Promise((resolve,reject)=>{
                
                //ejecuto segunda query en la que la asigno al noc que tenga menos capturas segun la consulta anteriormente realizada
                var query = "UPDATE metadatos SET propietario = ?,fecha_asignacion = now() WHERE idmetadatos = ?";
                var inserts = [propietario, captura];
                query = mysql.format(query, inserts);
                connection.getConnection(function(err,conn){
                    conn.query(query, function (error, results, field) {
                        if (error) throw reject(error);
                        console.log("Asignado correctamente a iduser: " + propietario + " - la captura: " + captura);
                        resolve('ok');
                    }); //fin query de asignacion
                    conn.release();
                });
            });
        }
         
        const run = async () => {
           try{
                //buscar el que tiene menos del turno matutino y asignarlo
                const noc_que_tiene_menos = await obtener_conteo();
                //validar si hay algun empleado en la respuesta, sino buscar un empleado aleatorio
                if(noc_que_tiene_menos.length > 0){
                    let response_final = await realizar_actualizacion(noc_que_tiene_menos[0].propietario);
                }else{
                    const noc_random = await obtener_empleado_random();
                    let response_final = await realizar_actualizacion(noc_random[0].propietario);
                }
                
            }catch(err){
                
                console.log(err);
                
            }
        }
        run();
    }

    let asignar_captura_vespertino = (captura) => {
        const obtener_conteo = () => {
            return new Promise((resolve,reject)=>{
                let query = "SELECT u.iduser as propietario, ifnull(count(m.estatus),0) as capturas FROM metadatos m right JOIN users u on u.iduser = m.propietario WHERE u.rol = 'noc' AND u.estatus = 'activo' AND u.turno = 'vespertino' AND month(m.creado) = month(now()) AND year(m.creado) = year(now()) group by u.iduser order by capturas asc limit 1";

                connection.getConnection(function(err,conn){
                    conn.query(query, function (error, results, field) {
                        if (error) reject(error)
                        //console.log(results);
                        resolve(results)
                    }); //fin query de consulta
                    conn.release();
                });
            });
        }
         
        const obtener_empleado_random = () => {
            return new Promise((resolve,reject)=>{
                let query = "SELECT u.iduser as propietario FROM users u WHERE u.rol = 'noc' AND u.estatus = 'activo' AND u.turno = 'vespertino' limit 1";

                connection.getConnection(function(err,conn){
                    conn.query(query, function (error, results, field) {
                        if (error) reject(error)
                        //console.log(results);
                        resolve(results)
                    }); //fin query de consulta
                    conn.release();
                });
            });
        }

        const realizar_actualizacion = (propietario) => {
            return new Promise((resolve,reject)=>{
                
                //ejecuto segunda query en la que la asigno al noc que tenga menos capturas segun la consulta anteriormente realizada
                var query = "UPDATE metadatos SET propietario = ?,fecha_asignacion = now() WHERE idmetadatos = ?";
                var inserts = [propietario, captura];
                query = mysql.format(query, inserts);
                connection.getConnection(function(err,conn){
                    conn.query(query, function (error, results, field) {
                        if (error) throw reject(error);
                        console.log("Asignado correctamente a iduser: " + propietario + " - la captura: " + captura);
                        resolve('ok');
                    }); //fin query de asignacion
                    conn.release();
                });
            });
        }
         
        const run = async () => {
           try{
                //buscar el que tiene menos del turno vespertino y asignarlo
                const noc_que_tiene_menos = await obtener_conteo();
                //validar si hay algun empleado en la respuesta, sino buscar un empleado aleatorio
                if(noc_que_tiene_menos.length > 0){
                    let response_final = await realizar_actualizacion(noc_que_tiene_menos[0].propietario);
                }else{
                    const noc_random = await obtener_empleado_random();
                    let response_final = await realizar_actualizacion(noc_random[0].propietario);
                }
                
            }catch(err){
                
                console.log(err);
                
            }
        }
        run();
    }







}// fin del archivo