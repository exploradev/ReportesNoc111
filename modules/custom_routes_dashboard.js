middleware = require('./middlewares');
var mysql = require('mysql');
var connection = require('./db');
var moment = require('moment');


module.exports = function(app,io){


    app.post('/getSpiderStatus', middleware.requireLogin, function (req, res) {
        var query = "SELECT SUM(CASE WHEN m.estatus IN('Nuevo', 'En proceso', 'Pendiente') AND m.falla = 'aclaraciones'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS abiertos_aclaraciones, SUM(CASE WHEN m.estatus IN('Nuevo', 'En proceso', 'Pendiente') AND m.falla = 'callback'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS abiertos_callback, SUM(CASE WHEN m.estatus IN('Nuevo', 'En proceso', 'Pendiente') AND m.falla = 'cobertura'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS abiertos_cobertura, SUM(CASE WHEN m.estatus IN('Nuevo', 'En proceso', 'Pendiente') AND m.falla = 'general'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS abiertos_general, SUM(CASE WHEN m.estatus IN('Nuevo', 'En proceso', 'Pendiente') AND m.falla = 'iccid'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS abiertos_iccid, SUM(CASE WHEN m.estatus IN('Nuevo', 'En proceso', 'Pendiente') AND m.falla = 'llamadas'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS abiertos_llamadas, SUM(CASE WHEN m.estatus IN('Nuevo', 'En proceso', 'Pendiente') AND m.falla = 'promociones'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS abiertos_promociones, SUM(CASE WHEN m.estatus IN('Nuevo', 'En proceso', 'Pendiente') AND m.falla = 'recargas'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS abiertos_recargas, SUM(CASE WHEN m.estatus IN('Nuevo', 'En proceso', 'Pendiente') AND m.falla = 'servicios'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS abiertos_servicios, SUM(CASE WHEN m.estatus IN('Nuevo', 'En proceso', 'Pendiente') AND m.falla = 'navegacion'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS abiertos_navegacion, SUM(CASE WHEN m.estatus IN('Cerrado') AND m.falla = 'aclaraciones'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS cerrados_aclaraciones, SUM(CASE WHEN m.estatus IN('Cerrado') AND m.falla = 'callback'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS cerrados_callback, SUM(CASE WHEN m.estatus IN('Cerrado') AND m.falla = 'cobertura'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS cerrados_cobertura, SUM(CASE WHEN m.estatus IN('Cerrado') AND m.falla = 'general'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS cerrados_general, SUM(CASE WHEN m.estatus IN('Cerrado') AND m.falla = 'iccid'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS cerrados_iccid, SUM(CASE WHEN m.estatus IN('Cerrado') AND m.falla = 'llamadas'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS cerrados_llamadas, SUM(CASE WHEN m.estatus IN('Cerrado') AND m.falla = 'promociones'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS cerrados_promociones, SUM(CASE WHEN m.estatus IN('Cerrado') AND m.falla = 'recargas'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS cerrados_recargas, SUM(CASE WHEN m.estatus IN('Cerrado') AND m.falla = 'servicios'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS cerrados_servicios, SUM(CASE WHEN m.estatus IN('Cerrado') AND m.falla = 'navegacion'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS cerrados_navegacion FROM metadatos m";
        
        connection.getConnection(function(err,conn){
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                res.send(results);
            });
            conn.release();
        });
        
    }); //fin del /getTotalReportes





    //-----------------------------------------------------------






    app.post('/getEstatusActuales', middleware.requireLogin, function (req, res) {
        var query = "SELECT         SUM(CASE WHEN m.estatus = 'Nuevo'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS nuevos, SUM(CASE WHEN m.estatus IN('En proceso', 'Pendiente')  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS enproceso, SUM(CASE WHEN m.estatus = 'Solucionado'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS solucionados, SUM(CASE WHEN m.estatus  IN('Cerrado')  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS cerrados, SUM(CASE WHEN m.estatus  IN('Rechazado')  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS rechazados, SUM(CASE WHEN m.estatus in ('Cerrado', 'Nuevo', 'En proceso', 'Pendiente', 'Rechazado','Solucionado')  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS total FROM metadatos m ";
        connection.getConnection(function(err,conn){
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                res.send(results);
            });
            conn.release();
        });
        
    }); //fin del /getTotalReportes


          

    app.post('/getEstatusActualesDia', middleware.requireLogin, function (req, res) {
        var query = "SELECT SUM(CASE WHEN m.estatus = 'Nuevo'  AND month(m.creado) = month(now()) AND day(m.creado) = day(now()) THEN 1 ELSE 0 END) AS nuevos, SUM(CASE WHEN m.estatus IN('En proceso', 'Pendiente')  AND month(m.creado) = month(now()) AND day(m.creado) = day(now()) THEN 1 ELSE 0 END) AS enproceso, SUM(CASE WHEN m.estatus = 'Solucionado'  AND month(m.creado) = month(now()) AND day(m.creado) = day(now()) THEN 1 ELSE 0 END) AS solucionados, SUM(CASE WHEN m.estatus IN('Cerrado')  AND month(m.creado) = month(now()) AND day(m.creado) = day(now()) THEN 1 ELSE 0 END) AS cerrados, SUM(CASE WHEN m.estatus IN('Rechazado')  AND month(m.creado) = month(now()) AND day(m.creado) = day(now()) THEN 1 ELSE 0 END) AS rechazados, SUM(CASE WHEN m.estatus in ('Cerrado', 'Nuevo', 'En proceso', 'Pendiente', 'Rechazado', 'Solucionado')  AND month(m.creado) = month(now()) AND day(m.creado) = day(now()) THEN 1 ELSE 0 END) AS total FROM metadatos m ";
        connection.getConnection(function(err,conn){
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                res.send(results);
            });
            conn.release();
        });
        
    }); //fin del /getTotalReportes





    //-----------------------------------------------------------






    app.post('/getTotalReportes', middleware.requireLogin, function (req, res) {
        var query = "SELECT day(creado) as dia, count(falla) as fallas from metadatos where month(creado) = month(now()) and year(creado) = year(now()) group by day(creado) order by day(creado) ASC";
        connection.getConnection(function(err,conn){
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                res.send(results);
            });
            conn.release();
        });
        
    }); //fin del /getTotalReportes

    app.post('/getConteoDiarioAclaraciones', middleware.requireLogin, function (req, res) {
        var query = "SELECT day(creado) as dia, count(falla) as fallas from metadatos where falla = 'aclaraciones' AND month(creado) = month(now()) and year(creado) = year(now()) group by day(creado) order by day(creado) ASC";
        connection.getConnection(function(err,conn){
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                res.send(results);
            });
            conn.release();
        });
        
    }); //fin del /getTotalReportes

    app.post('/getConteoDiarioCallback', middleware.requireLogin, function (req, res) {
        var query = "SELECT day(creado) as dia, count(falla) as fallas from metadatos where falla = 'callback' AND month(creado) = month(now()) and year(creado) = year(now()) group by day(creado) order by day(creado) ASC";
        connection.getConnection(function(err,conn){
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                res.send(results);
            });
            conn.release();
        });
        
    }); //fin del /getTotalReportes

    app.post('/getConteoDiarioCobertura', middleware.requireLogin, function (req, res) {
        var query = "SELECT day(creado) as dia, count(falla) as fallas from metadatos where falla = 'cobertura' AND month(creado) = month(now()) and year(creado) = year(now()) group by day(creado) order by day(creado) ASC";
        connection.getConnection(function(err,conn){
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                res.send(results);
            });
            conn.release();
        });
        
    }); //fin del /getTotalReportes


    app.post('/getConteoDiarioGeneral', middleware.requireLogin, function (req, res) {
        var query = "SELECT day(creado) as dia, count(falla) as fallas from metadatos where falla = 'general' AND month(creado) = month(now()) and year(creado) = year(now()) group by day(creado) order by day(creado) ASC";
        connection.getConnection(function(err,conn){
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                res.send(results);
            });
            conn.release();
        });
        
    }); //fin del /getTotalReportes


    app.post('/getConteoDiarioICCID', middleware.requireLogin, function (req, res) {
        var query = "SELECT day(creado) as dia, count(falla) as fallas from metadatos where falla = 'iccid' AND month(creado) = month(now()) and year(creado) = year(now()) group by day(creado) order by day(creado) ASC";
        connection.getConnection(function(err,conn){
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                res.send(results);
            });
            conn.release();
        });
        
    }); //fin del /getTotalReportes


    app.post('/getConteoDiarioLlamadas', middleware.requireLogin, function (req, res) {
        var query = "SELECT day(creado) as dia, count(falla) as fallas from metadatos where falla = 'llamadas' AND month(creado) = month(now()) and year(creado) = year(now()) group by day(creado) order by day(creado) ASC";
        connection.getConnection(function(err,conn){
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                res.send(results);
            });
            conn.release();
        });
        
    }); //fin del /getTotalReportes


    app.post('/getConteoDiarioPromociones', middleware.requireLogin, function (req, res) {
        var query = "SELECT day(creado) as dia, count(falla) as fallas from metadatos where falla = 'promociones' AND month(creado) = month(now()) and year(creado) = year(now()) group by day(creado) order by day(creado) ASC";
        connection.getConnection(function(err,conn){
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                res.send(results);
            });
            conn.release();
        });
        
    }); //fin del /getTotalReportes


    app.post('/getConteoDiarioRecargas', middleware.requireLogin, function (req, res) {
        var query = "SELECT day(creado) as dia, count(falla) as fallas from metadatos where falla = 'recargas' AND month(creado) = month(now()) and year(creado) = year(now()) group by day(creado) order by day(creado) ASC";
        connection.getConnection(function(err,conn){
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                res.send(results);
            });
            conn.release();
        });
        
    }); //fin del /getTotalReportes


    app.post('/getConteoDiarioServicios', middleware.requireLogin, function (req, res) {
        var query = "SELECT day(creado) as dia, count(falla) as fallas from metadatos where falla = 'servicios' AND month(creado) = month(now()) and year(creado) = year(now()) group by day(creado) order by day(creado) ASC";
        connection.getConnection(function(err,conn){
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                res.send(results);
            });
            conn.release();
        });
        
    }); //fin del /getTotalReportes


    app.post('/getConteoDiarioNavegacion', middleware.requireLogin, function (req, res) {
        var query = "SELECT day(creado) as dia, count(falla) as fallas from metadatos where falla = 'navegacion' AND month(creado) = month(now()) and year(creado) = year(now()) group by day(creado) order by day(creado) ASC";
        connection.getConnection(function(err,conn){
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                res.send(results);
            });
            conn.release();
        });
        
    }); //fin del /getTotalReportes


    //---------------------------------------------------------------------------------






    app.post('/getConteoTotalPorFalla', middleware.requireLogin, function (req, res) {
        var query = "SELECT         SUM(CASE WHEN m.falla = 'aclaraciones'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS aclaraciones, SUM(CASE WHEN m.falla = 'callback'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS callback,                 SUM(CASE WHEN m.falla = 'cobertura'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS cobertura,                     SUM(CASE WHEN m.falla = 'general'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS general,                         SUM(CASE WHEN m.falla = 'iccid'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS iccid,                             SUM(CASE WHEN m.falla = 'llamadas'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS llamadas,                                 SUM(CASE WHEN m.falla = 'promociones'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS promociones,                                     SUM(CASE WHEN m.falla = 'recargas'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS recargas,                                         SUM(CASE WHEN m.falla = 'servicios'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS servicios,                                             SUM(CASE WHEN m.falla = 'navegacion'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS navegacion          FROM metadatos m";
        connection.getConnection(function(err,conn){
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                res.send(results);
            });
            conn.release();
        });
        
    }); //fin del /getTotalReportes






    //---------------------------------------------------------------------------------
    
    
    
    app.post('/getProductividad', middleware.requireLogin, function (req, res) {
        var query = "SELECT        ifnull(u.nombre,'No asignado') as asesor,             SUM(CASE WHEN m.estatus =  'Nuevo'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS nuevos,                 SUM(CASE WHEN m.estatus = 'En proceso'  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS enproceso,                     SUM(CASE WHEN m.estatus IN ('Pendiente','Solucionado')  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS pendientes, SUM(CASE WHEN m.estatus IN ('Rechazado')  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS rechazados,                        SUM(CASE WHEN m.estatus IN('Cerrado')  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS cerrados,                             SUM(CASE WHEN m.estatus in ('Cerrado', 'Nuevo', 'En proceso', 'Pendiente','Solucionado','Rechazado')  AND month(m.creado) = month(now()) THEN 1 ELSE 0 END) AS total         FROM metadatos m        LEFT JOIN users u on m.propietario = u.iduser    WHERE u.estatus = 'activo' and u.rol='noc'       GROUP BY u.nombre         ORDER BY u.nombre";
        connection.getConnection(function(err,conn){
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                res.send(results);
            });
            conn.release();
        });
        
    }); //fin del /getTotalReportes


    //CONTEO DE ESTATUS REPORTES SUPERVISOR --------------------------------------------

    app.get('/getConteoSupervisor', middleware.requireLogin, function (req, res){
        query = "SELECT SUM(CASE WHEN estatus = 'Nuevo'  THEN 1 ELSE 0 END) AS nuevos, SUM(CASE WHEN estatus = 'En proceso'  THEN 1 ELSE 0 END) AS enproceso, SUM(CASE WHEN estatus = 'Cerrado'  AND month(creado) IN(month(now()), month(DATE_SUB(now(), INTERVAL 1 MONTH))) THEN 1 ELSE 0 END) AS cerrados, SUM(CASE WHEN estatus IN('Nuevo', 'En proceso', 'Cerrado')  AND month(creado) = month(now()) THEN 1 ELSE 0 END) AS total FROM supervision";
        connection.getConnection(function (err, conn) {
            conn.query(query, function (error, results, field) {
                if (error) res.send(error);
                res.send(results);
            });
            conn.release();
        });
    });



}// fin del archivo