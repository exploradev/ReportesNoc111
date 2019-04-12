var reset_all;
$(document).ready(function(){

    //FUNCION DE RESETEO DE CAMPOS AL GUARDAR
    //Y CIERRE DE LOS MODALES
    reset_all =  function(){

        //RESETEO DE CAMPOS
        $('.inputs_aclaraciones').val('').trigger('change');
        $('.inputs_general').val('').trigger('change');
        $('.inputs_cobertura').val('').trigger('change');
        $('.inputs_iccid').val('').trigger('change');
        $('.inputs_llamadas').val('').trigger('change');
        $('.inputs_navegacion').val('').trigger('change');
        $('.inputs_recargas').val('').trigger('change');
        $('.inputs_promociones').val('').trigger('change');
        $('.inputs_servicios').val('').trigger('change');
        $('.inputs_callback').val('').trigger('change');

        $('#telefono_afectado_cobertura').html("");
        $('#telefono_afectado_aclaraciones').html("");
        $('#captura_tipo').html("");

        //TRIGGER DE EVENTOS NECESARIOS
        //CIERRE DE MODAL

        //RETIRO DE CLASES DE VALIDACION
        $('.class_for_validation').removeClass('has-error has-success');
    }

    //--------------------------------------------------------------

    //HANDLER CUANDO SE CLICKEE BOTONES DE LOS FORMULARIOS
    //PARA GUARDAR EN LA BASE DE DATOS


    $('#btn_captura_cobertura').click(function(){
        

        var acumulador_no_vacios = 0;
        var conteo_inputs_cobertura = 0;
        var acumulador_por_llenar = 0;
        var acumulador_inputs_correctos = 0;
        var acumulador_inputs_erroneos = 0;
        //----------------------------------
        $('.inputs_cobertura').each(function () {
            //lleno mi contador de inputs
            conteo_inputs_cobertura++;

            //lleno mis acumuladores de no vacios y por llenar
            var valor_selector_actual = $(this).val();
            if(valor_selector_actual == "" || valor_selector_actual == null){
                acumulador_por_llenar++;
            }else{
                acumulador_no_vacios++;
            }
        });//fin de ciclo each uno
        //----------------------------------
        $('.inputs_cobertura').closest('.has-success').each(function () {
            //lleno mi contador de inputs correctos
            acumulador_inputs_correctos++;
        });//fin de ciclo each dos
        //------------------------------------
        $('.inputs_cobertura').closest('.has-error').each(function () {
            //lleno mi contador de inputs correctos
            acumulador_inputs_erroneos++;
        });//fin de ciclo each tres
        //------------------------------------
        
        //SI LA CANTIDAD DE ERRORES Y LOS NO LLENADOS NO SON IGUAL A CERO
        if(acumulador_inputs_erroneos != 0 || acumulador_por_llenar != 0){
            //HAGO ALERT INDICANDO LO QUE FALTA
            alert("Es necesario llenar todos los campos correctamente antes de guardar \n Por llenar: " + acumulador_por_llenar + "\n Con error: " + acumulador_inputs_erroneos);
        }else if(conteo_inputs_cobertura == acumulador_inputs_correctos){
            //SI AMBOS SON CERO ENTONCES 
            //VALIDO QUE LA CANTIDAD DE INPUTS TOTAL SEA IGUAL AL TOTAL DE INPUTS CORRECTOS, ENTONCES

            //TOMO LOS VALORES DE TODOS LOS QUE SON EXITOSOS Y LOS ASIGNO A VARIABLES POR PASAR POR AJAX, 
            var parametro_ajax = [];
            //get valor telefono
            var iduser = $('body').data('iduser');
            var telefono_afectado = $('#telefono_afectado_cobertura').html();
            
            $('.inputs_cobertura').closest('.has-success').children('.inputs_cobertura').each(function () {
                parametro_ajax.push($(this).val());
            });

            console.log(parametro_ajax);

            //EFECTUO EL AJAX Y EN EL CALLBACK CIERRO Y RESETEO TODOS LOS CAMPOS
            $.post('/guardar_cobertura',{
                iduser: iduser,
                telefono_afectado: telefono_afectado,
                contacto: parametro_ajax[0],
                nombreusuario: parametro_ajax[1],
                fechanaciemiento: parametro_ajax[2],
                lugarnacimiento: parametro_ajax[3],
                estado: parametro_ajax[4],
                municipio: parametro_ajax[5],
                colonia: parametro_ajax[6],
                cp: parametro_ajax[7],
                direccioncliente: parametro_ajax[8],
                descripcionzona: parametro_ajax[9],
                marcaequipo: parametro_ajax[10],
                modeloequipo: parametro_ajax[11],
                fechainiciofalla: parametro_ajax[12],
                falla: parametro_ajax[13],
                descripcionsituacion: parametro_ajax[14]
            },function(response){
                if(response=='Correcto'){
                    alert("Todo correcto");
                }
            });
        }
        

        
        

        
    });
    
    $('#btn_captura_aclaraciones').click(function () {


        var acumulador_no_vacios = 0;
        var conteo_inputs = 0;
        var acumulador_por_llenar = 0;
        var acumulador_inputs_correctos = 0;
        var acumulador_inputs_erroneos = 0;
        //----------------------------------
        $('.inputs_aclaraciones').each(function () {
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
        $('.inputs_aclaraciones').closest('.has-success').each(function () {
            //lleno mi contador de inputs correctos
            acumulador_inputs_correctos++;
        });//fin de ciclo each dos
        //------------------------------------
        $('.inputs_aclaraciones').closest('.has-error').each(function () {
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
            var telefono_afectado = $('#telefono_afectado_aclaraciones').html();

            $('.inputs_aclaraciones').closest('.has-success').children('.inputs_aclaraciones').each(function () {
                parametro_ajax.push($(this).val());
            });

            console.log(parametro_ajax);

            //EFECTUO EL AJAX Y EN EL CALLBACK CIERRO Y RESETEO TODOS LOS CAMPOS
            $.post('/guardar_aclaracion', {
                iduser: iduser,
                telefono_afectado: telefono_afectado,
                
                nombreusuario: parametro_ajax[0],
                contacto: parametro_ajax[1],
                fechainiciofalla: parametro_ajax[2],
                descripcionsituacion: parametro_ajax[3]

            }, function (response) {
                if (response == 'Correcto') {
                    alert("Todo correcto");
                }
            });
        }






    });

});