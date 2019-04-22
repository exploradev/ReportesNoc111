var reset_all;
$(document).ready(function(){

    //FUNCION DE RESETEO DE CAMPOS AL GUARDAR
    //Y CIERRE DE LOS MODALES
    reset_all =  function(){

        //RESETEO DE CAMPOS
        
        $('.inputsasesor').val('').trigger('change');
        
        $('#telefono_afectado_aclaraciones').html("");
        $('#telefono_afectado_callback').html("");
        $('#telefono_afectado_general').html("");
        $('#telefono_afectado_cobertura').html("");
        $('#telefono_afectado_iccid').html("");
        $('#telefono_afectado_llamadas').html("");
        $('#telefono_afectado_navegacion').html("");
        $('#telefono_afectado_recargas').html("");
        $('#telefono_afectado_promociones').html("");
        $('#telefono_afectado_servicios').html("");

        $('#captura_tipo').html("");

        //TRIGGER DE EVENTOS NECESARIOS
        //CIERRE DE MODAL

        //RETIRO DE CLASES DE VALIDACION
        $('.class_for_validation').removeClass('has-error has-success');

        //se resetea input de numero a buscar
        $('#input_buscador').val('');
    }

    //--------------------------------------------------------------
    //HANDLER PARA CUANDO SE SELECCIONE EL TIPO DE REPORTE
    //CON PREVIA VALIDACION DE SI EXISTE EL REPORTE CON EL MISMO TIPO Y NUMERO:

    //CAPTURO EL CLICK EN EL BOTON DE SELECCION
    $('.tiporeporte_opcion').click(function(){
        //MUESTRO LOADER 

        //CAPTURO EL NUMERO TELEFONICO
        var telefono = $('#input_numerotiporeporte').val();
        //CAPTURO EL DATA-ELECCION DEL ELEMENTO CLICKEADO
        var tiporeporte = $(this).data('eleccion');
        //CONSULTO CON AJAX SI EXISTE REPORTE CON EL MISMO NUMERO Y TIPO DE REPORTE
        if(telefono == "" || telefono.length != 10){
            alert('Ingresar telefono a 10 digitos antes de elegir tipo de reporte');
        }else{
            $.post('/consultaexistencia',{
                telefono:telefono,
                tiporeporte:tiporeporte
            },function(response){
                //RESPONDER DESDE EL BACKEND SI SE ENCONTRO EL NUMERO Y TIPO DE REPORTE
                //AL OBTENER LA RESPUESTA SE MUESTRA MENSAJE DE ERROR DE QUE PARA ESE YA EXISTE
                $('#loader_seleccion').css('display','block');
                if(response=="existe"){
                    $('#loader_seleccion').css('display', 'none');
                    $('#mensajeerror_tiporeporte').css('visibility','visible');

                }else if(response=='no existe'){
                    //EN DADO CASO DE QUE EL BACKEND RESPONDA QUE NO EXISTE ENTONCES 
                    //MOSTRAMOS EL BODY_MODAL Y EL FOOTER_MODAL DEL TIPO DE REPORTE
                    //NO SIN ANTES COPIAR EL NUMERO INGRESADO EN EL CAMPO ADECUADO
                    //Y TAMPOCO SIN ANTES COPIAR EL TIPO DE REPORTE EN EL #CAPTURA_TIPO
                    

                    $('#loader_seleccion').css('display', 'none');
                    $('#mensajeerror_tiporeporte').css('visibility', 'hidden');
                    $('#input_numerotiporeporte').val("");

                    //oculto modal actual y abro el de formularios para llenarlo con el seleccionado
                    $('#asesor_modal_seleccionartiporeporte').css('display', 'none');
                    $('#asesor_modal_formularios').css('display', 'block');
                    $('#container_modalformularios > div').css('display', 'none');
                    $('#container_footermodal > div').css('display', 'none');

                    switch(tiporeporte){
                        case 'aclaraciones':
                            $('#captura_tipo').html("Aclaraciones");
                            $('#telefono_afectado_aclaraciones').html(telefono);
                            $('#body_modal_capturaaclaraciones').css('display', 'grid');
                            $('#container_footer_aclaraciones').css('display', 'flex');
                            break;
                        case 'general':
                            $('#captura_tipo').html("Afectación general");
                            $('#telefono_afectado_general').html(telefono);
                            $('#body_modal_capturageneral').css('display', 'grid');
                            $('#container_footer_general').css('display', 'flex');
                            break;
                        case 'cobertura':
                            $('#captura_tipo').html("Calidad en el servicio / Cobertura");
                            $('#telefono_afectado_cobertura').html(telefono);
                            $('#body_modal_capturacobertura').css('display', 'grid');
                            $('#container_footer_cobertura').css('display', 'flex');
                            break;
                        case 'iccid':
                            $('#captura_tipo').html("Cambio de ICCID");
                            $('#telefono_afectado_iccid').html(telefono);
                            $('#body_modal_capturaiccid').css('display', 'grid');
                            $('#container_footer_iccid').css('display', 'flex');
                            break;
                        case 'llamadas':
                            $('#captura_tipo').html("Llamadas / SMS");
                            $('#telefono_afectado_llamadas').html(telefono);
                            $('#body_modal_capturallamadas').css('display', 'grid');
                            $('#container_footer_llamadas').css('display', 'flex');
                            break;
                        case 'navegacion':
                            $('#captura_tipo').html("Falla en navegación");
                            $('#telefono_afectado_navegacion').html(telefono);
                            $('#body_modal_capturanavegacion').css('display', 'grid');
                            $('#container_footer_navegacion').css('display', 'flex');
                            break;
                        case 'recargas':
                            $('#captura_tipo').html("Falla en recargas");
                            $('#telefono_afectado_recargas').html(telefono);
                            $('#body_modal_capturarecargas').css('display', 'grid');
                            $('#container_footer_recargas').css('display', 'flex');
                            break;
                        case 'promociones':
                            $('#captura_tipo').html("Promociones");
                            $('#telefono_afectado_promociones').html(telefono);
                            $('#body_modal_capturapromociones').css('display', 'grid');
                            $('#container_footer_promociones').css('display', 'flex');
                            break;
                        case 'servicios':
                            $('#captura_tipo').html("Altas o bajas de servicios");
                            $('#telefono_afectado_servicios').html(telefono);
                            $('#body_modal_capturaservicios').css('display', 'grid');
                            $('#container_footer_servicios').css('display', 'flex');
                            break;
                        case 'callback':
                            $('#captura_tipo').html("Callback");
                            $('#telefono_afectado_callback').html(telefono);
                            $('#body_modal_capturacallback').css('display', 'grid');
                            $('#container_footer_callback').css('display', 'flex');
                            break;
                    }
                    
                }
                //ESCONDER LOADER
            });
        }
        
    });
   
    
    
    
    
    
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
                    $('.closebuttonn').trigger('click');
                    reset_all();
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
                    $('.closebuttonn').trigger('click');
                    reset_all();
                }
            });
        }






    });

    $('#btn_captura_callback').click(function () {


        var acumulador_no_vacios = 0;
        var conteo_inputs = 0;
        var acumulador_por_llenar = 0;
        var acumulador_inputs_correctos = 0;
        var acumulador_inputs_erroneos = 0;
        //----------------------------------
        $('.inputs_callback').each(function () {
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
        $('.inputs_callback').closest('.has-success').each(function () {
            //lleno mi contador de inputs correctos
            acumulador_inputs_correctos++;
        });//fin de ciclo each dos
        //------------------------------------
        $('.inputs_callback').closest('.has-error').each(function () {
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
            var telefono_afectado = $('#telefono_afectado_callback').html();

            $('.inputs_callback').closest('.has-success').children('.inputs_callback').each(function () {
                parametro_ajax.push($(this).val());
            });

            console.log(parametro_ajax);

            //EFECTUO EL AJAX Y EN EL CALLBACK CIERRO Y RESETEO TODOS LOS CAMPOS
            $.post('/guardar_callback', {
                iduser: iduser,
                telefono_afectado: telefono_afectado,

                nombreusuario: parametro_ajax[0],
                contacto: parametro_ajax[1],
                motivo: parametro_ajax[2],
                descripcionsituacion: parametro_ajax[3]

            }, function (response) {
                if (response == 'Correcto') {
                    alert("Todo correcto");
                    $('.closebuttonn').trigger('click');
                    reset_all();
                }
            });
        }






    });

    $('#btn_captura_general').click(function () {


        var acumulador_no_vacios = 0;
        var conteo_inputs = 0;
        var acumulador_por_llenar = 0;
        var acumulador_inputs_correctos = 0;
        var acumulador_inputs_erroneos = 0;
        //----------------------------------
        $('.inputs_general').each(function () {
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
        $('.inputs_general').closest('.has-success').each(function () {
            //lleno mi contador de inputs correctos
            acumulador_inputs_correctos++;
        });//fin de ciclo each dos
        //------------------------------------
        $('.inputs_general').closest('.has-error').each(function () {
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
            var telefono_afectado = $('#telefono_afectado_general').html();

            $('.inputs_general').closest('.has-success').children('.inputs_general').each(function () {
                parametro_ajax.push($(this).val());
            });

            console.log(parametro_ajax);

            //EFECTUO EL AJAX Y EN EL CALLBACK CIERRO Y RESETEO TODOS LOS CAMPOS
            $.post('/guardar_general', {
                iduser: iduser,
                telefono_afectado: telefono_afectado,

                nombreusuario: parametro_ajax[0],
                contacto: parametro_ajax[1],
                descripcionsituacion: parametro_ajax[2]

            }, function (response) {
                if (response == 'Correcto') {
                    alert("Todo correcto");
                    $('.closebuttonn').trigger('click');
                    reset_all();
                }
            });
        }






    });

    $('#btn_captura_iccid').click(function () {


        var acumulador_no_vacios = 0;
        var conteo_inputs = 0;
        var acumulador_por_llenar = 0;
        var acumulador_inputs_correctos = 0;
        var acumulador_inputs_erroneos = 0;
        //----------------------------------
        $('.inputs_iccid').each(function () {
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
        $('.inputs_iccid').closest('.has-success').each(function () {
            //lleno mi contador de inputs correctos
            acumulador_inputs_correctos++;
        });//fin de ciclo each dos
        //------------------------------------
        $('.inputs_iccid').closest('.has-error').each(function () {
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
            var telefono_afectado = $('#telefono_afectado_iccid').html();

            $('.inputs_iccid').closest('.has-success').children('.inputs_iccid').each(function () {
                parametro_ajax.push($(this).val());
            });

            console.log(parametro_ajax);

            //EFECTUO EL AJAX Y EN EL CALLBACK CIERRO Y RESETEO TODOS LOS CAMPOS
            $.post('/guardar_iccid', {
                iduser: iduser,
                telefono_afectado: telefono_afectado,

                nombreusuario: parametro_ajax[0],
                contacto: parametro_ajax[1],
                iccidvirtual: parametro_ajax[2],
                iccidfisica: parametro_ajax[3],
                cac: parametro_ajax[4]

            }, function (response) {
                if (response == 'Correcto') {
                    alert("Todo correcto");
                    $('.closebuttonn').trigger('click');
                    reset_all();
                }
            });
        }






    });

    $('#btn_captura_llamadas').click(function () {


        var acumulador_no_vacios = 0;
        var conteo_inputs = 0;
        var acumulador_por_llenar = 0;
        var acumulador_inputs_correctos = 0;
        var acumulador_inputs_erroneos = 0;
        //----------------------------------
        $('.inputs_llamadas').each(function () {
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
        $('.inputs_llamadas').closest('.has-success').each(function () {
            //lleno mi contador de inputs correctos
            acumulador_inputs_correctos++;
        });//fin de ciclo each dos
        //------------------------------------
        $('.inputs_llamadas').closest('.has-error').each(function () {
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
            var telefono_afectado = $('#telefono_afectado_llamadas').html();

            $('.inputs_llamadas').closest('.has-success').children('.inputs_llamadas').each(function () {
                parametro_ajax.push($(this).val());
            });

            console.log(parametro_ajax);

            //EFECTUO EL AJAX Y EN EL CALLBACK CIERRO Y RESETEO TODOS LOS CAMPOS
            $.post('/guardar_llamadas', {
                iduser: iduser,
                telefono_afectado: telefono_afectado,

                nombreusuario: parametro_ajax[0],
                contacto: parametro_ajax[1],
                mensajeerror: parametro_ajax[2],
                afectacion: parametro_ajax[3],
                tipored: parametro_ajax[4],
                origen1: parametro_ajax[5],
                origen2: parametro_ajax[6],
                origen3: parametro_ajax[7],
                descripcionsituacion: parametro_ajax[8]

            }, function (response) {
                if (response == 'Correcto') {
                    alert("Todo correcto");
                    $('.closebuttonn').trigger('click');
                    reset_all();
                }
            });
        }






    });

    $('#btn_captura_navegacion').click(function () {


        var acumulador_no_vacios = 0;
        var conteo_inputs = 0;
        var acumulador_por_llenar = 0;
        var acumulador_inputs_correctos = 0;
        var acumulador_inputs_erroneos = 0;
        //----------------------------------
        $('.inputs_navegacion').each(function () {
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
        $('.inputs_navegacion').closest('.has-success').each(function () {
            //lleno mi contador de inputs correctos
            acumulador_inputs_correctos++;
        });//fin de ciclo each dos
        //------------------------------------
        $('.inputs_navegacion').closest('.has-error').each(function () {
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
            var telefono_afectado = $('#telefono_afectado_navegacion').html();

            $('.inputs_navegacion').closest('.has-success').children('.inputs_navegacion').each(function () {
                parametro_ajax.push($(this).val());
            });

            console.log(parametro_ajax);

            //EFECTUO EL AJAX Y EN EL CALLBACK CIERRO Y RESETEO TODOS LOS CAMPOS
            $.post('/guardar_navegacion', {
                iduser: iduser,
                telefono_afectado: telefono_afectado,

                nombreusuario: parametro_ajax[0],
                contacto: parametro_ajax[1],
                mensajeerror: parametro_ajax[2],
                pruebasbasicas: parametro_ajax[3],
                tipored: parametro_ajax[4],
                fechayhorainiciofalla: parametro_ajax[5],
                descripcionsituacion: parametro_ajax[6]

            }, function (response) {
                if (response == 'Correcto') {
                    alert("Todo correcto");
                    $('.closebuttonn').trigger('click');
                    reset_all();
                }
            });
        }






    });

    $('#btn_captura_recargas').click(function () {


        var acumulador_no_vacios = 0;
        var conteo_inputs = 0;
        var acumulador_por_llenar = 0;
        var acumulador_inputs_correctos = 0;
        var acumulador_inputs_erroneos = 0;
        //----------------------------------
        $('.inputs_recargas').each(function () {
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
        $('.inputs_recargas').closest('.has-success').each(function () {
            //lleno mi contador de inputs correctos
            acumulador_inputs_correctos++;
        });//fin de ciclo each dos
        //------------------------------------
        $('.inputs_recargas').closest('.has-error').each(function () {
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
            var telefono_afectado = $('#telefono_afectado_recargas').html();

            $('.inputs_recargas').closest('.has-success').children('.inputs_recargas').each(function () {
                parametro_ajax.push($(this).val());
            });

            console.log(parametro_ajax);

            //EFECTUO EL AJAX Y EN EL CALLBACK CIERRO Y RESETEO TODOS LOS CAMPOS
            $.post('/guardar_recargas', {
                iduser: iduser,
                telefono_afectado: telefono_afectado,

                nombreusuario: parametro_ajax[0],
                mensajeerror: parametro_ajax[1],
                importe: parametro_ajax[2],
                metodocompra: parametro_ajax[3],
                fechayhora: parametro_ajax[4],
                descripcionsituacion: parametro_ajax[5]

            }, function (response) {
                if (response == 'Correcto') {
                    alert("Todo correcto");
                    $('.closebuttonn').trigger('click');
                    reset_all();
                }
            });
        }






    });

    $('#btn_captura_promociones').click(function () {


        var acumulador_no_vacios = 0;
        var conteo_inputs = 0;
        var acumulador_por_llenar = 0;
        var acumulador_inputs_correctos = 0;
        var acumulador_inputs_erroneos = 0;
        //----------------------------------
        $('.inputs_promociones').each(function () {
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
        $('.inputs_promociones').closest('.has-success').each(function () {
            //lleno mi contador de inputs correctos
            acumulador_inputs_correctos++;
        });//fin de ciclo each dos
        //------------------------------------
        $('.inputs_promociones').closest('.has-error').each(function () {
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
            var telefono_afectado = $('#telefono_afectado_promociones').html();

            $('.inputs_promociones').closest('.has-success').children('.inputs_promociones').each(function () {
                parametro_ajax.push($(this).val());
            });

            console.log(parametro_ajax);

            //EFECTUO EL AJAX Y EN EL CALLBACK CIERRO Y RESETEO TODOS LOS CAMPOS
            $.post('/guardar_promociones', {
                iduser: iduser,
                telefono_afectado: telefono_afectado,

                nombreusuario: parametro_ajax[0],
                contacto: parametro_ajax[1],
                promocion: parametro_ajax[2],
                fechainiciofalla: parametro_ajax[3],
                descripcionsituacion: parametro_ajax[4]

            }, function (response) {
                if (response == 'Correcto') {
                    alert("Todo correcto");
                    $('.closebuttonn').trigger('click');
                    reset_all();
                }
            });
        }






    });

    $('#btn_captura_servicios').click(function () {


        var acumulador_no_vacios = 0;
        var conteo_inputs = 0;
        var acumulador_por_llenar = 0;
        var acumulador_inputs_correctos = 0;
        var acumulador_inputs_erroneos = 0;
        //----------------------------------
        $('.inputs_servicios').each(function () {
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
        $('.inputs_servicios').closest('.has-success').each(function () {
            //lleno mi contador de inputs correctos
            acumulador_inputs_correctos++;
        });//fin de ciclo each dos
        //------------------------------------
        $('.inputs_servicios').closest('.has-error').each(function () {
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
            var telefono_afectado = $('#telefono_afectado_servicios').html();

            $('.inputs_servicios').closest('.has-success').children('.inputs_servicios').each(function () {
                parametro_ajax.push($(this).val());
            });

            console.log(parametro_ajax);

            //EFECTUO EL AJAX Y EN EL CALLBACK CIERRO Y RESETEO TODOS LOS CAMPOS
            $.post('/guardar_servicios', {
                iduser: iduser,
                telefono_afectado: telefono_afectado,

                nombreusuario: parametro_ajax[0],
                contacto: parametro_ajax[1],
                mensajeerror: parametro_ajax[2],
                servicio: parametro_ajax[3],
                descripcionsituacion: parametro_ajax[4]

            }, function (response) {
                if (response == 'Correcto') {
                    alert("Todo correcto");
                    $('.closebuttonn').trigger('click');
                    reset_all();
                }
            });
        }






    });


    //-----------------------------------------------
    //SCRIPTS PARA BUSQUEDA DE NUMERO

    //Al clickear el boton de busqueda
    //se capturan los datos y se hace ajax para validar si existe el numero o el folio (id)
    $('#btn_buscador').click(function(){
        var numeroofolio = $('#input_buscador').val();
        $.post('/buscar_numeroofolio',{numeroofolio:numeroofolio},function(response){
            if(response == 'no existe'){
                //en caso de que no exista se muestra mensaje de error 
                $('#errorbusqueda').css('visibility','visible');
            }else{
                //en caso de que si exista entonces se resetea la tabla de resultados tbody
                //y se muestra modal de reportes disponibles
                //con la opcion de que al darle click se muestre el detalle en el modal de detalles
                $('#errorbusqueda').css('visibility', 'hidden');
                var table_body = [];
                for (i = 0; i < response.length; i++) {
                    table_body += "<tr id='row" + response[i]["idmetadatos"] + "' class='rowdetallesdisponibles' data-idmetadatos='" + response[i]["idmetadatos"] + "' data-tipofalla='" + response[i]["falla"] +"'>";

                    table_body += '<td>';
                    table_body += moment(response[i]["creado"]).format('DD/MM/YYYY HH:mm');
                    table_body += '</td>';

                    table_body += '<td>';
                    table_body += response[i]["asesor"];
                    table_body += '</td>';

                    table_body += '<td>';
                    if (response[i]["falla"] == 'aclaraciones') {
                        table_body += "Aclaraciones";
                    } else if (response[i]["falla"] == 'callback') {
                        table_body += "Callback";
                    } else if (response[i]["falla"] == 'general') {
                        table_body += "Afectación general";
                    } else if (response[i]["falla"] == 'cobertura') {
                        table_body += "Calidad en el servicio/Cobertura";
                    } else if (response[i]["falla"] == 'iccid') {
                        table_body += "Cambio de ICCID";
                    }else if (response[i]["falla"] == 'llamadas') {
                        table_body += "Falla en llamadas/SMS";
                    }else if (response[i]["falla"] == 'navegacion') {
                        table_body += "Falla en navegación";
                    } else if (response[i]["falla"] == 'recargas') {
                        table_body += "Recargas";
                    } else if (response[i]["falla"] == 'promociones') {
                        table_body += "Promociones";
                    } else if (response[i]["falla"] == 'servicios') {
                        table_body += "Alta o baja de servicios";
                    } else {
                        table_body += "N/A"
                    }
                    table_body += '</td>';

                    if (response[i]["ultseguimiento"] == null) {
                        table_body += '<td>';
                        table_body += "N/A"
                        table_body += '</td>';
                    } else {
                        table_body += '<td>';
                        table_body += moment(response[i]["ultseguimiento"]).format('DD/MM/YYYY HH:mm');
                        table_body += '</td>';
                    }

                    if (response[i]["propietario"] == null) {
                        table_body += '<td>';
                        table_body += "N/A"
                        table_body += '</td>';
                    } else {
                        table_body += '<td>';
                        table_body += response[i]["propietario"];
                        table_body += '</td>';
                    }

                    if (response[i]["cerrado"] == null) {
                        table_body += '<td>';
                        table_body += "N/A"
                        table_body += '</td>';
                    } else {
                        table_body += '<td>';
                        table_body += moment(response[i]["cerrado"]).format('DD/MM/YYYY HH:mm');
                        table_body += '</td>';
                    }

                    table_body += '<td>';
                    table_body += response[i]["estatus"];
                    table_body += '</td>';
                  

                    table_body += '</tr>';
                }
                $('#tbody_reportesexistentes').html(table_body);

                //Despues de escribir se muestra el modal
                var valor_numfolio = $('#input_buscador').val()
                $('#numeroofolioenmodal').html(valor_numfolio);
                $('#overlay-back').css('display', 'block');
                $('body').addClass('modal-open');
                $('#asesor_modal_reportesdisponibles').css('display','block');
            }
        });
    });
    
    
    
    
    //se esconde modal actual y se muestra el modal de detalles
    //se hace ajax para llenar los datos de detalle del reporte clickeado
    //habilitar boton de atras para mostrar el modal anterior en caso de que se desee ver detalles de otro reporte
    //al dar click al boton de atras se deben resetear los campos del modal de detalle
    //al dar esc se cierran todos los modales y se resetea todo

});