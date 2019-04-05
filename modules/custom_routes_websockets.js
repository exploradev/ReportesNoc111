middleware = require('./middlewares');
var mysql = require('mysql');
var connection = require('./db');
var moment = require('moment');


module.exports = function (app, io) {



//-----------------------------------------------------------------------
//-------------------------------WEBSOCKETS------------------------------
//-----------------------------------------------------------------------
conexiones = [0]; //VARIABLE GLOBAL QUE SERVIRA AL ROUTE /getNodeConnections que sigue a este bloque
socketidsserver = [];
socketidscliente = [];

io.on('connection', function (socket) {
    if (socketidsserver.indexOf(socket.id) == -1) {
        socketidsserver.push(socket.id);
    }


    //console.log(socket.id);
    //address = socket.request.connection._peername;
    //console.log(address);

    //DEFAULT HANDSHAKE - INSTANCIAR EL SOCKET.ID EN CLIENTE 
    io.to(socket.id).emit('default_handshake', socket.id);

    //DA LA ORDEN DE CAMBIO PARA QUE LOS NODOS ACTUALICEN SUS TABLAS
    //** H A R D C O D E D **//
    socket.on('setWebsocketUpdate', function (msg) {
        switch (msg.route) {
            case "capturaactivada":
                io.emit('capturaactivada', 'update');
                io.emit('refreshdashboard', 'update');

                getSocketIdForEmit = function (idrequest) {
                    userIdForSocketId = [];
                    var query = "SELECT request.iduser AS iduser FROM request WHERE idrequest = ? LIMIT 1";
                    var inserts = [idrequest];
                    var query_socketid = mysql.format(query, inserts);
                    connection.query(query_socketid, function (error, results) {
                        if (error) throw error;
                        results.forEach(element => {
                            var row = {
                                'id': element.iduser
                            }
                            userIdForSocketId.push(row);
                        });
                        //comparo si el id obtenido en la query coincide con alguno dentro del array dinamico de socketids conectados y si coincide entonces retorno el socketid para enviarle el mensaje privado
                        socketidscliente.forEach(index => {
                            if (userIdForSocketId[0]['id'] == index.idasesor) {
                                io.to(index.socketid).emit('capturaactivadaasesor', 'update');
                            }
                        });
                    });
                } //fin getSocketIdForEmit

                getSocketIdForEmit(msg.idrequest);

                break;
            case "puestaenespera":
                io.emit('puestaenespera', 'update');
                io.emit('refreshdashboard', 'update');

                getSocketIdForEmit = function (idrequest) {
                    userIdForSocketId = [];
                    var query = "SELECT request.iduser AS iduser FROM request WHERE idrequest = ? LIMIT 1";
                    var inserts = [idrequest];
                    var query_socketid = mysql.format(query, inserts);
                    connection.query(query_socketid, function (error, results) {
                        if (error) throw error;
                        results.forEach(element => {
                            var row = {
                                'id': element.iduser
                            }
                            userIdForSocketId.push(row);
                        });
                        //comparo si el id obtenido en la query coincide con alguno dentro del array dinamico de socketids conectados y si coincide entonces retorno el socketid para enviarle el mensaje privado
                        socketidscliente.forEach(index => {
                            if (userIdForSocketId[0]['id'] == index.idasesor) {
                                io.to(index.socketid).emit('puestaenesperaasesor', 'update');
                            }
                        });
                    });
                } //fin getSocketIdForEmit

                getSocketIdForEmit(msg.idrequest);

                break;
            case "cambiodestatuscerrador":
                io.emit('cambiodestatuscerrador', 'update');
                io.emit('refreshdashboard', 'update');
                io.emit()
                getSocketIdForEmit = function (idrequest) {
                    userIdForSocketId = [];
                    var query = "SELECT request.iduser AS iduser FROM request WHERE idrequest = ? LIMIT 1";
                    var inserts = [idrequest];
                    var query_socketid = mysql.format(query, inserts);
                    connection.query(query_socketid, function (error, results) {
                        if (error) throw error;
                        results.forEach(element => {
                            var row = {
                                'id': element.iduser
                            }
                            userIdForSocketId.push(row);
                        });
                        //comparo si el id obtenido en la query coincide con alguno dentro del array dinamico de socketids conectados y si coincide entonces retorno el socketid para enviarle el mensaje privado
                        socketidscliente.forEach(index => {
                            if (userIdForSocketId[0]['id'] == index.idasesor) {
                                io.to(index.socketid).emit('cambiodestatuscerradorasesor', 'update');
                            }
                        });
                    });
                } //fin getSocketIdForEmit

                getSocketIdForEmit(msg.idrequest);
                break;
            case "puestaparacorreccion":
                io.emit('puestaparacorreccion', 'update');

                getSocketIdForEmit = function (idrequest) {
                    userIdForSocketId = [];
                    var query = "SELECT request.iduser AS iduser FROM request WHERE idrequest = ? LIMIT 1";
                    var inserts = [idrequest];
                    var query_socketid = mysql.format(query, inserts);
                    connection.query(query_socketid, function (error, results) {
                        if (error) throw error;
                        results.forEach(element => {
                            var row = {
                                'id': element.iduser
                            }
                            userIdForSocketId.push(row);
                        });
                        //comparo si el id obtenido en la query coincide con alguno dentro del array dinamico de socketids conectados y si coincide entonces retorno el socketid para enviarle el mensaje privado
                        socketidscliente.forEach(index => {
                            if (userIdForSocketId[0]['id'] == index.idasesor) {
                                io.to(index.socketid).emit('puestaparacorreccionasesor', 'update');
                            }
                        });
                    });
                } //fin getSocketIdForEmit

                getSocketIdForEmit(msg.idrequest);
                break;
            case "capturaagendada":
                io.emit('capturaagendada', 'update');
                io.emit('refreshdashboard', 'update');

                getSocketIdForEmit = function (idrequest) {
                    userIdForSocketId = [];
                    var query = "SELECT request.iduser AS iduser FROM request WHERE idrequest = ? LIMIT 1";
                    var inserts = [idrequest];
                    var query_socketid = mysql.format(query, inserts);
                    connection.query(query_socketid, function (error, results) {
                        if (error) throw error;
                        results.forEach(element => {
                            var row = {
                                'id': element.iduser
                            }
                            userIdForSocketId.push(row);
                        });
                        //comparo si el id obtenido en la query coincide con alguno dentro del array dinamico de socketids conectados y si coincide entonces retorno el socketid para enviarle el mensaje privado
                        socketidscliente.forEach(index => {
                            if (userIdForSocketId[0]['id'] == index.idasesor) {
                                io.to(index.socketid).emit('capturaagendadaasesor', 'update');
                            }
                        });
                    });
                } //fin getSocketIdForEmit

                getSocketIdForEmit(msg.idrequest);
                break;
            case "nuevacapturaoasignacion":
                io.emit('nuevacapturaoasignacion', 'update');
                io.emit('refreshdashboard', 'update');

                getSocketIdForEmit = function (idrequest) {
                    userIdForSocketId = [];
                    var query = "SELECT request.iduser AS iduser FROM request WHERE idrequest = ? LIMIT 1";
                    var inserts = [idrequest];
                    var query_socketid = mysql.format(query, inserts);
                    connection.query(query_socketid, function (error, results) {
                        if (error) throw error;
                        results.forEach(element => {
                            var row = {
                                'id': element.iduser
                            }
                            userIdForSocketId.push(row);
                        });
                        //comparo si el id obtenido en la query coincide con alguno dentro del array dinamico de socketids conectados y si coincide entonces retorno el socketid para enviarle el mensaje privado
                        socketidscliente.forEach(index => {
                            if (userIdForSocketId[0]['id'] == index.idasesor) {
                                io.to(index.socketid).emit('nuevacapturaoasignacionasesor', 'update');
                            }
                        });
                    });
                } //fin getSocketIdForEmit

                getSocketIdForEmit(msg.idrequest);
                break;
            case "capturaaceptada":
                io.emit('capturaaceptada', 'update');
                io.emit('refreshdashboard', 'update');

                getSocketIdForEmit = function (idrequest) {
                    userIdForSocketId = [];
                    var query = "SELECT request.iduser AS iduser FROM request WHERE idrequest = ? LIMIT 1";
                    var inserts = [idrequest];
                    var query_socketid = mysql.format(query, inserts);
                    connection.query(query_socketid, function (error, results) {
                        if (error) throw error;
                        results.forEach(element => {
                            var row = {
                                'id': element.iduser
                            }
                            userIdForSocketId.push(row);
                        });
                        //comparo si el id obtenido en la query coincide con alguno dentro del array dinamico de socketids conectados y si coincide entonces retorno el socketid para enviarle el mensaje privado
                        socketidscliente.forEach(index => {
                            if (userIdForSocketId[0]['id'] == index.idasesor) {
                                io.to(index.socketid).emit('capturaaceptadaasesor', 'update');
                            }
                        });
                    });
                } //fin getSocketIdForEmit

                getSocketIdForEmit(msg.idrequest);
                break;

            //--------------------------------------------------------
            //CASE PARA RUTA DE ANALISTA A DOMICILIO
            case "actualizardomicilio":
                io.emit('actualizartablasdomicilio', 'update');
                io.emit('refreshdashboard', 'update');
                //io.emit('actualizarasesordomicilio','update');

                getSocketIdForEmit = function (idrequest) {
                    userIdForSocketId = [];
                    var query = "SELECT metashipping.iduser AS iduser FROM metashipping WHERE idshipping = ? LIMIT 1";
                    var inserts = [idrequest];
                    var query_socketid = mysql.format(query, inserts);
                    connection.query(query_socketid, function (error, results) {
                        if (error) throw error;
                        results.forEach(element => {
                            var row = {
                                'id': element.iduser
                            }
                            userIdForSocketId.push(row);
                        });
                        //comparo si el id obtenido en la query coincide con alguno dentro del array dinamico de socketids conectados y si coincide entonces retorno el socketid para enviarle el mensaje privado
                        socketidscliente.forEach(index => {
                            if (userIdForSocketId[0]['id'] == index.idasesor) {
                                io.to(index.socketid).emit('actualizarasesordomicilio', 'update');
                            }
                        });
                    });
                } //fin getSocketIdForEmit

                getSocketIdForEmit(msg.idrequest);
                break;

            case "actualizardomiciliofromasesor":
                io.emit('actualizartablasdomicilio', 'update');
                io.emit('refreshdashboard', 'update');
                

                break;
            //FIN DE CASE PARA RUTA DE ANALISTA A DOMICILIO
            //--------------------------------------------------------

            case "uglobalcerrador":
                io.emit('uglobalcerrador', 'update');
                io.emit('refreshdashboard', 'update');
                break;

        }

    });







    //RECIBE LOS HANDSHAKE DE LOS NODOS CONECTADOS PARA LISTARLOS EN EL DASHBOARD
    socket.on('reportealista', function (msg) {

        found = 0;
        //validar si los datos recibidos ya existen en el arreglo de objetos
        socketidscliente.forEach(index => {
            if ((index.socketid == msg.sockid) && (index.idasesor == msg.idasesor)) {
                found = 1;
            }
        });

        //si no existen entonces se hace push al objeto
        if (found != 1) {
            elemento = {
                socketid: msg.sockid,
                idasesor: msg.idasesor
            }
            socketidscliente.push(elemento);
        }
        //console.log(socketidscliente);


        //invoco la funcion que cruza la informacion recibida con la del servidor
        vennfunction();

    });
    //----------------------------------------------------------------------------------------

    //ELIMINAR 
    socket.on('disconnect', function () {
        i = socketidsserver.indexOf(socket.id);
        socketidsserver.splice(i, 1);
        //console.log(socketidsserver);
        deletevennfunction();

    });
    //---------------------------------------------------------------------------------------

    //los que coincidan los socketsids los agrego al arreglo de indices de conexiones
    //si no coinciden se hace splice en el arreglo de indices de conexiones
    vennfunction = function () {
        for (i = 0; i < socketidsserver.length; i++) {
            for (j = 0; j < socketidscliente.length; j++) {
                //console.log(socketidsserver[i] + " " + socketidscliente[j].socketid);

                if (socketidsserver[i] == socketidscliente[j].socketid) {
                    //console.log('Coincidencia ' + socketidsserver[i] + " " + socketidscliente[j].socketid + " ID: " + socketidscliente[j].idasesor);
                    encontrado = 0;
                    conexiones.forEach(index => {
                        if (socketidscliente[j].idasesor == index) {
                            //console.log('YA existe ' + socketidscliente[j].idasesor);
                            encontrado = 1;
                        }
                    });

                    if (encontrado == 0) {
                        //console.log('Haciendo push a: ' + socketidscliente[j].idasesor)
                        conexiones.push(socketidscliente[j].idasesor);
                    }
                    encontrado = 0;

                }

            }//fin de socketidcliente
        } // fin de socketidserver


        //console.log(conexiones);
        socket.broadcast.emit('update_tableconnections', 'actualizar');
    } // fin de la funcion

    deletevennfunction = function () {
        for (i = 0; i < socketidsserver.length; i++) {
            for (j = 0; j < socketidscliente.length; j++) {

                //console.log(socketidscliente)
                if ((socketidsserver[i] != socketidscliente[j].socketid)) {
                    //console.log('no coincide ' + socketidsserver[i])
                    found = 0;
                    conexiones.forEach(index => {
                        if (index == socketidscliente[j].idasesor) {

                            found = 1;
                        }
                    });
                    if (found == 0) {
                        //console.log(socketidscliente[j].idasesor)
                        conexiones.splice(socketidscliente[j].idasesor, 1);
                    }
                }

            }//fin de socketidcliente
        } // fin de socketidserver

        socket.broadcast.emit('reportensetodos', 'reportensetodos');
    } // fin de la funcion


});

//-----------------------------------------------------------------------
//-------------------------------WEBSOCKETS------------------------------
//-----------------------------------------------------------------------


//DASHBOARD DE CONEXIONES
app.post('/getNodeConnections', middleware.requireLogin, function (req, res) {

    var statistics_data = [];

    if (conexiones == [] || conexiones == '' || conexiones == undefined || conexiones == null) {

        var usuarios = "SELECT  CONCAT(user.lastname,' ',user.name) AS asesor,        SUM(CASE WHEN request.status = 'borrador' and date(request.created) = date(now()) THEN 1 ELSE 0 END) AS borrador,            SUM(CASE WHEN request.status = 'no finalizada' and date(request.created) = date(now()) THEN 1 ELSE 0 END) AS nofinalizada,                SUM(CASE WHEN request.status = 'activa' and date(request.activated) = date(now()) THEN 1 ELSE 0 END) AS activa,                    SUM(CASE WHEN request.status = 'en espera' and date(request.created) = date(now()) THEN 1 ELSE 0 END) AS enespera,                        SUM(CASE WHEN request.status = 'aceptada' and date(request.created) = date(now()) THEN 1 ELSE 0 END) AS aceptada,                            SUM(CASE WHEN request.status = 'aceptadacc' and date(request.created) = date(now()) THEN 1 ELSE 0 END) AS aceptadacc,                                SUM(CASE WHEN request.status = 'rechazada' and date(request.created) = date(now()) THEN 1 ELSE 0 END) AS rechazada,                                    SUM(CASE WHEN request.status = 'corregir' and date(request.created) = date(now()) THEN 1 ELSE 0 END) AS corregir,                                        SUM(CASE WHEN request.status = 'enviado' and date(request.created) = date(now()) THEN 1 ELSE 0 END) AS enviado, MAX(campaign.name) AS campania        FROM request LEFT JOIN user ON user.iduser = request.iduser LEFT JOIN campaign ON campaign.idcampaign = user.idcampaign       WHERE request.iduser IN (0) GROUP BY asesor ORDER BY campania, asesor ASC";
    } else {
        var usuarios = "SELECT  CONCAT(user.lastname,' ',user.name) AS asesor,        SUM(CASE WHEN request.status = 'borrador' and date(request.created) = date(now()) THEN 1 ELSE 0 END) AS borrador,            SUM(CASE WHEN request.status = 'no finalizada' and date(request.created) = date(now()) THEN 1 ELSE 0 END) AS nofinalizada,                SUM(CASE WHEN request.status = 'activa' and date(request.activated) = date(now()) THEN 1 ELSE 0 END) AS activa,                    SUM(CASE WHEN request.status = 'en espera' and date(request.created) = date(now()) THEN 1 ELSE 0 END) AS enespera,                        SUM(CASE WHEN request.status = 'aceptada' and date(request.created) = date(now()) THEN 1 ELSE 0 END) AS aceptada,                            SUM(CASE WHEN request.status = 'aceptadacc' and date(request.created) = date(now()) THEN 1 ELSE 0 END) AS aceptadacc,                                SUM(CASE WHEN request.status = 'rechazada' and date(request.created) = date(now()) THEN 1 ELSE 0 END) AS rechazada,                                    SUM(CASE WHEN request.status = 'corregir' and date(request.created) = date(now()) THEN 1 ELSE 0 END) AS corregir,                                        SUM(CASE WHEN request.status = 'enviado' and date(request.created) = date(now()) THEN 1 ELSE 0 END) AS enviado, MAX(campaign.name) AS campania        FROM request LEFT JOIN user ON user.iduser = request.iduser LEFT JOIN campaign ON campaign.idcampaign = user.idcampaign       WHERE request.iduser IN (" + conexiones.join(',') + ") GROUP BY asesor ORDER BY campania, asesor ASC";
    }








    connection.query(usuarios, function (error, results, field) {
        if (error) throw error;
        results.forEach(element => {
            var row = {
                'asesor': element.asesor,
                'campania': element.campania,
                'borrador': element.borrador,
                'nofinalizada': element.nofinalizada,
                'activa': element.activa,
                'enespera': element.enespera,
                'aceptada': element.aceptada,
                'aceptadacc': element.aceptadacc,
                'rechazada': element.rechazada,
                'corregir': element.corregir,
                'enviado': element.enviado
            }
            statistics_data.push(row);
        });
        res.send(statistics_data);

    });
}); //fin del /getNodeConnectionsMonth

}