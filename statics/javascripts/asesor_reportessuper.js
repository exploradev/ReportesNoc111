$(document).ready(function () {


    //ENVIO DE REPORTE DE SUPERVISOR
    $('#btn_captura_supervisor').click(function () {


        var acumulador_no_vacios = 0;
        var conteo_inputs = 0;
        var acumulador_por_llenar = 0;
        var acumulador_inputs_correctos = 0;
        var acumulador_inputs_erroneos = 0;
        //----------------------------------
        $('.inputsasesorforsup').each(function () {
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
        $('.inputsasesorforsup').closest('.has-success').each(function () {
            //lleno mi contador de inputs correctos
            acumulador_inputs_correctos++;
        });//fin de ciclo each dos
        //------------------------------------
        $('.inputsasesorforsup').closest('.has-error').each(function () {
            //lleno mi contador de inputs correctos
            acumulador_inputs_erroneos++;
        });//fin de ciclo each tres
        //------------------------------------

        //SI LA CANTIDAD DE ERRORES Y LOS NO LLENADOS NO SON IGUAL A CERO
        if (acumulador_inputs_erroneos != 0 || acumulador_por_llenar != 0) {
            //HAGO ALERT INDICANDO LO QUE FALTA
            alert("Es necesario llenar todos los campos correctamente antes de guardar \n Por llenar: " + acumulador_por_llenar + "\n Con error: " + acumulador_inputs_erroneos);
        } else if (conteo_inputs == acumulador_inputs_correctos) {
            //SI AMBOS SON CERO ENTONCES 
            //VALIDO QUE LA CANTIDAD DE INPUTS TOTAL SEA IGUAL AL TOTAL DE INPUTS CORRECTOS, ENTONCES

            //TOMO LOS VALORES DE TODOS LOS QUE SON EXITOSOS Y LOS ASIGNO A VARIABLES POR PASAR POR AJAX, 
            var parametro_ajax = [];
            //get valor telefono
            var iduser = $('body').data('iduser');
            parametro_ajax.push(iduser);
            
            $('.inputsasesorforsup').closest('.has-success').children('.inputsasesorforsup').each(function () {
                parametro_ajax.push($(this).val());
            });

            console.log(parametro_ajax);

            //EFECTUO EL AJAX Y EN EL CALLBACK CIERRO Y RESETEO TODOS LOS CAMPOS
            $.post('/guardar_repsupervisor', {
                iduser: parametro_ajax[0],
                asunto: parametro_ajax[1],
                numero: parametro_ajax[2],
                contacto: parametro_ajax[3],
                descripcion: parametro_ajax[4]

            }, function (response) {
                if (response == 'Correcto') {
                    alert("Todo correcto");
                    $('.closebuttonn').trigger('click');
                    $('.inputsasesorforsup').val('');
                }
            });
        }






    });
});
