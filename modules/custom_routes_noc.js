middleware = require('./middlewares');
var mysql = require('mysql');
var connection = require('./db');
var moment = require('moment');


module.exports = function(app,io){

    //OBTENGO CONTEOS DE PANEL SUPERIOR
    app.post('/get_conteopersonal_superior', middleware.requireLogin, function (req, res){
        var iduser = req.body.iduser;
        var query = "SELECT SUM(CASE WHEN estatus = 'Nuevo'   AND propietario = ? THEN 1 ELSE 0 END) AS nuevos, SUM(CASE WHEN estatus = 'Pendiente'  AND propietario = ? THEN 1 ELSE 0 END) AS pendientes, SUM(CASE WHEN estatus IN ('Cerrado','Rechazado')  AND month(creado) = month(now()) AND propietario = ? THEN 1 ELSE 0 END) AS cerrados, SUM(CASE WHEN estatus = 'En proceso'   AND propietario = ? THEN 1 ELSE 0 END) AS enproceso FROM metadatos LIMIT 1;";
        var inserts = [iduser, iduser, iduser, iduser];
        query = mysql.format(query, inserts)
        connection.getConnection(function(err,conn){
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                res.send(results);
            });
            conn.release();
        })
        
    });

    //OBTENGO CONTEOS PARA EL MENU LATERAL
    app.get('/get_conteosmenu', middleware.requireLogin, function (req, res) {
        var query = "SELECT SUM(CASE WHEN month(creado) = month(now()) THEN 1 ELSE 0 END) AS conteo_global, SUM(CASE WHEN falla = 'aclaraciones'  AND month(creado) = month(now()) THEN 1 ELSE 0 END) AS conteo_aclaraciones, SUM(CASE WHEN falla = 'callback'  AND month(creado) = month(now()) THEN 1 ELSE 0 END) AS conteo_callback,SUM(CASE WHEN falla = 'general'  AND month(creado) = month(now()) THEN 1 ELSE 0 END) AS conteo_general,SUM(CASE WHEN falla = 'cobertura'  AND month(creado) = month(now()) THEN 1 ELSE 0 END) AS conteo_cobertura,SUM(CASE WHEN falla = 'iccid'  AND month(creado) = month(now()) THEN 1 ELSE 0 END) AS conteo_iccid,        SUM(CASE WHEN falla = 'llamadas'  AND month(creado) = month(now()) THEN 1 ELSE 0 END) AS conteo_llamadas, SUM(CASE WHEN falla = 'navegacion'  AND month(creado) = month(now()) THEN 1 ELSE 0 END) AS conteo_navegacion, SUM(CASE WHEN falla = 'recargas'  AND month(creado) = month(now()) THEN 1 ELSE 0 END) AS conteo_recargas,            SUM(CASE WHEN falla = 'promociones'  AND month(creado) = month(now()) THEN 1 ELSE 0 END) AS conteo_promociones, SUM(CASE WHEN falla = 'servicios'  AND month(creado) = month(now()) THEN 1 ELSE 0 END) AS conteo_servicios, SUM(CASE WHEN falla = 'aclaraciones' AND month(creado) = month(now()) AND estatus NOT IN('Cerrado') THEN 1 ELSE 0 END) AS abiertos_aclaraciones, SUM(CASE WHEN falla = 'callback' AND month(creado) = month(now()) AND estatus NOT IN('Cerrado') THEN 1 ELSE 0 END) AS abiertos_callback,                SUM(CASE WHEN falla = 'general' AND month(creado) = month(now()) AND estatus NOT IN('Cerrado') THEN 1 ELSE 0 END) AS abiertos_general, SUM(CASE WHEN falla = 'cobertura' AND month(creado) = month(now()) AND estatus NOT IN('Cerrado') THEN 1 ELSE 0 END) AS abiertos_cobertura, SUM(CASE WHEN falla = 'iccid' AND month(creado) = month(now()) AND estatus NOT IN('Cerrado') THEN 1 ELSE 0 END) AS abiertos_iccid, SUM(CASE WHEN falla = 'llamadas' AND month(creado) = month(now()) AND estatus NOT IN('Cerrado') THEN 1 ELSE 0 END) AS abiertos_llamadas, SUM(CASE WHEN falla = 'navegacion' AND month(creado) = month(now()) AND estatus NOT IN('Cerrado') THEN 1 ELSE 0 END) AS abiertos_navegacion, SUM(CASE WHEN falla = 'recargas' AND month(creado) = month(now()) AND estatus NOT IN('Cerrado') THEN 1 ELSE 0 END) AS abiertos_recargas, SUM(CASE WHEN falla = 'promociones' AND month(creado) = month(now()) AND estatus NOT IN('Cerrado') THEN 1 ELSE 0 END) AS abiertos_promociones, SUM(CASE WHEN falla = 'servicios' AND month(creado) = month(now()) AND estatus NOT IN('Cerrado') THEN 1 ELSE 0 END) AS abiertos_servicios, SUM(CASE WHEN falla = 'aclaraciones'  AND estatus = 'Nuevo' THEN 1 ELSE 0 END) AS nuevos_aclaraciones, SUM(CASE WHEN falla = 'callback'  AND estatus = 'Nuevo' THEN 1 ELSE 0 END) AS nuevos_callback,                    SUM(CASE WHEN falla = 'general'  AND estatus = 'Nuevo' THEN 1 ELSE 0 END) AS nuevos_general, SUM(CASE WHEN falla = 'cobertura'  AND estatus = 'Nuevo' THEN 1 ELSE 0 END) AS nuevos_cobertura, SUM(CASE WHEN falla = 'iccid'  AND estatus = 'Nuevo' THEN 1 ELSE 0 END) AS nuevos_iccid,                        SUM(CASE WHEN falla = 'llamadas'  AND estatus = 'Nuevo' THEN 1 ELSE 0 END) AS nuevos_llamadas, SUM(CASE WHEN falla = 'navegacion'  AND estatus = 'Nuevo' THEN 1 ELSE 0 END) AS nuevos_navegacion, SUM(CASE WHEN falla = 'recargas'  AND estatus = 'Nuevo' THEN 1 ELSE 0 END) AS nuevos_recargas,                            SUM(CASE WHEN falla = 'promociones'  AND estatus = 'Nuevo' THEN 1 ELSE 0 END) AS nuevos_promociones, SUM(CASE WHEN falla = 'servicios'  AND estatus = 'Nuevo' THEN 1 ELSE 0 END) AS nuevos_servicios, SUM(CASE WHEN falla = 'aclaraciones'  AND estatus = 'En proceso' THEN 1 ELSE 0 END) AS enproceso_aclaraciones,                                SUM(CASE WHEN falla = 'callback'  AND estatus = 'En proceso' THEN 1 ELSE 0 END) AS enproceso_callback, SUM(CASE WHEN falla = 'general'  AND estatus = 'En proceso' THEN 1 ELSE 0 END) AS enproceso_general, SUM(CASE WHEN falla = 'cobertura'  AND estatus = 'En proceso' THEN 1 ELSE 0 END) AS enproceso_cobertura,                                    SUM(CASE WHEN falla = 'iccid'  AND estatus = 'En proceso' THEN 1 ELSE 0 END) AS enproceso_iccid, SUM(CASE WHEN falla = 'llamadas'  AND estatus = 'En proceso' THEN 1 ELSE 0 END) AS enproceso_llamadas, SUM(CASE WHEN falla = 'navegacion'  AND estatus = 'En proceso' THEN 1 ELSE 0 END) AS enproceso_navegacion,                                        SUM(CASE WHEN falla = 'recargas'  AND estatus = 'En proceso' THEN 1 ELSE 0 END) AS enproceso_recargas, SUM(CASE WHEN falla = 'promociones'  AND estatus = 'En proceso' THEN 1 ELSE 0 END) AS enproceso_promociones, SUM(CASE WHEN falla = 'servicios'  AND estatus = 'En proceso' THEN 1 ELSE 0 END) AS enproceso_servicios, SUM(CASE WHEN falla = 'aclaraciones'  AND estatus = 'Pendiente' THEN 1 ELSE 0 END) AS pendientes_aclaraciones, SUM(CASE WHEN falla = 'callback'  AND estatus = 'Pendiente' THEN 1 ELSE 0 END) AS pendientes_callback, SUM(CASE WHEN falla = 'general'  AND estatus = 'Pendiente' THEN 1 ELSE 0 END) AS pendientes_general,                                            SUM(CASE WHEN falla = 'cobertura'  AND estatus = 'Pendiente' THEN 1 ELSE 0 END) AS pendientes_cobertura, SUM(CASE WHEN falla = 'iccid'  AND estatus = 'Pendiente' THEN 1 ELSE 0 END) AS pendientes_iccid, SUM(CASE WHEN falla = 'llamadas'  AND estatus = 'Pendiente' THEN 1 ELSE 0 END) AS pendientes_llamadas,                                                SUM(CASE WHEN falla = 'navegacion'  AND estatus = 'Pendiente' THEN 1 ELSE 0 END) AS pendientes_navegacion, SUM(CASE WHEN falla = 'recargas'  AND estatus = 'Pendiente' THEN 1 ELSE 0 END) AS pendientes_recargas, SUM(CASE WHEN falla = 'promociones'  AND estatus = 'Pendiente' THEN 1 ELSE 0 END) AS pendientes_promociones,                                                    SUM(CASE WHEN falla = 'servicios'  AND estatus = 'Pendiente' THEN 1 ELSE 0 END) AS pendientes_servicios, SUM(CASE WHEN falla = 'aclaraciones'  AND month(creado) = month(now()) AND estatus = 'Cerrado' THEN 1 ELSE 0 END) AS cerrados_aclaraciones, SUM(CASE WHEN falla = 'callback'  AND month(creado) = month(now()) AND estatus = 'Cerrado' THEN 1 ELSE 0 END) AS cerrados_callback, SUM(CASE WHEN falla = 'general'  AND month(creado) = month(now()) AND estatus = 'Cerrado' THEN 1 ELSE 0 END) AS cerrados_general,                                                        SUM(CASE WHEN falla = 'cobertura'  AND month(creado) = month(now()) AND estatus = 'Cerrado' THEN 1 ELSE 0 END) AS cerrados_cobertura, SUM(CASE WHEN falla = 'iccid'  AND month(creado) = month(now()) AND estatus = 'Cerrado' THEN 1 ELSE 0 END) AS cerrados_iccid, SUM(CASE WHEN falla = 'llamadas'  AND month(creado) = month(now()) AND estatus = 'Cerrado' THEN 1 ELSE 0 END) AS cerrados_llamadas, SUM(CASE WHEN falla = 'navegacion'  AND month(creado) = month(now()) AND estatus = 'Cerrado' THEN 1 ELSE 0 END) AS cerrados_navegacion, SUM(CASE WHEN falla = 'recargas'  AND month(creado) = month(now()) AND estatus = 'Cerrado' THEN 1 ELSE 0 END) AS cerrados_recargas, SUM(CASE WHEN falla = 'promociones'  AND month(creado) = month(now()) AND estatus = 'Cerrado' THEN 1 ELSE 0 END) AS cerrados_promociones, SUM(CASE WHEN falla = 'servicios'  AND month(creado) = month(now()) AND estatus = 'Cerrado' THEN 1 ELSE 0 END) AS cerrados_servicios FROM metadatos LIMIT 1;";
        connection.getConnection(function (err, conn) {
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                res.send(results);
            });
            conn.release();
        });
        
    });

    app.post('/get_conteosmenu_propios', middleware.requireLogin, function (req, res) {

        var iduser = req.body.iduser;

        var query = "SELECT SUM(CASE WHEN propietario = ? AND month(creado) = month(now()) THEN 1 ELSE 0 END) AS conteo_global, SUM(CASE WHEN propietario = ? AND falla = 'aclaraciones'  AND month(creado) = month(now()) THEN 1 ELSE 0 END) AS conteo_aclaraciones, SUM(CASE WHEN propietario = ? AND falla = 'callback'  AND month(creado) = month(now()) THEN 1 ELSE 0 END) AS conteo_callback, SUM(CASE WHEN propietario = ? AND falla = 'general'  AND month(creado) = month(now()) THEN 1 ELSE 0 END) AS conteo_general, SUM(CASE WHEN propietario = ? AND falla = 'cobertura'  AND month(creado) = month(now()) THEN 1 ELSE 0 END) AS conteo_cobertura, SUM(CASE WHEN propietario = ? AND falla = 'iccid'  AND month(creado) = month(now()) THEN 1 ELSE 0 END) AS conteo_iccid, SUM(CASE WHEN propietario = ? AND falla = 'llamadas'  AND month(creado) = month(now()) THEN 1 ELSE 0 END) AS conteo_llamadas, SUM(CASE WHEN propietario = ? AND falla = 'navegacion'  AND month(creado) = month(now()) THEN 1 ELSE 0 END) AS conteo_navegacion, SUM(CASE WHEN propietario = ? AND falla = 'recargas'  AND month(creado) = month(now()) THEN 1 ELSE 0 END) AS conteo_recargas, SUM(CASE WHEN propietario = ? AND falla = 'promociones'  AND month(creado) = month(now()) THEN 1 ELSE 0 END) AS conteo_promociones, SUM(CASE WHEN propietario = ? AND falla = 'servicios'  AND month(creado) = month(now()) THEN 1 ELSE 0 END) AS conteo_servicios, SUM(CASE WHEN propietario = ? AND falla = 'aclaraciones' AND month(creado) = month(now()) AND estatus NOT IN ('Cerrado','Rechazado') THEN 1 ELSE 0 END) AS abiertos_aclaraciones, SUM(CASE WHEN propietario = ? AND falla = 'callback' AND month(creado) = month(now()) AND estatus NOT IN ('Cerrado') THEN 1 ELSE 0 END) AS abiertos_callback, SUM(CASE WHEN propietario = ? AND falla = 'general' AND month(creado) = month(now()) AND estatus NOT IN ('Cerrado') THEN 1 ELSE 0 END) AS abiertos_general, SUM(CASE WHEN propietario = ? AND falla = 'cobertura' AND month(creado) = month(now()) AND estatus NOT IN ('Cerrado') THEN 1 ELSE 0 END) AS abiertos_cobertura, SUM(CASE WHEN propietario = ? AND falla = 'iccid' AND month(creado) = month(now()) AND estatus NOT IN ('Cerrado') THEN 1 ELSE 0 END) AS abiertos_iccid, SUM(CASE WHEN propietario = ? AND falla = 'llamadas' AND month(creado) = month(now()) AND estatus NOT IN ('Cerrado') THEN 1 ELSE 0 END) AS abiertos_llamadas, SUM(CASE WHEN propietario = ? AND falla = 'navegacion' AND month(creado) = month(now()) AND estatus NOT IN ('Cerrado') THEN 1 ELSE 0 END) AS abiertos_navegacion, SUM(CASE WHEN propietario = ? AND falla = 'recargas' AND month(creado) = month(now()) AND estatus NOT IN ('Cerrado') THEN 1 ELSE 0 END) AS abiertos_recargas, SUM(CASE WHEN propietario = ? AND falla = 'promociones' AND month(creado) = month(now()) AND estatus NOT IN ('Cerrado') THEN 1 ELSE 0 END) AS abiertos_promociones, SUM(CASE WHEN propietario = ? AND falla = 'servicios' AND month(creado) = month(now()) AND estatus NOT IN ('Cerrado') THEN 1 ELSE 0 END) AS abiertos_servicios, SUM(CASE WHEN propietario = ? AND falla = 'aclaraciones'  AND estatus = 'Nuevo' THEN 1 ELSE 0 END) AS nuevos_aclaraciones, SUM(CASE WHEN propietario = ? AND falla = 'callback'  AND estatus = 'Nuevo' THEN 1 ELSE 0 END) AS nuevos_callback, SUM(CASE WHEN propietario = ? AND falla = 'general'  AND estatus = 'Nuevo' THEN 1 ELSE 0 END) AS nuevos_general, SUM(CASE WHEN propietario = ? AND falla = 'cobertura'  AND estatus = 'Nuevo' THEN 1 ELSE 0 END) AS nuevos_cobertura, SUM(CASE WHEN propietario = ? AND falla = 'iccid'  AND estatus = 'Nuevo' THEN 1 ELSE 0 END) AS nuevos_iccid, SUM(CASE WHEN propietario = ? AND falla = 'llamadas'  AND estatus = 'Nuevo' THEN 1 ELSE 0 END) AS nuevos_llamadas, SUM(CASE WHEN propietario = ? AND falla = 'navegacion'  AND estatus = 'Nuevo' THEN 1 ELSE 0 END) AS nuevos_navegacion, SUM(CASE WHEN propietario = ? AND falla = 'recargas'  AND estatus = 'Nuevo' THEN 1 ELSE 0 END) AS nuevos_recargas, SUM(CASE WHEN propietario = ? AND falla = 'promociones'  AND estatus = 'Nuevo' THEN 1 ELSE 0 END) AS nuevos_promociones, SUM(CASE WHEN propietario = ? AND falla = 'servicios'  AND estatus = 'Nuevo' THEN 1 ELSE 0 END) AS nuevos_servicios, SUM(CASE WHEN propietario = ? AND falla = 'aclaraciones'  AND estatus = 'En proceso' THEN 1 ELSE 0 END) AS enproceso_aclaraciones, SUM(CASE WHEN propietario = ? AND falla = 'callback'  AND estatus = 'En proceso' THEN 1 ELSE 0 END) AS enproceso_callback, SUM(CASE WHEN propietario = ? AND falla = 'general'  AND estatus = 'En proceso' THEN 1 ELSE 0 END) AS enproceso_general, SUM(CASE WHEN propietario = ? AND falla = 'cobertura'  AND estatus = 'En proceso' THEN 1 ELSE 0 END) AS enproceso_cobertura, SUM(CASE WHEN propietario = ? AND falla = 'iccid'  AND estatus = 'En proceso' THEN 1 ELSE 0 END) AS enproceso_iccid, SUM(CASE WHEN propietario = ? AND falla = 'llamadas'  AND estatus = 'En proceso' THEN 1 ELSE 0 END) AS enproceso_llamadas, SUM(CASE WHEN propietario = ? AND falla = 'navegacion'  AND estatus = 'En proceso' THEN 1 ELSE 0 END) AS enproceso_navegacion, SUM(CASE WHEN propietario = ? AND falla = 'recargas'  AND estatus = 'En proceso' THEN 1 ELSE 0 END) AS enproceso_recargas, SUM(CASE WHEN propietario = ? AND falla = 'promociones'  AND estatus = 'En proceso' THEN 1 ELSE 0 END) AS enproceso_promociones, SUM(CASE WHEN propietario = ? AND falla = 'servicios'  AND estatus = 'En proceso' THEN 1 ELSE 0 END) AS enproceso_servicios, SUM(CASE WHEN propietario = ? AND falla = 'aclaraciones'  AND estatus = 'Pendiente' THEN 1 ELSE 0 END) AS pendientes_aclaraciones, SUM(CASE WHEN propietario = ? AND falla = 'callback'  AND estatus = 'Pendiente' THEN 1 ELSE 0 END) AS pendientes_callback, SUM(CASE WHEN propietario = ? AND falla = 'general'  AND estatus = 'Pendiente' THEN 1 ELSE 0 END) AS pendientes_general, SUM(CASE WHEN propietario = ? AND falla = 'cobertura'  AND estatus = 'Pendiente' THEN 1 ELSE 0 END) AS pendientes_cobertura, SUM(CASE WHEN propietario = ? AND falla = 'iccid'  AND estatus = 'Pendiente' THEN 1 ELSE 0 END) AS pendientes_iccid, SUM(CASE WHEN propietario = ? AND falla = 'llamadas'  AND estatus = 'Pendiente' THEN 1 ELSE 0 END) AS pendientes_llamadas, SUM(CASE WHEN propietario = ? AND falla = 'navegacion'  AND estatus = 'Pendiente' THEN 1 ELSE 0 END) AS pendientes_navegacion, SUM(CASE WHEN propietario = ? AND falla = 'recargas'  AND estatus = 'Pendiente' THEN 1 ELSE 0 END) AS pendientes_recargas, SUM(CASE WHEN propietario = ? AND falla = 'promociones'  AND estatus = 'Pendiente' THEN 1 ELSE 0 END) AS pendientes_promociones, SUM(CASE WHEN propietario = ? AND falla = 'servicios'  AND estatus = 'Pendiente' THEN 1 ELSE 0 END) AS pendientes_servicios, SUM(CASE WHEN propietario = ? AND falla = 'aclaraciones'  AND month(creado) = month(now()) AND estatus = 'Cerrado' THEN 1 ELSE 0 END) AS cerrados_aclaraciones, SUM(CASE WHEN propietario = ? AND falla = 'callback'  AND month(creado) = month(now()) AND estatus = 'Cerrado' THEN 1 ELSE 0 END) AS cerrados_callback, SUM(CASE WHEN propietario = ? AND falla = 'general'  AND month(creado) = month(now()) AND estatus = 'Cerrado' THEN 1 ELSE 0 END) AS cerrados_general, SUM(CASE WHEN propietario = ? AND falla = 'cobertura'  AND month(creado) = month(now()) AND estatus = 'Cerrado' THEN 1 ELSE 0 END) AS cerrados_cobertura, SUM(CASE WHEN propietario = ? AND falla = 'iccid'  AND month(creado) = month(now()) AND estatus = 'Cerrado' THEN 1 ELSE 0 END) AS cerrados_iccid, SUM(CASE WHEN propietario = ? AND falla = 'llamadas'  AND month(creado) = month(now()) AND estatus = 'Cerrado' THEN 1 ELSE 0 END) AS cerrados_llamadas, SUM(CASE WHEN propietario = ? AND falla = 'navegacion'  AND month(creado) = month(now()) AND estatus = 'Cerrado' THEN 1 ELSE 0 END) AS cerrados_navegacion, SUM(CASE WHEN propietario = ? AND falla = 'recargas'  AND month(creado) = month(now()) AND estatus = 'Cerrado' THEN 1 ELSE 0 END) AS cerrados_recargas, SUM(CASE WHEN propietario = ? AND falla = 'promociones'  AND month(creado) = month(now()) AND estatus = 'Cerrado' THEN 1 ELSE 0 END) AS cerrados_promociones, SUM(CASE WHEN propietario = ? AND falla = 'servicios'  AND month(creado) = month(now()) AND estatus = 'Cerrado' THEN 1 ELSE 0 END) AS cerrados_servicios FROM metadatos LIMIT 1";
        var inserts = [
            iduser, iduser, iduser, iduser, iduser, iduser, iduser, iduser, iduser, iduser,
            iduser, iduser, iduser, iduser, iduser, iduser, iduser, iduser, iduser, iduser,
            iduser, iduser, iduser, iduser, iduser, iduser, iduser, iduser, iduser, iduser,
            iduser, iduser, iduser, iduser, iduser, iduser, iduser, iduser, iduser, iduser,
            iduser, iduser, iduser, iduser, iduser, iduser, iduser, iduser, iduser, iduser,
            iduser, iduser, iduser, iduser, iduser, iduser, iduser, iduser, iduser, iduser,
            iduser
        ];
        query = mysql.format(query,inserts);
        connection.getConnection(function(err,conn){
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                res.send(results);
            });
            conn.release();
        });
        
    });

    app.post('/get_maintabledata', middleware.requireLogin, function (req, res) {
        var filtro = req.body.filtro;
        switch (filtro) {


            case 'global':
                //todas las capturas que no esten cerradas y las cerradas que sean del mes
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  (m.estatus NOT IN ('Cerrado','Rechazado')) order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;

            //----------------------------------------------------
            case 'aclaraciones':
                //todas las capturas que que no esten cerradas y las cerradas del mes con estatus especifico
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where(month(m.creado) = month(now()) AND m.estatus IN('Cerrado','Rechazado')  AND m.falla = 'aclaraciones') OR (m.estatus NOT IN('Cerrado','Rechazado')) AND falla = 'aclaraciones' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'callback':
                //todas las capturas que que no esten cerradas y las cerradas del mes con estatus especifico 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where(month(m.creado) = month(now()) AND m.estatus IN('Cerrado','Rechazado')  AND m.falla = 'callback') OR(m.estatus NOT IN('Cerrado','Rechazado')) AND falla = 'callback' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'general':
                //todas las capturas que que no esten cerradas y las cerradas del mes con estatus especifico 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where(month(m.creado) = month(now()) AND m.estatus IN('Cerrado','Rechazado')  AND m.falla = 'general') OR(m.estatus NOT IN('Cerrado','Rechazado')) AND falla = 'general' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'cobertura':
                //todas las capturas que que no esten cerradas y las cerradas del mes con estatus especifico 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where(month(m.creado) = month(now()) AND m.estatus IN('Cerrado','Rechazado')  AND m.falla = 'cobertura') OR(m.estatus NOT IN('Cerrado','Rechazado')) AND falla = 'cobertura' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'iccid':
                //todas las capturas que que no esten cerradas y las cerradas del mes con estatus especifico 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where(month(m.creado) = month(now()) AND m.estatus IN('Cerrado','Rechazado')  AND m.falla = 'iccid') OR(m.estatus NOT IN('Cerrado','Rechazado')) AND falla = 'iccid' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'llamadas':
                //todas las capturas que que no esten cerradas y las cerradas del mes con estatus especifico 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where(month(m.creado) = month(now()) AND m.estatus IN('Cerrado','Rechazado')  AND m.falla = 'llamadas') OR(m.estatus NOT IN('Cerrado','Rechazado')) AND falla = 'llamadas' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'navegacion':
                //todas las capturas que que no esten cerradas y las cerradas del mes con estatus especifico 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where(month(m.creado) = month(now()) AND m.estatus IN('Cerrado','Rechazado')  AND m.falla = 'navegacion') OR(m.estatus NOT IN('Cerrado','Rechazado')) AND falla = 'navegacion' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'recargas':
                //todas las capturas que que no esten cerradas y las cerradas del mes con estatus especifico 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where(month(m.creado) = month(now()) AND m.estatus IN('Cerrado','Rechazado')  AND m.falla = 'recargas') OR(m.estatus NOT IN('Cerrado','Rechazado')) AND falla = 'recargas' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'promociones':
                //todas las capturas que que no esten cerradas y las cerradas del mes con estatus especifico 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where(month(m.creado) = month(now()) AND m.estatus IN('Cerrado','Rechazado')  AND m.falla = 'promociones') OR(m.estatus NOT IN('Cerrado','Rechazado')) AND falla = 'promociones' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'servicios':
                //todas las capturas que que no esten cerradas y las cerradas del mes con estatus especifico 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where(month(m.creado) = month(now()) AND m.estatus IN('Cerrado','Rechazado')  AND m.falla = 'servicios') OR(m.estatus NOT IN('Cerrado','Rechazado')) AND falla = 'servicios' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;


            //----------------------------------------------------
            //----------------------------------------------------
            //----------------------------------------------------
            case 'abiertos_aclaraciones':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where (m.estatus NOT IN ('Cerrado','Rechazado')) AND m.falla =  'aclaraciones' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'nuevos_aclaraciones':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'Nuevo' AND m.falla = 'aclaraciones' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'enproceso_aclaraciones':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'En proceso' AND m.falla = 'aclaraciones' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'pendientes_aclaraciones':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'Pendiente' AND m.falla = 'aclaraciones' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'cerrados_aclaraciones':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'Cerrado' AND m.falla = 'aclaraciones' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;

            //----------------------------------------------------
            //----------------------------------------------------
            //----------------------------------------------------
            case 'abiertos_general':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where (m.estatus NOT IN ('Cerrado','Rechazado')) AND m.falla =  'general' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'nuevos_general':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'Nuevo' AND m.falla = 'general' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'enproceso_general':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'En proceso' AND m.falla = 'general' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'pendientes_general':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'Pendiente' AND m.falla = 'general' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'cerrados_general':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'Cerrado' AND m.falla = 'general' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;

            //----------------------------------------------------
            //----------------------------------------------------
            //----------------------------------------------------
            case 'abiertos_servicios':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where (m.estatus NOT IN ('Cerrado','Rechazado')) AND m.falla =  'servicios' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'nuevos_servicios':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'Nuevo' AND m.falla = 'servicios' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'enproceso_servicios':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'En proceso' AND m.falla = 'servicios' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'pendientes_servicios':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'Pendiente' AND m.falla = 'servicios' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'cerrados_servicios':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'Cerrado' AND m.falla = 'servicios' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;

            //----------------------------------------------------
            //----------------------------------------------------
            //----------------------------------------------------
            case 'abiertos_callback':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where (m.estatus NOT IN ('Cerrado','Rechazado')) AND m.falla =  'callback' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'nuevos_callback':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'Nuevo' AND m.falla = 'callback' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'enproceso_callback':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'En proceso' AND m.falla = 'callback' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'pendientes_callback':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'Pendiente' AND m.falla = 'callback' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'cerrados_callback':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'Cerrado' AND m.falla = 'callback' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;

            //----------------------------------------------------
            //----------------------------------------------------
            //----------------------------------------------------
            case 'abiertos_cobertura':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where (m.estatus NOT IN ('Cerrado','Rechazado')) AND m.falla =  'cobertura' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'nuevos_cobertura':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'Nuevo' AND m.falla = 'cobertura' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'enproceso_cobertura':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'En proceso' AND m.falla = 'cobertura' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'pendientes_cobertura':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'Pendiente' AND m.falla = 'cobertura' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'cerrados_cobertura':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'Cerrado' AND m.falla = 'cobertura' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;

            //----------------------------------------------------
            //----------------------------------------------------
            //----------------------------------------------------
            case 'abiertos_iccid':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where (m.estatus NOT IN ('Cerrado','Rechazado')) AND m.falla =  'iccid' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'nuevos_iccid':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'Nuevo' AND m.falla = 'iccid' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'enproceso_iccid':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'En proceso' AND m.falla = 'iccid' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'pendientes_iccid':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'Pendiente' AND m.falla = 'iccid' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'cerrados_iccid':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'Cerrado' AND m.falla = 'iccid' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;

            //----------------------------------------------------
            //----------------------------------------------------
            //----------------------------------------------------
            case 'abiertos_navegacion':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where (m.estatus NOT IN ('Cerrado','Rechazado')) AND m.falla =  'navegacion' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'nuevos_navegacion':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'Nuevo' AND m.falla = 'navegacion' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'enproceso_navegacion':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'En proceso' AND m.falla = 'navegacion' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'pendientes_navegacion':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'Pendiente' AND m.falla = 'navegacion' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'cerrados_navegacion':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'Cerrado' AND m.falla = 'navegacion' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;

            //----------------------------------------------------
            //----------------------------------------------------
            //----------------------------------------------------
            case 'abiertos_recargas':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where (m.estatus NOT IN ('Cerrado','Rechazado')) AND m.falla =  'recargas' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'nuevos_recargas':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'Nuevo' AND m.falla = 'recargas' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'enproceso_recargas':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'En proceso' AND m.falla = 'recargas' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'pendientes_recargas':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'Pendiente' AND m.falla = 'recargas' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'cerrados_recargas':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'Cerrado' AND m.falla = 'recargas' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;

            //----------------------------------------------------
            //----------------------------------------------------
            //----------------------------------------------------
            case 'abiertos_llamadas':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where (m.estatus NOT IN ('Cerrado','Rechazado')) AND m.falla =  'llamadas' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'nuevos_llamadas':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'Nuevo' AND m.falla = 'llamadas' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'enproceso_llamadas':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'En proceso' AND m.falla = 'llamadas' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'pendientes_llamadas':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'Pendiente' AND m.falla = 'llamadas' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'cerrados_llamadas':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'Cerrado' AND m.falla = 'llamadas' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;

            //----------------------------------------------------
            //----------------------------------------------------
            //----------------------------------------------------
            case 'abiertos_promociones':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where (m.estatus NOT IN ('Cerrado','Rechazado')) AND m.falla =  'promociones' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'nuevos_promociones':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'Nuevo' AND m.falla = 'promociones' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'enproceso_promociones':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'En proceso' AND m.falla = 'promociones' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'pendientes_promociones':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'Pendiente' AND m.falla = 'promociones' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;
            case 'cerrados_promociones':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.rechazado_time, m.solucionado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where m.estatus = 'Cerrado' AND m.falla = 'promociones' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                break;

        }

        connection.getConnection(function (err, conn) {
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                res.send(results);
            });
            conn.release();
        });
        
    });

    app.post('/get_maintabledata_propios', middleware.requireLogin, function (req, res) {
        var filtro = req.body.filtro;
        var iduser = req.body.iduser;
        switch (filtro) {


            case 'global':
                //todas las capturas que no esten cerradas y las cerradas que sean del mes
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser WHERE    (m.estatus NOT IN ('Cerrado','Rechazado') AND m.propietario = ?) order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";

                var inserts = [iduser, iduser];
                query = mysql.format(query, inserts);
                break;

            //----------------------------------------------------
            case 'aclaraciones':
                //todas las capturas que que no esten cerradas y las cerradas del mes con estatus especifico
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser WHERE  (month(m.creado) = month(now()) AND m.estatus IN('Cerrado') AND m.propietario = ?  AND m.falla = 'aclaraciones') OR (m.estatus NOT IN('Cerrado') AND m.propietario = ? )  AND falla = 'aclaraciones' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";

                var inserts = [iduser, iduser];
                query = mysql.format(query, inserts);
                

                break;
            case 'callback':
                //todas las capturas que que no esten cerradas y las cerradas del mes con estatus especifico 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser WHERE (month(m.creado) = month(now()) AND m.estatus IN('Cerrado') AND m.propietario = ? AND m.falla = 'callback') OR(m.estatus NOT IN('Cerrado') AND m.propietario = ?) AND falla = 'callback' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser, iduser];
                query = mysql.format(query, inserts);
                
                break;
            case 'general':
                //todas las capturas que que no esten cerradas y las cerradas del mes con estatus especifico 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser WHERE (month(m.creado) = month(now()) AND m.estatus IN('Cerrado') AND m.propietario = ? AND m.falla = 'general') OR(m.estatus NOT IN('Cerrado') AND m.propietario = ?) AND falla = 'general' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser, iduser];
                query = mysql.format(query, inserts);
                
                break;
            case 'cobertura':
                //todas las capturas que que no esten cerradas y las cerradas del mes con estatus especifico 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser WHERE (month(m.creado) = month(now()) AND m.estatus IN('Cerrado') AND m.propietario = ? AND m.falla = 'cobertura') OR(m.estatus NOT IN('Cerrado') AND m.propietario = ?) AND falla = 'cobertura' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser, iduser];
                query = mysql.format(query, inserts);
                
                break;
            case 'iccid':
                //todas las capturas que que no esten cerradas y las cerradas del mes con estatus especifico 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser WHERE (month(m.creado) = month(now()) AND m.estatus IN('Cerrado') AND m.propietario = ? AND m.falla = 'iccid') OR(m.estatus NOT IN('Cerrado') AND m.propietario = ?) AND falla = 'iccid' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser, iduser];
                query = mysql.format(query, inserts);
                
                break;
            case 'llamadas':
                //todas las capturas que que no esten cerradas y las cerradas del mes con estatus especifico 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser WHERE (month(m.creado) = month(now()) AND m.estatus IN('Cerrado') AND m.propietario = ? AND m.falla = 'llamadas') OR(m.estatus NOT IN('Cerrado') AND m.propietario = ?) AND falla = 'llamadas' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser, iduser];
                query = mysql.format(query, inserts);
                
                break;
            case 'navegacion':
                //todas las capturas que que no esten cerradas y las cerradas del mes con estatus especifico 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser WHERE (month(m.creado) = month(now()) AND m.estatus IN('Cerrado') AND m.propietario = ? AND m.falla = 'navegacion') OR(m.estatus NOT IN('Cerrado') AND m.propietario = ?) AND falla = 'navegacion' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser, iduser];
                query = mysql.format(query, inserts);
                
                break;
            case 'recargas':
                //todas las capturas que que no esten cerradas y las cerradas del mes con estatus especifico 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser WHERE (month(m.creado) = month(now()) AND m.estatus IN('Cerrado') AND m.propietario = ? AND m.falla = 'recargas') OR(m.estatus NOT IN('Cerrado') AND m.propietario = ?) AND falla = 'recargas' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser, iduser];
                query = mysql.format(query, inserts);
                
                break;
            case 'promociones':
                //todas las capturas que que no esten cerradas y las cerradas del mes con estatus especifico 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser WHERE (month(m.creado) = month(now()) AND m.estatus IN('Cerrado') AND m.propietario = ? AND m.falla = 'promociones') OR(m.estatus NOT IN('Cerrado') AND m.propietario = ?) AND falla = 'promociones' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser, iduser];
                query = mysql.format(query, inserts);
                
                break;
            case 'servicios':
                //todas las capturas que que no esten cerradas y las cerradas del mes con estatus especifico 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser WHERE (month(m.creado) = month(now()) AND m.estatus IN('Cerrado') AND m.propietario = ? AND m.falla = 'servicios') OR(m.estatus NOT IN('Cerrado') AND m.propietario = ?) AND falla = 'servicios' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser, iduser];
                query = mysql.format(query, inserts);
                
                break;


            //----------------------------------------------------
            //----------------------------------------------------
            //----------------------------------------------------
            case 'abiertos_aclaraciones':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  (m.estatus NOT IN ('Cerrado','Rechazado')) AND m.falla =  'aclaraciones' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'nuevos_aclaraciones':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'Nuevo' AND m.falla = 'aclaraciones' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'enproceso_aclaraciones':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'En proceso' AND m.falla = 'aclaraciones' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'pendientes_aclaraciones':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'Pendiente' AND m.falla = 'aclaraciones' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'cerrados_aclaraciones':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'Cerrado' AND m.falla = 'aclaraciones' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;

            //----------------------------------------------------
            //----------------------------------------------------
            //----------------------------------------------------
            case 'abiertos_general':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  (m.estatus NOT IN ('Cerrado','Rechazado')) AND m.falla =  'general' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'nuevos_general':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'Nuevo' AND m.falla = 'general' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'enproceso_general':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'En proceso' AND m.falla = 'general' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'pendientes_general':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'Pendiente' AND m.falla = 'general' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'cerrados_general':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'Cerrado' AND m.falla = 'general' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;

            //----------------------------------------------------
            //----------------------------------------------------
            //----------------------------------------------------
            case 'abiertos_servicios':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  (m.estatus NOT IN ('Cerrado','Rechazado')) AND m.falla =  'servicios' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'nuevos_servicios':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'Nuevo' AND m.falla = 'servicios' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'enproceso_servicios':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'En proceso' AND m.falla = 'servicios' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'pendientes_servicios':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'Pendiente' AND m.falla = 'servicios' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'cerrados_servicios':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'Cerrado' AND m.falla = 'servicios' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;

            //----------------------------------------------------
            //----------------------------------------------------
            //----------------------------------------------------
            case 'abiertos_callback':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  (m.estatus NOT IN ('Cerrado','Rechazado')) AND m.falla =  'callback' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'nuevos_callback':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'Nuevo' AND m.falla = 'callback' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'enproceso_callback':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'En proceso' AND m.falla = 'callback' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'pendientes_callback':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'Pendiente' AND m.falla = 'callback' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'cerrados_callback':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'Cerrado' AND m.falla = 'callback' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;

            //----------------------------------------------------
            //----------------------------------------------------
            //----------------------------------------------------
            case 'abiertos_cobertura':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  (m.estatus NOT IN ('Cerrado','Rechazado')) AND m.falla =  'cobertura' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'nuevos_cobertura':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'Nuevo' AND m.falla = 'cobertura' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'enproceso_cobertura':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'En proceso' AND m.falla = 'cobertura' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'pendientes_cobertura':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'Pendiente' AND m.falla = 'cobertura' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'cerrados_cobertura':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'Cerrado' AND m.falla = 'cobertura' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;

            //----------------------------------------------------
            //----------------------------------------------------
            //----------------------------------------------------
            case 'abiertos_iccid':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  (m.estatus NOT IN ('Cerrado','Rechazado')) AND m.falla =  'iccid' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'nuevos_iccid':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'Nuevo' AND m.falla = 'iccid' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'enproceso_iccid':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'En proceso' AND m.falla = 'iccid' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'pendientes_iccid':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'Pendiente' AND m.falla = 'iccid' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'cerrados_iccid':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'Cerrado' AND m.falla = 'iccid' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;

            //----------------------------------------------------
            //----------------------------------------------------
            //----------------------------------------------------
            case 'abiertos_navegacion':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  (m.estatus NOT IN ('Cerrado','Rechazado')) AND m.falla =  'navegacion' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'nuevos_navegacion':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'Nuevo' AND m.falla = 'navegacion' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'enproceso_navegacion':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'En proceso' AND m.falla = 'navegacion' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'pendientes_navegacion':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'Pendiente' AND m.falla = 'navegacion' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'cerrados_navegacion':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'Cerrado' AND m.falla = 'navegacion' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;

            //----------------------------------------------------
            //----------------------------------------------------
            //----------------------------------------------------
            case 'abiertos_recargas':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  (m.estatus NOT IN ('Cerrado','Rechazado')) AND m.falla =  'recargas' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'nuevos_recargas':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'Nuevo' AND m.falla = 'recargas' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'enproceso_recargas':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'En proceso' AND m.falla = 'recargas' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'pendientes_recargas':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'Pendiente' AND m.falla = 'recargas' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'cerrados_recargas':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'Cerrado' AND m.falla = 'recargas' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;

            //----------------------------------------------------
            //----------------------------------------------------
            //----------------------------------------------------
            case 'abiertos_llamadas':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  (m.estatus NOT IN ('Cerrado','Rechazado')) AND m.falla =  'llamadas' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'nuevos_llamadas':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'Nuevo' AND m.falla = 'llamadas' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'enproceso_llamadas':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'En proceso' AND m.falla = 'llamadas' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'pendientes_llamadas':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'Pendiente' AND m.falla = 'llamadas' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'cerrados_llamadas':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'Cerrado' AND m.falla = 'llamadas' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;

            //----------------------------------------------------
            //----------------------------------------------------
            //----------------------------------------------------
            case 'abiertos_promociones':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  (m.estatus NOT IN ('Cerrado','Rechazado')) AND m.falla =  'promociones' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'nuevos_promociones':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'Nuevo' AND m.falla = 'promociones' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'enproceso_promociones':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'En proceso' AND m.falla = 'promociones' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'pendientes_promociones':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'Pendiente' AND m.falla = 'promociones' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;
            case 'cerrados_promociones':
                //todas las capturas que 
                var query = "select m.enproceso_time, m.solucionado_time, m.rechazado_time, m.cerrado, m.creado, m.idmetadatos, u.nombre as asesor, m.telefono, m.ultseguimiento, m.falla, m.estatus, us.nombre as propietario from metadatos m left join users u on m.iduser = u.iduser left join users us on m.propietario = us.iduser where  m.propietario = ?  AND  m.estatus = 'Cerrado' AND m.falla = 'promociones' order by (	case		        when m.estatus = 'En proceso'  then m.enproceso_time             when m.estatus = 'Nuevo' then m.creado        when m.estatus = 'Solucionado' then m.solucionado_time    end) asc";
                var inserts = [iduser];
                query = mysql.format(query, inserts);
                break;

        }

        connection.getConnection(function (err, conn) {
            conn.query(query, function (error, results, field) {
                if (error) throw error;
                res.send(results);
            });
            conn.release();
        });
        
    });

    app.post('/actualizar_estatuscaptura', middleware.requireLogin, function (req, res) {
        var nuevo_estatus = req.body.nuevo_estatus;
        var nuevo_comentario = req.body.nuevo_comentario;
        var nuevo_codificacion = req.body.nuevo_codificacion;
        var folio_bit = req.body.folio_bit;
        var folio_cpd = req.body.folio_cpd;
        var folio_usd = req.body.folio_usd;
        var folio_reporsis = req.body.folio_reporsis;
        var iduser = req.body.iduser;
        var idmetadatos = req.body.idmetadatos;

        if (nuevo_estatus == "Cerrado") {
            var query_metadatos = "UPDATE metadatos SET estatus = ?, ultseguimiento = now(), cerrado = now(), tipificacion = ?, bit = ?, cpd = ?, usd = ?, reporsis = ? WHERE idmetadatos = ?";
        } else if (nuevo_estatus == "En proceso") {
            var query_metadatos = "UPDATE metadatos SET estatus = ?, ultseguimiento = now(), enproceso_time = now(), tipificacion = ?, bit = ?, cpd = ?, usd = ?, reporsis = ? WHERE idmetadatos = ?";
        } else if (nuevo_estatus == "Solucionado") {
            var query_metadatos = "UPDATE metadatos SET estatus = ?, ultseguimiento = now(), solucionado_time = now(), tipificacion = ?, bit = ?, cpd = ?, usd = ?, reporsis = ? WHERE idmetadatos = ?";
        } else if (nuevo_estatus == "Rechazado") {
            var query_metadatos = "UPDATE metadatos SET estatus = ?, ultseguimiento = now(), rechazado_time = now(), tipificacion = ?, bit = ?, cpd = ?, usd = ?, reporsis = ? WHERE idmetadatos = ?";
        } 

        connection.getConnection(function (err, pool) {
            pool.beginTransaction(function (err) {
                if (err) throw err;

                var inserts = [nuevo_estatus, nuevo_codificacion, folio_bit, folio_cpd, folio_usd, folio_reporsis, idmetadatos];
                var query = mysql.format(query_metadatos, inserts);

                pool.query(query, function (err, result) {
                    if (err) {
                        pool.rollback(function () {
                            throw err;
                        });
                    }


                    //siguiente query

                    var query = "INSERT INTO observaciones(idmetadatos,observacion,noc,estatus) VALUES(?,?,?,?)";
                    var inserts = [idmetadatos, nuevo_comentario, iduser, nuevo_estatus];
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
                            console.log('Nuevo comentario de seguimiento de captura ID: ' + idmetadatos);
                            io.emit('new', 'nuevo_seguimiento');
                            res.send(nuevo_estatus);

                        });//fin del commit
                    });//fin del query 2

                });//fin de la query 1
            }); //fin del begin transaction
            pool.release();
        }); //fin del get connection
    });

    app.post('/set_comentariolibre', middleware.requireLogin, function (req, res) {
        var nuevo_estatus = req.body.nuevo_estatus;
        var nuevo_comentario = req.body.nuevo_comentario;
        var nuevo_codificacion = req.body.nuevo_codificacion;
        var folio_bit = req.body.folio_bit;
        var folio_cpd = req.body.folio_cpd;
        var folio_usd = req.body.folio_usd;
        var folio_reporsis = req.body.folio_reporsis;
        var iduser = req.body.iduser;
        var idmetadatos = req.body.idmetadatos;

        var query_metadatos = "UPDATE metadatos SET estatus = ?, ultseguimiento = now(), tipificacion = ?, bit = ?, cpd = ?, usd = ?, reporsis = ? WHERE idmetadatos = ?";

        connection.getConnection(function (err, pool) {
            pool.beginTransaction(function (err) {
                if (err) throw err;

                var inserts = [nuevo_estatus, nuevo_codificacion, folio_bit, folio_cpd, folio_usd, folio_reporsis, idmetadatos];
                var query = mysql.format(query_metadatos, inserts);

                pool.query(query, function (err, result) {
                    if (err) {
                        pool.rollback(function () {
                            throw err;
                        });
                    }


                    //siguiente query

                    var query = "INSERT INTO observaciones(idmetadatos,observacion,noc,estatus) VALUES(?,?,?,?)";
                    var inserts = [idmetadatos, nuevo_comentario, iduser, nuevo_estatus];
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
                            console.log('Nuevo comentario de seguimiento de captura ID: ' + idmetadatos);
                            io.emit('new', 'nuevo_seguimiento');
                            res.send(nuevo_estatus);

                        });//fin del commit
                    });//fin del query 2

                });//fin de la query 1
            }); //fin del begin transaction
            pool.release();
        }); //fin del get connection
    });


    //INGRESO ESTATUS DE PRIMER BLOQUEO
    app.post('/setPrimerbloqueo', middleware.requireLogin,function(req,res){
        var estatus = req.body.estatus;
        var idmetadatos = req.body.idmetadatos;
        var iduser = req.body.iduser;

        var nuevo_estatus = estatus;
        var nuevo_comentario = "Seguimiento iniciado";
        
        if(estatus == "En proceso"){
            var query_metadatos = "UPDATE metadatos SET estatus = 'En proceso', enproceso_time = now() WHERE idmetadatos = ? ";
            connection.getConnection(function (err, pool) {
                pool.beginTransaction(function (err) {
                    if (err) throw err;

                    var inserts = [idmetadatos];
                    var query = mysql.format(query_metadatos, inserts);

                    pool.query(query, function (err, result) {
                        if (err) {
                            pool.rollback(function () {
                                throw err;
                            });
                        }


                        //siguiente query

                        var query = "INSERT INTO observaciones(idmetadatos,observacion,noc,estatus) VALUES(?,?,?,?)";
                        var inserts = [idmetadatos, nuevo_comentario, iduser, nuevo_estatus];
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
                                console.log('Primer bloqueo en captura ID: ' + idmetadatos);
                                io.emit('new', 'nuevo_seguimiento');
                                res.send(nuevo_estatus);

                            });//fin del commit
                        });//fin del query 2

                    });//fin de la query 1
                }); //fin del begin transaction
                pool.release();
            }); //fin del get connection
        }else{
            res.send("Error, no se puede iniciar el seguimiento");
        }

        //ingresar timestamp y establecer nuevo estatus como "En espera"


        
    });

}// fin del archivo