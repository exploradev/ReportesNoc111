var fill_selectoptionsfallas, reload_supervision;
$(document).ready(function () {
    //ABAJO LIGA DE FALLAS

    //funciones con problemas forzandolas
    load_users();
    estatus_actuales_supervisor();
    //fin de funciones con problemas

    //-----------------------------------------------------------------------
    //-------------------------------WEBSOCKETS------------------------------
    //-----------------------------------------------------------------------
    socket = io.connect('http://'+location.host);
    //var socket = io.connect('http://localhost:2264');

    socket.on('new', function (msg) {
        console.log("Socket: " + msg);

        if (msg == "nueva_captura_super" || msg == "nuevo_seguimiento_super") {
            reload_supervision();
        }else{
            reload_everything();
        }
        
    });
    //-----------------------------------------------------------------------
    //-------------------------------WEBSOCKETS------------------------------
    //-----------------------------------------------------------------------


    ////////////////////////////////////////

    reload_everything = function () {

        //reload_conteos
        var mios = $("input[name=mios]:checked").val();
        if (mios == 'show') {
            llenar_conteos_propios();
        } else {
            llenar_conteos_todos();
        }
        //reload tabla actual trtgger click de panel abierto
        var panelabierto = $('#tiporeporte_header').attr("data-filterclick");
        $('.clickable_filter[data-filter="' + panelabierto + '"]').trigger('click');

        //reload dashboard
        reload_all();
    }

    reload_supervision = function () {
        
        //reload supervision
        getTablePreview();

    }
        /////////////////////////////////////////



    //CONTROL DE VENTANAS
    $(window).keyup(function (e) {
        if (e.keyCode === 27) $('.closebuttonn').trigger('click');
    });

    //CLICK EN BOTONES DE CIERRES DE MODAL
    $('.closebuttonn').click(function () {
        $('#asesor_modal_detallesdecaptura').css('display', 'none');
        $('#coordinador_modaledicionusuarios').css('display', 'none');
        $('#overlay-back').css('display', 'none');
        $('body').removeClass('modal-open');
        //reset_form_users();
    });

    //desploega panel de inputs para alta de usuarios
    $('#opciones_tabla').click(function(){
        $('#altausuario_container').toggle();    
    });


    $("#showpassword").click(function(){
        if ($('#actualizar_password').attr('psswd-shown') == 'false') {

            $('#actualizar_password').removeAttr('type');
            $('#actualizar_password').attr('type', 'text');

            $('#actualizar_password').removeAttr('psswd-shown');
            $('#actualizar_password').attr('psswd-shown', 'true');

            

        } else {

            $('#actualizar_password').removeAttr('type');
            $('#actualizar_password').attr('type', 'password');

            $('#actualizar_password').removeAttr('psswd-shown');
            $('#actualizar_password').attr('psswd-shown', 'false');
        }
    });

    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    //FALLAS MASIVAS TODO EN ESTE DOCUMENTO




    
    $('#camposreporte').on('input change',function(){
        var cantidad = $(this).val();
        $('#cantidadcamposreporte').html(cantidad + " campos");

        $("#preview_grid").html("");
        default_code = "<div class='preview-group'> <label class='preview-field'>NOMBRE DEL CAMPO</label><div class='class_for_validation'> <input type='text' class='fieldname nowhites' placeholder='Nombre del campo'><span class='successimage' style='display: none;'><img src='../assets/success.png'/></span><span class='errorimage' style='display: none; '><img src='../assets/error.png'/></span></div> </div>";
        var html_body = "";
        for(i=1;i<=cantidad;i++){
            html_body += default_code;
        }
        $("#preview_grid").html(html_body);
    });

    //validacion de los campos .nowhites sin espacios en blanco y maximo 20 caracteres
    //con numeros
    var regex_nowhites = /^[a-z]{1,15}$/;
    var regex_nowhitesnumbers = /^[a-z]{1,15}\d{6}$/;
    var regex_librelargo = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ&,\s\d\.\-_\/\\\']{1,250}$/;

    //para campo dinamicos
    $('#preview_grid').on('input change', '.nowhites', function () {
        var selector_actualmente_siendo_tecleado = $(this);
        var valor_selector = $(this).val();
        if (valor_selector.match(regex_nowhites)) {
            //console.log('coincide');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').removeClass('has-error');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').addClass('has-success');
        } else {
            //console.log('no coincide');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').removeClass('has-success');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').addClass('has-error');
        }

    });

    //para nombre de la tabla
    $('.nowhitesnumbers').on('input change', function () {
        var selector_actualmente_siendo_tecleado = $(this);
        var valor_selector = $(this).val();
        if (valor_selector.match(regex_nowhitesnumbers)) {
            //console.log('coincide');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').removeClass('has-error');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').addClass('has-success');
        } else {
            //console.log('no coincide');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').removeClass('has-success');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').addClass('has-error');
        }
    });

    //para comentarios de la tabla
    $('.nowhitesnumbers').on('input change', function () {
        var selector_actualmente_siendo_tecleado = $(this);
        var valor_selector = $(this).val();
        if (valor_selector.match(regex_nowhitesnumbers)) {
            //console.log('coincide');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').removeClass('has-error');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').addClass('has-success');
        } else {
            //console.log('no coincide');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').removeClass('has-success');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').addClass('has-error');
        }
    });

    $('.tipodato_librelargo').on('input change', function () {
        var selector_actualmente_siendo_tecleado = $(this);
        var valor_selector = $(this).val();
        if (valor_selector.match(regex_librelargo)) {
            //console.log('coincide');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').removeClass('has-error');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').addClass('has-success');
        } else {
            //console.log('no coincide');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').removeClass('has-success');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').addClass('has-error');
        }
    });
    //--------------------------------------------------------------------
    //validacion de campos antes de enviar

    $('#btn_savefields').click(function(){
        var acumulador_no_vacios = 0;
        var conteo_inputs = 0;
        var acumulador_por_llenar = 0;
        var acumulador_inputs_correctos = 0;
        var acumulador_inputs_erroneos = 0;

        $('.fieldname').each(function () {
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
        $('.fieldname').closest('.has-success').each(function () {
            //lleno mi contador de inputs correctos
            acumulador_inputs_correctos++;
        });//fin de ciclo each dos
        //------------------------------------
        $('.fieldname').closest('.has-error').each(function () {
            //lleno mi contador de inputs correctos
            acumulador_inputs_erroneos++;
        });//fin de ciclo each tres

        //SI LA CANTIDAD DE ERRORES Y LOS NO LLENADOS NO SON IGUAL A CERO
        if (acumulador_inputs_erroneos != 0 || acumulador_por_llenar != 0) {
            //HAGO ALERT INDICANDO LO QUE FALTA
            alert("Es necesario llenar todos los campos correctamente antes de guardar \n Por llenar: " + acumulador_por_llenar + "\n Con error: " + acumulador_inputs_erroneos);
        } else if (conteo_inputs < 3) {
            alert("Seleccionar campos a llenar");
        } else if (conteo_inputs == acumulador_inputs_correctos) {

            //SI TODO ES CORRECTO ENTONCES COMIENZA LA MAGIA:
            parametro_ajax = [];
            var iduser = $('body').data('iduser');
            parametro_ajax.push(iduser)
            $('.fieldname').each(function () {
                parametro_ajax.push($(this).val());
            });
            var tablajson = JSON.stringify(parametro_ajax);
            $.post('/generartabla',{estructura:tablajson},function(response){
                if(response == "TODO OK"){
                    alert("GENERADO CORRECTAMENTE");
                    $("#camposreporte").val(0).trigger('change input');
                    $('#cantidadcamposreporte').html("0 campos");
                    $(".fieldname").val("").closest('.class_for_validation').removeClass('has-error has-success');
                    $("#preview_grid").html("");
                    fill_selectoptionsfallas();
                    fill_tablesoptions();
                }else{
                    alert("Informar a webmaster sobre el siguiente error: " + response);
                }
            });
        }
    });

    //CONTROL DE BOTONES Y VISTAS DE PANEL DE FALLAS MASIVAS
    $('#btn_nuevorepfalla').click(function () {
        $(".hide_fallasmasivas").hide();
        $("#container_nuevo").css('display','initial');
    });

    $('#btn_gestionfalla').click(function () {
        $(".hide_fallasmasivas").hide();
        $("#container_gestion").css('display', 'flex');
    });

    //CARGA DE CAMPOS Y LISTAS DE REPORTES DE FALLAS
    fill_selectoptionsfallas = function(){
        $.post('/getTablesFallas',function(response){
            
            
            //SE AGREGA AL SELECT
            var options = "<option></option>";
            for(i=0;i<response.length;i++){
                options += "<option value='" + response[i]["idtablasporexportar"] + "'>" + response[i]["tabla"]+"</option>";
            }
            $('#tablas_fallas').html(options);
            $('#tablas_por_desactivar').html(options);

            //SE AGREGAN A LAS TABLAS

            var tbody_tabla = "";
            for (i = 0; i < response.length; i++) {
                tbody_tabla += "<tr>";
                tbody_tabla += "<td>"+response[i]["tabla"]+"</td>";
                tbody_tabla += "<td>" + moment(response[i]["creado"]).format('DD/MM/YYYY HH:mm') +"</td>";
                tbody_tabla += "<td>"+response[i]["nombre"]+"</td>";
                tbody_tabla += "<td>"+response[i]["activa"]+"</td>";
                tbody_tabla += "<td>"+response[i]["descripcion"]+"</td>";
                tbody_tabla += "</tr>";
            }
            $('#tbody_fallasmasivas').html(tbody_tabla);
        });
    }

    fill_selectoptionsfallas();

    //ACTIVAR TABLA
    $('#activartabla').click(function () {
        var id = $('#tablas_fallas').val();
        var numero = $('#numero_falla').val();
        if (id == "" || numero == "") {
            alert("Seleccionar una opcion de la ambas listas");
        } else {
            $.post('/activar_tabla', { id: id, numero: numero }, function (response) {
                if (response == "ok") {
                    alert("Activada correctamente");
                    fill_selectoptionsfallas();
                    fill_tablesoptions();
                    $('#numero_falla').val("").trigger('change');
                } else {
                    alert("Error: " + response)
                }
            });
        }
    });

    //DESACTIVAR TABLA
    $('#desactivartabla').click(function () {
        var id = $('#tablas_por_desactivar').val();
        
        if (id == "") {
            alert("Seleccionar una opcion de la lista");
        } else {
            $.post('/desactivar_tabla', { id: id}, function (response) {
                if (response == "ok") {
                    alert("Desactivada correctamente");
                    fill_selectoptionsfallas();
                    fill_tablesoptions();
                } else {
                    alert("Error: " + response)
                }
            });
        }
    });

    //DESACTIVAR TODAS LAS TABLAS
    $('#desactivartodastablas').click(function () {
        $.post('/deshabilitar_tablas',function(response){
            if(response == "ok"){
                alert("Todas las tablas de fallas fueron deshabilitadas correctamente");
                fill_selectoptionsfallas();
                fill_tablesoptions();
            }else{
                alert("Error: "+ response)
            }
        });
    });



            //EXPORTAR ESTADISTICAS DEL MES ACTUAL DE LAS CAPTURAS DE REFERIDOS
    $('#btn_download_referidos').click(function(){
        
        
        $.post('/referidos_ultimomes',function(response){
            console.table(response);
            if (response == ''){
                console.log("Sin resultados");
                alert("Sin resultados");
                return;
            }else{
                JSONToCSVConvertor(response,"Referidos-ultimo-mes-"+response.length, true);
            }
        });

    });

///////////////////////////////////////////////////////////////
//funcion para exportar reportes en excel
//jsfiddle: http://jsfiddle.net/hybrid13i/JXrwM/
function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var CSV = '';
    //Set Report title in first row or line

    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";

        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {

            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";

        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);

        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    //Generate a file name
    var fileName = "Reporte_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g, "_");

    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
////////////////////////////////////////////////////////////////



});