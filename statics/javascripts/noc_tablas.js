var llenar_conteos, construirRelojEn, clockInterval_rows;
$(document).ready(function () {


    //RELOJ PARA CADA FILA RENDERIZADA
    construirRelojEn = function(selector,server_time){
        $("#" + selector).empty();
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
        if (minutos < 10) { minutos = "0" + minutos }
        if (segundos < 10) { segundos = "0" + segundos }
        var current = dias + "d " + horas + ":" + minutos + ":" + segundos + "h";
        
        //pintar de colores los tiempos por default
        if ((horas > 1 && horas < 4) && (dias == 0)) {
            $("#" + selector).html("<span style='color:orange;font-weight:bold;'>" + current + "</span>");
        } else if (horas > 3 || dias > 0) {
            $("#" + selector).html("<span style='color:red;font-weight:bold;'>" + current + "</span>");
        } else {
            $("#" + selector).html(current);
        }


        clockInterval_rows = setInterval(function () {
            //validar cada contador
            if (segundos == 59) {
                segundos = 0;
                if (minutos == 59) {
                    minutos = 0;
                    if (horas == 23) {
                        horas = 0
                        dias++
                    } else {
                        horas++;
                    }
                } else {
                    minutos++
                }
            } else {
                segundos++
            }
            dias = parseInt(dias);
            horas = parseInt(horas);
            minutos = parseInt(minutos);
            segundos = parseInt(segundos);

            if (horas < 10) {

                if (toString(horas).charAt(0) != '0') { horas = "0" + horas }
            }
            if (minutos < 10) {
                if (toString(minutos).charAt(0) != '0') { minutos = "0" + minutos }
            }
            if (segundos < 10) {

                if (toString(segundos).charAt(0) != '0') { segundos = "0" + segundos }
            }
            var current = dias + "d " + horas + ":" + minutos + ":" + segundos + "h";
            //$('#server_rolex').html(current);

            //pintar de colores los tiempos
            if ((horas > 1 && horas < 4) && (dias == 0)) {
                $("#" + selector).html("<span style='color:orange;font-weight:bold;'>" + current + "</span>");
            } else if (horas > 3 || dias > 0) {
                $("#" + selector).html("<span style='color:red;font-weight:bold;'>" + current + "</span>");
            } else {
                $("#" + selector).html(current);
            }
            
        }, 1000);

    }
    //FIN DE RELOJ PARA CADA FILA RENDERIZADA

    //-------------------------------------------------------

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
        clearInterval(clockInterval_rows); //reseteo el contador de la ventana actual
        var lista_relojes = [];

        var filtro = $(this).data('filter');
        if (filtro !='cerradosrechazados'){

            //OCULTO BUSCADORES AUXILIARES
            $('.container_onlynumber').hide();
            $('#main_searchbox').show();
            

            var mios = $("input[name=mios]:checked").val();
            if (mios == 'show') {

                var iduser = $('body').data('iduser');

                $.post('/get_maintabledata_propios', { filtro: filtro, iduser: iduser }, function (response) {
                    var table_body = [];
                    for (i = 0; i < response.length; i++) {
                        table_body += "<tr id='row" + response[i]["idmetadatos"] + "' class='rowdetallesdisponibles' data-idmetadatos='" + response[i]["idmetadatos"] + "' data-tipofalla='" + response[i]["falla"] + "'>";

                        table_body += '<td>';
                        table_body += moment(response[i]["creado"]).format('DD/MM/YYYY HH:mm');
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




                        if (response[i]["propietario"] == null) {
                            table_body += '<td>';
                            table_body += "N/A"
                            table_body += '</td>';
                        } else {
                            table_body += '<td>';
                            table_body += response[i]["propietario"];
                            table_body += '</td>';
                        }

                        table_body += '<td>';
                        table_body += response[i]["estatus"];
                        table_body += '</td>';

                        //BLOQUE QUE HACE RENDER DEL TIEMPO
                        var idreporte = response[i]["idmetadatos"];
                        var ultimoestatus = response[i]["estatus"];
                        if (ultimoestatus == "Cerrado" || ultimoestatus == "Rechazado") {
                            table_body += '<td>';
                            table_body += "--"
                            table_body += '</td>';
                            clearInterval(clockInterval_rows); //reseteo el contador de la ventana actual
                        } else if (ultimoestatus == "Nuevo") {
                            var numero_random = Math.random() * (999999 - 000000) + 000000;
                            numero_random = parseInt(numero_random);
                            $("#clock_nuevo_" + idreporte + numero_random).empty().remove();

                            table_body += '<td id="clock_nuevo_' + idreporte + numero_random + '">';
                            table_body += "--";
                            table_body += '</td>';
                            var row = {
                                ["clock_nuevo_" + idreporte + numero_random]: response[i]["creado"]
                            }
                            lista_relojes.push(row);
                            clearInterval(clockInterval_rows); //reseteo el contador de la ventana actual
                        } else if (ultimoestatus == "En proceso") {
                            var numero_random = Math.random() * (999999 - 000000) + 000000;
                            numero_random = parseInt(numero_random);
                            $("#clock_enproceso_" + idreporte).empty().remove();
                            table_body += '<td id="clock_enproceso_' + idreporte + numero_random + '">';
                            table_body += "--";
                            table_body += '</td>';

                            var row = {
                                ["clock_enproceso_" + idreporte + numero_random]: response[i]["enproceso_time"]
                            }
                            lista_relojes.push(row);
                            clearInterval(clockInterval_rows); //reseteo el contador de la ventana actual
                        } else if (ultimoestatus == "Solucionado") {
                            var numero_random = Math.random() * (999999 - 000000) + 000000;
                            numero_random = parseInt(numero_random);
                            $("#clock_solucionado_" + idreporte).empty().remove();
                            table_body += '<td id="clock_solucionado_' + idreporte + numero_random + '">';
                            table_body += "--";
                            table_body += '</td>';

                            var row = {
                                ["clock_solucionado_" + idreporte + numero_random]: response[i]["solucionado_time"]
                            }
                            lista_relojes.push(row);
                            clearInterval(clockInterval_rows); //reseteo el contador de la ventana actual
                        }
                        //FIN DEL BLOQUE QUE HACE RENDER DEL TIEMPO


                        table_body += '</tr>';
                    }
                    $('#tbody_maintable').html(table_body);
                    //BUCLE PARA ESCRIBIR RELOJES EN IDs CREADOS
                    lista_relojes.forEach(element => {
                        clearInterval(clockInterval_rows); //reseteo el contador de la ventana actual
                    });

                    lista_relojes.forEach(element => {
                        for (key in element) {
                            if (element.hasOwnProperty(key)) {
                                if (element[key]) {
                                    $("#" + key).empty();
                                    construirRelojEn(key, element[key]);
                                }
                            }
                        }
                    });

                    // FIN DE BUCLE PARA ESCRIBIR RELOJES EN IDs CREADOS
                });
            } else {

                $.post('/get_maintabledata', { filtro: filtro }, function (response) {
                    var table_body = [];
                    for (i = 0; i < response.length; i++) {
                        table_body += "<tr id='row" + response[i]["idmetadatos"] + "' class='rowdetallesdisponibles' data-idmetadatos='" + response[i]["idmetadatos"] + "' data-tipofalla='" + response[i]["falla"] + "'>";

                        table_body += '<td>';
                        table_body += moment(response[i]["creado"]).format('DD/MM/YYYY HH:mm');
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



                        if (response[i]["propietario"] == null) {
                            table_body += '<td>';
                            table_body += "N/A"
                            table_body += '</td>';
                        } else {
                            table_body += '<td>';
                            table_body += response[i]["propietario"];
                            table_body += '</td>';
                        }

                        table_body += '<td>';
                        table_body += response[i]["estatus"];
                        table_body += '</td>';

                        //BLOQUE QUE HACE RENDER DEL TIEMPO
                        var idreporte = response[i]["idmetadatos"];
                        var ultimoestatus = response[i]["estatus"];
                        if (ultimoestatus == "Cerrado" || ultimoestatus == "Rechazado") {
                            table_body += '<td>';
                            table_body += "--"
                            table_body += '</td>';
                            clearInterval(clockInterval_rows); //reseteo el contador de la ventana actual
                        } else if (ultimoestatus == "Nuevo") {
                            var numero_random = Math.random() * (999999 - 000000) + 000000;
                            numero_random = parseInt(numero_random);
                            $("#clock_nuevo_" + idreporte + numero_random).empty().remove();

                            table_body += '<td id="clock_nuevo_' + idreporte + numero_random + '">';
                            table_body += "--";
                            table_body += '</td>';
                            var row = {
                                ["clock_nuevo_" + idreporte + numero_random]: response[i]["creado"]
                            }
                            lista_relojes.push(row);
                            clearInterval(clockInterval_rows); //reseteo el contador de la ventana actual
                        } else if (ultimoestatus == "En proceso") {
                            var numero_random = Math.random() * (999999 - 000000) + 000000;
                            numero_random = parseInt(numero_random);
                            $("#clock_enproceso_" + idreporte).empty().remove();
                            table_body += '<td id="clock_enproceso_' + idreporte + numero_random + '">';
                            table_body += "--";
                            table_body += '</td>';

                            var row = {
                                ["clock_enproceso_" + idreporte + numero_random]: response[i]["enproceso_time"]
                            }
                            lista_relojes.push(row);
                            clearInterval(clockInterval_rows); //reseteo el contador de la ventana actual
                        } else if (ultimoestatus == "Solucionado") {
                            var numero_random = Math.random() * (999999 - 000000) + 000000;
                            numero_random = parseInt(numero_random);
                            $("#clock_solucionado_" + idreporte).empty().remove();
                            table_body += '<td id="clock_solucionado_' + idreporte + numero_random + '">';
                            table_body += "--";
                            table_body += '</td>';

                            var row = {
                                ["clock_solucionado_" + idreporte + numero_random]: response[i]["solucionado_time"]
                            }
                            lista_relojes.push(row);
                            clearInterval(clockInterval_rows); //reseteo el contador de la ventana actual
                        }
                        //FIN DEL BLOQUE QUE HACE RENDER DEL TIEMPO


                        table_body += '</tr>';
                    }
                    $('#tbody_maintable').html(table_body);
                    //BUCLE PARA ESCRIBIR RELOJES EN IDs CREADOS
                    lista_relojes.forEach(element => {
                        clearInterval(clockInterval_rows); //reseteo el contador de la ventana actual
                    });

                    lista_relojes.forEach(element => {
                        for (key in element) {
                            if (element.hasOwnProperty(key)) {
                                if (element[key]) {
                                    $("#" + key).empty();
                                    construirRelojEn(key, element[key]);
                                }
                            }
                        }
                    });

                    // FIN DE BUCLE PARA ESCRIBIR RELOJES EN IDs CREADOS



                });
            }
        }else{
            console.log("Mostrar Errores");
            $('#tbody_maintable').html("");
            $('#main_searchbox').hide();
            $('.container_onlynumber').show();
        }
    });

    //BUSCAR NUMEROS INDIVIDUALES CON ESTATUS CERRADO O RECHAZADO
    $("#btn_onlynumber").click(function () { 
        var buscarnumero = $('#searchbox_onlynumber').val();
        $.post('/get_maintabledata', { filtro: buscarnumero }, function (response) {
            var table_body = [];
            for (i = 0; i < response.length; i++) {
                table_body += "<tr id='row" + response[i]["idmetadatos"] + "' class='rowdetallesdisponibles' data-idmetadatos='" + response[i]["idmetadatos"] + "' data-tipofalla='" + response[i]["falla"] + "'>";

                table_body += '<td>';
                table_body += moment(response[i]["creado"]).format('DD/MM/YYYY HH:mm');
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



                if (response[i]["propietario"] == null) {
                    table_body += '<td>';
                    table_body += "N/A"
                    table_body += '</td>';
                } else {
                    table_body += '<td>';
                    table_body += response[i]["propietario"];
                    table_body += '</td>';
                }

                table_body += '<td>';
                table_body += response[i]["estatus"];
                table_body += '</td>';

                //BLOQUE QUE HACE RENDER DEL TIEMPO
               
                table_body += '<td>';
                table_body += "--"
                table_body += '</td>';
                
                //FIN DEL BLOQUE QUE HACE RENDER DEL TIEMPO


                table_body += '</tr>';
            }
            $('#tbody_maintable').html(table_body);
        });
        
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