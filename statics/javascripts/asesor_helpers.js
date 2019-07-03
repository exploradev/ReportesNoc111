var tablafallasEstaActiva;
$(document).ready(function () {
    // todo sobre liga de fallas
    //select2 de cobertura
    //ajax para refresco de selects dec obertura

    //HELPER PARA DATETIMEPICKERS
    $('.datetimepicker_notime').datetimepicker({
        timepicker: false,
        format: 'Y-m-d',
        validateOnBlur: false,
        onChangeDateTime: function(ct,inputt){
            inputt.trigger('input');
        }
    });

    $('.datetimepicker_withtime').datetimepicker({
        timepicker: true,
        format: 'Y-m-d H:i',
        validateOnBlur: false,
        step: 1,
        onChangeDateTime: function (ct, inputt) {
            inputt.trigger('input');
        }
        
    });

    //----------------------------------------------------------
    //MOSTRAR LOS CAMPOS DE CHECKLIST AL CHANGE DEL SELECT
    $('#selectinput_checklist').change(function () { 
        var seleccion = $(this).val();
        switch(seleccion){
            case 'navegacion':
                $('.hidecheckboxes').hide();
                $('#navegacion_checklist').show();
                break;
            case 'llamadas':
                $('.hidecheckboxes').hide();
                $('#llamadas_checklist').show();
                break;
            case 'aclaracion':
                $('.hidecheckboxes').hide();
                $('#aclaracion_checklist').show();
                break;
            case 'cobertura':
                $('.hidecheckboxes').hide();
                $('#cobertura_checklist').show();
                break;
            case 'callback':
                $('.hidecheckboxes').hide();
                $('#callback_checklist').show();
                break;
            case 'iccid':
                $('.hidecheckboxes').hide();
                $('#iccid_checklist').show();
                break;
        }
    });

    //HELPER PARA SELECT2 -------------------------------------------

    

    function formatState(opt) {
        if (!opt.id) {
            return opt.text.toLowerCase();
        }

        var optimage = $(opt.element).attr('data-image');
        console.log(optimage)
        if (!optimage) {
            return opt.text.toLowerCase();
        } else {
            var $opt = $(
                '<span><img src="' + optimage + '" width="15px" /> ' + opt.text.toUpperCase() + '</span>'
            );
            return $opt;
        }
    };

    
    $('#selectinput_checklist').select2({
        dropdownParent: $("#modal_checklist"),
        placeholder: "Tipo de falla",
        allowClear: false,
        dropdownCssClass: "myFont",
        templateResult: formatState,
        templateSelection: formatState,
        width: '55%',
    });

    $('.global_select2_estado').select2({
        dropdownParent: $("#container_modalformularios"),
        placeholder: "SELECCIONAR ESTADO",
        allowClear: false
    });

    $('.global_select2_municipio').select2({
        dropdownParent: $("#container_modalformularios"),
        placeholder: "SELECCIONAR MUNICIPIO",
        allowClear: false
    });

    $('.global_select2_colonia').select2({
        dropdownParent: $("#container_modalformularios"),
        placeholder: "SELECCIONAR COLONIA",
        allowClear: false
    });

    $('.global_select2_cp').select2({
        dropdownParent: $("#container_modalformularios"),
        placeholder: "SELECCIONAR CODIGO POSTAL",
        allowClear: false
    });

    $('#cobertura_falla').select2({
        dropdownParent: $("#body_modal_capturacobertura"),
        placeholder: "SELECCIONAR TIPO FALLA",
        allowClear: false
    });

    $('#cobertura_tecnologiaafectada').select2({
        dropdownParent: $("#body_modal_capturacobertura"),
        placeholder: "SELECCIONAR TECNOLOGÍA",
        allowClear: false
    });

    $('#cobertura_servicioafectado').select2({
        dropdownParent: $("#body_modal_capturacobertura"),
        placeholder: "SELECCIONAR SERVICIO",
        allowClear: false
    });

    $('#iccid_cac').select2({
        dropdownParent: $("#body_modal_capturaiccid"),
        placeholder: "SELECCIONAR CAC",
        allowClear: false
    });

    $('#callback_motivo').select2({
        dropdownParent: $("#body_modal_capturacallback"),
        placeholder: "SELECCIONAR MOTIVO",
        allowClear: false
    });

    $('#llamadas_afectacion').select2({
        dropdownParent: $("#body_modal_capturallamadas"),
        placeholder: "SELECCIONAR AFECTACIÓN",
        allowClear: false
    });

    $('#llamadas_tipored').select2({
        dropdownParent: $("#body_modal_capturallamadas"),
        placeholder: "SELECCIONAR TIPO DE RED",
        allowClear: false
    });

    $('#llamadas_servicioafectado').select2({
        dropdownParent: $("#body_modal_capturallamadas"),
        placeholder: "SELECCIONAR SERVICIO",
        allowClear: false
    });

    $('#navegacion_tipored').select2({
        dropdownParent: $("#body_modal_capturanavegacion"),
        placeholder: "SELECCIONAR TIPO DE RED",
        allowClear: false
    });

    $('#servicios_servicio').select2({
        dropdownParent: $("#body_modal_capturaservicios"),
        placeholder: "SELECCIONAR SERVICIO",
        allowClear: false
    });

    $('#iccid_fzaventa').select2({
        dropdownParent: $("#body_modal_capturaiccid"),
        placeholder: "SELECCIONAR FZA DE VENTA",
        allowClear: false
    });

    $('#promociones_tipo').select2({
        dropdownParent: $("#body_modal_capturapromociones"),
        placeholder: "SELECCIONAR TIPO",
        allowClear: false
    });

    //AJAX PARA OBTENER LOS OPTION DE LOS SELECTS DE MUNICIPIO Y COLONIA---------------------
    
    //DETECTAR EL CHANGE EN EL SELECTOR DE ESTADO Y LLAMAR EL REFRESCO DE MUNICIPIO
    //OBTENER VALOR DEL CAMPO DE ESTADO
    $('.global_select2_estado').change(function(){
        var estado = $(this).val();
        $('.global_select2_municipio').html('');
        $.post('/getMunicipio',{estado:estado},function(response){
            var injectThisHTML = '<option></option>';
            for(i = 0; i<response.length;i++){
                injectThisHTML += "<option value='"+ response[i]['municipio'] +"'>"+ response[i]['municipio'] +"</option>";
            }
            $('.global_select2_municipio').html(injectThisHTML);
        });
        //se resetean a default los demas campos
        $('.global_select2_colonia').html('');
        $('.global_select2_cp').html('');
    });
    //DETECTAR EL CHANGE EN EL SELECTOR DE MUNICIPIO Y LLAMAR EL REFRESCO DE COLONIA
    //OBTENER VALOR DEL CAMPO DE MUNICIPIO
    $('.global_select2_municipio').change(function () {
        var municipio = $(this).val();
        
        
        tipo = $(this).closest('.class_for_validation').attr('data-tiporeporte');
        var estado = $('#'+tipo+"_estado").val();

        
        $('.global_select2_colonia').html('');
        $.post('/getColonia', { municipio: municipio, estado:estado }, function (response) {
            var injectThisHTML = '<option></option>';
            for (i = 0; i < response.length; i++) {
                injectThisHTML += "<option value='" + response[i]['colonia'] + "'>" + response[i]['colonia'] + "</option>";
            }
            $('.global_select2_colonia').html(injectThisHTML);
        });
        //se resetean a default los demas campos
        $('.global_select2_cp').html('');
    });
    //DETECTAR EL CHANGE EN EL SELECTOR DE COLONIA Y LLAMAR REFRESCO DE CODIGO POSTAL
    //OBTENER EL VALOR DEL CAMPO DE COLONIA
    $('.global_select2_colonia').change(function () {
        var colonia = $(this).val();

        tipo = $(this).closest('.class_for_validation').attr('data-tiporeporte');
        var estado = $('#' + tipo + "_estado").val();

        tipo = $(this).closest('.class_for_validation').attr('data-tiporeporte');
        var municipio = $('#' + tipo + "_municipio").val();

        
        $('.global_select2_cp').html('');
        $.post('/getCP', { colonia: colonia, estado: estado, municipio: municipio }, function (response) {
            var injectThisHTML = '<option></option>';
            for (i = 0; i < response.length; i++) {
                injectThisHTML += "<option value='" + response[i]['cp'] + "'>" + response[i]['cp'] + "</option>";
            }
            $('.global_select2_cp').html(injectThisHTML);
        });
    });//fin de evento de cobertura colonia

















    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //TODO LO RELACINADO A LIGA DE FALLAS

    //validar si alguna tabla de fallas esta activada
    tablafallasEstaActiva = function(){
         //en caso de que este activada entonces hacemos visible el boton
        //escribimos en el body del modal el contenido de la tabla activa
        //en caso de que sea negativo  entonces el body lo vaciamos y ocultamos el boton
        
        $.post('/validarFallasActivas',function(response){

            var fallas = [];
            for(i=0;i<response.length;i++){
                if (response[i]["activa"] == "falla1"){
                    $("#btn_nuevamasiva").css('visibility','visible');
                }else if(response[i]["activa"] == "falla2"){
                    $("#btn_nuevamasiva2").css('visibility','visible');
                }else if(response[i]["activa"] == "falla3"){
                    $("#btn_nuevamasiva3").css('visibility','visible');
                }else if(response == "noexiste"){
                    $("#body_fallasmasivas").html("");
                    $("#descripcion_fallamasiva").html("");
                    $("#btn_nuevamasiva").css('visibility','hidden');
                    $("#btn_nuevamasiva2").css('visibility','hidden');
                    $("#btn_nuevamasiva3").css('visibility','hidden');
                    limpiar_body_fallamasiva();
                }
                fallas.push(response[i]["activa"]);
            }
            if(fallas.indexOf("falla1") == -1){
                $("#btn_nuevamasiva").css('visibility', 'hidden');
            }else if(fallas.indexOf("falla2") == -1){
                $("#btn_nuevamasiva2").css('visibility', 'hidden');
            } else if (fallas.indexOf("falla3") == -1) {
                $("#btn_nuevamasiva3").css('visibility', 'hidden');
            }


            
        });
    }

    llenar_body_fallamasiva = function(falla){
        //mostrar boton oculto 
        //llenar body y comentario de falla
        $.post('/getTablaMasivaActiva',{falla:falla},function(response){
            $("#subheader_modalfallasmasivas").attr("data-falla",falla);
            $("#body_fallasmasivas").html(response[0]['contenido']);
            $("#descripcion_fallamasiva").html(response[0]['descripcion']);
        });
    }

    limpiar_body_fallamasiva = function(){
        $("#body_fallasmasivas").html("");
        $("#descripcion_fallamasiva").html("");
    };

    tablafallasEstaActiva();

    //------------------------------------------------------------
    //CLICK AL BTN DE FALLA MASIVA MUESTRA MODAL
    $("#btn_nuevamasiva,#btn_nuevamasiva2,#btn_nuevamasiva3").click(function(){
        $('#asesor_modal_fallasmasivas').show();
        $('#overlay-back').css('display', 'block');
        $('body').addClass('modal-open');
    });
    //------------------------------------------------------------

    //se ingresan los datos a la correspondiente db haciendo uso del backend
    $('#btn_savemasiva').click(function(){
        var acumulador_no_vacios = 0;
        var conteo_inputs = 0;
        var acumulador_por_llenar = 0;
        
        //----------------------------------
        $('.campo_fallamasiva').each(function () {
            //lleno mi contador de inputs
            conteo_inputs++;

            //lleno mis acumuladores de no vacios y por llenar
            var valor_selector_actual = $(this).val();
            if (valor_selector_actual == "" || valor_selector_actual == null) {
                acumulador_por_llenar++;
            } else {
                acumulador_no_vacios++;
            }
        });//fin de ciclo each uno
        //----------------------------------
        

        //SI LA CANTIDAD DE ERRORES Y LOS NO LLENADOS NO SON IGUAL A CERO
        if (acumulador_por_llenar != 0) {
            //HAGO ALERT INDICANDO LO QUE FALTA
            alert("Es necesario llenar todos los campos correctamente antes de guardar");
        } else if (conteo_inputs == acumulador_no_vacios) {
            
            //VALIDO QUE LA CANTIDAD DE INPUTS TOTAL SEA IGUAL AL TOTAL DE INPUTS CORRECTOS, ENTONCES

            //TOMO LOS VALORES DE TODOS LOS QUE SON EXITOSOS Y LOS ASIGNO A VARIABLES POR PASAR POR AJAX, 
            var parametro_ajax = [];
            //get valor telefono
            var iduser = $('#asesorname').data('name');
            var falla = $('#subheader_modalfallasmasivas').attr('data-falla');
            parametro_ajax.push(falla);
            parametro_ajax.push(iduser);
            $('.campo_fallamasiva').each(function () {
                parametro_ajax.push($(this).val());
            });

            console.log(parametro_ajax);
            var newjson = JSON.stringify(parametro_ajax);
            console.log(newjson);

            if(parametro_ajax.length < 2){
                alert("Sin campos no se hace el envio. Reportar al webmaster");
            }else{
            //EFECTUO EL AJAX Y EN EL CALLBACK CIERRO Y RESETEO TODOS LOS CAMPOS

            $.post('/guardarpool_fallamasiva', {
                parametros: newjson

            }, function (response) {
                if (response == 'Correcto') {
                    alert("GUARDADO CORRECTAMENTE");
                    $('.campo_fallamasiva').val("");
                    $('.closebuttonn').trigger('click');
                }else{
                    alert("Error: "+response);
                }
            });
            }
            
        }
    });


    //-----------------------------------------------------------------------
    //-------------------------------WEBSOCKETS------------------------------
    //-----------------------------------------------------------------------
    socket = io.connect('http://192.168.3.62:2264');
    //var socket = io.connect('http://localhost:2264');

    socket.on('fallamasiva', function (msg) {
        console.log("Socket: " + msg);
        tablafallasEstaActiva();
    });
        //-----------------------------------------------------------------------
        //-------------------------------WEBSOCKETS------------------------------
        //-----------------------------------------------------------------------
   

});