
var getNocs;
$(document).ready(function () {
    $('#show_dashboard').click(function () {
        $('#menu_lateral, #tabla_principal').hide();
        $('#dashboard').css('display','initial');
        $(".highch").html("<img src='../assets/loader1.gif'>");
        reload_all();
    });

    $('#show_tablas').click(function () {
        $('#dashboard').hide();
        $('#menu_lateral, #tabla_principal').show();
    });

    //REASIGNACION DE PROPIEDAD DE FOLIOS
    $('#reasignacion_select').select2({
        dropdownParent: $("#subheader_modaldetalles"),
        placeholder: "Seleccionar nuevo propietario",
        allowClear: false
    });

    

    getNocs = function(){
        $.post('/getNocs', function (response) {
            var table_body = "<option></option>";
            for (i = 0; i < response.length; i++) {
                table_body += "<option value='" + response[i]['iduser'] +"'>";
                table_body += response[i]['nombre'];
                table_body += '<option>';
            }
            $('#reasignacion_select').html(table_body);
        });
    }

    //AL clickear reasignar folio:
    $('#btn_reasignarreporte').click(function(){
        var iduser = $("#reasignacion_select").val();
        var idmetadatos = $('#detalles_metadatospanel_folio').html();
        $.post('/reasignacion_propietario',{iduser: iduser, idmetadatos:idmetadatos},function(responser){
            if(responser == 'Correcto'){
                getNocs();
                reload_everything();
                alert("Reasignado correctamente");
            }else{
                alert("Error con la reasignación");
            } //fin del if
        });
    });
    
    getNocs();
});

