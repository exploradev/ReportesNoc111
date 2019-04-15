var colorvalidacion, resetcoloremptyfields;
$(document).ready(function(){

    //EVITA EL SUBMIT AL CLICKEAR ANTER ------------------------------
    $(window).keydown(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });

    //VALIDACION DE CAMPOS POR TIPO DE DATO --------------------------

    //REGEX POR TIPO DE DATO

    //telefono principal
    var regex_telefono = /^(\d{10})$/;

    //campo libre estandar
    var regex_libreestandar = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ&,\s\d\.\-_\/\\\']{1,80}$/;

    //campo libre de comentario largo
    var regex_librelargo = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ&,\s\d\.\-_\/\\\']{1,250}$/;

    //fecha
    var regex_fecha = /^\d{4}[\-\/\s]?((((0[13578])|(1[02]))[\-\/\s]?(([0-2][0-9])|(3[01])))|(((0[469])|(11))[\-\/\s]?(([0-2][0-9])|(30)))|(02[\-\/\s]?[0-2][0-9]))$/;

    //fecha y hora
    var regex_fechayhora = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s(2[0-3]|[01][0-9]):[0-5][0-9]/;

    //iccid
    var regex_iccid = /^\d{18}$/;

    //iccid fisica
    var regex_iccidfisica = /^\d{19}$/;

    //importe
    var regex_importe = /^\d+\.\d+$/;

    //telefono contacto
    //var regex_telefonocontacto = /^(\d{7}|\d{10})$/;

    $('.tipodato_telefono').on('input',function(){
        var selector_actualmente_siendo_tecleado = $(this);
        var valor_selector = $(this).val();
        if (valor_selector.match(regex_telefono)){
            //console.log('coincide');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').removeClass('has-error');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').addClass('has-success');
        }else{
            //console.log('no coincide');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').removeClass('has-success');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').addClass('has-error');
        }
    });

    $('.tipodato_libreestandar').on('input',function () {
        var selector_actualmente_siendo_tecleado = $(this);
        var valor_selector = $(this).val();
        if (valor_selector.match(regex_libreestandar)) {
            //console.log('coincide');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').removeClass('has-error');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').addClass('has-success');
        } else {
            //console.log('no coincide');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').removeClass('has-success');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').addClass('has-error');
        }
    });

    $('.tipodato_librelargo').on('input',function () {
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

    $('.tipodato_fecha').on('input',function () {
        var selector_actualmente_siendo_tecleado = $(this);
        var valor_selector = $(this).val();
        if (valor_selector.match(regex_fecha)) {
            //console.log('coincide');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').removeClass('has-error');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').addClass('has-success');
        } else {
            //console.log('no coincide');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').removeClass('has-success');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').addClass('has-error');
        }
    });

    $('.tipodato_fechayhora').on('input',function () {
        var selector_actualmente_siendo_tecleado = $(this);
        var valor_selector = $(this).val();
        if (valor_selector.match(regex_fechayhora)) {
            //console.log('coincide');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').removeClass('has-error');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').addClass('has-success');
        } else {
            //console.log('no coincide');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').removeClass('has-success');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').addClass('has-error');
        }
    });

    $('.tipodato_iccid').on('input',function () {
        var selector_actualmente_siendo_tecleado = $(this);
        var valor_selector = $(this).val();
        if (valor_selector.match(regex_iccid)) {
            //console.log('coincide');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').removeClass('has-error');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').addClass('has-success');
        } else {
            //console.log('no coincide');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').removeClass('has-success');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').addClass('has-error');
        }
    });

    $('.tipodato_iccidfisica').on('input',function () {
        var selector_actualmente_siendo_tecleado = $(this);
        var valor_selector = $(this).val();
        if (valor_selector.match(regex_iccidfisica)) {
            //console.log('coincide');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').removeClass('has-error');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').addClass('has-success');
        } else {
            //console.log('no coincide');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').removeClass('has-success');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').addClass('has-error');
        }
    });

    $('.tipodato_importe').on('input',function () {
        var selector_actualmente_siendo_tecleado = $(this);
        var valor_selector = $(this).val();
        if (valor_selector.match(regex_importe)) {
            //console.log('coincide');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').removeClass('has-error');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').addClass('has-success');
        } else {
            //console.log('no coincide');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').removeClass('has-success');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').addClass('has-error');
        }
    });


    //PARA QUE LA VALIDACION POR SELECT FUNCIONE TODOS ESTOS DEBEN SER INICIALIZADOS CON LA CLASE .SELECT2
    $('.tipodato_select').on('change', function () {
        var valor_selector = $(this).val();
        selector_actualmente_siendo_tecleado = $(this).next().find('.select2-selection.select2-selection--single');
        
        if (valor_selector != '' && valor_selector != null) {
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').removeClass('has-error');
            selector_actualmente_siendo_tecleado.closest('.class_for_validation').addClass('has-success');
            $('.tipodato_select').each(function (index) {
                var valor_selector = $(this).val();
                selector_actualmente_siendo_tecleado = $(this).next().find('.select2-selection.select2-selection--single');
                if (valor_selector != '' && valor_selector != null) {
                    selector_actualmente_siendo_tecleado.closest('.class_for_validation').removeClass('has-error');
                    selector_actualmente_siendo_tecleado.closest('.class_for_validation').addClass('has-success');
                } else if (valor_selector == '' || valor_selector == null) {
                    selector_actualmente_siendo_tecleado.closest('.class_for_validation').removeClass('has-success');
                }
            });
        }
    });


    



    



});



