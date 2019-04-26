
    $(document).ready(function () {




        ///////////////////////////////////////////////////////
        //
        //CLON DE NOC_AJAX.JS CON MODIFICACIONES
        //
        //////////////////////////////////////////////////////



        
        //al clickear el boton de guardado de seguimiento se ejecuta lo siguiente
        $("#guardar_seguimiento_nuevo").click(function () {
            var nuevo_estatus = $('#estatus_seguimiento_nuevo').val();
            var nuevo_comentario = $('#comentarios_seguimiento_nuevo').val();
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
                    iduser: iduser,
                    idmetadatos: idmetadatos
                }, function (response) {
                    if (response == "Correcto") {
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


                    }
                });


            }
        });

        function reload_comentarios(idmetadatos) {
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



        //AJAX PARA LLENAR DETALLES EN EL MODAL DE SEGUIMIENTO
        $("#tbody_maintable").on('click', '.rowdetallesdisponibles', function () {
            var idmetadatos = $(this).data('idmetadatos');
            var tipofalla = $(this).data('tipofalla');
            getNocs();
            //console.log(tipofalla, idmetadatos);


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
            $('#detalle_promociones_descripcion').html(response[0]["descripcion"]);
        }

        filldetalles_recargas = function (response) {
            $('#detalle_recargas_telefono').html(response[0]["telefono"]);
            $('#detalle_recargas_nombreusuario').html(response[0]["usuario"]);
            $('#detalle_recargas_error').html(response[0]["error"]);
            $('#detalle_recargas_importe').html(response[0]["importe"]);
            $('#detalle_recargas_metodocompra').html(response[0]["metodocompra"]);
            $('#detalle_recargas_fechayhora').html(response[0]["fechahora"]);
            $('#detalle_recargas_descripcion').html(response[0]["descripcion"]);
        }

        filldetalles_servicios = function (response) {
            $('#detalle_servicios_telefono').html(response[0]["telefono"]);
            $('#detalle_servicios_nombreusuario').html(response[0]["usuario"]);
            $('#detalle_servicios_contacto').html(response[0]["contacto"]);
            $('#detalle_servicios_error').html(response[0]["error"]);
            $('#detalle_servicios_servicio').html(response[0]["servicio"]);
            $('#detalle_servicios_descripcion').html(response[0]["descripcion"]);
        }



    });


