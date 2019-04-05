var resetfields, setdatamodal, getdatarequestwithid;
$(document).ready(function () {
    //EN ESTE JS:
    //popover_init
    //select2_init
    //funcion setdatamodal
    //function resetfields
    //getdatarequestwithid para llenar el detailpanel de capturas y correcciones

    // DATETIME PICKER --------------------------------------------------------------------------------------
    $('.datetimepicker_notime').datetimepicker({
        timepicker: false,
        format: 'Y/m/d',
        validateOnBlur: false
    });
        // DATETIME PICKER --------------------------------------------------------------------------------------
    
    resetfields = function() {
        //pestaña datos del plan
        $("input[name='tipoactivacion']").prop('checked', false);
        $("input[name='procedencia']").prop('checked', false);
        $("input[name='tipodelinea']").prop('checked', false);
        $("input[name='numamigrar']").val('');
        $("input[name='refacta']").val('');

        $("input[name='canal']").val('');
        $("#selectplan").val('');
        $("#selectplan").trigger('change');
        $("input[name='equipo']").val('');
        $("input[name='costoamigo']").val('');
        $("input[name='pagoinicial']").val('');

        //pestaña datos personales
        $("input[name='sexo']").prop('checked', false);
        $("input[name='apellidos']").val('');
        $("input[name='nombres']").val('');
        $("input[name='fechadenacimiento']").val('');
        $("input[name='numcliente']").val('');
        $("input[name='email']").val('');
        $("input[name='rfc']").val('');

        //pestaña domicilio cliente
        $("input[name='estado']").val('');
        $("input[name='ciudad']").val('');
        $("input[name='callecliente']").val('');
        $("input[name='numinterior']").val('');
        $("input[name='numexterior']").val('');
        $("input[name='cruzamientos']").val('');
        $("input[name='colonia']").val('');
        $("input[name='referencias']").val('');
        $("input[name='numcelularofijo']").val('');
        $("input[name='horariovisita']").val('');

        //pestaña datos laborales
        $("input[name='nombreempresa']").val('');
        $("input[name='cargo']").val('');
        $("input[name='celofijolaboral']").val('');
        $("input[name='extensionlaboral']").val('');
        $("input[name='horariovisitalaboral']").val('');

        //pestaña referencias
        $("input[name='nombresref1']").val('');
        $("input[name='apellidosref1']").val('');
        $("input[name='telref1']").val('');
        $("input[name='horarioref1']").val('');

        $("input[name='nombresref2']").val('');
        $("input[name='apellidosref2']").val('');
        $("input[name='telref2']").val('');
        $("input[name='horarioref2']").val('');

        $("input[name='nombresref3']").val('');
        $("input[name='apellidosref3']").val('');
        $("input[name='telref3']").val('');
        $("input[name='horarioref3']").val('');

        //pestaña confirmar captura
        $("input[name='observacionesadicionales']").val('');

        //condicionales asignadas al campo de migracion de numero
        $('#condnumamigrar').css('display', 'none'); //ocultar input
        $('#numeroamigrar').removeClass('mandatory'); //retirar el mandatory que se asigna al dar click
        $('#conf_numamigrar').html("");

        //para todos los input
        $('.has-success, .has-error').removeClass('has-success').removeClass('has-error');
        $('.select2-has-success, .select2-has-error').removeClass('select2-has-success').removeClass('select2-has-error');

        //para todos los campos de confirmacion de datos
        $('#containerconfirmardatos p span').html("");
        //para eliminar el id de la captura
        $('#id_registrodb').html(' ');

        //reseteo del boton de actualizar
        $('#btn-borrador').html('Guardar borrador');

        //se deshabilitan botones
        $('#botonborradormodal').prop('disabled', true);
        $('#botonguardarmodal').prop('disabled', true);
        $('[data-toggle="popover"]').popover('hide');
        //alert('debugging: resetfields ok');

        //Se habilitan botones de envio
        $('#botonborradormodal, #botonguardarmodal').css('display','block');
        $('#botoncorreccionmodal').css('display','none');
    }

    //eventos ON LOAD -------
    $('#happyclosebutton').popover({html: true, trigger: 'click'});
    resetfields();
    
    //$('#happyclosebutton2').popover({ html: true, trigger: 'click' });
    
    // -----------------------------------------------------------------


    $('.dynamicselect').select2({
        dropdownParent: $("#capturanormalmodal"),
        placeholder: "Selecciona un plan",
        allowClear: true,
        dropdownCssClass: 'selectplan'
    });

    $('.dynamicselect2').select2({
        dropdownParent: $("#capturadomiciliomodal"),
        placeholder: "Selecciona un plan",
        allowClear: true,
        dropdownCssClass: 'selectplan'
    });


    //AJAX PARA ALIMENTAR PANEL DE DETALLES AL HACER CLICK A LOS TR DE LA TABLA DE ACTIVACIONES
    $('#statuscapturas').on('click', '.rows_capturas',function(){
        var idrequest = $(this).data('idrequest');
        $('#panelContainerDetails').css('display', 'block');
        $('#overlay-back').css('display', 'block');
        $('#date_agenda, #cac_agenda').val('');
        getdatarequestwithid(idrequest);
    });

    //AJAX PARA ALIMENTAR PANEL DE DETALLES AL HACER CLICK A LOS TR DE LA TABLA DE AGENDA
    $('#statusagenda').on('click', '.rows_agenda', function () {
        var idrequest = $(this).data('idrequest');
        $('#panelContainerDetails').css('display', 'block');
        $('#overlay-back').css('display', 'block');
        $('#date_agenda, #cac_agenda').val('');
        getdatarequestwithid(idrequest);

    });


    //AJAX PARA ALIMENTAR MODAL AL HACER CLICK A LOS TR DE LA TABLA DE BORRADORES
    $('#statusborrador').on('click', '.rows_borrador', function () {
        resetfields();
        var idrequest = $(this).data('idrequest');
        $('#botonborradormodal, #botonguardarmodal').css('display', 'block');
        $('#botoncorreccionmodal').css('display', 'none');
        $('#capturanormalmodalbtn').trigger('click');
        setdatamodal(idrequest);
    });


    //AJAX PARA TABLA DE CORRECCIONES, MUESTRA BOTON AL MODAL AL TENER STATUS DE CORREGIR
    $('#statuscorregir').on('click', '.rows_correcciones', function () {
        resetfields();
        var idrequest = $(this).data('idrequest');
        $('#panelContainerDetails').css('display', 'block');
        $('#overlay-back').css('display', 'block');
        $('#date_agenda, #cac_agenda').val('');
        getdatarequestwithid(idrequest);
    });

    //FUNCION PARA ESCRIBIR RESPONSE EN MODAL EN BORRADORES Y CORRECCIONES--------------------------
    setdatamodal = function (idrequest) {
        $.post('/getdatarequest', { idregistro: idrequest }, function (response) {

            //Poner el idrequest en el titulo para que detecte que es borrador y solo habilite ese boton
            //hasta que se llene completamente
            $('#id_registrodb').html(idrequest);

            //datos personales
            //$('#get_sexo').html();
            if (response[1]["gender"] == 'Hombre') {
                $("input[name='sexo']").trigger('click');
                $("input[value='Hombre']").trigger('click');
            } else if (response[1]["gender"] == 'Mujer') {
                $("input[name='sexo']").trigger('click');
                $("input[value='Mujer']").trigger('click');
            }

            $('#apellidos').val(response[1]["lastname"]);
            $('#nombres').val(response[1]["name"]);
            $('#fechadenacimiento').val(response[1]["birthday"]);
            $('#numerodelcliente').val(response[1]["contact_num"]);
            $('#email').val(response[1]["email"]);
            $('#rfc').val(response[1]["rfc"]);

            //DATOS DEL PLAN ---------------------------------------------------
            //DATOS DEL PLAN ---------------------------------------------------
            //DATOS DEL PLAN ---------------------------------------------------

            //TIPO DE ACTIVACION RADIOBUTTON
            if (response[2]["tipo"] == 'Inmediata') {
                $("input[name='tipoactivacion']").trigger('click');
                $("input[value='Inmediata']").trigger('click');
            } else if (response[2]["tipo"] == 'Diferida') {
                $("input[name='tipoactivacion']").trigger('click');
                $("input[value='Diferida']").trigger('click');
            }

            //PROCEDENCIA RADIOBUTTON
            if (response[2]["origen"] == 'Aheeva') {
                $("input[name='procedencia']").trigger('click');
                $("input[value='Aheeva']").trigger('click');
            } else if (response[2]["origen"] == '111') {
                $("input[name='procedencia']").trigger('click');
                $("input[value='111']").trigger('click');
            } else if (response[2]["origen"] == 'Nekotec') {
                $("input[name='procedencia']").trigger('click');
                $("input[value='Nekotec']").trigger('click');
            }

            //NUMERO A MIGRAR RADIOBUTTON
            if (response[2]["amigrar"] == 'lineanueva') {
                $("input[name='tipodelinea']").trigger('click');
                $("input[value='lineanueva']").trigger('click');
                $('#numeroamigrar').val('');
                $('#conf_numamigrar').html('Linea nueva');
            } else if ((response[2]["amigrar"] == 'msr')) {
                
                $("input[name='tipodelinea']").trigger('click');
                $("input[value='msr']").trigger('click');
                $('#numeroamigrar').val('');
                $('#conf_numamigrar').html('MSR');
            } else if ((response[2]["amigrar"] != 'lineanueva') && (response[2]["amigrar"] != '') && (response[2]["amigrar"] != 'msr')) {
                $("input[name='tipodelinea']").trigger('click');
                $("input[value='migracion']").trigger('click');
                $('#numeroamigrar').val(response[2]["amigrar"]);
                $('#conf_numamigrar').html(response[2]["amigrar"]);
            }


            $('#referenciaacuenta').val(response[2]["refacta"]);
            $('#canal').val(response[2]["canal"]);
            $('#selectplan').val(response[2]["idplan"]).trigger('change');
            //$('#get_plazo').val(response[2]["plazoplan"]);
            //$('#get_claveplan').val(response[2]["claveplan"]);
            $('#equipo').val(response[2]["equipocelular"]);
            $('#pagoinicial').val(response[2]["pagoinicial"]);
            $('#costoamigo').val(response[2]["preciodelista"]);

            //address
            $('#estado').val(response[3]["state"]);
            $('#ciudad').val(response[3]["city"]);
            $('#callecliente').val(response[3]["street"]);
            $('#numexterior').val(response[3]["num_ext"]);
            $('#numinterior').val(response[3]["num_int"]);
            $('#cruzamientos').val(response[3]["between_streets"]);
            $('#colonia').val(response[3]["district"]);
            $('#codigopostal').val(response[3]["postalcode"]);
            $('#numcelularofijo').val(response[3]["local_phonenumber"]);
            $('#horariovisita').val(response[3]["availability"]);
            $('#referencias').val(response[3]["reference"]);

            //datos laborales
            $('#nombreempresa').val(response[4]["jobname"]);
            $('#cargo').val(response[4]["job"]);
            $('#celofijolaboral').val(response[4]["phonenumber"]);
            $('#extensionlaboral').val(response[4]["extension"]);
            $('#horariovisitalaboral').val(response[4]["availability"]);

            //referencias

            $('#nombresref1').val(response[5]["refname"]);
            $('#apellidosref1').val(response[5]["reflastname"]);
            $('#telref1').val(response[5]["refphonenumber"]);
            $('#horarioref1').val(response[5]["refavailability"]);

            $('#nombresref2').val(response[6]["refname"]);
            $('#apellidosref2').val(response[6]["reflastname"]);
            $('#telref2').val(response[6]["refphonenumber"]);
            $('#horarioref2').val(response[6]["refavailability"]);

            //NOTA: DEBIDO A REQUERIMIENTO DE AGREGAR FORMULARIO PARA TERCER CONTACTO DE REFERENCIA
            //ES NECESARIO VALIDAR SI ESTE EXISTE, EN CASO DE EXISTIR SE TOMA EN CUENTA UNA
            //TUPLA EXTRA EN EL JSON RESPONSE
            if(response[8]){
                $('#nombresref3').val(response[7]["refname"]);
                $('#apellidosref3').val(response[7]["reflastname"]);
                $('#telref3').val(response[7]["refphonenumber"]);
                $('#horarioref3').val(response[7]["refavailability"]);

                //observaciones
                $('#observacionesadicionales').val(response[8]["observation"]);
                $('input').trigger('keyup')
                //$("input[name='tipodelinea']").trigger('click');
            }else{
                //observaciones
                $('#observacionesadicionales').val(response[7]["observation"]);

                //SE AGREGAN REFERENCIAS DUMMYS PARA QUE NO HAYA PROBLEMA CON LA VALIDACION
                // Y CON EL "ENABLE" DEL BOTON DE GUARDAR Y ENVIAR
                //EVIDENTEMENTE SE AGREGARAN LAS REFERENCIAS DUMMYS A LA DB

                $('#nombresref3').val("NA");
                $('#apellidosref3').val("NA");
                $('#telref3').val("0000000000");
                $('#horarioref3').val("NA");

                $('input').trigger('keyup')
                //$("input[name='tipodelinea']").trigger('click');

            }

            
            $('input').trigger('keyup')
            //$("input[name='tipodelinea']").trigger('click');


        });//fin del post de select all
    }

    //FUNCION PARA ESCRIBIR RESPONSE EN DETAILPANEL DE CAPTURAS Y CORRECCIONES
    getdatarequestwithid = function (idrequest) {
        $.post('/getdatarequest', { idregistro: idrequest }, function (response) {

            //hacer request de estatus, sisact y canal
            $('#get_capturaid').html(idrequest);
            $('#get_sisact').html(response[0]["sisact"]);
            $('#get_canal2').html(response[0]["canal2"]);
            $('#get_status').html(response[0]["status"]);


            //console.log(response);
            $('#analistaasignado').html('Asignado a: ' + response[0]["analistaasignado"]);
            $('#fechadecaptura').html('Capturado: ' + response[0]["created"]);

            //datos personales
            $('#get_sexo').html(response[1]["gender"]);
            $('#get_nombresapellidos').html(response[1]["name"] + ' ' + response[1]["lastname"]);
            $('#get_fechadenacimiento').html(response[1]["birthday"]);
            $('#get_numcliente').html(response[1]["contact_num"]);
            $('#get_email').html(response[1]["email"]);
            $('#get_rfc').html(response[1]["rfc"]);

            //datos del plan
            $('#get_tipoactivacion').html(response[2]["tipo"]);
            $('#get_procedencia').html(response[2]["origen"]);
            $('#get_numamigrar').html(response[2]["amigrar"]);
            $('#get_refacta').html(response[2]["refacta"]);
            $('#get_canal').html(response[2]["canal"]);
            $('#get_plan').html(response[2]["nombreplan"]);
            $('#get_plazo').html(response[2]["plazoplan"]);
            $('#get_claveplan').html(response[2]["claveplan"]);
            $('#get_equipo').html(response[2]["equipocelular"]);
            $('#get_pagoinicial').html(response[2]["pagoinicial"]);
            $('#get_costoamigo').html(response[2]["preciodelista"]);

            //address
            $('#get_ciudadestado').html(response[3]["city"] + ", " + response[3]["state"]);
            $('#get_callecliente').html(response[3]["street"]);
            $('#get_numexterior').html(response[3]["num_ext"]);
            $('#get_numinterior').html(response[3]["num_int"]);
            $('#get_cruzamientos').html(response[3]["between_streets"]);
            $('#get_colonia').html(response[3]["district"]);
            $('#get_codigopostal').html(response[3]["postalcode"]);
            $('#get_numcelularofijo').html(response[3]["local_phonenumber"]);
            $('#get_horariovisita').html(response[3]["availability"]);
            $('#get_referencias').html(response[3]["reference"]);

            //datos laborales
            $('#get_nombreempresa').html(response[4]["jobname"]);
            $('#get_cargo').html(response[4]["job"]);
            $('#get_celofijolaboral').html(response[4]["phonenumber"]);
            $('#get_extensionlaboral').html(response[4]["extension"]);
            $('#get_horariovisitalaboral').html(response[4]["availability"]);

            //referencias
            var referencia1 = response[5]["refname"] + " " + response[5]["reflastname"] + " " + response[5]["refphonenumber"] + " " + response[5]["refavailability"];
            var referencia2 = response[6]["refname"] + " " + response[6]["reflastname"] + " " + response[6]["refphonenumber"] + " " + response[6]["refavailability"];

            if (response[8]) {
                var referencia3 = response[7]["refname"] + " " + response[7]["reflastname"] + " " + response[7]["refphonenumber"] + " " + response[7]["refavailability"];
                $('#get_referencia3').html(referencia3);
                //observaciones
                $('#get_observacionesadicionales').html(response[8]["observation"]);
                
            }else{
                //observaciones
                $('#get_observacionesadicionales').html(response[7]["observation"]);
            }

            
            $('#get_referencia1').html(referencia1);
            $('#get_referencia2').html(referencia2);
            



            
            $('#comentarioanalista').html(response[0]["comentario"]);
            $('#get_motivorechazo').html(response[0]["rechazo"]);
            $('#get_correccion').html(response[0]["correccion"]);
            $('#get_motivoaceptacion').html(response[0]["aceptacion"]);
            $('#get_fechaagenda').html(response[0]["fechaagenda"]);
            $('#get_cacagenda').html(response[0]["cacagenda"]);


            if (response[0]["status"] == 'corregir') {
                $('#showmodalforcorrection').css('display', 'block');
            } else {
                $('#showmodalforcorrection').css('display', 'none');
            }

            //Solo para panel details
            //$('#link_agenda').html("<a href='#' id='agenda_asesor"+ idrequest +"'>(Click para agendar)</a>");
            

            

        });//fin del post de select all
    }

    //REDIRECCIONAR AL MODAL AL CLICKEAR EL BOTON ENORME ROJO DE CORREGIR CAPTURA
    $('#showmodalforcorrection').click(function(){
        var idrequest = $('#get_capturaid').html();
        $('#closePanelDetails').trigger('click');
        //ocultar botones por default cuando se trate de una corrccion
        $('#capturanormalmodalbtn').trigger('click');
        $('#botonborradormodal, #botonguardarmodal').css('display', 'none');
        $('#botoncorreccionmodal').css('display','block');
        
        setdatamodal(idrequest);
    });

    //cerrar panel de detalles

    $('#closePanelDetails, #capturanormalmodalbtn').click(function(){
        resetfields();
        $('#save_agenda').prop('disabled', true);
        $('#panelContainerDetails').css('display','none');
        $('#overlay-back').css('display', 'none');
        $('#agenda_span').css('display','none');
    });

    //AGENDAR REQUEST EN PANEL DE DETALLES
    
    //toggle hide show de formulario
    $('#agenda_asesor').click(function(){
        $('#agenda_span').toggle();
    });
    
    //formateo de datetimpicker
    $('.datetimepicker').datetimepicker({
        format: 'Y/m/d H:m:s',
        validateOnBlur: false
    });
    // DATETIME PICKER 
    
    //Validacion de campos de formulario de agenda
    $('#cac_agenda, #date_agenda').on('keyup',function () {
        var valordate = $('#date_agenda').val();
        var valorcac = $('#cac_agenda').val();
        var regexdate = /^(\d{4})(\/)(0[1-9]|1[0-2])\2([0-2][0-9]|3[0-1])(\s)([0-1][0-9]|2[0-3])(:)([0-5][0-9])(:)([0-5][0-9])$/;
        var regexcac = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s\d]{1,20}$/;
        if (valordate.match(regexdate) && valorcac.match(regexcac)) {
            $('#save_agenda').prop('disabled', false);
        } else {
            $('#save_agenda').prop('disabled', true);
        }
    });

    //retrieve data de formulario y llamado a la funcion de insercion
    $('#save_agenda').click(function (e) {
        var fecha = $('#date_agenda').val();
        var cac = $('#cac_agenda').val();
        var idrequest = $('#get_capturaid').html();
        if ((fecha != '')&&(cac != '')){
            //SE LLAMARA AL AJAX PARA GUARDAR LOS DATOS Y REFRESCAR EL PANEL DE DETALLES
            setScheduleForRequest(fecha, cac, idrequest);
            e.stopImmediatePropagation();
            e.preventDefault();
        }else{
            alert('Se ha detectado uso incorrecto de la plataforma, los cambios no han sido guardados');
            $('#save_agenda').prop('disabled', true);
            $('#closePanelDetails').trigger('click');
        }
        
    });

});