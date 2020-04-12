middleware = require('./middlewares');
var mysql = require('mysql');
var connection = require('./db');
var connectionTMK = require('./db_tmk');
var moment = require('moment');
var nodemailer = require('nodemailer');
var cron = require('node-cron');
let converter = require('json-2-csv');

module.exports = function(app,io){



    let envio_email = 'NO';
    let envio_summary = 'NO'
    








    app.get('/run_mailing',middleware.requireLogin,function(req,res){
        run_mailing();
        res.send('ok')
    });

    app.get('/run_summary',middleware.requireLogin,function(req,res){
        run_summary();
        res.send('ok')
    });










    //10,14,18,21
    cron.schedule('0 10,14,18,21 * * *', () => { 
        if(envio_email == 'SI'){
            run_mailing();
        }
    });

    cron.schedule('0 7 * * 1', () => { 
        if(envio_summary == 'SI'){
            run_summary();
        }
    });












    //conteo por tipo de falla, y estatus de 
    //reporte global cada lunes - de lunes a domingo
    let run_mailing = () => {
        //obtener reporte correspondiente
        //enviar respuesta por mail

        //obtener fecha actual
        let current_date = moment().format('YYYY-MM-DD');

        const get_falla = () => {
            return new Promise((resolve,reject)=>{
                var query = `SELECT  falla ,count(*) as cantidad FROM Explora264.metadatos where date(creado) = date('${current_date}') group by falla order by falla desc;`;
                //query = mysql.format(query,inserts);
                connection.getConnection(function (err, conn) {
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

        const get_estatus = () => {
            return new Promise((resolve,reject)=>{
                var query = `SELECT  estatus ,count(*) as cantidad FROM Explora264.metadatos where date(creado) = date('${current_date}') group by estatus order by estatus desc;`;
                //query = mysql.format(query,inserts);
                connection.getConnection(function (err, conn) {
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

        const get_general = () => {
            return new Promise((resolve,reject)=>{
                var query = `SELECT  falla,estatus ,count(*) as cantidad FROM Explora264.metadatos where date(creado) = date('${current_date}') group by falla,estatus order by falla desc;`;
                //query = mysql.format(query,inserts);
                connection.getConnection(function (err, conn) {
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

        const get_estatus_mes = () => {
            return new Promise((resolve,reject)=>{
                var query = `SELECT 
                                estatus , count(*) as cantidad
                            FROM
                                metadatos 
                            WHERE 
                                MONTH(creado) = MONTH(NOW())
                            AND YEAR(creado) = YEAR(NOW()) group by estatus`;
                //query = mysql.format(query,inserts);
                connection.getConnection(function (err, conn) {
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

        const get_productividad = () => {
            return new Promise((resolve,reject)=>{
                var query = `SELECT 
                                IFNULL(u.nombre, 'No asignado') AS asesor,
                                SUM(CASE
                                    WHEN
                                        m.estatus = 'Nuevo'
                                            AND MONTH(m.creado) = MONTH(NOW())
                                            AND YEAR(m.creado) = YEAR(NOW())
                                    THEN
                                        1
                                    ELSE 0
                                END) AS nuevos,
                                SUM(CASE
                                    WHEN
                                        m.estatus = 'En proceso'
                                            AND MONTH(m.creado) = MONTH(NOW())
                                            AND YEAR(m.creado) = YEAR(NOW())
                                    THEN
                                        1
                                    ELSE 0
                                END) AS enproceso,
                                SUM(CASE
                                    WHEN
                                        m.estatus IN ('Pendiente' , 'Solucionado')
                                            AND MONTH(m.creado) = MONTH(NOW())
                                            AND YEAR(m.creado) = YEAR(NOW())
                                    THEN
                                        1
                                    ELSE 0
                                END) AS pendientes,
                                SUM(CASE
                                    WHEN
                                        m.estatus IN ('Rechazado')
                                            AND MONTH(m.creado) = MONTH(NOW())
                                            AND YEAR(m.creado) = YEAR(NOW())
                                    THEN
                                        1
                                    ELSE 0
                                END) AS rechazados,
                                SUM(CASE
                                    WHEN
                                        m.estatus IN ('Cerrado')
                                            AND MONTH(m.creado) = MONTH(NOW())
                                            AND YEAR(m.creado) = YEAR(NOW())
                                    THEN
                                        1
                                    ELSE 0
                                END) AS cerrados,
                                SUM(CASE
                                    WHEN
                                        m.estatus IN ('Cerrado' , 'Nuevo',
                                            'En proceso',
                                            'Pendiente',
                                            'Solucionado',
                                            'Rechazado')
                                            AND MONTH(m.creado) = MONTH(NOW())
                                            AND YEAR(m.creado) = YEAR(NOW())
                                    THEN
                                        1
                                    ELSE 0
                                END) AS total
                            FROM
                                metadatos m
                                    LEFT JOIN
                                users u ON m.propietario = u.iduser
                            WHERE
                                u.estatus = 'activo' AND u.rol = 'noc'
                            GROUP BY u.nombre
                            ORDER BY u.nombre`;
                //query = mysql.format(query,inserts);
                connection.getConnection(function (err, conn) {
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

        const get_string = (estatus,falla,general,mes,productividad) => {
            return new Promise((resolve,reject)=>{
                let parte1 = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/> <title>Reporte *264</title> <meta name="viewport" content="width=device-width, initial-scale=1.0"/></head><body style="margin: 0; padding: 0;"> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="font-family: Arial, sans-serif, 'Open Sans'"> <tr> <td bgcolor="#fff" style='font-weight:bold;text-align:center;padding: 30px'> SEGUIMIENTOS DEL DIA NOCS *264 Explora Comunicaciones </td></tr><tr> <td bgcolor="#3F4658" style='text-align:left;padding: 30px;color:white'> Por estatus - Día actual <table width='95%' align="center" border="1" cellpadding="0" cellspacing="0" style='font-size:13px;margin-top:10px'> <tr> <td>Estatus</td><td>Cantidad</td></tr>`;
                let parte2 = `</table> </td></tr><tr> <td bgcolor="#fff" style='padding: 30px;text-align:left'> Por tipo de falla - Día actual <table width='95%' align="center" border="1" cellpadding="0" cellspacing="0" style='font-size:13px;margin-top:10px'> <tr> <td>Estatus</td><td>Cantidad</td></tr>`;
                let parte2_2 = `</table> </td></tr><tr> <td bgcolor="#3F4658" style='padding: 30px;text-align:left;color:white'> Por estatus - Mensual <table width='95%' align="center" border="1" cellpadding="0" cellspacing="0" style='font-size:13px;margin-top:10px'> <tr> <td>Estatus</td><td>Cantidad</td></tr>`;
                let parte3 = `</table> </td></tr><tr> <td bgcolor="#fff" style='text-align:left;padding: 30px'> General - Día actual <table width='95%' align="center" border="1" cellpadding="0" cellspacing="0" style='font-size:13px;margin-top:10px'> <tr> <td>Falla</td><td>Estatus</td><td>Cantidad</td></tr>`;
                let parte4 = ` </table> </td></tr><tr> <td bgcolor="#3F4658" style='text-align:left;padding: 30px;color:white'> Productividad - Mensual <table width='95%' align="center" border="1" cellpadding="0" cellspacing="0" style='font-size:13px;margin-top:10px'> <tr> <td>Asesor</td><td>Nuevos</td><td>En proceso</td><td>Pendientes</td><td>Rechazados</td><td>Cerrados</td><td>Total</td></tr>`;
                let parte5 = ` </table> </td></tr><tr> <td bgcolor="#3F4658" style='text-align:left;padding: 1px;color:white'> </td></tr></table></body></html>`;











                //recorrer los resultados y guardarlos en aux_text y concatenarlos despues de cada parte, al final concatenar todas las partes.
                let aux_text = "";
                for(row of estatus){
                    aux_text += `<tr>
                                    <td>${row.estatus}</td>
                                    <td>${row.cantidad}</td>
                                </tr>`;
                }

                parte1 += aux_text;


                aux_text = "";
                for(row of falla){
                    aux_text += `<tr>
                                    <td>${row.falla}</td>
                                    <td>${row.cantidad}</td>
                                </tr>`;
                }

                parte2 += aux_text;

                aux_text = "";
                for(row of mes){
                    aux_text += `<tr>
                                    <td>${row.estatus}</td>
                                    <td>${row.cantidad}</td>
                                </tr>`;
                }

                parte2_2 += aux_text;

                aux_text = "";
                for(row of general){
                    aux_text += `<tr>
                                    <td>${row.falla}</td>
                                    <td>${row.estatus}</td>
                                    <td>${row.cantidad}</td>
                                </tr>`;
                }

                parte3 += aux_text;

                aux_text = "";
                for(row of productividad){
                    aux_text += `<tr>
                                    <td>${row.asesor}</td>
                                    <td>${row.nuevos}</td>
                                    <td>${row.enproceso}</td>
                                    <td>${row.pendientes}</td>
                                    <td>${row.rechazados}</td>
                                    <td>${row.cerrados}</td>
                                    <td>${row.total}</td>
                                </tr>`;
                }

                parte4 += aux_text;

                //CONCATENAMOS TODO
                parte1 = parte1 + parte2 + parte2_2 + parte3 + parte4 + parte5;

                resolve(parte1)
            });
        }

        const send_mail = (buffer_response) => {
            return new Promise((resolve,reject)=>{
                var transporter = nodemailer.createTransport({
                      service: 'gmail',
                      auth: {
                        user: 'alertas.exploracom@gmail.com',
                        pass: 'unddiev0gels1ngenn1ghtmehr'
                    }
                });

                    var mailOptions = {
                      from: 'alertas.exploracom@gmail.com',
                      to: 'eddie.aguilar@explora-mexico.com.mx',
                      subject: '[NOCS] - REPORTE',
                      html: buffer_response
                      
                    };

                      
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                            reject(error)
                        } else {
                            resolve('ok')
                            console.log('Email sent: ' + info.response);
                        }
                    });
            });
        }

        const run = async () => {
            try{
                let estatus = await get_estatus();
                let falla = await get_falla();
                let general = await get_general();
                let mes = await get_estatus_mes();
                let productividad = await get_productividad();
                let string_text = await get_string(estatus,falla,general,mes,productividad);
                let response_send_mail = await send_mail(string_text);
                 //console.log(string_text) 
            }catch(err){
                console.log(err);
                res.send(err);
            }
        }

        run();
    }



    /*
    const get_estatus = () => {
            return new Promise((resolve,reject)=>{
                var query = "--";
                //query = mysql.format(query,inserts);
                connection.getConnection(function (err, conn) {
                    conn.query(query, function (error, results, field) {
                        if (error){
                            reject(error.sqlMessage)
                        }else{
                            let json2csvCallback = function (err, csv) {
                                if (err) reject(err);
                                resolve(csv);
                            };

                            converter.json2csv(results, json2csvCallback, {
                              prependHeader: true      // removes the generated header of "value1,value2,value3,value4" (in case you don't want it)
                            });
                            
                        }
                    });
                    conn.release();
                });
            });
        }
    */




    let run_summary = () => {
        const get_data = () => {
            return new Promise((resolve,reject)=>{
                
                //calcular fecha actual y restarle 1 para fecha final y restarle 6 para fecha inicial
                let fecha_inicial = moment().subtract(6, "days").format('YYYY-MM-DD');
                let fecha_final = moment().format('YYYY-MM-DD');

                let query = `
                    SELECT * from vista_metadatos where creado between date('${fecha_inicial}') and date('${fecha_final}');
                `;
                let inserts = [];
                query = mysql.format(query,inserts);
                connection.getConnection(function (err, conn) {
                    conn.query(query, function (error, results, field) {
                        if (error){
                            res.send(error.sqlMessage)
                        }else{
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

                            let json2csvCallback = function (err, csv) {
                                if (err) reject(err);
                                resolve(csv);
                            };

                            converter.json2csv(results, json2csvCallback, {
                              prependHeader: true      // removes the generated header of "value1,value2,value3,value4" (in case you don't want it)
                            });
                        }
                    });
                    conn.release();
                });
            });
        }

        const notify = (buffer_response) => {
            return new Promise((resolve,reject)=>{
                    var transporter = nodemailer.createTransport({
                          service: 'gmail',
                          auth: {
                            user: 'alertas.exploracom@gmail.com',
                            pass: 'unddiev0gels1ngenn1ghtmehr'
                        }
                    });

                    var mailOptions = {
                      from: 'alertas.exploracom@gmail.com',
                      to: 'eddie.aguilar@explora-mexico.com.mx',
                      subject: '[NOCS] - REPORTE SEMANAL',
                      text: 'Reporte semanal *264 NOCS',
                      attachments: [{
                        filename: 'reporte.csv',
                        content: buffer_response
                      }]
                      
                    };

                      
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                            reject(error)
                        } else {
                            resolve('ok')
                            console.log('Email sent: ' + info.response);
                        }
                    });
            });
        }

        const run = async () => {
            try{
                let data = await get_data()
                let get_notify = await notify(data);
            }catch(err){
                console.log(err);
                //res.send(err);
            }
        }

        run();
    } 
    
}