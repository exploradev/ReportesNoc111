var colorvalidacion, resetcoloremptyfields;
$(document).ready(function(){

    //EVITA EL SUBMIT AL CLICKEAR ANTER
    $(window).keydown(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });

    //reset empty fields
    resetcoloremptyfields = function(selector,valorselector){
        if (valorselector == '') {
            selector.closest('div').removeClass('has-success').removeClass('has-error');
            selector.removeClass('select2-has-success').removeClass('select2-has-error');
        }
        
    }

    //validacion datos del plan

    $("input[name='tipoactivacion']").on('click', function(){
        $(this).closest('div').addClass('has-success');
        var tipodeactivacion_validacion = $("input[name='tipoactivacion']:checked").val();
        $('#conf_tipoactivacion').html(tipodeactivacion_validacion);
    });

    $("input[name='procedencia']").on('click', function () {
        $(this).closest('div').addClass('has-success');
        var procedencia_validacion = $("input[name='procedencia']:checked").val();
        $('#conf_procedencia').html(procedencia_validacion);
    });



    $("input[name='tipodelinea']").on('click', function () {
        $(this).closest('div').addClass('has-success');
        var tipodelinea_validacion = $("input[name='tipodelinea']:checked").val();
        if ((tipodelinea_validacion == 'msr') || (tipodelinea_validacion == 'lineanueva')){
            $('#conf_numamigrar').html(tipodelinea_validacion);
            //alert(tipodelinea_validacion);
        }else{
            var value = $("input[name='numamigrar']").val();
            $('#conf_numamigrar').html(value);
        }
        
    });

       
    $("input[name='numamigrar']").on('keyup',function () {
        var selector = $(this);
        var valorselector = $(this).val();
        var regex = /^\d{10}$/;
        //$('#conf_numamigrar').html(valorselector);
        colorvalidacion(selector, valorselector, regex);
        resetcoloremptyfields(selector, valorselector);
    });

    

    $("input[name='refacta']").on('keyup',function () {
        var selector = $(this);
        var valorselector = $(this).val();
        var regex = /^\d{8}$/;
        $('#conf_refacta').html(valorselector);
        colorvalidacion(selector, valorselector, regex);
        resetcoloremptyfields(selector, valorselector);
        
    });

    $("input[name='canal']").on('keyup',function () {
        var selector = $(this);
        var valorselector = $(this).val();
        var regex = /^(\w){1,20}$/;
        $('#conf_canal').html(valorselector);
        colorvalidacion(selector, valorselector, regex);
        resetcoloremptyfields(selector, valorselector);
    });


    $("#selectplan").change(function(){
        var selector = $('.select2-selection.select2-selection--single');
        var nombredeplan = $(this).val();
        if(nombredeplan == ''){
            
            $(this).closest('div').removeClass('has-success');
            $(this).closest('div').addClass('has-error');
            $('.select2-selection.select2-selection--single').removeClass('select2-has-success');
            $('.select2-selection.select2-selection--single').addClass('select2-has-error'); 
        }else{
            
            $(this).closest('div').removeClass('has-error');
            $(this).closest('div').addClass('has-success');
            $('.select2-selection.select2-selection--single').removeClass('select2-has-error');
            $('.select2-selection.select2-selection--single').addClass('select2-has-success');
        }
        resetcoloremptyfields(selector, nombredeplan);

        //datos del plan en confirmacion de captura
        var nombreplan = $(this).find(":selected").text();
        var claveplan = $(this).find(":selected").data("keyname");
        var plazoplan = $(this).find(":selected").data("term");
        $('#conf_plan').html(nombreplan);
        $('#conf_claveplan').html(claveplan);

        if(claveplan == undefined){
            $('#clavedeplan').html('Clave:');
            $('#plazodeplan').html('Plazo:');
            $('#conf_claveplan').html("");
            $('#conf_plan').html("");
        }else{
            $('#clavedeplan').html('Clave: ' + claveplan);
            $('#plazodeplan').html('Plazo: ' + plazoplan);
        }     
    });

    $("input[name='equipo']").on('keyup',function () {
        var selector = $(this);
        var valorselector = $(this).val();
        var regex = /^([a-zA-ZñÑáéíóúÁÉÍÓÚ\s\d\.\-_\/\\\']){1,50}$/;
        $('#conf_equipo').html(valorselector);
        colorvalidacion(selector, valorselector, regex);
        resetcoloremptyfields(selector, valorselector);
    });

    $("input[name='costoamigo']").on('keyup',function () {
        var selector = $(this);
        var valorselector = $(this).val();
        var regex = /^\d+\.\d+$/;
        $('#conf_costoamigo').html(valorselector);
        colorvalidacion(selector, valorselector, regex);
        resetcoloremptyfields(selector, valorselector);
    });

    $("input[name='pagoinicial']").on('keyup',function () {
        var selector = $(this);
        var valorselector = $(this).val();
        var regex = /^\d+\.\d+$/;
        $('#conf_pagoinicial').html(valorselector);
        colorvalidacion(selector, valorselector, regex);
        resetcoloremptyfields(selector, valorselector);
    });

    //validacion datospersonales

    $("input[name='sexo']").on('click', function () {
        var selector = $(this);
        $(this).closest('div').addClass('has-success');
        var sexo_validacion = $("input[name='sexo']:checked").val();
        $('#conf_sexo').html(sexo_validacion);
        resetcoloremptyfields(selector, sexo_validacion);
    });

    var apellidos, nombres;
    $("input[name='apellidos']").on('keyup',function () {
        var selector = $(this);
        apellidos = $(this).val();
        var regex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s\d]{1,50}$/;
        concatenarnombre(nombres,apellidos);
        colorvalidacion(selector, apellidos, regex);
        resetcoloremptyfields(selector, apellidos);
    });

    $("input[name='nombres']").on('keyup',function () {
        var selector = $(this);
        nombres = $(this).val();
        var regex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s\d]{1,50}$/;
        concatenarnombre(nombres, apellidos);
        colorvalidacion(selector, nombres, regex);
        resetcoloremptyfields(selector, nombres);
    });

    function concatenarnombre(nombres,apellidos){
        if(!(nombres == '' || apellidos == '')){
            $('#conf_nombresapellidos').html(apellidos + " " + nombres);
        }else{
            $('#conf_nombresapellidos').html(' ');
        }
    }

    //-------------------------------------------------------------

    $("input[name='fechadenacimiento']").on('change',function(){
        var selector = $(this);
        var valorselector = $(this).val();
        var regex = /^\d{4}[\-\/\s]?((((0[13578])|(1[02]))[\-\/\s]?(([0-2][0-9])|(3[01])))|(((0[469])|(11))[\-\/\s]?(([0-2][0-9])|(30)))|(02[\-\/\s]?[0-2][0-9]))$/;
        //var regex = /[\d/]+/;
        $('#conf_fechadenacimiento').html(valorselector);
        colorvalidacion(selector,valorselector,regex)
        resetcoloremptyfields(selector, valorselector);
    });

    $("input[name='fechadenacimiento']").on('keyup', function () {
        var selector = $(this);
        var valorselector = $(this).val();
        var regex = /^\d{4}[\-\/\s]?((((0[13578])|(1[02]))[\-\/\s]?(([0-2][0-9])|(3[01])))|(((0[469])|(11))[\-\/\s]?(([0-2][0-9])|(30)))|(02[\-\/\s]?[0-2][0-9]))$/;
        //var regex = /[\d/]+/;
        $('#conf_fechadenacimiento').html(valorselector);
        colorvalidacion(selector, valorselector, regex)
        resetcoloremptyfields(selector, valorselector);
    });

    //-------------------------------------------------------------

    $("input[name='numcliente']").on('keyup',function () {
        var selector = $(this);
        var valorselector = $(this).val();
        var regex = /^\d{10}$/;
        $('#conf_numcliente').html(valorselector);
        colorvalidacion(selector, valorselector, regex);
        resetcoloremptyfields(selector, valorselector);
    });

    $("input[name='email']").on('keyup',function () {
        var selector = $(this);
        var valorselector = $(this).val();
        var regex = /^[\w.\-\_ñ]+@\w+(\.\w+)+$/;
        $('#conf_email').html(valorselector);
        colorvalidacion(selector, valorselector, regex);
        resetcoloremptyfields(selector, valorselector);
    });

    $("input[name='rfc']").on('keyup',function () {
        var selector = $(this);
        var valorselector = $(this).val();
        var regex = /^\w{10,13}$/;
        $('#conf_rfc').html(valorselector);
        colorvalidacion(selector, valorselector, regex);
        resetcoloremptyfields(selector, valorselector);
    });

       


    //validacion domicilio cliente

    var estado, ciudad;

    $("input[name='estado']").on('keyup',function () {
        var selector = $(this);
        estado = $(this).val();
        var regex = /^([a-zA-ZñÑáéíóúÁÉÍÓÚ\s\d\.\-_\/\\\']){1,50}$/;
        
        colorvalidacion(selector, estado, regex);
        concatenarestado(ciudad, estado);
        resetcoloremptyfields(selector, estado);
    });

    $("input[name='ciudad']").on('keyup',function () {
        var selector = $(this);
        ciudad = $(this).val();
        var regex = /^([a-zA-ZñÑáéíóúÁÉÍÓÚ\s\d\.\-_\/\\\']){1,50}$/;
        
        colorvalidacion(selector, ciudad, regex);
        concatenarestado(ciudad, estado);
        resetcoloremptyfields(selector, ciudad);
    });

    function concatenarestado(ciudad,estado){
        if (!(ciudad == '' || estado == '')) {
            $('#conf_ciudadestado').html(ciudad + ", " + estado);
        } else {
            $('#conf_ciudadestado').html(' ');
        }
    }

    $("input[name='callecliente']").on('keyup',function () {
        var selector = $(this);
        var valorselector = $(this).val();
        var regex = /^([a-zA-ZñÑáéíóúÁÉÍÓÚ\s\d\.\-_\/\\\']){1,50}$/;
        $('#conf_callecliente').html(valorselector);
        colorvalidacion(selector, valorselector, regex);
        resetcoloremptyfields(selector, valorselector);
    });

    $("input[name='numinterior']").on('keyup',function () {
        var selector = $(this);
        var valorselector = $(this).val();
        var regex = /^([a-zA-ZñÑáéíóúÁÉÍÓÚ\s\d\.\-_\/\\\']){1,50}$/;
        $('#conf_numinterior').html(valorselector);
        if (valorselector == ''){
            selector.closest('div').removeClass('has-error');
            selector.closest('div').removeClass('has-success');
        }else{
            colorvalidacion(selector, valorselector, regex);
            resetcoloremptyfields(selector, valorselector);
        }
        
    });

    $("input[name='numexterior']").on('keyup',function () {
        var selector = $(this);
        var valorselector = $(this).val();
        var regex = /^([a-zA-ZñÑáéíóúÁÉÍÓÚ\s\d\.\-_\/\\\']){1,50}$/;
        $('#conf_numexterior').html(valorselector);
        colorvalidacion(selector, valorselector, regex);
        resetcoloremptyfields(selector, valorselector);
    });

    $("input[name='cruzamientos']").on('keyup',function () {
        var selector = $(this);
        var valorselector = $(this).val();
        var regex = /^([a-zA-ZñÑáéíóúÁÉÍÓÚ\s\d\.\-_\/\\\']){1,50}$/;
        $('#conf_cruzamientos').html(valorselector);
        colorvalidacion(selector, valorselector, regex);
        resetcoloremptyfields(selector, valorselector);
    });

    $("input[name='codigopostal']").on('keyup',function () {
        var selector = $(this);
        var valorselector = $(this).val();
        var regex = /^\d{1,10}$/;
        $('#conf_codigopostal').html(valorselector);
        colorvalidacion(selector, valorselector, regex);
        resetcoloremptyfields(selector, valorselector);
    });

    $("input[name='colonia']").on('keyup',function () {
        var selector = $(this);
        var valorselector = $(this).val();
        var regex = /^([a-zA-ZñÑáéíóúÁÉÍÓÚ\s\d\.\-_\/\\\']){1,50}$/;
        $('#conf_colonia').html(valorselector);
        colorvalidacion(selector, valorselector, regex);
        resetcoloremptyfields(selector, valorselector);
    });

    $("input[name='referencias']").on('keyup',function () {
        var selector = $(this);
        var valorselector = $(this).val();
        var regex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s\d\.\-_\/\\\']{1,300}$/;
        $('#conf_referencias').html(valorselector);
        colorvalidacion(selector, valorselector, regex);
        resetcoloremptyfields(selector, valorselector);
    });

    $("input[name='numcelularofijo']").on('keyup',function () {
        var selector = $(this);
        var valorselector = $(this).val();
        var regex = /^(\d{7}|\d{10})$/ ;
        $('#conf_numcelularofijo').html(valorselector);
        colorvalidacion(selector, valorselector, regex);
        resetcoloremptyfields(selector, valorselector);
    });

    $("input[name='horariovisita']").on('keyup',function () {
        var selector = $(this);
        var valorselector = $(this).val();
        var regex = /^[:a-zA-ZñÑáéíóúÁÉÍÓÚ\s\d]{1,50}$/;
        $('#conf_horariovisita').html(valorselector);
        colorvalidacion(selector, valorselector, regex);
        resetcoloremptyfields(selector, valorselector);
    });

    //validacion datos laborales

    $("input[name='nombreempresa']").on('keyup',function () {
        var selector = $(this);
        var valorselector = $(this).val();
        var regex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s\d]{1,50}$/;
        $('#conf_nombreempresa').html(valorselector);
        colorvalidacion(selector, valorselector, regex);
        resetcoloremptyfields(selector, valorselector);
    });

    $("input[name='cargo']").on('keyup',function () {
        var selector = $(this);
        var valorselector = $(this).val();
        var regex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s\d]{1,50}$/;
        $('#conf_cargo').html(valorselector);
        colorvalidacion(selector, valorselector, regex);
        resetcoloremptyfields(selector, valorselector);
    });

    $("input[name='celofijolaboral']").on('keyup',function () {
        var selector = $(this);
        var valorselector = $(this).val();
        var regex = /^(\d{7}|\d{10})$/;
        $('#conf_celofijolaboral').html(valorselector);
        colorvalidacion(selector, valorselector, regex);
        resetcoloremptyfields(selector, valorselector);
    });

    $("input[name='extensionlaboral']").on('keyup',function () {
        var selector = $(this);
        var valorselector = $(this).val();
        var regex = /^\d{1,30}$/;
        $('#conf_extensionlaboral').html(valorselector);
        colorvalidacion(selector, valorselector, regex);
        resetcoloremptyfields(selector, valorselector);
    });

    $("input[name='horariovisitalaboral']").on('keyup',function () {
        var selector = $(this);
        var valorselector = $(this).val();
        var regex = /^[:a-zA-ZñÑáéíóúÁÉÍÓÚ\s\d]{1,50}$/;
        $('#conf_horariovisitalaboral').html(valorselector);
        colorvalidacion(selector, valorselector, regex);
        resetcoloremptyfields(selector, valorselector);
    });

    //validacion referencias
    
    var nombresref1, apellidosref1, numeroref1, horarioref1;
    $("input[name='nombresref1']").on('keyup',function () {
        var selector = $(this);
        nombresref1 = $(this).val();
        var regex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{1,50}$/;
        concatenarref1(nombresref1, apellidosref1, numeroref1, horarioref1);
        colorvalidacion(selector, nombresref1, regex);
        resetcoloremptyfields(selector, nombresref1);
    });
    $("input[name='apellidosref1']").on('keyup',function () {
        var selector = $(this);
        apellidosref1 = $(this).val();
        var regex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{1,50}$/;
        concatenarref1(nombresref1, apellidosref1, numeroref1, horarioref1);
        colorvalidacion(selector, apellidosref1, regex);
        resetcoloremptyfields(selector, apellidosref1);
    });
    $("input[name='telref1']").on('keyup',function () {
        var selector = $(this);
        numeroref1 = $(this).val();
        var regex = /^(\d{7}|\d{10})$/;
        concatenarref1(nombresref1, apellidosref1, numeroref1, horarioref1);
        colorvalidacion(selector, numeroref1, regex);
        resetcoloremptyfields(selector, numeroref1);
    });
    $("input[name='horarioref1']").on('keyup',function () {
        var selector = $(this);
        horarioref1 = $(this).val();
        var regex = /^[:a-zA-ZñÑáéíóúÁÉÍÓÚ\s\d]{1,50}$/;
        concatenarref1(nombresref1, apellidosref1, numeroref1, horarioref1);
        colorvalidacion(selector, horarioref1, regex);
        resetcoloremptyfields(selector, horarioref1);
    });

    function concatenarref1(nombresref1, apellidosref1, numeroref1, horarioref1) {
        if (!(nombresref1 == '' || apellidosref1 == '' || numeroref1 == '' || horarioref1 == '')) {
            $('#conf_referencia1').html(nombresref1+' '+ apellidosref1+' '+ numeroref1+ ' ' + horarioref1);
        } else {
            $('#conf_referencia1').html(' ');
        }
    }

    var nombresref2, apellidosref2, numeroref2, horarioref2;
    $("input[name='nombresref2']").on('keyup',function () {
        var selector = $(this);
        nombresref2 = $(this).val();
        var regex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{1,50}$/;
        concatenarref2(nombresref2, apellidosref2, numeroref2, horarioref2);
        colorvalidacion(selector, nombresref2, regex);
        resetcoloremptyfields(selector, nombresref2);
    });
    $("input[name='apellidosref2']").on('keyup',function () {
        var selector = $(this);
        apellidosref2 = $(this).val();
        var regex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{1,50}$/;
        concatenarref2(nombresref2, apellidosref2, numeroref2, horarioref2);
        colorvalidacion(selector, apellidosref2, regex);
        resetcoloremptyfields(selector, apellidosref2);
    });
    $("input[name='telref2']").on('keyup',function () {
        var selector = $(this);
        numeroref2 = $(this).val();
        var regex = /^(\d{7}|\d{10})$/;
        concatenarref2(nombresref2, apellidosref2, numeroref2, horarioref2);
        colorvalidacion(selector, numeroref2, regex);
        resetcoloremptyfields(selector, numeroref2);
    });
    $("input[name='horarioref2']").on('keyup',function () {
        var selector = $(this);
        horarioref2 = $(this).val();
        var regex = /^[:a-zA-ZñÑáéíóúÁÉÍÓÚ\s\d]{1,50}$/;
        concatenarref2(nombresref2, apellidosref2, numeroref2, horarioref2);
        colorvalidacion(selector, horarioref2, regex);
        resetcoloremptyfields(selector, horarioref2);
    });

    function concatenarref2(nombresref2, apellidosref2, numeroref2, horarioref2) {
        if (!(nombresref2 == '' || apellidosref2 == '' || numeroref2 == '' || horarioref2 == '')) {
            $('#conf_referencia2').html(nombresref2+ ' '+ apellidosref2+ ' '+numeroref2+ ' '+ horarioref2);
        } else {
            $('#conf_referencia2').html(' ');
        }
    }

    var nombresref3, apellidosref3, numeroref3, horarioref3;
    $("input[name='nombresref3']").on('keyup',function () {
        var selector = $(this);
        nombresref3 = $(this).val();
        var regex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{1,50}$/;
        concatenarref3(nombresref3, apellidosref3, numeroref3, horarioref3);
        colorvalidacion(selector, nombresref3, regex);
        resetcoloremptyfields(selector, nombresref3);
    });
    $("input[name='apellidosref3']").on('keyup',function () {
        var selector = $(this);
        apellidosref3 = $(this).val();
        var regex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{1,50}$/;
        concatenarref3(nombresref3, apellidosref3, numeroref3, horarioref3);
        colorvalidacion(selector, apellidosref3, regex);
        resetcoloremptyfields(selector, apellidosref3);
    });
    $("input[name='telref3']").on('keyup',function () {
        var selector = $(this);
        numeroref3 = $(this).val();
        var regex = /^(\d{7}|\d{10})$/;
        concatenarref3(nombresref3, apellidosref3, numeroref3, horarioref3);
        colorvalidacion(selector, numeroref3, regex);
        resetcoloremptyfields(selector, numeroref3);
    });
    $("input[name='horarioref3']").on('keyup',function () {
        var selector = $(this);
        horarioref3 = $(this).val();
        var regex = /^[:a-zA-ZñÑáéíóúÁÉÍÓÚ\s\d]{1,50}$/;
        concatenarref3(nombresref3, apellidosref3, numeroref3, horarioref3);
        colorvalidacion(selector, horarioref3, regex);
        resetcoloremptyfields(selector, horarioref3);
    });

    function concatenarref3(nombresref3, apellidosref3, numeroref3, horarioref3) {
        if (!(nombresref3 == '' || apellidosref3 == '' || numeroref3 == '' || horarioref3 == '')) {
            $('#conf_referencia3').html(nombresref3 + ' ' + apellidosref3 + ' ' + numeroref3 + ' ' + horarioref3);
        } else {
            $('#conf_referencia3').html(' ');
        }
    }

    $("input[name='observacionesadicionales']").on('keyup',function () {
        var observaciones = $(this).val();
        var observaciones_len = observaciones.length;
        if( observaciones_len > 250){
            alert('Maximo 250 caracteres en el campo de observaciones. Actualmente: '+ observaciones_len);
        }
    });




    //Funcion para colorear
    colorvalidacion = function(selector, valorselector, regex) {
        if (valorselector.match(regex)) {
            selector.closest('div').removeClass('has-error');
            selector.closest('div').addClass('has-success').addClass('has-feedback');
        } else {
            selector.closest('div').removeClass('has-success');
            selector.closest('div').addClass('has-error').addClass('has-feedback');
        }

    }


});



