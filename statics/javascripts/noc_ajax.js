var fillsidepanel, fillsidepanel2, showdata, setStatusFromTelcel, setScheduleForRequest, setStatusFromCAC, justifyrejectorcorrection, setSisactCanal, getComment, setComment;
$(document).ready(function(){

    //----------------------WEBSOCKETS-----------------------
    //----------------------WEBSOCKETS-----------------------

    var socket = io.connect('http://192.168.3.62');
    //var socket = io.connect('http://10.162.45.20:4040');
    //var socket = io.connect('http://localhost:4040');

    socket.on('refreshalldivs', function (msg) {
        console.log('Actualizando divs');
        //statistics();
        //tabla_pendientes();
        //tabla_enespera();
        //tabla_aceptadas();
        //tabla_correcciones();
        //tabla_activadas();
        //tabla_analistaagenda();
    });

    socket.on('nuevacapturaoasignacion',function(msg){
        //escucha:
        //nueva captura por parte del asesor
        //el analista se asigno la captura
        statistics();
        tabla_pendientes();
        tabla_correcciones();
    });

    socket.on('capturaaceptada', function (msg) {
        statistics();
        tabla_enespera();
    });

    socket.on('puestaenespera',function(msg){
        statistics();
        tabla_pendientes();
        tabla_enespera();
    });

    socket.on('puestaparacorreccion',function (msg) {
        statistics();
        tabla_correcciones();
        tabla_pendientes();
    });

    socket.on('capturaactivada',function (msg) {
        statistics();
        tabla_activadas();
    });

    

    //----------------------WEBSOCKETS-----------------------
    //----------------------WEBSOCKETS-----------------------

    //mostrar datos de capturas cuando ya esta asignado
    showdata = function (idregistro) {
        $.post('/getdatarequest', { idregistro: idregistro }, function (response) {

            //console.log(response);
            $('#idcaptura').html('Detalles de la captura ID ' + idregistro);
            $('#idcaptura').attr("data-idrequest", idregistro);
            $('#analistaasignado').html('Asignado a: ' + response[0]["analistaasignado"]);
            $('#fechadecaptura').html('Capturado: ' + response[0]["created"]);

            //datos personales
            $('#show_sexo').html(response[1]["gender"]);
            $('#show_nombres').html(response[1]["name"]);
            $('#show_apellidos').html(response[1]["lastname"]);
            $('#show_fechadenacimiento').html(response[1]["birthday"]);
            $('#show_numcliente').html(response[1]["contact_num"]);
            $('#show_email').html(response[1]["email"]);
            $('#show_rfc').html(response[1]["rfc"]);

            //datos del plan
            $('#show_tipodeactivacion').html(response[2]["tipo"]);
            $('#show_procedencia').html(response[2]["origen"]);
            $('#show_migrarnumero').html(response[2]["amigrar"]);
            $('#show_refacta').html(response[2]["refacta"]);
            $('#show_canal').html(response[2]["canal"]);
            $('#show_plan').html(response[2]["nombreplan"]);
            $('#show_plazo').html(response[2]["plazoplan"]);
            $('#show_clavedeplan').html(response[2]["claveplan"]);
            $('#show_equipo').html(response[2]["equipocelular"]);
            $('#show_pagoinicial').html(response[2]["pagoinicial"]);
            $('#show_costoamigo').html(response[2]["preciodelista"]);

            //address
            $('#show_ciudad').html(response[3]["city"]);
            $('#show_estado').html(response[3]["state"]);
            $('#show_calle').html(response[3]["street"]);
            $('#show_numexterior').html(response[3]["num_ext"]);
            $('#show_numinterior').html(response[3]["num_int"]);
            $('#show_cruzamientos').html(response[3]["between_streets"]);
            $('#show_colonia').html(response[3]["district"]);
            $('#show_celofijo').html(response[3]["local_phonenumber"]);
            $('#show_horariovisita').html(response[3]["availability"]);
            $('#show_referencias').html(response[3]["reference"]);

            //datos laborales
            $('#show_empresa').html(response[4]["jobname"]);
            $('#show_cargo').html(response[4]["job"]);
            $('#show_celofijolaboral').html(response[4]["phonenumber"]);
            $('#show_extension').html(response[4]["extension"]);
            $('#show_horariovisitalaboral').html(response[4]["availability"]);

            //referencias
            $('#show_nombresref1').html(response[5]["refname"]);
            $('#show_apellidosref1').html(response[5]["reflastname"]);
            $('#show_telefonoref1').html(response[5]["refphonenumber"]);
            $('#show_horariovisitaref1').html(response[5]["refavailability"]);

            $('#show_nombresref2').html(response[6]["refname"]);
            $('#show_apellidosref2').html(response[6]["reflastname"]);
            $('#show_telefonoref2').html(response[6]["refphonenumber"]);
            $('#show_horariovisitaref2').html(response[6]["refavailability"]);


            //observaciones
            $('#show_observaciones').html(response[7]["observation"]);

        });//fin de /getdatarequest
    }

    showdata2 = function (idregistro) {
        $.post('/getdatarequest', { idregistro: idregistro }, function (response) {

            //console.log(response);
            $('#idcaptura2').html('Detalles de la captura ID ' + idregistro);
            $('#idcaptura2').attr("data-idrequest", idregistro);
            $('#analistaasignado2').html('Asignado a: ' + response[0]["analistaasignado"]);
            $('#fechadecaptura2').html('Capturado: ' + response[0]["created"]);

            //datos personales
            $('#show_sexo2').html(response[1]["gender"]);
            $('#show_nombres2').html(response[1]["name"]);
            $('#show_apellidos2').html(response[1]["lastname"]);
            $('#show_fechadenacimiento2').html(response[1]["birthday"]);
            $('#show_numcliente2').html(response[1]["contact_num"]);
            $('#show_email2').html(response[1]["email"]);
            $('#show_rfc2').html(response[1]["rfc"]);

            //datos del plan
            $('#show_tipodeactivacion2').html(response[2]["tipo"]);
            $('#show_procedencia2').html(response[2]["origen"]);
            $('#show_migrarnumero2').html(response[2]["amigrar"]);
            $('#show_refacta2').html(response[2]["refacta"]);
            $('#show_canal2').html(response[2]["canal"]);
            $('#show_plan2').html(response[2]["nombreplan"]);
            $('#show_plazo2').html(response[2]["plazoplan"]);
            $('#show_clavedeplan2').html(response[2]["claveplan"]);
            $('#show_equipo2').html(response[2]["equipocelular"]);
            $('#show_pagoinicial2').html(response[2]["pagoinicial"]);
            $('#show_costoamigo2').html(response[2]["preciodelista"]);

            //address
            $('#show_ciudad2').html(response[3]["city"]);
            $('#show_estado2').html(response[3]["state"]);
            $('#show_calle2').html(response[3]["street"]);
            $('#show_numexterior2').html(response[3]["num_ext"]);
            $('#show_numinterior2').html(response[3]["num_int"]);
            $('#show_cruzamientos2').html(response[3]["between_streets"]);
            $('#show_colonia2').html(response[3]["district"]);
            $('#show_celofijo2').html(response[3]["local_phonenumber"]);
            $('#show_horariovisita2').html(response[3]["availability"]);
            $('#show_referencias2').html(response[3]["reference"]);

            //datos laborales
            $('#show_empresa2').html(response[4]["jobname"]);
            $('#show_cargo2').html(response[4]["job"]);
            $('#show_celofijolaboral2').html(response[4]["phonenumber"]);
            $('#show_extension2').html(response[4]["extension"]);
            $('#show_horariovisitalaboral2').html(response[4]["availability"]);

            //referencias
            $('#show_nombresref12').html(response[5]["refname"]);
            $('#show_apellidosref12').html(response[5]["reflastname"]);
            $('#show_telefonoref12').html(response[5]["refphonenumber"]);
            $('#show_horariovisitaref12').html(response[5]["refavailability"]);

            $('#show_nombresref22').html(response[6]["refname"]);
            $('#show_apellidosref22').html(response[6]["reflastname"]);
            $('#show_telefonoref22').html(response[6]["refphonenumber"]);
            $('#show_horariovisitaref22').html(response[6]["refavailability"]);


            //observaciones
            $('#show_observaciones2').html(response[7]["observation"]);

            

        });//fin del post de select all
    }

    // ------------------------------------------------------------------------
    //Alimentar tabla de capturas
    fillsidepanel = function (idregistro) {
        $('#idcaptura').html('Detalles de la captura ID ' + idregistro);
        $('#idcaptura').attr("data-idrequest", idregistro);
        var iduser = $('body').data('iduser');

        $.post('/asigntoanalyst', { iduser: iduser, idrequest: idregistro }, function (response_1) {
            if (response_1 == 'Actualizado') {
                socket.emit('setWebsocketUpdate', { route: 'nuevacapturaoasignacion', idrequest: idregistro });
                $.post('/getdatarequest', { idregistro: idregistro }, function (response) {

                    //console.log(response);
                    $('#analistaasignado').html('Asignado a: ' + response[0]["analistaasignado"]);
                    $('#fechadecaptura').html('Capturado: ' + response[0]["created"]);

                    //datos personales
                    $('#show_sexo').html(response[1]["gender"]);
                    $('#show_nombres').html(response[1]["name"]);
                    $('#show_apellidos').html(response[1]["lastname"]);
                    $('#show_fechadenacimiento').html(response[1]["birthday"]);
                    $('#show_numcliente').html(response[1]["contact_num"]);
                    $('#show_email').html(response[1]["email"]);
                    $('#show_rfc').html(response[1]["rfc"]);

                    //datos del plan
                    $('#show_tipodeactivacion').html(response[2]["tipo"]);
                    $('#show_procedencia').html(response[2]["origen"]);
                    $('#show_migrarnumero').html(response[2]["amigrar"]);
                    $('#show_refacta').html(response[2]["refacta"]);
                    $('#show_canal').html(response[2]["canal"]);
                    $('#show_plan').html(response[2]["nombreplan"]);
                    $('#show_plazo').html(response[2]["plazoplan"]);
                    $('#show_clavedeplan').html(response[2]["claveplan"]);
                    $('#show_equipo').html(response[2]["equipocelular"]);
                    $('#show_pagoinicial').html(response[2]["pagoinicial"]);
                    $('#show_costoamigo').html(response[2]["preciodelista"]);

                    //address
                    $('#show_ciudad').html(response[3]["city"]);
                    $('#show_estado').html(response[3]["state"]);
                    $('#show_calle').html(response[3]["street"]);
                    $('#show_numexterior').html(response[3]["num_ext"]);
                    $('#show_numinterior').html(response[3]["num_int"]);
                    $('#show_cruzamientos').html(response[3]["between_streets"]);
                    $('#show_colonia').html(response[3]["district"]);
                    $('#show_codigopostal').html(response[3]["postalcode"]);
                    $('#show_celofijo').html(response[3]["local_phonenumber"]);
                    $('#show_horariovisita').html(response[3]["availability"]);
                    $('#show_referencias').html(response[3]["reference"]);

                    //datos laborales
                    $('#show_empresa').html(response[4]["jobname"]);
                    $('#show_cargo').html(response[4]["job"]);
                    $('#show_celofijolaboral').html(response[4]["phonenumber"]);
                    $('#show_extension').html(response[4]["extension"]);
                    $('#show_horariovisitalaboral').html(response[4]["availability"]);

                    //referencias
                    $('#show_nombresref1').html(response[5]["refname"]);
                    $('#show_apellidosref1').html(response[5]["reflastname"]);
                    $('#show_telefonoref1').html(response[5]["refphonenumber"]);
                    $('#show_horariovisitaref1').html(response[5]["refavailability"]);

                    $('#show_nombresref2').html(response[6]["refname"]);
                    $('#show_apellidosref2').html(response[6]["reflastname"]);
                    $('#show_telefonoref2').html(response[6]["refphonenumber"]);
                    $('#show_horariovisitaref2').html(response[6]["refavailability"]);

                    if(response[8]){
                        $('#show_nombresref3').html(response[7]["refname"]);
                        $('#show_apellidosref3').html(response[7]["reflastname"]);
                        $('#show_telefonoref3').html(response[7]["refphonenumber"]);
                        $('#show_horariovisitaref3').html(response[7]["refavailability"]);
                        //observaciones
                        $('#show_observaciones').html(response[8]["observation"]);
                    }else{
                        //observaciones
                        $('#show_observaciones').html(response[7]["observation"]);

                        $('#show_nombresref3').html(" ");
                        $('#show_apellidosref3').html(" ");
                        $('#show_telefonoref3').html(" ");
                        $('#show_horariovisitaref3').html(" ");
                    }

                    
                    

                    

                });//fin del post de select all
            } //fin del if
        });//fin del post actualizar asignto


    } //fin de fill side-panel

    fillsidepanel2 = function (idregistro) {
        $('#idcaptura2').html('Detalles de la captura ID ' + idregistro);
        $('#idcaptura2').attr("data-idrequest", idregistro);
        var iduser = $('body').data('iduser');

        $.post('/asigntoanalyst', { iduser: iduser, idrequest: idregistro }, function (response_1) {
            if (response_1 == 'Actualizado') {
                socket.emit('setWebsocketUpdate', { route: 'nuevacapturaoasignacion', idrequest: idregistro });
                $.post('/getdatarequest', { idregistro: idregistro }, function (response) {

                    //console.log(response);
                    $('#analistaasignado2').html('Asignado a: ' + response[0]["analistaasignado"]);
                    $('#fechadecaptura2').html('Capturado: ' + response[0]["created"]);

                    //datos personales
                    $('#show_sexo2').html(response[1]["gender"]);
                    $('#show_nombres2').html(response[1]["name"]);
                    $('#show_apellidos2').html(response[1]["lastname"]);
                    $('#show_fechadenacimiento2').html(response[1]["birthday"]);
                    $('#show_numcliente2').html(response[1]["contact_num"]);
                    $('#show_email2').html(response[1]["email"]);
                    $('#show_rfc2').html(response[1]["rfc"]);

                    //datos del plan
                    $('#show_tipodeactivacion2').html(response[2]["tipo"]);
                    $('#show_procedencia2').html(response[2]["origen"]);
                    $('#show_migrarnumero2').html(response[2]["amigrar"]);
                    $('#show_refacta2').html(response[2]["refacta"]);
                    $('#show_canal2').html(response[2]["canal"]);
                    $('#show_plan2').html(response[2]["nombreplan"]);
                    $('#show_plazo2').html(response[2]["plazoplan"]);
                    $('#show_clavedeplan2').html(response[2]["claveplan"]);
                    $('#show_equipo2').html(response[2]["equipocelular"]);
                    $('#show_pagoinicial2').html(response[2]["pagoinicial"]);
                    $('#show_costoamigo2').html(response[2]["preciodelista"]);

                    //address
                    $('#show_ciudad2').html(response[3]["city"]);
                    $('#show_estado2').html(response[3]["state"]);
                    $('#show_calle2').html(response[3]["street"]);
                    $('#show_numexterior2').html(response[3]["num_ext"]);
                    $('#show_numinterior2').html(response[3]["num_int"]);
                    $('#show_cruzamientos2').html(response[3]["between_streets"]);
                    $('#show_colonia2').html(response[3]["district"]);
                    $('#show_codigopostal2').html(response[3]["postalcode"]);
                    $('#show_celofijo2').html(response[3]["local_phonenumber"]);
                    $('#show_horariovisita2').html(response[3]["availability"]);
                    $('#show_referencias2').html(response[3]["reference"]);

                    //datos laborales
                    $('#show_empresa2').html(response[4]["jobname"]);
                    $('#show_cargo2').html(response[4]["job"]);
                    $('#show_celofijolaboral2').html(response[4]["phonenumber"]);
                    $('#show_extension2').html(response[4]["extension"]);
                    $('#show_horariovisitalaboral2').html(response[4]["availability"]);

                    //referencias
                    $('#show_nombresref12').html(response[5]["refname"]);
                    $('#show_apellidosref12').html(response[5]["reflastname"]);
                    $('#show_telefonoref12').html(response[5]["refphonenumber"]);
                    $('#show_horariovisitaref12').html(response[5]["refavailability"]);

                    $('#show_nombresref22').html(response[6]["refname"]);
                    $('#show_apellidosref22').html(response[6]["reflastname"]);
                    $('#show_telefonoref22').html(response[6]["refphonenumber"]);
                    $('#show_horariovisitaref22').html(response[6]["refavailability"]);

                    if(response[8]){
                        $('#show_nombresref32').html(response[7]["refname"]);
                        $('#show_apellidosref32').html(response[7]["reflastname"]);
                        $('#show_telefonoref32').html(response[7]["refphonenumber"]);
                        $('#show_horariovisitaref32').html(response[7]["refavailability"]);

                        //observaciones
                        $('#show_observaciones2').html(response[8]["observation"]);
                    }else{
                        //observaciones
                        $('#show_observaciones2').html(response[7]["observation"]);

                        $('#show_nombresref32').html(" ");
                        $('#show_apellidosref32').html(" ");
                        $('#show_telefonoref32').html(" ");
                        $('#show_horariovisitaref32').html(" ");
                    }


                    

                    

                });//fin del post de select all
            } //fin del if
        });//fin del post actualizar asignto


    } //fin de fill side-panel
    

    //handler para pasar a en espera de respuesta -------------------------------------

    
    

    //al hacer submit del sisact:
    $('#btn_guardarsisact').click(function(){
        idrequest = $('#idcaptura').attr('data-idrequest');
        sisact = $('#sisactfield').val();
        canal = $('#canalfield').val();
        status = 'en espera';

      

        $.post('/setrequesttoenespera',
        {idrequest:idrequest, sisact:sisact, canal:canal ,status:status},function(response){
            if(response == 'Actualizado'){
                socket.emit('setWebsocketUpdate', {route: 'puestaenespera',idrequest: idrequest});
                $('#sisactfield').val('');
                $('#canalfield').val('');
                $("option[value='default']").prop('selected',true)
                $('#formaccepted').css('display','none');
                $('#side-panel').animate({ right: -2000 }, 100, "linear");
                $('#side-panel').css('display', 'none');
            }
        });
        
    });

    //al hacer submit del motivo de la correccion
    $('#btn_guardarcorreccion').click(function () {
        idrequest = $('#idcaptura').attr('data-idrequest');
        correccion = $('#observacionescorreccion').val();
        status = 'corregir';
        
        $.post('/setrequestcorregir',
            { idrequest: idrequest, correccion: correccion, status: status }, function (response) {
                if (response == 'Actualizado') {
                    socket.emit('setWebsocketUpdate', { route: 'puestaparacorreccion', idrequest: idrequest });
                    $('#observacionescorreccion').val('');
                    $("option[value='default']").prop('selected', true)
                    $('#formcorrected').css('display', 'none');
                    $('#side-panel').animate({ right: -2000 }, 100, "linear");
                    $('#side-panel').css('display', 'none');
                }
        });

    });

    //al hacer submit del motivo del rechazo
    $('#btn_guardarrechazo').click(function () {
        idrequest = $('#idcaptura').attr('data-idrequest');
        correccion = $('#observacionesrechazo').val();
        status = 'rechazada';

        $.post('/setrequestcorregir',
            { idrequest: idrequest, correccion: correccion, status: status }, function (response) {
                if (response == 'Actualizado') {
                    socket.emit('setWebsocketUpdate', { route: 'puestaparacorreccion', idrequest: idrequest });
                    $('#observacionesrechazo').val('');
                    $("option[value='default']").prop('selected', true)
                    $('#formrejected').css('display', 'none');
                    $('#side-panel').animate({ right: -2000 }, 100, "linear");
                    $('#side-panel').css('display', 'none');
                }
            });

    });

    //----------------------------------------------------------------------------
    //Opciones de en espera de respuesta

    setStatusFromTelcel = function(idrequest,status){
        $.post('/setStatusFromTelcel',{idrequest: idrequest,status: status}, function (response) {
                if (response == 'Actualizado') {
                    socket.emit('setWebsocketUpdate', { route: 'capturaaceptada', idrequest: idrequest });
                }
            });
    }

    justifyrejectorcorrection = function(idrequest,motivo,status){
        $.post('/justifyrejectorcorrection', { idrequest: idrequest,motivo:motivo, status: status }, function (response) {
            if (response == 'Actualizado') {
                socket.emit('setWebsocketUpdate', { route: 'capturaaceptada', idrequest: idrequest });
            }
        });
    }

    setSisactCanal = function (idrequest, modificacion, atributodb) {
        $.post('/setSisactCanal', { idrequest: idrequest, modificacion: modificacion, atributodb: atributodb }, function (response) {
            if (response == 'Actualizado') {
                socket.emit('setWebsocketUpdate', { route: 'capturaaceptada', idrequest: idrequest });
            }
        });
    }

    //opciones de aceptadas //----------------------------------------------------------------------------
    //agendar
    setScheduleForRequest = function (fecha, cac, idrequest) {
        $.post('/setScheduleForRequest', { fecha: fecha, cac: cac, idrequest: idrequest }, function (response) {
            if (response == 'Actualizado') {
                $('date' + idrequest).val('');
                $('cac' + idrequest).val('');
                $('#trigger-click-agenda' + idrequest).trigger('click');
                socket.emit('setWebsocketUpdate', { route: 'capturaagendada', idrequest: idrequest });

            }
        });
    }

    getComment = function (idrequest) {
        $.post('/getComment', { idrequest: idrequest }, function (response) {
            $('#comentariosisact').html('SISACT: '+ response[0]["sisact"]);
            $('#comentariocanal').html('CANAL: ' + response[0]["canal"]);
            $('#comentariocliente').html('CLIENTE: ' + response[0]["cliente"]);
            $('#comentarioanterior').html(response[0]["comentario"]);
        });
    }

    setComment = function (idrequest, comentario_analista) {
        $.post('/setComment', { comentario_analista: comentario_analista, idrequest: idrequest }, function (response) {
            if (response == 'Actualizado') {
                socket.emit('setWebsocketUpdate', { route: 'capturaagendada', idrequest: idrequest });
                $('#comentariosisact').html('SISACT: ' );
                $('#comentariocanal').html('CANAL: ' );
                $('#comentariocliente').html('CLIENTE: ' );
                $('#comentarioanterior').html('...');
                getComment(idrequest);
            }
        });
    }

    //----------------------------------------------------------------------------
    //opciones de correccion

    //al clickear el submit de sisact
    $('#btn_guardarsisact2').click(function () {
        idrequest = $('#idcaptura2').attr('data-idrequest');
        sisact = $('#sisactfield2').val();
        canal = $('#canalfield2').val();
        status = 'en espera';

        $.post('/setrequesttoenespera',
            { idrequest: idrequest, sisact: sisact, canal: canal, status: status }, function (response) {
                if (response == 'Actualizado') {
                    socket.emit('setWebsocketUpdate', { route: 'puestaenespera', idrequest: idrequest });
                    $('#sisactfield2').val('');
                    $('#canalfield2').val('');
                    $("option[value='default']").prop('selected', true)
                    $('#formaccepted2').css('display', 'none');
                    $('#side-panel2').animate({ right: -2000 }, 100, "linear");
                    $('#side-panel2').css('display', 'none');
                }
            });

    });

    //al hacer submit del motivo de la correccion
    $('#btn_guardarcorreccion2').click(function () {
        idrequest = $('#idcaptura2').attr('data-idrequest');
        correccion = $('#observacionescorreccion2').val();
        status = 'corregir';

        $.post('/setrequestcorregir',
            { idrequest: idrequest, correccion: correccion, status: status }, function (response) {
                if (response == 'Actualizado') {
                    socket.emit('setWebsocketUpdate', { route: 'puestaparacorreccion', idrequest: idrequest });
                    $('#observacionescorreccion2').val('');
                    $("option[value='default']").prop('selected', true)
                    $('#formcorrected2').css('display', 'none');
                    $('#side-panel2').animate({ right: -2000 }, 100, "linear");
                    $('#side-panel2').css('display', 'none');
                }
            });

    });

    //al hacer submit del motivo del rechazo
    $('#btn_guardarrechazo2').click(function () {
        idrequest = $('#idcaptura2').attr('data-idrequest');
        correccion = $('#observacionesrechazo2').val();
        status = 'rechazada';

        $.post('/setrequestcorregir',
            { idrequest: idrequest, correccion: correccion, status: status }, function (response) {
                if (response == 'Actualizado') {
                    socket.emit('setWebsocketUpdate', { route: 'puestaparacorreccion', idrequest: idrequest });
                    $('#observacionesrechazo2').val('');
                    $("option[value='default']").prop('selected', true)
                    $('#formrejected2').css('display', 'none');
                    $('#side-panel2').animate({ right: -2000 }, 100, "linear");
                    $('#side-panel2').css('display', 'none');
                }
            });

    });
});