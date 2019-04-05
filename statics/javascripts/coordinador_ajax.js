var getDataModal, setSisactCanal, setRequestActive;


$(document).ready(function(){


    //-----------------------------------------------------------------------
    //-------------------------------WEBSOCKETS------------------------------
    //-----------------------------------------------------------------------


    var socket = io.connect('http://192.168.3.62');
    //var socket = io.connect('http://10.162.45.20:4040');
    //var socket = io.connect('http://localhost:4040');

    //var userforsocket = $('body').data('iduser');
    //socket.emit('iam', userforsocket);

    socket.on('setWebsocketUpdate', function (msg) {
        console.log('Updated');
        //statistics();
        //tabla_concentrado(); //SE REFRESCA CON AJAX SOLAMENTE :)
        //tabla_aceptadassin();
        //tabla_aceptadasdom(); //AJAX TAMBIEN ademas de ws
        //tabla_agendadas();
        //tabla_activadas();
    });

    socket.on('capturaaceptada', function (msg) {
        statistics();
        tabla_aceptadassin();
        tabla_aceptadasdom();
    });

    socket.on('capturaagendada', function (msg) {
        statistics();
        tabla_concentrado();
        tabla_aceptadassin();
        tabla_aceptadasdom();
        tabla_agendadas();
    });

    socket.on('capturaactivada', function (msg) {
        statistics();
        tabla_agendadas();
        tabla_activadas();
        tabla_aceptadasdom();
        
    });

    socket.on('uglobalcerrador', function (msg) {
        statistics();
        tabla_concentrado(); 
        tabla_agendadas();
        tabla_aceptadassin();
        tabla_aceptadasdom();
        
    });

    //-----------------------------------------------------------------------
    //-------------------------------WEBSOCKETS------------------------------
    //-----------------------------------------------------------------------


 
    getDataModal = function(idrequest,action){
        $.post('/getdatamodal', { idrequest: idrequest}, function (response) {
            if (action == 'reject') {
                $('#idrequestmodalrechazo').html(idrequest);
                $('#nombremodalrechazo').html(response[0]["cliente"]);
                $('#contactomodalrechazo').html(response[0]["contacto"]);
                $('#sisactmodalrechazo').html(response[0]["sisact"]);
                $('#canalmodalrechazo').html(response[0]["canal"]);

            }else if(action == 'comnt'){
                $('#idrequestmodalcomentario').html(idrequest);
                $('#nombremodalcomentario').html(response[0]["cliente"]);
                $('#contactomodalcomentario').html(response[0]["contacto"]);
                $('#sisactmodalcomentario').html(response[0]["sisact"]);
                $('#canalmodalcomentario').html(response[0]["canal"]);
            }else if(action == 'agenda'){
                $('#idrequestmodalagenda').html(idrequest);
                $('#nombremodalagenda').html(response[0]["cliente"]);
                $('#contactomodalagenda').html(response[0]["contacto"]);
                $('#sisactmodalagenda').html(response[0]["sisact"]);
                $('#canalmodalagenda').html(response[0]["canal"]);
            }   
        });
    }

   
    

    //al hacer submit del motivo del rechazo
    $('#submitmodalrechazo').click(function () {
        idrequest = $('#idrequestmodalrechazo').html();
        motivo = $('#textareamodalrechazo').val();

        //TIMESTAMP DE PRIMER STATUS Y/O SEGUIMIETNO
        $.post('/setFirstStatusTimestamp', { idrequest: idrequest });
        //TIMESTAMP DE PRIMER STATUS Y/O SEGUIMIENTO
        if ((idrequest != '') && (motivo != '')) {
            $.post('/setreject',
                { idrequest: idrequest, motivo: motivo }, function (response) {
                    if (response == 'Actualizado') {
                        socket.emit('setWebsocketUpdate', { route: 'uglobalcerrador'});
                        socket.emit('setWebsocketUpdate', { route: 'cambiodestatuscerrador', idrequest: idrequest });
                        $('#close_modalrechazo').trigger('click');
                    } else {
                        alert('Captura no actualizado. Intenta nuevamente.')
                    }
                });
        } else {
            alert('Campos vacios. Mal uso de la herramienta.');
        }
    });

    //al hacer submit del comentario de seguimiento
    $('#submitmodalcomentario').click(function () {
        idrequest = $('#idrequestmodalcomentario').html();
        observacion = $('#textareamodalcomentario').val();
        //TIMESTAMP DE PRIMER STATUS Y/O SEGUIMIETNO
        $.post('/setFirstStatusTimestamp', { idrequest: idrequest });
        //TIMESTAMP DE PRIMER STATUS Y/O SEGUIMIENTO
        if ((idrequest != '') && (observacion != '')) {
            $.post('/setcontinuity',
                { idrequest: idrequest, observacion: observacion }, function (response) {
                    if (response == 'Actualizado') {
                        socket.emit('setWebsocketUpdate', { route: 'uglobalcerrador' });
                        socket.emit('setWebsocketUpdate', { route: 'cambiodestatuscerrador', idrequest: idrequest });
                        $('#close_modalcomentario').trigger('click');
                    } else {
                        alert('Comentario no actualizado. Intenta nuevamente.')
                    }
                });
        } else {
            alert('Campos vacios. Mal uso de la herramienta.');
        }
    });

    //al hacer submit de la agenda
    $('#submitmodalagenda').click(function () {
        idrequest = $('#idrequestmodalagenda').html();
        fecha = $('#fechaagendainput').val();
        cac = $('#canalagendainput').val();
        //TIMESTAMP DE PRIMER STATUS Y/O SEGUIMIETNO
        $.post('/setFirstStatusTimestamp', { idrequest: idrequest });
        //TIMESTAMP DE PRIMER STATUS Y/O SEGUIMIENTO
        if ((idrequest != '') && (fecha != '') && (cac != '')) {
            $.post('/setScheduleForRequest',
                { idrequest: idrequest, fecha: fecha, cac: cac }, function (response) {
                    if (response == 'Actualizado') {
                        socket.emit('setWebsocketUpdate', { route: 'capturaagendada', idrequest: idrequest });
                        $('#close_modalagenda').trigger('click');
                    } else {
                        alert('Captura no agendada. Intenta nuevamente.')
                    }
                });
        } else {
            alert('Campos vacios. Mal uso de la herramienta.');
        }
    });

    //----------------------------------------------------------------------------
 

    setSisactCanal = function (idrequest, modificacion, atributodb) {
        $.post('/setSisactCanal', { idrequest: idrequest, modificacion: modificacion, atributodb: atributodb }, function (response) {
            if (response == 'Actualizado') {
                socket.emit('setWebsocketUpdate', { route: 'uglobalcerrador' });
                
            }
        });
    }

    setRequestActive = function(idrequest){
        $.post('/setStatusFromTelcel', { idrequest: idrequest, status: 'activa' }, function () {
            
            socket.emit('setWebsocketUpdate', { route: 'capturaactivada', idrequest: idrequest });
        });
    }

  
});