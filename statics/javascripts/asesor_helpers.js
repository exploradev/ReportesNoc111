
$(document).ready(function () {
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
        format: 'Y-m-d H:m',
        validateOnBlur: false,
        step: 1,
        onChangeDateTime: function (ct, inputt) {
            inputt.trigger('input');
        }
        
    });

    //HELPER PARA SELECT2 COBERTURA -------------------------------------------
    $('#cobertura_estado').select2({
        dropdownParent: $("#body_modal_capturacobertura"),
        placeholder: "SELECCIONAR ESTADO",
        allowClear: false
    });

    $('#cobertura_municipio').select2({
        dropdownParent: $("#body_modal_capturacobertura"),
        placeholder: "SELECCIONAR MUNICIPIO",
        allowClear: false
    });

    $('#cobertura_colonia').select2({
        dropdownParent: $("#body_modal_capturacobertura"),
        placeholder: "SELECCIONAR COLONIA",
        allowClear: false
    });

    $('#cobertura_cp').select2({
        dropdownParent: $("#body_modal_capturacobertura"),
        placeholder: "SELECCIONAR CODIGO POSTAL",
        allowClear: false
    });

    $('#cobertura_falla').select2({
        dropdownParent: $("#body_modal_capturacobertura"),
        placeholder: "SELECCIONAR TIPO FALLA",
        allowClear: false
    });

    //AJAX PARA OBTENER LOS OPTION DE LOS SELECTS DE MUNICIPIO Y COLONIA---------------------
    
    //DETECTAR EL CHANGE EN EL SELECTOR DE ESTADO Y LLAMAR EL REFRESCO DE MUNICIPIO
    //OBTENER VALOR DEL CAMPO DE ESTADO
    $('#cobertura_estado').change(function(){
        var estado = $(this).val();
        $('#cobertura_municipio').html('');
        $.post('/getMunicipio',{estado:estado},function(response){
            var injectThisHTML = '<option></option>';
            for(i = 0; i<response.length;i++){
                injectThisHTML += "<option value='"+ response[i]['municipio'] +"'>"+ response[i]['municipio'] +"</option>";
            }
            $('#cobertura_municipio').html(injectThisHTML);
        });
        //se resetean a default los demas campos
        $('#cobertura_colonia').html('');
        $('#cobertura_cp').html('');
    });
    //DETECTAR EL CHANGE EN EL SELECTOR DE MUNICIPIO Y LLAMAR EL REFRESCO DE COLONIA
    //OBTENER VALOR DEL CAMPO DE MUNICIPIO
    $('#cobertura_municipio').change(function () {
        var municipio = $(this).val();
        var estado = $('#cobertura_estado').val();
        $('#cobertura_colonia').html('');
        $.post('/getColonia', { municipio: municipio, estado:estado }, function (response) {
            var injectThisHTML = '<option></option>';
            for (i = 0; i < response.length; i++) {
                injectThisHTML += "<option value='" + response[i]['colonia'] + "'>" + response[i]['colonia'] + "</option>";
            }
            $('#cobertura_colonia').html(injectThisHTML);
        });
        //se resetean a default los demas campos
        $('#cobertura_cp').html('');
    });
    //DETECTAR EL CHANGE EN EL SELECTOR DE COLONIA Y LLAMAR REFRESCO DE CODIGO POSTAL
    //OBTENER EL VALOR DEL CAMPO DE COLONIA
    $('#cobertura_colonia').change(function () {
        var colonia = $(this).val();
        var estado = $('#cobertura_estado').val();
        var municipio = $('#cobertura_municipio').val();
        $('#cobertura_cp').html('');
        $.post('/getCP', { colonia: colonia, estado: estado, municipio: municipio }, function (response) {
            var injectThisHTML = '<option></option>';
            for (i = 0; i < response.length; i++) {
                injectThisHTML += "<option value='" + response[i]['cp'] + "'>" + response[i]['cp'] + "</option>";
            }
            $('#cobertura_cp').html(injectThisHTML);
        });
    });//fin de evento de cobertura colonia


    
});