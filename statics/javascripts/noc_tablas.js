var llenar_conteos;
$(document).ready(function () {

    llenar_conteos_todos = function () {
        $.get('/get_conteosmenu', function (response) {


            $('#conteo_global').html(response[0]['conteo_global']);

            $('#conteo_aclaraciones').html(response[0]['conteo_aclaraciones']);
            $('#conteo_general').html(response[0]['conteo_general']);
            $('#conteo_servicios').html(response[0]['conteo_servicios']);
            $('#conteo_callback').html(response[0]['conteo_callback']);
            $('#conteo_cobertura').html(response[0]['conteo_cobertura']);
            $('#conteo_iccid').html(response[0]['conteo_iccid']);
            $('#conteo_navegacion').html(response[0]['conteo_navegacion']);
            $('#conteo_recargas').html(response[0]['conteo_recargas']);
            $('#conteo_llamadas').html(response[0]['conteo_llamadas']);
            $('#conteo_promociones').html(response[0]['conteo_promociones']);

            $('#abiertos_aclaraciones').html(response[0]['abiertos_aclaraciones']);
            $('#nuevos_aclaraciones').html(response[0]['nuevos_aclaraciones']);
            $('#enproceso_aclaraciones').html(response[0]['enproceso_aclaraciones']);
            $('#pendientes_aclaraciones').html(response[0]['pendientes_aclaraciones']);
            $('#cerrados_aclaraciones').html(response[0]['cerrados_aclaraciones']);

            $('#abiertos_general').html(response[0]['abiertos_general']);
            $('#nuevos_general').html(response[0]['nuevos_general']);
            $('#enproceso_general').html(response[0]['enproceso_general']);
            $('#pendientes_general').html(response[0]['pendientes_general']);
            $('#cerrados_general').html(response[0]['cerrados_general']);

            $('#abiertos_servicios').html(response[0]['abiertos_servicios']);
            $('#nuevos_servicios').html(response[0]['nuevos_servicios']);
            $('#enproceso_servicios').html(response[0]['enproceso_servicios']);
            $('#pendientes_servicios').html(response[0]['pendientes_servicios']);
            $('#cerrados_servicios').html(response[0]['cerrados_servicios']);

            $('#abiertos_callback').html(response[0]['abiertos_callback']);
            $('#nuevos_callback').html(response[0]['nuevos_callback']);
            $('#enproceso_callback').html(response[0]['enproceso_callback']);
            $('#pendientes_callback').html(response[0]['pendientes_callback']);
            $('#cerrados_callback').html(response[0]['cerrados_callback']);

            $('#abiertos_cobertura').html(response[0]['abiertos_cobertura']);
            $('#nuevos_cobertura').html(response[0]['nuevos_cobertura']);
            $('#enproceso_cobertura').html(response[0]['enproceso_cobertura']);
            $('#pendientes_cobertura').html(response[0]['pendientes_cobertura']);
            $('#cerrados_cobertura').html(response[0]['cerrados_cobertura']);

            $('#abiertos_iccid').html(response[0]['abiertos_iccid']);
            $('#nuevos_iccid').html(response[0]['nuevos_iccid']);
            $('#enproceso_iccid').html(response[0]['enproceso_iccid']);
            $('#pendientes_iccid').html(response[0]['pendientes_iccid']);
            $('#cerrados_iccid').html(response[0]['cerrados_iccid']);

            $('#abiertos_navegacion').html(response[0]['abiertos_navegacion']);
            $('#nuevos_navegacion').html(response[0]['nuevos_navegacion']);
            $('#enproceso_navegacion').html(response[0]['enproceso_navegacion']);
            $('#pendientes_navegacion').html(response[0]['pendientes_navegacion']);
            $('#cerrados_navegacion').html(response[0]['cerrados_navegacion']);

            $('#abiertos_recargas').html(response[0]['abiertos_recargas']);
            $('#nuevos_recargas').html(response[0]['nuevos_recargas']);
            $('#enproceso_recargas').html(response[0]['enproceso_recargas']);
            $('#pendientes_recargas').html(response[0]['pendientes_recargas']);
            $('#cerrados_recargas').html(response[0]['cerrados_recargas']);

            $('#abiertos_llamadas').html(response[0]['abiertos_llamadas']);
            $('#nuevos_llamadas').html(response[0]['nuevos_llamadas']);
            $('#enproceso_llamadas').html(response[0]['enproceso_llamadas']);
            $('#pendientes_llamadas').html(response[0]['pendientes_llamadas']);
            $('#cerrados_llamadas').html(response[0]['cerrados_llamadas']);

            $('#abiertos_promociones').html(response[0]['abiertos_promociones']);
            $('#nuevos_promociones').html(response[0]['nuevos_promociones']);
            $('#enproceso_promociones').html(response[0]['enproceso_promociones']);
            $('#pendientes_promociones').html(response[0]['pendientes_promociones']);
            $('#cerrados_promociones').html(response[0]['cerrados_promociones']);

        });
    }

    llenar_conteos_propios = function () {
        var iduser = $('body').data('iduser');
        
        $.post('/get_conteosmenu_propios',{iduser:iduser} ,function (response) {


            $('#conteo_global').html(response[0]['conteo_global']);

            $('#conteo_aclaraciones').html(response[0]['conteo_aclaraciones']);
            $('#conteo_general').html(response[0]['conteo_general']);
            $('#conteo_servicios').html(response[0]['conteo_servicios']);
            $('#conteo_callback').html(response[0]['conteo_callback']);
            $('#conteo_cobertura').html(response[0]['conteo_cobertura']);
            $('#conteo_iccid').html(response[0]['conteo_iccid']);
            $('#conteo_navegacion').html(response[0]['conteo_navegacion']);
            $('#conteo_recargas').html(response[0]['conteo_recargas']);
            $('#conteo_llamadas').html(response[0]['conteo_llamadas']);
            $('#conteo_promociones').html(response[0]['conteo_promociones']);

            $('#abiertos_aclaraciones').html(response[0]['abiertos_aclaraciones']);
            $('#nuevos_aclaraciones').html(response[0]['nuevos_aclaraciones']);
            $('#enproceso_aclaraciones').html(response[0]['enproceso_aclaraciones']);
            $('#pendientes_aclaraciones').html(response[0]['pendientes_aclaraciones']);
            $('#cerrados_aclaraciones').html(response[0]['cerrados_aclaraciones']);

            $('#abiertos_general').html(response[0]['abiertos_general']);
            $('#nuevos_general').html(response[0]['nuevos_general']);
            $('#enproceso_general').html(response[0]['enproceso_general']);
            $('#pendientes_general').html(response[0]['pendientes_general']);
            $('#cerrados_general').html(response[0]['cerrados_general']);

            $('#abiertos_servicios').html(response[0]['abiertos_servicios']);
            $('#nuevos_servicios').html(response[0]['nuevos_servicios']);
            $('#enproceso_servicios').html(response[0]['enproceso_servicios']);
            $('#pendientes_servicios').html(response[0]['pendientes_servicios']);
            $('#cerrados_servicios').html(response[0]['cerrados_servicios']);

            $('#abiertos_callback').html(response[0]['abiertos_callback']);
            $('#nuevos_callback').html(response[0]['nuevos_callback']);
            $('#enproceso_callback').html(response[0]['enproceso_callback']);
            $('#pendientes_callback').html(response[0]['pendientes_callback']);
            $('#cerrados_callback').html(response[0]['cerrados_callback']);

            $('#abiertos_cobertura').html(response[0]['abiertos_cobertura']);
            $('#nuevos_cobertura').html(response[0]['nuevos_cobertura']);
            $('#enproceso_cobertura').html(response[0]['enproceso_cobertura']);
            $('#pendientes_cobertura').html(response[0]['pendientes_cobertura']);
            $('#cerrados_cobertura').html(response[0]['cerrados_cobertura']);

            $('#abiertos_iccid').html(response[0]['abiertos_iccid']);
            $('#nuevos_iccid').html(response[0]['nuevos_iccid']);
            $('#enproceso_iccid').html(response[0]['enproceso_iccid']);
            $('#pendientes_iccid').html(response[0]['pendientes_iccid']);
            $('#cerrados_iccid').html(response[0]['cerrados_iccid']);

            $('#abiertos_navegacion').html(response[0]['abiertos_navegacion']);
            $('#nuevos_navegacion').html(response[0]['nuevos_navegacion']);
            $('#enproceso_navegacion').html(response[0]['enproceso_navegacion']);
            $('#pendientes_navegacion').html(response[0]['pendientes_navegacion']);
            $('#cerrados_navegacion').html(response[0]['cerrados_navegacion']);

            $('#abiertos_recargas').html(response[0]['abiertos_recargas']);
            $('#nuevos_recargas').html(response[0]['nuevos_recargas']);
            $('#enproceso_recargas').html(response[0]['enproceso_recargas']);
            $('#pendientes_recargas').html(response[0]['pendientes_recargas']);
            $('#cerrados_recargas').html(response[0]['cerrados_recargas']);

            $('#abiertos_llamadas').html(response[0]['abiertos_llamadas']);
            $('#nuevos_llamadas').html(response[0]['nuevos_llamadas']);
            $('#enproceso_llamadas').html(response[0]['enproceso_llamadas']);
            $('#pendientes_llamadas').html(response[0]['pendientes_llamadas']);
            $('#cerrados_llamadas').html(response[0]['cerrados_llamadas']);

            $('#abiertos_promociones').html(response[0]['abiertos_promociones']);
            $('#nuevos_promociones').html(response[0]['nuevos_promociones']);
            $('#enproceso_promociones').html(response[0]['enproceso_promociones']);
            $('#pendientes_promociones').html(response[0]['pendientes_promociones']);
            $('#cerrados_promociones').html(response[0]['cerrados_promociones']);

        });
    }

    //CLICK EN LOS DIFERENTES FILTROS LLAMAN QUERYS DISTINTAS
    $('.clickable_filter').click(function () {
        var filtro = $(this).data('filter');
        var mios = $("input[name=mios]:checked").val();
        if(mios == 'show'){
            
            var iduser = $('body').data('iduser');
            
            $.post('/get_maintabledata_propios', { filtro: filtro,iduser:iduser }, function (response) {
                var table_body = [];
                for (i = 0; i < response.length; i++) {
                    table_body += "<tr id='row" + response[i]["idmetadatos"] + "' class='rowdetallesdisponibles' data-idmetadatos='" + response[i]["idmetadatos"] + "' data-tipofalla='" + response[i]["falla"] + "'>";

                    table_body += '<td>';
                    table_body += moment(response[i]["creado"]).format('DD/MM/YYYY HH:mm');
                    table_body += '</td>';

                    table_body += '<td>';
                    table_body += response[i]["idmetadatos"];
                    table_body += '</td>';

                    table_body += '<td>';
                    table_body += response[i]["asesor"];
                    table_body += '</td>';

                    table_body += '<td>';
                    table_body += response[i]["telefono"];
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
                    } else if (response[i]["falla"] == 'llamadas') {
                        table_body += "Falla en llamadas/SMS";
                    } else if (response[i]["falla"] == 'navegacion') {
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

                    table_body += '<td>';
                    table_body += response[i]["estatus"];
                    table_body += '</td>';


                    if (response[i]["propietario"] == null) {
                        table_body += '<td>';
                        table_body += "N/A"
                        table_body += '</td>';
                    } else {
                        table_body += '<td>';
                        table_body += response[i]["propietario"];
                        table_body += '</td>';
                    }

                    table_body += '</tr>';
                }
                $('#tbody_maintable').html(table_body);
            });
        }else{
            
            $.post('/get_maintabledata', { filtro: filtro }, function (response) {
                var table_body = [];
                for (i = 0; i < response.length; i++) {
                    table_body += "<tr id='row" + response[i]["idmetadatos"] + "' class='rowdetallesdisponibles' data-idmetadatos='" + response[i]["idmetadatos"] + "' data-tipofalla='" + response[i]["falla"] + "'>";

                    table_body += '<td>';
                    table_body += moment(response[i]["creado"]).format('DD/MM/YYYY HH:mm');
                    table_body += '</td>';

                    table_body += '<td>';
                    table_body += response[i]["idmetadatos"];
                    table_body += '</td>';

                    table_body += '<td>';
                    table_body += response[i]["asesor"];
                    table_body += '</td>';

                    table_body += '<td>';
                    table_body += response[i]["telefono"];
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
                    } else if (response[i]["falla"] == 'llamadas') {
                        table_body += "Falla en llamadas/SMS";
                    } else if (response[i]["falla"] == 'navegacion') {
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

                    table_body += '<td>';
                    table_body += response[i]["estatus"];
                    table_body += '</td>';


                    if (response[i]["propietario"] == null) {
                        table_body += '<td>';
                        table_body += "N/A"
                        table_body += '</td>';
                    } else {
                        table_body += '<td>';
                        table_body += response[i]["propietario"];
                        table_body += '</td>';
                    }

                    table_body += '</tr>';
                }
                $('#tbody_maintable').html(table_body);
            });
        }
        
    });

    //POR DEFAULT SE LLENA LA TABLA CON TODOS LOS REPORTES
    $('#countergroup').trigger('click');

    $('input[type=checkbox]').change(function(){
        var mios = $("input[name=mios]:checked").val();
        if(mios == 'show'){
            llenar_conteos_propios();
            $('#countergroup').trigger('click');
        }else{
            llenar_conteos_todos();
            $('#countergroup').trigger('click');
        }
    });
        

    

    llenar_conteos_todos();
    //llenar_conteos_propios();
});