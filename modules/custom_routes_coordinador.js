middleware = require('./middlewares');
var mysql = require('mysql');
var connection = require('./db');
var moment = require('moment');


module.exports = function(app,io){

    //LLENA LA TABLA DEL PERFIL DE ANALISTA DE ACUERDO AL STATUS SOLICITADO
    //DEVUELVE LOS DATOS DE ACUERDO A SI EL STATUS SE DEPURA MENSUALMENTE
    //O SI ES PERSISTENTE PARA SU DEBIDO SEGUIMIENTO
    app.post('/getDataForTableAnalista', middleware.requireLogin, function (req, res) {
        var status = req.body.status;

        var statusPorDepurarAlMes = ['Cambio a sinergia','Cancelada por cliente', 'Cancelada/Err.Asesor','Cancelada/Err.Mensajeria','Guia entregada'];

        if(status == 'todos'){
            var data = "select m.created , concat(u.name,' ',u.lastname) as asesor ,s.clientname,s.contact, m.guidenumber,  m.status, m.comment, m.idshipping from metashipping m left join shipping s on m.idshipping = s.idshipping left join user u ON m.iduser = u.iduser where (status not in ('Cambio a sinergia','Cancelada por cliente', 'Cancelada / Err.Asesor','Cancelada / Err.Mensajeria','Guia entregada')) or (status in ('Cambio a sinergia','Cancelada por cliente', 'Cancelada/Err.Asesor','Cancelada/Err.Mensajeria','Guia entregada') AND month(created) = month(now()))";
        } else if (statusPorDepurarAlMes.indexOf(status) == -1){
            var data = 'select m.created , concat(u.name," ",u.lastname) as asesor ,s.clientname,s.contact, m.guidenumber,  m.status, m.comment, m.idshipping from metashipping m left join shipping s on m.idshipping = s.idshipping left join user u ON m.iduser = u.iduser where status = ? ';
        }else{
            var data = 'select m.created , concat(u.name," ",u.lastname) as asesor ,s.clientname,s.contact, m.guidenumber,  m.status, m.comment, m.idshipping from metashipping m left join shipping s on m.idshipping = s.idshipping left join user u ON m.iduser = u.iduser where status = ? AND month(created) = month(now())';
        }

        var response_previsualizacion = []
        var inserts = [status];
        var query = mysql.format(data, inserts);
        connection.query(query, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {

                    'created': moment(element.created).format('D[/]MM[/]YY, H:mm'),
                    'asesor': element.asesor,
                    'cliente': element.clientname,
                    'contacto': element.contact,
                    'guidenumber': element.guidenumber,
                    'status': element.status,
                    'comments': element.comment,
                    'idshipping': element.idshipping,

                }
                response_previsualizacion.push(row);
            });
            res.send(response_previsualizacion);
        });
    });

    //DEVUELVE EL CONTEO POR STATUS PARA LLENAR LOS "BOTONES FILTRO" DEL PERFIL
    //DEL ANALISTA
    app.get('/getDataLabelsCount', middleware.requireLogin, function (req, res) {
        var response_counter = [];
        var query = "SELECT status, count(status) as conteostatus FROM metashipping group by status";
        connection.query(query, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    'status': element.status,
                    'conteostatus': element.conteostatus
                }
                response_counter.push(row);
            });
            res.send(response_counter);
        });
    });

    //--------------------------------------------------------
    //LA RUTA PARA LLENAR EL MODAL PRINCIPAL DEL ANALISTA ESTA EN:
    //custom_routes_asesor.js
    //nombrado '/getDetalleDomicilio' 
    //RECIBE COMO PARAMETRO EL 'idshipping' QUE CORRESPONDE
    //AL ID DE LA CAPTURA A DOMICILIO REALIZADA
    //-------------------------------------------------------

    app.post('/updatedatadomicilio', middleware.requireLogin, function (req, res) {

        //se reciben los parametros del lado del cliente

        //idshipping
        var idshipping = req.body.idshipping;

        //var userLoggedIn = req.body.userLoggedIn;
        var cliente = req.body.cliente;
        var fechaentrega = req.body.fechaentrega;
        var horarioentrega = req.body.horarioentrega;
        var contacto = req.body.contacto;
        var numamigrar = req.body.numamigrar;
        var destino = req.body.destino;
        var direccion = req.body.direccion;
        var colonia = req.body.colonia;
        var referencias = req.body.referencias;
        var folio = req.body.folio;
        var canal = req.body.canal;
        var plan = req.body.plan;
        var tipoactivacion = req.body.tipoactivacion;
        var ctaconsolidar = req.body.ctaconsolidar;
        var email = req.body.email;
        var financiamiento = req.body.financiamiento;
        var equipo = req.body.equipo;
        var imei = req.body.imei;
        var concepto = req.body.concepto;
        var observaciones = req.body.observaciones;
        var statusofrequest = req.body.statusofrequest;

        var factura = req.body.factura;
        var iccid = req.body.iccid;
        var guia = req.body.guia;
        var proveedor = req.body.proveedor;
        var activacion = req.body.activacion;
        var envio = req.body.envio;
        var entregado = req.body.entregado;
        var observacionanalista =  req.body.observacionanalista;

        if (fechaentrega == '') { fechaentrega = null }
        if (envio == '') { envio = null }
        if (activacion == '') { activacion = null }
        if (entregado == '') { entregado = null }

         

        connection.getConnection(function (err, pool) {
            pool.beginTransaction(function (err) {
                if (err) throw err;
                var query_metashipping = "UPDATE metashipping SET status = ?, updatedstatus = now(), provider = ?, guidenumber = ?, comment = ?, datewithprovider = ?, iccid = ?, invoice = ?, activation_date = ?, delivered_date = ? WHERE idshipping = ?";
                var inserts_metashipping = [statusofrequest,proveedor,guia,observacionanalista,envio,iccid,factura,activacion,entregado,idshipping];
                var query_insert_metashipping = mysql.format(query_metashipping, inserts_metashipping);

                pool.query(query_insert_metashipping, function (err, result) {
                    if (err) {
                        pool.rollback(function () {
                            throw err;
                        });
                    }

                    //siguiente query

                    var query_datashipping = "UPDATE datashipping SET sisact = ?,channel = ?,idplan = ?,type = ?,account = ?,email = ?,fineq = ?,phone = ?,imei = ?,concept = ?,additionalcomment = ? WHERE idshipping = ?";
                    var inserts_datashipping = [folio, canal, plan, tipoactivacion, ctaconsolidar, email, financiamiento, equipo, imei, concepto, observaciones, idshipping];
                    var query_insert_datashipping = mysql.format(query_datashipping, inserts_datashipping);

                    pool.query(query_insert_datashipping, function (err, result) {
                        if (err) {
                            pool.rollback(function () {
                                throw err;
                            });//fin del throw err
                        }//fin del if

                        var query_shipping = "UPDATE shipping SET clientname = ?,scheduled = ?,time = ?,contact = ?,mainline = ?,city = ?,address = ?,postalcode = ?,reference = ? WHERE idshipping = ?";
                        var inserts_shipping = [cliente, fechaentrega, horarioentrega, contacto, numamigrar, destino, direccion, colonia, referencias, idshipping];
                        var query_insert_shipping = mysql.format(query_shipping, inserts_shipping);

                        pool.query(query_insert_shipping, function (err, result) {
                            if (err) {
                                pool.rollback(function () {
                                    throw err;
                                });//fin del throw err
                            }//fin del if


                            //en el ultimo insert
                            pool.commit(function (err) {
                                if (err) {
                                    pool.rollback(function () {
                                        throw err;
                                    });
                                }
                                console.log('Actualizada sol. DOMICILIO ID: ' + idshipping);
                                res.send("Correcto");

                            });//fin del commit

                        });//fin de la tercer query
                    });//fin de la query 2
                });//fin de la query 1
            }); //fin del begin transaction
        }); //fin del get connection
    });

    //GENERAR REPORTE DE DOMICILIO 
    app.post('/getDataDomicilio', middleware.requireLogin, function (req, res) {
        var fromdate = req.body.fromdate;
        var tildate = req.body.tildate;
        var response = [];
        var query = 'SELECT m.created, m.guidenumber, concat(u.name," ",u.lastname) as asesor , s.clientname,s.mainline, s.contact,d.sisact,p.keyname, p.name, s.city,d.account,m.activation_date,d.phone,m.invoice,d.imei,m.iccid,m.datewithprovider,m.delivered_date,m.status,d.type from metashipping m left join user u ON m.iduser = u.iduser left join shipping s on m.idshipping = s.idshipping LEFT JOIN datashipping d ON m.idshipping = d.idshipping LEFT JOIN plan p ON d.idplan = p.idplan WHERE created BETWEEN ? AND ?';
        var inserts = [fromdate,tildate];
        query = mysql.format(query,inserts);
        connection.query(query, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    'created': element.created,
                    'guidenumber': element.guidenumber,
                    'asesor': element.asesor,
                    'clientname': element.clientname,
                    'mainline': element.mainline,
                    'contact': element.contact,
                    'sisact': element.sisact,
                    'keyname': element.keyname,
                    'name': element.name,
                    'city': element.city,
                    'account': element.account,
                    'activation_date': element.activation_date,
                    'phone': element.phone,
                    'invoice': element.invoice,
                    'imei': element.imei,
                    'iccid': element.iccid,
                    'datewithprovider': element.datewithprovider,
                    'delivered_date': element.delivered_date,
                    'status': element.status,
                    'type': element.type,
                }
                response.push(row);
            });
            res.send(response);
        });
    });


}// fin del archivo
