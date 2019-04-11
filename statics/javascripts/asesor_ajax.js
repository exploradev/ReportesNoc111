
$(document).ready(function(){

    $('#btn_captura_cobertura').click(function(){

        var telefono_afectado = $('#cobertura_telefono').html();
        console.log(telefono_afectado);
        $('.inputs_cobertura').each(function (elemento) {
            console.log($(this).val());
        })
    });
    

});