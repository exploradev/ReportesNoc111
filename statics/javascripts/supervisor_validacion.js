var buttonsforsubmit;
$(document).ready(function(){
    //EVITA EL SUBMIT AL CLICKEAR ANTER
    $(window).keydown(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });

    //VALIDACION DE CAMPOS DE ALTA O MODIFICACION DE NUEVO USUARIO ------------------------------

    $("input[name='edit_nombres']").keyup(function(){
        var selector = $(this);
        var valorselector = $(this).val();
        var regex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s\d]{1,20}$/;
        colorvalidacion(selector, valorselector, regex);
        resetcoloremptyfields(selector, valorselector);
    });

    $("input[name='edit_apellidos']").keyup(function () {
        var selector = $(this);
        var valorselector = $(this).val();
        var regex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s\d]{1,20}$/;
        colorvalidacion(selector, valorselector, regex);
        resetcoloremptyfields(selector, valorselector);
    });

    $("input[name='edit_username']").keyup(function () {
        var selector = $(this);
        var valorselector = $(this).val();
        var regex = /^[a-zA-Z\d\.]{1,20}$/;
        colorvalidacion(selector, valorselector, regex);
        resetcoloremptyfields(selector, valorselector);
    });

    $("input[name='edit_password']").keyup(function () {
        var selector = $(this);
        var valorselector = $(this).val();
        var regex = /^[a-zA-Z\d\.]{1,20}$/;
        colorvalidacion(selector, valorselector, regex);
        resetcoloremptyfields(selector, valorselector);
    });

    //SELECTS SE VALIDAN DIFERENTE -------------------------

    $('#edit_rol').change(function () {
        var selector = $(this);
        var valorselector = $(this).val();
        validacion_select(selector,valorselector);
        resetcoloremptyfields(selector, valorselector);
    });

    $('#edit_campania').change(function () {
        var selector = $(this);
        var valorselector = $(this).val();
        validacion_select(selector, valorselector);
        resetcoloremptyfields(selector, valorselector);
    });

    $('#edit_turno').change(function () {
        var selector = $(this);
        var valorselector = $(this).val();
        validacion_select(selector, valorselector);
        resetcoloremptyfields(selector, valorselector);
    });

    $('#edit_estatus').change(function () {
        var selector = $(this);
        var valorselector = $(this).val();
        validacion_select(selector, valorselector);
        resetcoloremptyfields(selector, valorselector);
    });




    //FUNCIONES DE VALIDACION ------------------------------------------------------------
    //Funcion para colorear
    function colorvalidacion(selector, valorselector, regex) {
        if (valorselector.match(regex)) {
            selector.closest('div').removeClass('has-error');
            selector.closest('div').addClass('has-success');
        } else {
            selector.closest('div').removeClass('has-success');
            selector.closest('div').addClass('has-error');
        }

    }

    //colorear selects
    function validacion_select(selector, valorselector){
        if (valorselector == '') {
            $(selector).closest('div').removeClass('has-success');
            $(selector).closest('div').addClass('has-error');
        } else {
            $(selector).closest('div').removeClass('has-error');
            $(selector).closest('div').addClass('has-success');
        }
    }


    //reset empty fields
    function resetcoloremptyfields(selector, valorselector) {
        if (valorselector == '') {
            selector.closest('div').removeClass('has-success').removeClass('has-error');
        }

    }

    //HABILITAR EL BOTON PARA SUBMIT DE 
    $('input').keyup(function () {
        buttonsforsubmit();
    });

    $('select').change(function () {
        buttonsforsubmit();
    });

    buttonsforsubmit = function () {
        var mandatory = $('.mandatory').length;
        var validated = ($('.has-success').find('.mandatory').length);
        if (validated == mandatory) {
            $('#btn_guardarusuario').prop('disabled', false);
        } else {
            $('#btn_guardarusuario').prop('disabled', true);
        }
    }

    //VALIDAR SI EL SELECT ES DIFERENTE A DEFAULT DEL APARTADO DE REASIGNACION DE CAPTURAS
    $('#selectmodalreasignar').change(function () {
        var value = $(this).val();
        
        if ((value == 'default') || (value == null)) {
            $('#submitmodalreasignar').prop('disabled', true);
        } else {
            $('#submitmodalreasignar').prop('disabled', false);
        }
    });
    
});
