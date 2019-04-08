var setScheduleForRequest;
var socket;
$(document).ready(function(){

    //-----------------------------------------------------------------------
    //-------------------------------WEBSOCKETS------------------------------
    //-----------------------------------------------------------------------

    //socket = io.connect('http://192.168.3.62');
    //var socket = io.connect('http://10.162.45.20:4040');
    //var socket = io.connect('http://localhost:4040');
    //var socket = io.connect('http://192.168.1.69:4040');
    socket.on('refreshalldivs', function (msg) {
        console.log('Actualizando divs');
        //feedactivadores();
        //feedcampanias();
        feedminidash(); //ajax y/o websocket especifico
        tabla_borradores(); //ajax
        //tabla_capturas();
        //tabla_agenda();
        //tabla_correcciones();
    });

    //DEFAULT ACK
    var idasesor;
    socket.on('default_handshake',function(msg){
        
        //REPORTE A SERVER AL CARGAR
        idasesor = $("#seccionconfirmarcaptura").data('user');
        nombreasesor = $("#asesorname").data('name');
        sockid = socket.id;
        socket.emit('reportealista', { idasesor: idasesor, sockid: sockid });
    });

    //REPORTE AL SERVER AL OCURRIR UNA NUEVA CONEXION
    socket.on('reportensetodos', function (msg) {
        if (msg == "reportensetodos") {
            idasesor = $("#seccionconfirmarcaptura").data('user');
            nombreasesor = $("#asesorname").data('name');
            socket.emit('reportealista', { id: idasesor, nombre: nombreasesor });
            //console.log(socket.id);
        }
    });

    //---------------------------------------
    
    socket.on('nuevacapturaoasignacionasesor', function (msg) {
        tabla_capturas();
    });

    socket.on('capturaactivadaasesor',function(msg){
        feedactivadores();
        feedcampanias();
        tabla_capturas();
    });

    socket.on('puestaenesperaasesor',function(msg){
        tabla_capturas();
    });

    socket.on('cambiodestatuscerradorasesor', function (msg) {
        tabla_capturas();
    });

    socket.on('puestaparacorreccionasesor', function (msg) {
        tabla_correcciones();
        tabla_capturas();
    });

    socket.on('capturaagendadaasesor', function (msg) {
        tabla_agenda();
        
    });

    socket.on('capturaaceptadaasesor', function (msg) {
        tabla_capturas();
    });

    socket.on('actualizarasesordomicilio', function (msg) {
        filltable();
    });

    

    //-----------------------------------------------------------------------
    //-------------------------------WEBSOCKETS------------------------------
    //-----------------------------------------------------------------------
    




    //------------------------------------------------------------------------
    //inicializando los botones de submit deshabilitados
    $('#botonguardarmodal').prop('disabled', true);
    $('#botonborradormodal').prop('disabled', true);

    
    //agendar
    setScheduleForRequest = function (fecha, cac, idrequest) {
        $.post('/setScheduleForRequest', { fecha: fecha, cac: cac, idrequest: idrequest }, function (response) {
            if (response == 'Actualizado') {
                $('#date_agenda').val('');
                $('#cac_agenda').val('');
                getdatarequestwithid(idrequest);
                socket.emit('setWebsocketUpdate', { route: 'capturaagendada', idrequest: idrequest });
                $('#save_agenda').prop('disabled', true);
                $('#agenda_span').css('display','none');
            }
        });
    }


    

    //evento para habilitar los botones de submit al hacer keyup o change en caso del select
    $('input').on('keyup',function(){
        buttonsforsubmitevents();
    });

    $('select').change(function(){
        buttonsforsubmitevents();
    });

    function buttonsforsubmitevents() {
        //para enviar y guardar
        var mandatory = $('.mandatory').length;
        var mandatorywithhassuccess = $('.has-success').find('.mandatory').length;
        var simultaneusselector = $('.mandatory.has-success').length;
        var total_validated = mandatorywithhassuccess + simultaneusselector;

        var witherror = $('.has-error').length;

        if ((mandatory == total_validated) && (witherror == 0)) {
            $('#botonguardarmodal').prop('disabled', false);
        } else {
            $('#botonguardarmodal').prop('disabled', true);
        }


        //para guardar como borrador
        var fordraw = $('.neededfordraw').length;
        var inputfordraw = $('.has-success').find('.neededfordraw').length;
        var radiofordraw = $('.neededfordraw.has-success').length;
        var total_validated_fordraw = inputfordraw + radiofordraw;



        if ((fordraw == total_validated_fordraw) && (witherror == 0)) {
            $('#botonborradormodal').prop('disabled', false);
        } else {
            $('#botonborradormodal').prop('disabled', true);
        }
    }

    //----------------------------------------------------------------------------------------------
    // eventos principales de los botones
    // llaman a la funcion para capturar los datos de los campos y establece un status
    $('#botonborradormodal').on('click', function(){
        getDataFromFormAndSubmit('borrador');
        
    });

    $('#botonguardarmodal').on('click', function () {
        getDataFromFormAndSubmit('enviado');
        resetfields();
        $('#capturanormalmodal').modal('hide');
    });

    
    $('#botoncorreccionmodal').on('click', function () {
        getDataFromFormAndSubmit('corregir');
        resetfields();
        $('#capturanormalmodal').modal('hide');
    });
    
    //----------------------------------------------------------------------------------------------
    
    

    function getDataFromFormAndSubmit(status) {
        var rol = $('body').data('rol');
        //console.log(rol);
        var userLoggedIn = $('#seccionconfirmarcaptura').data('user');
        //pestaña datos del plan
        var tipodeactivacion = $("input[name='tipoactivacion']:checked").val();
        var procedencia = $("input[name='procedencia']:checked").val();
        var numeroporasignar = $("input[name='tipodelinea']:checked").val();
        var numeroamigrar = $("input[name='numamigrar']").val();
        var referenciaacta = $("input[name='refacta']").val();
        var canal = $("input[name='canal']").val();
        var plan = $("#selectplan").val();
        var equipo = $("input[name='equipo']").val();
        var costoamigo = $("input[name='costoamigo']").val();
        var pagoinicial = $("input[name='pagoinicial']").val();

        //pestaña datos personales
        var sexo = $("input[name='sexo']:checked").val();
        var apellidoscliente = $("input[name='apellidos']").val();
        var nombrescliente = $("input[name='nombres']").val();
        var fechadenacimiento = $("input[name='fechadenacimiento']").val();
        var numerodelcliente = $("input[name='numcliente']").val();
        var email = $("input[name='email']").val();
        var rfc = $("input[name='rfc']").val();

        //pestaña domicilio cliente
        var estado = $("input[name='estado']").val();
        var ciudad = $("input[name='ciudad']").val();
        var callecliente = $("input[name='callecliente']").val();
        var numinterior = $("input[name='numinterior']").val();
        var numexterior = $("input[name='numexterior']").val();
        var cruzamientos = $("input[name='cruzamientos']").val();
        var colonia = $("input[name='colonia']").val();
        var codigopostal = $("input[name='codigopostal']").val();
        var referencias = $("input[name='referencias']").val();
        var numcelularofijo = $("input[name='numcelularofijo']").val();
        var horariovisita = $("input[name='horariovisita']").val();

        //pestaña datos laborales
        var nombreempresa = $("input[name='nombreempresa']").val();
        var cargo = $("input[name='cargo']").val();
        var celofijolaboral = $("input[name='celofijolaboral']").val();
        var extensionlaboral = $("input[name='extensionlaboral']").val();
        var horariovisitalaboral = $("input[name='horariovisitalaboral']").val();

        //pestaña referencias
        var nombresref1 = $("input[name='nombresref1']").val();
        var apellidosref1 = $("input[name='apellidosref1']").val();
        var telref1 = $("input[name='telref1']").val();
        var horarioref1 = $("input[name='horarioref1']").val();

        var nombresref2 = $("input[name='nombresref2']").val();
        var apellidosref2 = $("input[name='apellidosref2']").val();
        var telref2 = $("input[name='telref2']").val();
        var horarioref2 = $("input[name='horarioref2']").val();

        var nombresref3 = $("input[name='nombresref3']").val();
        var apellidosref3 = $("input[name='apellidosref3']").val();
        var telref3 = $("input[name='telref3']").val();
        var horarioref3 = $("input[name='horarioref3']").val();

        //pestaña confirmar captura
        var observaciones = $("input[name='observacionesadicionales']").val();

        var statusofrequest = status; 
        
    insertdata(rol,userLoggedIn,tipodeactivacion, procedencia, numeroporasignar, numeroamigrar, referenciaacta, numerodelcliente, canal, plan, equipo, costoamigo, pagoinicial,
            sexo, apellidoscliente, nombrescliente, fechadenacimiento, email, rfc,
            estado, ciudad, callecliente, numinterior, numexterior, cruzamientos, colonia,codigopostal,referencias, numcelularofijo, horariovisita,
            nombreempresa, cargo, celofijolaboral, extensionlaboral, horariovisitalaboral,
        nombresref1, apellidosref1, telref1, horarioref1, nombresref2, apellidosref2, telref2, horarioref2, nombresref3, apellidosref3, telref3, horarioref3,observaciones, statusofrequest);

    };


    function insertdata(
        rol,
        userLoggedIn, 
        //parametros
        tipodeactivacion,procedencia,numeroporasignar,numeroamigrar,referenciaacta,numerodelcliente,canal,plan,equipo,costoamigo,pagoinicial,
        sexo, apellidoscliente,nombrescliente, fechadenacimiento, email,rfc,
        estado,ciudad,callecliente,numinterior,numexterior,cruzamientos,colonia,codigopostal,referencias,numcelularofijo,horariovisita,
        nombreempresa,cargo,celofijolaboral,extensionlaboral,horariovisitalaboral,
        nombresref1, apellidosref1, telref1, horarioref1, nombresref2, apellidosref2, telref2, horarioref2, nombresref3, apellidosref3, telref3, horarioref3,
        observaciones,statusofrequest
    ){
        //validacion de campos nulos
        if (tipodeactivacion == undefined) {tipodeactivacion = null;}
        if (procedencia == undefined) { procedencia = null; }
        if (numeroporasignar == undefined) { numeroporasignar = null; }
        if (numeroamigrar == undefined) { numeroamigrar = null; }
        if (referenciaacta == undefined) { referenciaacta = null; }
        if (numerodelcliente == undefined) { numerodelcliente = null; }
        if (canal == undefined) { canal = null; }
        if (plan == undefined) { plan = null; }
        if (equipo == undefined) { equipo = null; }
        if (costoamigo == undefined) { costoamigo = null; }
        if (pagoinicial == undefined) { pagoinicial = null; }

        if (sexo == undefined) { sexo = null; }
        if (apellidoscliente == undefined) { apellidoscliente = null; }
        if (nombrescliente == undefined) { nombrescliente = null; }
        if (fechadenacimiento == undefined) { fechadenacimiento = null; }
        if (email == undefined) { email = null; }
        if (rfc == undefined) { rfc = null; }

        if (estado == undefined) { estado = null; }
        if (ciudad == undefined) { ciudad = null; }
        if (callecliente == undefined) { callecliente = null; }
        if (numinterior == undefined) { numinterior = null; }
        if (numexterior == undefined) { numexterior = null; }
        if (cruzamientos == undefined) { cruzamientos = null; }
        if (colonia == undefined) { colonia = null; }
        if (codigopostal == undefined) { codigopostal = null; }
        if (referencias == undefined) { referencias = null; }
        if (numcelularofijo == undefined) { numcelularofijo = null; }
        if (horariovisita == undefined) { horariovisita = null; }
        
        if (nombreempresa == undefined) { nombreempresa = null; }
        if (cargo == undefined) { cargo = null; }
        if (celofijolaboral == undefined) { celofijolaboral = null; }
        if (extensionlaboral == undefined) { extensionlaboral = null; }
        if (horariovisitalaboral == undefined) { horariovisitalaboral = null; }

        if (nombresref1 == undefined) { nombresref1 = null; }
        if (apellidosref1 == undefined) { apellidosref1 = null; }
        if (telref1 == undefined) { telref1 = null; }
        if (horarioref1 == undefined) { horarioref1 = null; }

        if (nombresref2 == undefined) { nombresref2 = null; }
        if (apellidosref2 == undefined) { apellidosref2 = null; }
        if (telref2 == undefined) { telref2 = null; }
        if (horarioref2 == undefined) { horarioref2 = null; }

        if (nombresref3 == undefined) { nombresref3 = null; }
        if (apellidosref3 == undefined) { apellidosref3 = null; }
        if (telref3 == undefined) { telref3 = null; }
        if (horarioref3 == undefined) { horarioref3 = null; }

        if (observaciones == undefined) { observaciones = null; }
        //ajax
        if ((userLoggedIn != '') && (rol != 7)){

            var insertar = '/insertdata';
            var actualizar = '/updatedata';
            var action;
            var valor_idrequest = $('#id_registrodb').text();
            if (valor_idrequest == ' '){
                action = insertar;
            }else{
                action = actualizar;
            }


            $.post(action, {
                userLoggedIn: userLoggedIn,
                valor_idrequest: valor_idrequest,
                //---------------------------
                tipodeactivacion: tipodeactivacion,
                procedencia: procedencia,
                numeroporasignar: numeroporasignar,
                numeroamigrar: numeroamigrar,
                referenciaacta: referenciaacta,
                canal: canal,
                plan: plan,
                equipo: equipo,
                costoamigo: costoamigo,
                pagoinicial: pagoinicial,
                // ---------------------------
                sexo: sexo,
                apellidoscliente: apellidoscliente,
                nombrescliente: nombrescliente,
                fechadenacimiento: fechadenacimiento,
                numerodelcliente: numerodelcliente,
                email: email,
                rfc: rfc,
                // ---------------------------
                estado: estado,
                ciudad: ciudad,
                callecliente: callecliente,
                numinterior: numinterior,
                numexterior: numexterior,
                cruzamientos: cruzamientos,
                colonia: colonia,
                codigopostal: codigopostal,
                referencias: referencias,
                numcelularofijo: numcelularofijo,
                horariovisita: horariovisita,
                // ----------------------------
                nombreempresa: nombreempresa,
                cargo: cargo,
                celofijolaboral: celofijolaboral,
                extensionlaboral: extensionlaboral,
                horariovisitalaboral: horariovisitalaboral,
                // -----------------------------
                nombresref1: nombresref1,
                apellidosref1: apellidosref1,
                telref1: telref1,
                horarioref1: horarioref1,

                nombresref2: nombresref2,
                apellidosref2: apellidosref2,
                telref2: telref2,
                horarioref2: horarioref2,

                nombresref3: nombresref3,
                apellidosref3: apellidosref3,
                telref3: telref3,
                horarioref3: horarioref3,

                // -------------------------------
                observaciones: observaciones,
                //status
                statusofrequest: statusofrequest
            }, function(data) {
                if (data != 'Actualizado'){
                    $('#id_registrodb').html(' ');
                    $('#id_registrodb').html(data);
                    socket.emit('setWebsocketUpdate', { route: 'nuevacapturaoasignacion', idrequest: data });
                }else{

                    setInterval(function(){
                        $('#btn-borrador').html('Actualizar borrador');
                    },1000);
                    $('#btn-borrador').html('Actualizando...');
                    var idrequest_corrected = $('#id_registrodb').html();
                    socket.emit('setWebsocketUpdate', { route: 'nuevacapturaoasignacion', idrequest: idrequest_corrected });
                }
                
                if(statusofrequest == "corregir"){
                    var idrequest_corrected = $('#id_registrodb').html();
                    socket.emit('setWebsocketUpdate', { route: 'puestaparacorreccion', idrequest: idrequest_corrected });
                }if(statusofrequest == "borrador"){
                    tabla_borradores();
                }
            }
            )}else{
            alert('Debido a ser perfil de capacitación no es posible la inserción a la base de datos');
        }
    }
    
});