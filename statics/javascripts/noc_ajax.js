var llenarContadoresSuperiores, timestampsCounter,clockInterval;
$(document).ready(function(){

  //TODAS LAS OPERACIONES CRUD DE LOS REPORTES SE HACEN ACA



  //llamada para llenar contadores
    llenarContadoresSuperiores = function(){
        var iduser = $("body").data("iduser");
        $.post('/get_conteopersonal_superior',{
            iduser:iduser
        },function(response){
                $("#conteonoc_nuevos").html(response[0]['nuevos']);
                $("#conteonoc_enproceso").html(response[0]['enproceso']);
                $("#conteonoc_pendientes").html(response[0]['pendientes']);
                $("#conteonoc_cerrado").html(response[0]['cerrados']);
        });
    }

  //CONDICIONAL PARA MOSTRAR PICKLIST AL MOMENTO DE CLICKEAR EN PROCESO
    $('#boton_enproceso').click(function () {

        //ajax para timestamp de estatus en proceso
        //al ajax exitoso se ejecuta el codigo de abajo
        var iduser = $("body").data("iduser");
        var idmetadatos = $('#detalles_metadatospanel_folio').html();

        $.post('/setPrimerBloqueo', {iduser:iduser, idmetadatos:idmetadatos,estatus: "En proceso" }, function (response) {
            if (response == "En proceso") {
                $('#seccion_comentarioslibres').attr("data-estatus", "En proceso");
                $('#form_seguimiento').show();
                $('#boton_enproceso ').hide();
                $('#estatus_seguimiento_nuevo').next(".select2-container").show();
                $('#estatus_seguimiento_nuevo').show();
                $('#guardar_seguimiento_nuevo').show();
                $('#estatus_seguimiento_solucionado').next(".select2-container").hide();
                $('#guardar_seguimiento_solucionado').hide();
                $('#comentarios_seguimiento_nuevo').show();
                $("#seccion_comentarioslibres").show();
                reload_comentarios(idmetadatos)

                //manejo de clase auxiliar para centrar boton en proceso
                //debugger
                $("#footer_modal_container").removeClass('aux_enproceso');
                $("#footer_modal_container").addClass('footer_modal_container');

                //ACTUALIZO PANEL DE LISTA CONCENTRADOS DE REPORTES
                var mios = $("input[name=mios]:checked").val();
                if (mios == 'show') {
                    llenar_conteos_propios();
                } else {
                    llenar_conteos_todos();
                }
                //reload tabla actual trtgger click de panel abierto

                var panelabierto = $('#tiporeporte_header').attr("data-filterclick");
                $('.clickable_filter[data-filter="' + panelabierto + '"]').trigger('click');
                 
                $.post("/get_detallesmetadatos", {idmetadatos:idmetadatos},
                    function (inner_response) {
                        //ACTUALIZAR CONTADOR ---------------------------
                        //INICIO RELOJ ESTATUS -------------------------
                        var servertime = inner_response[0]["enproceso_time"]
                        var newMoment = moment(servertime).format("YYYY-MM-DD HH:mm:ss");
                        servertime = new Date(newMoment);
                        clearInterval(clockInterval); //reseteo el contador de la ventana actual
                        timestampsCounter(servertime);
                        //FIN RELOJ ESTATUS ----------------------------
                    }
                );

                
                
            } else {
                alert(response);
            }


        });


    });
    
  //al clickear el boton de guardado de seguimiento se ejecuta lo siguiente
    $("#guardar_seguimiento_nuevo").click(function(){
        var nuevo_estatus = $('#estatus_seguimiento_nuevo').val();
        var nuevo_codificacion = $('#codificacion_noc').val();
        var nuevo_comentario = $('#comentarios_seguimiento_nuevo').val();
        var folio_bit = $('#folio_bit').val();
        var folio_cpd = $('#folio_cpd').val();
        var folio_usd = $('#folio_usd').val();
        var folio_reporsis = $('#folio_reporsis').val();



        var iduser = $("body").data("iduser");
        var idmetadatos = $('#detalles_metadatospanel_folio').html();
        if(nuevo_comentario == ""){
            alert("Ingresar comentario de seguimiento");
        }else if(nuevo_estatus == ""){
            alert("Ingresar estatus de la captura actual");
        }else if(nuevo_comentario != "" && nuevo_estatus != ""){
            //ingresar comentario a db por 
            $.post('/actualizar_estatuscaptura',{
                nuevo_estatus:nuevo_estatus,
                nuevo_comentario:nuevo_comentario,
                nuevo_codificacion: nuevo_codificacion,
                folio_bit: folio_bit,
                folio_cpd: folio_cpd,
                folio_usd: folio_usd,
                folio_reporsis: folio_reporsis,
                iduser:iduser,
                idmetadatos:idmetadatos
            },function(response){
                if(response == "Solucionado"){
                    $('#seccion_comentarioslibres').attr("data-estatus", "Solucionado");
                    //MOSTRAR SELECT CON LOS ESTATUS SIGUIENTES
                    $('#estatus_seguimiento_nuevo').next(".select2-container").hide();
                    $('#guardar_seguimiento_nuevo').hide();
                    $('#estatus_seguimiento_solucionado').next(".select2-container").show();
                    $('#guardar_seguimiento_solucionado').show();


                    alert("Actualizado correctamente");
                    $('#estatus_seguimiento_nuevo').val("").trigger('change');
                    $('#comentarios_seguimiento_nuevo').val("");
                    //llamar ajax de comentarios de folio actual
                    reload_comentarios(idmetadatos);
                    //reload_conteos
                    var mios = $("input[name=mios]:checked").val();
                    if (mios == 'show') {
                        llenar_conteos_propios();
                    } else {
                        llenar_conteos_todos();
                    }
                    //reload tabla actual trtgger click de panel abierto
                    var panelabierto = $('#tiporeporte_header').attr("data-filterclick");
                    $('.clickable_filter[data-filter="'+panelabierto+'"]').trigger('click');
                    //console.log(panelabierto);

                    $.post("/get_detallesmetadatos", { idmetadatos: idmetadatos },
                        function (inner_response) {
                            //ACTUALIZAR CONTADOR ---------------------------
                            //INICIO RELOJ ESTATUS -------------------------
                            var servertime = inner_response[0]["solucionado_time"]
                            var newMoment = moment(servertime).format("YYYY-MM-DD HH:mm:ss");
                            servertime = new Date(newMoment);
                            clearInterval(clockInterval); //reseteo el contador de la ventana actual
                            timestampsCounter(servertime);
                            //FIN RELOJ ESTATUS ----------------------------
                        }
                    );

                    
                    
                    
                }else if(response == 'Cerrado' || response == 'Rechazado'){ //si el estatus es cerrado o rechazado
                    $('#seccion_comentarioslibres').attr("data-estatus", response);
                    //ocultar selects y botones
                    $('#estatus_seguimiento_nuevo').next(".select2-container").hide();
                    $('#guardar_seguimiento_nuevo').hide();
                    $('#estatus_seguimiento_solucionado').next(".select2-container").hide();
                    $('#guardar_seguimiento_solucionado').hide();
                    $('#comentarios_seguimiento_nuevo').hide();


                    alert("Actualizado correctamente");
                    $('#estatus_seguimiento_nuevo').val("").trigger('change');
                    $('#estatus_seguimiento_solucionado').val("").trigger('change');
                    $('#comentarios_seguimiento_nuevo').val("");
                    //llamar ajax de comentarios de folio actual
                    reload_comentarios(idmetadatos);
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
                    //console.log(panelabierto);

                    clearInterval(clockInterval); //reseteo el contador de la ventana actual
                    $('#server_rolex').html("--");

                }else{
                    alert(response)
                }
            });
            
            
        }
    });

    $("#guardar_seguimiento_solucionado").click(function () {
        var nuevo_estatus = $('#estatus_seguimiento_solucionado').val();
        var nuevo_codificacion = $('#codificacion_noc').val();
        var nuevo_comentario = $('#comentarios_seguimiento_nuevo').val();
        var folio_bit = $('#folio_bit').val();
        var folio_cpd = $('#folio_cpd').val();
        var folio_usd = $('#folio_usd').val();
        var folio_reporsis = $('#folio_reporsis').val();



        var iduser = $("body").data("iduser");
        var idmetadatos = $('#detalles_metadatospanel_folio').html();
        if (nuevo_comentario == "") {
            alert("Ingresar comentario de seguimiento");
        } else if (nuevo_estatus == "") {
            alert("Ingresar estatus de la captura actual");
        } else if (nuevo_comentario != "" && nuevo_estatus != "") {
            //ingresar comentario a db por 
            $.post('/actualizar_estatuscaptura', {
                nuevo_estatus: nuevo_estatus,
                nuevo_comentario: nuevo_comentario,
                nuevo_codificacion: nuevo_codificacion,
                folio_bit: folio_bit,
                folio_cpd: folio_cpd,
                folio_usd: folio_usd,
                folio_reporsis: folio_reporsis,
                iduser: iduser,
                idmetadatos: idmetadatos
            }, function (response) {
                if (response == "Solucionado") {

                    $('#seccion_comentarioslibres').attr("data-estatus", "Solucionado");
                    //MOSTRAR SELECT CON LOS ESTATUS SIGUIENTES

                    $('#estatus_seguimiento_nuevo').next(".select2-container").hide();
                    $('#guardar_seguimiento_nuevo').hide();
                    $('#estatus_seguimiento_solucionado').next(".select2-container").show();
                    $('#guardar_seguimiento_solucionado').show();


                    alert("Actualizado correctamente");
                    $('#estatus_seguimiento_nuevo').val("").trigger('change');
                    $('#comentarios_seguimiento_nuevo').val("");
                    //llamar ajax de comentarios de folio actual
                    reload_comentarios(idmetadatos);
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
                    //console.log(panelabierto);

                    $.post("/get_detallesmetadatos", { idmetadatos: idmetadatos },
                        function (inner_response) {
                            //ACTUALIZAR CONTADOR ---------------------------
                            //INICIO RELOJ ESTATUS -------------------------
                            var servertime = inner_response[0]["solucionado_time"]
                            var newMoment = moment(servertime).format("YYYY-MM-DD HH:mm:ss");
                            servertime = new Date(newMoment);
                            clearInterval(clockInterval); //reseteo el contador de la ventana actual
                            timestampsCounter(servertime);
                            //FIN RELOJ ESTATUS ----------------------------
                        }
                    );


                } else if (response == 'Cerrado' || response == 'Rechazado') { //si el estatus es cerrado o rechazado

                    $('#seccion_comentarioslibres').attr("data-estatus", response);
                    //ocultar selects y botones
                    $('#estatus_seguimiento_nuevo').next(".select2-container").hide();
                    $('#guardar_seguimiento_nuevo').hide();
                    $('#estatus_seguimiento_solucionado').next(".select2-container").hide();
                    $('#guardar_seguimiento_solucionado').hide();
                    $('#comentarios_seguimiento_nuevo').hide();


                    alert("Actualizado correctamente");
                    $('#estatus_seguimiento_nuevo').val("").trigger('change');
                    $('#estatus_seguimiento_solucionado').val("").trigger('change');
                    $('#comentarios_seguimiento_nuevo').val("");
                    //llamar ajax de comentarios de folio actual
                    reload_comentarios(idmetadatos);

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
                    //console.log(panelabierto);

                    clearInterval(clockInterval); //reseteo el contador de la ventana actual
                    $('#server_rolex').html("--");


                } else {
                    alert(response)
                }
            });


        }
    });

    //GUARDAR COMENTARIOS LIBRES (SIN CAMBIO DE ESTATUS) **PENDIENTE CONTINUAR---------------
    $('#btn_comentarioslibres').click(function () { 
        var nuevo_comentario = $('#input_comentarioslibres').val();
        var nuevo_estatus = $('#seccion_comentarioslibres').attr("data-estatus");
        var nuevo_codificacion = $('#codificacion_noc').val();
        var folio_bit = $('#folio_bit').val();
        var folio_cpd = $('#folio_cpd').val();
        var folio_usd = $('#folio_usd').val();
        var folio_reporsis = $('#folio_reporsis').val();

        var iduser = $("body").data("iduser");
        var idmetadatos = $('#detalles_metadatospanel_folio').html();

        if (nuevo_comentario == "") {
            alert("Ingresar comentario de seguimiento");
        } else if (nuevo_estatus == "") {
            alert("Ingresar estatus de la captura actual");
        } else if (nuevo_comentario != "" && nuevo_estatus != "") {
            //ingresar comentario a db por 
            $.post('/set_comentariolibre', {
                nuevo_estatus: nuevo_estatus,
                nuevo_comentario: nuevo_comentario,
                nuevo_codificacion: nuevo_codificacion,
                folio_bit: folio_bit,
                folio_cpd: folio_cpd,
                folio_usd: folio_usd,
                folio_reporsis: folio_reporsis,
                iduser: iduser,
                idmetadatos: idmetadatos
            }, function (response) {
                    $("#input_comentarioslibres").val("");
                reload_comentarios(idmetadatos);
            });


        }
    });

    //AGREGAR EL ESTATUS EN CUALQUIER LUGAR PARA REUTILIZARLO EN COMENTARIO LIBRES
    //GUARDAR COMENTARIOS LIBRES (SIN CAMBIO DE ESTATUS) **PENDIENTE CONTINUAR---------------

    function reload_comentarios(idmetadatos){
        //LLAMAR AJAX PARA LLENAR TABLA DE COMENTARIOS DE SEGUIMIENTO
        $.post('/get_detallesobservaciones', {
            idmetadatos: idmetadatos
        }, function (response) {
            var table_body = [];
            for (i = 0; i < response.length; i++) {
                table_body += "<tr>";

                table_body += '<td>';
                table_body += moment(response[i]["creado"]).format('DD/MM/YYYY HH:mm');
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["nombre"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["estatus"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["observacion"];
                table_body += '</td>';

                table_body += '</tr>';
            }
            $('#tbody_detallescomentariosmodal').html(table_body);
        });
    }


  
  //AJAX PARA LLENAR DETALLES EN EL MODAL DE SEGUIMIENTO -------------------------------------
    $("#tbody_maintable").on('click','.rowdetallesdisponibles',function(){
        var idmetadatos = $(this).data('idmetadatos');
        var tipofalla = $(this).data('tipofalla');
        
        //reseteo el contador superior
        $("#server_rolex").html("--");
        //console.log(tipofalla, idmetadatos);
        //javascript de show para demas controles al iniciar el proceso en get_detallesmetadatos
        
        $('.body_modal_detalles').css('display', 'none');
        switch (tipofalla) {
            case 'aclaraciones':
                $('#body_modal_detallesaclaraciones').css('display', 'grid');
                break;
            case 'general':
                $('#body_modal_detallesgeneral').css('display', 'grid');
                break;
            case 'cobertura':
                $('#body_modal_detallescobertura').css('display', 'grid');
                break;
            case 'iccid':
                $('#body_modal_detallesiccid').css('display', 'grid');
                break;
            case 'llamadas':
                $('#body_modal_detallesllamadas').css('display', 'grid');
                break;
            case 'navegacion':
                $('#body_modal_detallesnavegacion').css('display', 'grid');
                break;
            case 'recargas':
                $('#body_modal_detallesrecargas').css('display', 'grid');
                break;
            case 'promociones':
                $('#body_modal_detallespromociones').css('display', 'grid');
                break;
            case 'servicios':
                $('#body_modal_detallesservicios').css('display', 'grid');
                break;
            case 'callback':
                $('#body_modal_detallescallback').css('display', 'grid');
                break;
        }

        $.post('/get_detallesmetadatos', {
            idmetadatos: idmetadatos
        }, function (response) {


            //REVISAR EL ESTATUS Y DEPENDIENDO DEL QUE TENGA SE HACE SHOW O HIDE
            //DEL SELECT Y DEL BOTON DE ENVIO

            if (response[0]["estatus"] == "En proceso"){
                $('#form_seguimiento').show();
                $('#boton_enproceso ').hide();
                $('#estatus_seguimiento_nuevo').next(".select2-container").show();
                $('#estatus_seguimiento_nuevo').show();
                $('#guardar_seguimiento_nuevo').show();
                $('#estatus_seguimiento_solucionado').next(".select2-container").hide();
                $('#guardar_seguimiento_solucionado').hide();
                $('#comentarios_seguimiento_nuevo').show();
                $("#seccion_comentarioslibres").show();

                //manejo de clase auxiliar para centrar boton en proceso
                //debugger
                $("#footer_modal_container").removeClass('aux_enproceso');
                $("#footer_modal_container").addClass('footer_modal_container');
                
                

                //INICIO RELOJ ESTATUS -------------------------
                var servertime = response[0]["enproceso_time"]
                var newMoment = moment(servertime).format("YYYY-MM-DD HH:mm:ss");
                servertime = new Date(newMoment);
                clearInterval(clockInterval); //reseteo el contador de la ventana actual
                timestampsCounter(servertime);
                //FIN RELOJ ESTATUS ----------------------------

            }else if(response[0]["estatus"] == "Solucionado"){
                $('#form_seguimiento').show();
                //MOSTRAR SELECT CON LOS ESTATUS SIGUIENTES
                $('#boton_enproceso ').hide();
                $('#estatus_seguimiento_nuevo').next(".select2-container").hide();
                $('#guardar_seguimiento_nuevo').hide();
                $('#estatus_seguimiento_solucionado').next(".select2-container").show();
                $('#estatus_seguimiento_solucionado').show();
                $('#guardar_seguimiento_solucionado').show();
                $('#comentarios_seguimiento_nuevo').show();
                $("#seccion_comentarioslibres").show();

                //manejo de clase auxiliar para centrar boton en proceso
                //debugger
                $("#footer_modal_container").removeClass('aux_enproceso');
                $("#footer_modal_container").addClass('footer_modal_container');



                //INICIO RELOJ ESTATUS -------------------------
                var servertime = response[0]["solucionado_time"]
                var newMoment = moment(servertime).format("YYYY-MM-DD HH:mm:ss");
                servertime = new Date(newMoment);
                clearInterval(clockInterval); //reseteo el contador de la ventana actual
                timestampsCounter(servertime);
                //FIN RELOJ ESTATUS ----------------------------

            } else if (response[0]["estatus"] == "Cerrado" || response[0]["estatus"] == "Rechazado"){
                //ocultar selects y botones
                $('#form_seguimiento').show();
                $('#boton_enproceso ').hide();
                $('#estatus_seguimiento_nuevo').next(".select2-container").hide();
                $('#guardar_seguimiento_nuevo').hide();
                $('#estatus_seguimiento_solucionado').next(".select2-container").hide();
                $('#guardar_seguimiento_solucionado').hide();
                $('#comentarios_seguimiento_nuevo').hide();
                $("#seccion_comentarioslibres").show();

                //manejo de clase auxiliar para centrar boton en proceso
                //debugger
                $("#footer_modal_container").removeClass('aux_enproceso');
                $("#footer_modal_container").addClass('footer_modal_container');



                clearInterval(clockInterval); //reseteo el contador de la ventana actual
                $('#server_rolex').html("--");

            } else if (response[0]["estatus"] == "Nuevo"){
                $('#form_seguimiento').hide();
                $('#boton_enproceso ').show();
                $('#estatus_seguimiento_nuevo').next(".select2-container").hide();
                $('#guardar_seguimiento_nuevo').hide();
                $('#estatus_seguimiento_solucionado').next(".select2-container").hide();
                $('#guardar_seguimiento_solucionado').hide();
                $('#comentarios_seguimiento_nuevo').hide();
                $("#seccion_comentarioslibres").hide();

                //manejo de clase auxiliar para centrar boton en proceso
                //debugger
                $("#footer_modal_container").removeClass('footer_modal_container');
                $("#footer_modal_container").addClass('aux_enproceso');

                //INICIO RELOJ ESTATUS -------------------------
                var servertime = response[0]["creado"]
                var newMoment = moment(servertime).format("YYYY-MM-DD HH:mm:ss");
                servertime = new Date(newMoment);
                clearInterval(clockInterval); //reseteo el contador de la ventana actual
                timestampsCounter(servertime);
                //FIN RELOJ ESTATUS ----------------------------

            }

            //FIN DE VALIDACION DE ESTATUS
            
            

            $('#seccion_comentarioslibres').attr("data-estatus", response[0]["estatus"]);

            $('#detalles_metadatospanel_folio').html(response[0]["idmetadatos"]);
            switch (tipofalla) {
                case 'aclaraciones':
                    $('#detalles_metadatospanel_tiporeporte').html("Aclaraciones")
                    break;
                case 'general':
                    $('#detalles_metadatospanel_tiporeporte').html("Afectación general")
                    break;
                case 'cobertura':
                    $('#detalles_metadatospanel_tiporeporte').html("Calidad en el servicio/Cobertura")
                    break;
                case 'iccid':
                    $('#detalles_metadatospanel_tiporeporte').html("Cambio de ICCID")
                    break;
                case 'llamadas':
                    $('#detalles_metadatospanel_tiporeporte').html("Llamadas/SMS")
                    break;
                case 'navegacion':
                    $('#detalles_metadatospanel_tiporeporte').html("Falla en navegación")
                    break;
                case 'recargas':
                    $('#detalles_metadatospanel_tiporeporte').html("Falla en recargas")
                    break;
                case 'promociones':
                    $('#detalles_metadatospanel_tiporeporte').html("Promociones")
                    break;
                case 'servicios':
                    $('#detalles_metadatospanel_tiporeporte').html("Altas o bajas de servicios")
                    break;
                case 'callback':
                    $('#detalles_metadatospanel_tiporeporte').html("Callback")
                    break;
            }
            $('#detalles_metadatospanel_asesor').html(response[0]["nombre"]);
            $('#detalles_metadatospanel_creado').html(moment(response[0]["creado"]).format('DD/MM/YYYY HH:mm'));
            $('#detalles_metadatospanel_tipificacion').html(response[0]["tipificacion"]);
                var zona = response[0]["municipio"] + "," + response[0]["estado"];
                $('#detalles_metadatospanel_zona').html(zona);

            $('#folio_bit').val(response[0]["bit"]);
            $('#folio_cpd').val(response[0]["cpd"]);
            $('#folio_usd').val(response[0]["usd"]);
            $('#folio_reporsis').val(response[0]["reporsis"]);
        });

        $.post('/get_detallescaptura', {
            idmetadatos: idmetadatos,
            tipofalla: tipofalla
        }, function (response) {

            switch (tipofalla) {
                case 'aclaraciones':
                    filldetalles_aclaraciones(response);
                    break;
                case 'general':
                    filldetalles_general(response);
                    break;
                case 'cobertura':
                    filldetalles_cobertura(response);
                    break;
                case 'iccid':
                    filldetalles_iccid(response);
                    break;
                case 'llamadas':
                    filldetalles_llamadas(response);
                    break;
                case 'navegacion':
                    filldetalles_navegacion(response);
                    break;
                case 'recargas':
                    filldetalles_recargas(response);
                    break;
                case 'promociones':
                    filldetalles_promociones(response);
                    break;
                case 'servicios':
                    filldetalles_servicios(response);
                    break;
                case 'callback':
                    filldetalles_callback(response);
                    break;
            }

            
                //abrir modal
                //agregar clase al body para que no se mueva el overflow
                //llenar datos de modal con ajax
                $('#asesor_modal_detallesdecaptura').css('display', 'flex');
                $('#overlay-back').css('display', 'block');
                $('body').addClass('modal-open');
        
        });

        //LLAMAR AJAX PARA LLENAR TABLA DE COMENTARIOS DE SEGUIMIENTO
        $.post('/get_detallesobservaciones', {
            idmetadatos: idmetadatos
        }, function (response) {

            
            var table_body = [];
            for (i = 0; i < response.length; i++) {
                table_body += "<tr>";

                table_body += '<td>';
                table_body += moment(response[i]["creado"]).format('DD/MM/YYYY HH:mm');
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["nombre"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["estatus"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["observacion"];
                table_body += '</td>';

                table_body += '</tr>';
            }
            $('#tbody_detallescomentariosmodal').html(table_body);
        });

        //custom_routes_coordinador
        $.post('/getTipificacion',{idmetadatos:idmetadatos},function(response){
            $('#codificacion_noc').val(response[0]["tipificacion"]).trigger('change');
        });
    }); //fin de evento click en las filas de tabla de detalles

    //FUNCIONES GLOBALES PARA LLENAR LOS DETALLES MANTENIENDO LEGIBLE EL CODIGO
    filldetalles_aclaraciones = function (response) {
        $('#detalle_aclaraciones_telefono').html(response[0]["telefono"]);
        $('#detalle_aclaraciones_nombreusuario').html(response[0]["usuario"]);
        $('#detalle_aclaraciones_contacto').html(response[0]["contacto"]);
        $('#detalle_aclaraciones_fechainiciofalla').html(response[0]["fecha"]);
        $('#detalle_aclaraciones_descripcionsituacion').html(response[0]["descripcion"]);
    }

    filldetalles_callback = function (response) {
        $('#detalle_callback_telefono').html(response[0]["telefono"]);
        $('#detalle_callback_nombreusuario').html(response[0]["usuario"]);
        $('#detalle_callback_contacto').html(response[0]["contacto"]);
        $('#detalle_callback_motivo').html(response[0]["motivo"]);
        $('#detalle_callback_descripcion').html(response[0]["descripcion"]);
    }

    filldetalles_cobertura = function (response) {
        $('#detalle_cobertura_telefono').html(response[0]["telefono"]);
        $('#detalle_cobertura_contacto').html(response[0]["contacto"]);
        $('#detalle_cobertura_nombreusuario').html(response[0]["usuario"]);
        $('#detalle_cobertura_fechanacimiento').html(response[0]["fechanacimiento"]);
        $('#detalle_cobertura_lugarnacimiento').html(response[0]["lugarnacimiento"]);
        $('#detalle_cobertura_estado').html(response[0]["estado"]);
        $('#detalle_cobertura_municipio').html(response[0]["municipio"]);
        $('#detalle_cobertura_colonia').html(response[0]["colonia"]);
        $('#detalle_cobertura_cp').html(response[0]["cp"]);
        $('#detalle_cobertura_direccion').html(response[0]["direccion"]);
        $('#detalle_cobertura_descripcionzona').html(response[0]["desczona"]);
        $('#detalle_cobertura_equipomarca').html(response[0]["equipomarca"]);
        $('#detalle_cobertura_equipomodelo').html(response[0]["equipomodelo"]);
        $('#detalle_cobertura_fechainiciofalla').html(response[0]["iniciofalla"]);
        $('#detalle_cobertura_falla').html(response[0]["falla"]);
        $('#detalle_cobertura_descripcion').html(response[0]["descripcion"]);
        $('#detalle_cobertura_servicio').html(response[0]["servicio"]);
        $('#detalle_cobertura_tecnologia').html(response[0]["tecnologia"]);
    }

    filldetalles_general = function (response) {
        $('#detalle_general_telefono').html(response[0]["telefono"]);
        $('#detalle_general_nombreusuario').html(response[0]["usuario"]);
        $('#detalle_general_contacto').html(response[0]["contacto"]);
        $('#detalle_general_descripcion').html(response[0]["descripcion"]);
    }

    filldetalles_iccid = function (response) {
        $('#detalle_iccid_telefono').html(response[0]["telefono"]);
        $('#detalle_iccid_nombreusuario').html(response[0]["usuario"]);
        $('#detalle_iccid_contacto').html(response[0]["contacto"]);
        $('#detalle_iccid_iccidvirtual').html(response[0]["iccidvirtual"]);
        $('#detalle_iccid_iccidfisica').html(response[0]["iccidfisica"]);
        $('#detalle_iccid_fzaventa').html(response[0]["fzaventa"]);
        $('#detalle_iccid_cac').html(response[0]["cac"]);
    }

    filldetalles_llamadas = function (response) {
        $('#detalle_llamadas_telefono').html(response[0]["telefono"]);
        $('#detalle_llamadas_nombreusuario').html(response[0]["usuario"]);
        $('#detalle_llamadas_contacto').html(response[0]["contacto"]);
        $('#detalle_llamadas_error').html(response[0]["error"]);
        $('#detalle_llamadas_afectacion').html(response[0]["afectacion"]);
        $('#detalle_llamadas_tipored').html(response[0]["tipored"]);
        $('#detalle_llamadas_destino1').html(response[0]["origendestuno"]);
        $('#detalle_llamadas_destino2').html(response[0]["origendestdos"]);
        $('#detalle_llamadas_destino3').html(response[0]["origendesttres"]);
        $('#detalle_llamadas_descripcion').html(response[0]["descripcion"]);
    }

    filldetalles_navegacion = function (response) {
        $('#detalle_navegacion_telefono').html(response[0]["telefono"]);
        $('#detalle_navegacion_nombreusuario').html(response[0]["usuario"]);
        $('#detalle_navegacion_contacto').html(response[0]["contacto"]);
        $('#detalle_navegacion_error').html(response[0]["error"]);
        $('#detalle_navegacion_pruebasbasicas').html(response[0]["pruebasbasicas"]);
        $('#detalle_navegacion_tipored').html(response[0]["tipored"]);
        $('#detalle_navegacion_fechayhorainiciofalla').html(response[0]["fechahora"]);
        $('#detalle_navegacion_descripcion').html(response[0]["descripcion"]);
    }

    filldetalles_promociones = function (response) {
        $('#detalle_promociones_telefono').html(response[0]["telefono"]);
        $('#detalle_promociones_nombreusuario').html(response[0]["usuario"]);
        $('#detalle_promociones_contacto').html(response[0]["contacto"]);
        $('#detalle_promociones_promocion').html(response[0]["promocion"]);
        $('#detalle_promociones_fechainiciofalla').html(response[0]["fecha"]);
        $('#detalle_promociones_tipo').html(response[0]["tipo"]);
        $('#detalle_promociones_descripcion').html(response[0]["descripcion"]);
    }

    filldetalles_recargas = function (response) {
        $('#detalle_recargas_telefono').html(response[0]["telefono"]);
        $('#detalle_recargas_nombreusuario').html(response[0]["usuario"]);
        $('#detalle_recargas_error').html(response[0]["error"]);
        $('#detalle_recargas_importe').html(response[0]["importe"]);
        $('#detalle_recargas_metodocompra').html(response[0]["metodocompra"]);
        $('#detalle_recargas_fechayhora').html(response[0]["fechahora"]);
        $('#detalle_recargas_metodocompra2').html(response[0]["metodocompra2"]);
        $('#detalle_recargas_fechayhora2').html(response[0]["fechahora2"]);
        $('#detalle_recargas_metodocompra3').html(response[0]["metodocompra3"]);
        $('#detalle_recargas_fechayhora3').html(response[0]["fechahora3"]);
        $('#detalle_recargas_descripcion').html(response[0]["descripcion"]);
        $('#detalle_recargas_contacto').html(response[0]["contacto"]);
    }

    filldetalles_servicios = function (response) {
        $('#detalle_servicios_telefono').html(response[0]["telefono"]);
        $('#detalle_servicios_nombreusuario').html(response[0]["usuario"]);
        $('#detalle_servicios_contacto').html(response[0]["contacto"]);
        $('#detalle_servicios_error').html(response[0]["error"]);
        $('#detalle_servicios_servicio').html(response[0]["servicio"]);
        $('#detalle_servicios_descripcion').html(response[0]["descripcion"]);
    }

    llenarContadoresSuperiores();

    //contador de timestamps
    timestampsCounter = function(server_time){
        
        var hoy = new moment();
        
        //console.log(hoy);
        //console.log(server_time);
        
        var duration = moment.duration(hoy.diff(server_time));
        
        var dias = duration.asDays();
        var horas = duration.get('hours');
        var minutos = duration.get('minutes');
        var segundos = duration.get('seconds');

        dias = parseInt(dias);

        if (horas < 10) { horas = "0" + horas }
        if(minutos<10){minutos = "0"+minutos}
        if (segundos < 10) { segundos = "0" + segundos }
        var current = dias + " dias, " + horas + ":" + minutos + ":" + segundos + " hrs";
        $('#server_rolex').html(current);
        

        clockInterval = setInterval(function () {
            //validar cada contador
            if(segundos == 59){
                segundos = 0;
                if(minutos==59){
                    minutos = 0;
                    if(horas==23){
                        horas=0
                        dias++
                    }else{
                        horas++;
                    }
                }else{
                    minutos++
                }
            }else{
                segundos++
            }
            dias = parseInt(dias);
            horas = parseInt(horas);
            minutos = parseInt(minutos);
            segundos = parseInt(segundos);

            if (horas < 10) { 
                
                if (toString(horas).charAt(0) != '0') { horas = "0" + horas}  
            }
            if (minutos < 10) { 
                if (toString(minutos).charAt(0) != '0') { minutos = "0" + minutos }  
            }
            if (segundos < 10) { 
                
                if (toString(segundos).charAt(0) != '0') { segundos = "0" + segundos }  
            }
            var current = dias + " dias, " + horas + ":" + minutos + ":" + segundos + " hrs";
            $('#server_rolex').html(current);
        }, 1000);
        
    }

});