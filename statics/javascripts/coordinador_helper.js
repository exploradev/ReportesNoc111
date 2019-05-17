
var getNocs;
$(document).ready(function(){

    //BUSQUEDA SEARCHBOX
    //BUSQUEDA DE CAPTURAS EN TABLAS AL HACER KEYUP
    $('#main_searchbox_u').keyup(function () {
        var filterBy = this;
        $.each($('.row_usuarios'), function (i, val) {
            if ($(val).text().toLowerCase().indexOf($(filterBy).val().toLowerCase()) == -1) {
                $('.row_usuarios').eq(i).hide();
            } else {
                $('.row_usuarios').eq(i).show();
            }
        });
    });

    //INSTANCIA DE DATETIMEPICKER
    // DATETIME PICKER ---------------------------------------------------------------------------------
    
    //datetimepicker por rango
    jQuery('#exportar_desde').datetimepicker({
        format: 'Y/m/d',
        onShow: function (ct) {
            this.setOptions({
                maxDate: jQuery('#exportar_hasta').val() ? jQuery('#exportar_hasta').val() : false
            })
        },
        timepicker: false,
        theme: 'dark'
    });
    jQuery('#exportar_hasta').datetimepicker({
        format: 'Y/m/d',
        onShow: function (ct) {
            this.setOptions({
                minDate: jQuery('#exportar_desde').val() ? jQuery('#exportar_desde').val() : false
            })
        },
        timepicker: false,
        theme: 'dark'
    });
    // DATETIME PICKER ---------------------------------------------------------------------------------

    ///////////////////////////////////////////////
    //CLON DE SUPEVISOR_HELPERS.JS CON MODIFICACIONES
    ///////////////////////////////////////////////

    $('#nuevo_rol').select2({
        dropdownParent: $("#altausuario_container"),
        placeholder: "ROL",
        allowClear: false
    });

    $('#nuevo_turno').select2({
        dropdownParent: $("#altausuario_container"),
        placeholder: "TURNO",
        allowClear: false
    });

    $('#nuevo_estatus').select2({
        dropdownParent: $("#altausuario_container"),
        placeholder: "ESTATUS",
        allowClear: false
    });

    $('#actualizar_rol').select2({
        dropdownParent: $("#body_modaledicionusuarios"),
        placeholder: "ROL",
        allowClear: false
    });

    $('#actualizar_turno').select2({
        dropdownParent: $("#body_modaledicionusuarios"),
        placeholder: "TURNO",
        allowClear: false
    });

    $('#actualizar_estatus').select2({
        dropdownParent: $("#body_modaledicionusuarios"),
        placeholder: "ESTATUS",
        allowClear: false
    });
    ///////////////////////////////////////////////

    $('#tiporeporte ').select2({
        dropdownParent: $("#seleccion_rangos"),
        placeholder: "ESTATUS",
        allowClear: false
    });

    $('#tablas_fallas').select2({
        dropdownParent: $("#leftside"),
        placeholder: "SELECCIONAR FALLA",
        allowClear: false
    });

    
    $('#numero_falla').select2({
        dropdownParent: $("#leftside"),
        placeholder: "ASIGNAR NUMERO",
        allowClear: false
    });

    $('#tablas_por_desactivar').select2({
        dropdownParent: $("#leftside"),
        placeholder: "SELECCIONAR FALLA",
        allowClear: false
    });

    

    ///////////////////////////////////////////////
    $('#show_export').click(function () {
        $('.hideallthis').hide();
        $('#tabla_exportar').css('display','initial');
    });

    $('#show_usuarios').click(function () {
        $('.hideallthis').hide();
        $('#tabla_usuarios').css('display', 'initial');
    });

    $('#show_wizardmasivas').click(function () {
        $('.hideallthis').hide();
        $('#wizardmasivas').css('display', 'initial');
    });

    $('#show_supervisor').click(function () {
        $('.hideallthis').hide();
        $('#tabla_supervisor').css('display', 'initial');
    });

    ////////////////////////////////////////////////
    
    $('#show_dashboard').click(function () {
        $('.hideallthis').hide();
        $('#dashboard').css('display', 'initial');
        $(".highch").html("<img src='../assets/loader1.gif'>");
        reload_all();


    });

    $('#show_tablas').click(function () {
        $('.hideallthis').hide();
        $('#menu_lateral, #tabla_principal').show();
    });

    //REASIGNACION DE PROPIEDAD DE FOLIOS
    $('#reasignacion_select').select2({
        dropdownParent: $("#subheader_modaldetalles"),
        placeholder: "Seleccionar nuevo propietario",
        allowClear: false
    });

    getNocs = function () {
        $.post('/getNocs', function (response) {
            var table_body = "<option></option>";
            for (i = 0; i < response.length; i++) {
                table_body += "<option value='" + response[i]['iduser'] + "'>";
                table_body += response[i]['nombre'];
                table_body += '<option>';
            }
            $('#reasignacion_select').html(table_body);
        });
    }

    //AL clickear reasignar folio:
    $('#btn_reasignarreporte').click(function () {
        var iduser = $("#reasignacion_select").val();
        var idmetadatos = $('#detalles_metadatospanel_folio').html();
        $.post('/reasignacion_propietario', { iduser: iduser, idmetadatos: idmetadatos }, function (responser) {
            if (responser == 'Correcto') {
                getNocs();
                reload_everything();
                alert("Reasignado correctamente");
            } else {
                alert("Error con la reasignación");
            } //fin del if
        });
    });

    getNocs();
    
    
});
