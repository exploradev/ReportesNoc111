middleware = require('./middlewares');
var mysql = require('mysql');
var connection = require('./db');
var moment = require('moment');


module.exports = function (app, io) {



//-----------------------------------------------------------------------
//-------------------------------WEBSOCKETS------------------------------
//-----------------------------------------------------------------------

var usuarios_conectados = [{socketid: 'dummie-text', idasesor: 0}];
io.on('connection', function (socket) {
    
    //DEFAULT HANDSHAKE - INVOCAR EL SOCKET.ID EN EL NAVEGADOR CLIENTE FRONTEND
    io.to(socket.id).emit('default_handshake', socket.id);

    //RECIBE LOS HANDSHAKE DE LOS NODOS CONECTADOS PARA LISTARLOS --------------------------------
    socket.on('reportealista', function (msg) {

        var socket = msg.sockid;
        var iduser = msg.idasesor;

        var encontrado = 0

        //al conectar verificar si el usuario existe en el objeto
        //si existe, eliminarlo e ingresar con el nuevo socket id
        //si no existe, se agrega unicamente ambos datos

        for (let index = 0; index < usuarios_conectados.length; index++) {
            //console.log(index);
            var idasesor_obj = usuarios_conectados[index].idasesor;
            if (idasesor_obj == iduser) {
                encontrado++;
                removeItemsById(usuarios_conectados,iduser);
                elemento = {
                    socketid: msg.sockid,
                    idasesor: msg.idasesor
                }
                usuarios_conectados.push(elemento);
                break;
            }
        }
        //ELIMINA ITEMS DEL ARREGLO DE OBJETOS POR IDASESOR - INSTANCIADO DESDE EL FOR DE ARRIBA
        function removeItemsById(arr, id) {
            var i = arr.length;
            if (i) {   // (not 0)
                while (--i) {
                    var cur = arr[i];
                    if (cur.idasesor == id) {
                        arr.splice(i, 1);
                    }
                }
            }
        }

        
       

        //si no existen entonces se hace push al objeto
        if (encontrado == 0) {
            elemento = {
                socketid: msg.sockid,
                idasesor: msg.idasesor
            }
            usuarios_conectados.push(elemento);
        }

        //console.log(iduser);
        //console.log(socket);
        console.log("--------------------");
        console.log(usuarios_conectados);
    });
  

    //ELIMINAR ------------------------------------------------------------------------------
    socket.on('disconnect', function () {
        //console.log(socket.id)
        console.log("Descnectado " + socket.id);
        
        //REVISA LA EXISTENCIA DEL SOCKET
        for (let index = 0; index < usuarios_conectados.length; index++) {
            //console.log(index);
            var socket_obj = usuarios_conectados[index].socketid;
            if (socket_obj == socket.id) {
                removeItemsBySocket(usuarios_conectados, socket_obj);
                break;
            }
        }


        //ELIMINA ITEMS DEL ARREGLO DE OBJETOS POR SOCKET- INSTANCIADO DESDE EL FOR DE ARRIBA
        function removeItemsBySocket(arr, id) {
            var i = arr.length;
            if (i) {   // (not 0)
                while (--i) {
                    var cur = arr[i];
                    if (cur.socketid == id) {
                        arr.splice(i, 1);
                    }
                }
            }
        }
        console.log("--------------------");
        console.log(usuarios_conectados);
        
    });//FIN DEL SOCKET
    //---------------------------------------------------------------------------------------

    



});

//-----------------------------------------------------------------------
//-------------------------------WEBSOCKETS------------------------------
//-----------------------------------------------------------------------


}