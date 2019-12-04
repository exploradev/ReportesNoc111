middleware = require('./middlewares');
var mysql = require('mysql');
var connection = require('./db');
var connectionTMK = require('./db_tmk');
var moment = require('moment');


module.exports = function(app,io){

    app.post('/getNocs', middleware.requireLogin, function (req, res) {
        var query = "SELECT iduser, nombre from users where rol = 'noc' and estatus = 'activo'";
        connection.getConnection(function(err,conn){
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                res.send(results);
            });
            conn.release();
        });
        
    }); //fin del /getTotalReportes


    app.post('/reasignacion_propietario', middleware.requireLogin, function (req, res) {
        var iduser = req.body.iduser;
        var idmetadatos = req.body.idmetadatos;
        var query = "UPDATE metadatos SET propietario = ? WHERE idmetadatos = ?";
        var inserts = [iduser,idmetadatos];
        query = mysql.format(query,inserts);
        connection.getConnection(function(err,conn){
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                io.emit('new', 'nuevo_reasignacion');
                res.send("Correcto");
            });
            conn.release();
        });
        
    }); //fin del /getTotalReportes

    //CUSTOM ROUTES PARA REPORTES A SUPERVISOR -----------------------------------------

    //OBTENER PREVISUALIZACION DE TABLA
    app.get('/getPreviewTableSuper', middleware.requireLogin, function (req, res){
        var query = "SELECT s.creado, s.idsupervision, u.nombre as asesor,s.numero,s.estatus,s.cerrado, us.nombre as propietario FROM supervision s LEFT JOIN users u on u.iduser = s.asesor LEFT JOIN users us on us.iduser = s.supervisor WHERE(s.estatus in ('Nuevo', 'En proceso')) OR(s.estatus = 'Cerrado' AND month(now()) = month(s.creado)) ORDER BY CREADO";
        connection.getConnection(function(err,conn){
            conn.query(query,function(error,results){
                if(error){
                    res.send("Error: "+error.sqlMessage);
                    console.log("Error consulta super preview: "+error.sqlMessage);
                }else{
                    res.send(results);
                }
            });
            conn.release();
        });
    });

    //OBTENER PREVISUALIZACION DE TABLA
    app.post('/getDetailsSupervisor', middleware.requireLogin, function (req, res) {

        var idsupervision = req.body.idsupervision;

        var query = "SELECT s.asunto, s.descripcion, s.comentario, s.creado, s.idsupervision, u.nombre as asesor,s.numero,s.estatus, us.nombre as propietario, s.contacto,s.cerrado FROM supervision s LEFT JOIN users u on u.iduser = s.asesor LEFT JOIN users us on us.iduser = s.supervisor WHERE s.idsupervision = ? LIMIT 1";
        var inserts = [idsupervision];
        query = mysql.format(query,inserts);

        connection.getConnection(function (err, conn) {
            conn.query(query, function (error, results) {
                if (error) {
                    res.send("Error: " + error.sqlMessage);
                    console.log("Error consulta super detalles: " + error.sqlMessage);
                } else {
                    res.send(results);
                }
            });
            conn.release();
        });
    });

    //UPDATE SEGUIMIENTO
    app.post('/updateDetailsSupervisor', middleware.requireLogin, function (req, res) {

        var idreporte = req.body.idreporte;
        var supervisor = req.body.supervisor;
        var estatus = req.body.estatus;
        var comentarios = req.body.comentarios;

        if(estatus == "Cerrado"){
            var query = "UPDATE supervision SET estatus = ?,supervisor = ?,comentario = ?, cerrado = now() WHERE idsupervision = ? LIMIT 1";
        }else{
            var query = "UPDATE supervision SET estatus = ?,supervisor = ?,comentario = ? WHERE idsupervision = ? LIMIT 1";
        }
        
        var inserts = [estatus,supervisor,comentarios,idreporte];
        query = mysql.format(query, inserts);

        connection.getConnection(function (err, conn) {
            conn.query(query, function (error, results) {
                if (error) {
                    res.send("Error: " + error.sqlMessage);
                    console.log("Error actualizando estatus/comentario: " + error.sqlMessage);
                } else {
                    res.send("Correcto");
                    io.emit('new', 'nuevo_seguimiento_super');
                }
            });
            conn.release();
        });
    });

    app.post('/referidos_ultimomes',middleware.requireLogin,function(req,res){
        let query = `SELECT id, DATE_FORMAT(creado, '%d-%b-%y %H:%i:%s') as creado, asesor, telefono,status,observaciones FROM refered WHERE 
            (month(creado) = month(now()) and
            year(creado) = year(now()))  
            OR
            (YEAR(creado) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH) AND
            MONTH(creado) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH))
            `;
        
        connectionTMK.getConnection(function (err, conn) {
            conn.query(query, function (error, results, field) {
                if (error){
                    res.send(error.sqlMessage)
                }else{
                    res.send(results);
                }
            });
            conn.release();
        });
    });

}// fin del archivo