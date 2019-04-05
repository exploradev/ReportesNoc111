var statistics, tabla_pendientes, tabla_enespera, tabla_aceptadas, tabla_correcciones, tabla_activadas, tabla_analistaagenda;
$(document).ready(function(){

    

    statistics = function () { 
        $.post('/statisticsanalista', function (response) {
            var pendientes, enesperaderespuesta, aceptadas, correcciones, activaciones;
            
            pendientes = response[0]["pendientes"];
            enesperaderespuesta = response[0]["enesperaderespuesta"];
            aceptadas = response[0]["aceptadas"];
            correcciones = response[0]["correcciones"];
            activaciones = response[0]["activaciones"];

            $('#pendientes').html(pendientes);
            $('#enesperaderespuesta').html(enesperaderespuesta);
            $('#aceptadas').html(aceptadas);
            $('#correcciones').html(correcciones);
            $('#activaciones').html(activaciones);
        });
    }

    tabla_pendientes = function () {  
        $.post('/analistapendientes', function (response) {
            var table_body = [];
            for (i = 0; i < response.length; i++) {
                table_body += "<tr id='row" + response[i]["idregistro"] +"' class='rowhover' data-idregistro='" + response[i]["idregistro"]+"'>";

                table_body += '<td>';
                table_body += response[i]["fecha"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["cliente"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["vendedor"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["turno"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["tipoactivacion"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["campania"];
                table_body += '</td>';

                //console.log(response[i]["analistaasignado"]);
                if (response[i]["analistaasignado"]==null){
                    table_body += "<td class='btn-asignto'><div id='asignto" + response[i]["idregistro"] + "' class='asignto'>Asignar y ver detalles<div/></td>";
                }else{
                    table_body += "<td class='analista_capturando' id='verrequest" + response[i]["idregistro"]+"'> Capturando ";
                    table_body += response[i]["analistaasignado"];
                    table_body += '</td>';
                }
                table_body += '</tr>';
            }
            $('#tbody_pendientes').html(table_body);
        });
    }

    tabla_enespera = function () {
        $.post('/analistaenespera', function (response) {
            var table_body = [];
            for (i = 0; i < response.length; i++) {
                table_body += "<tr id='enespera" + response[i]["idregistro"] + "' class='enesperarow' data-idregistro='" + response[i]["idregistro"] + "'>";

                table_body += '<td>';
                table_body += response[i]["fecha"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["cliente"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["vendedor"];
                table_body += '</td>';
                
                table_body += '<td>';
                table_body += response[i]["campania"];
                table_body += '</td>';
                
                table_body += '<td>';
                table_body += "<span class='trigger-click-agenda' id='canal" + response[i]["idregistro"] +"' data-toggle='popover'>"
                table_body += response[i]["canal"];
                table_body += '</span></td>';

                table_body += '<td>';
                table_body += "<span class='trigger-click-agenda' id='sisact" + response[i]["idregistro"] +"' data-toggle='popover'>";
                table_body += response[i]["sisact"];
                table_body += '</span></td>';

                table_body += "<td><div class='buttons-set-events' id='button-enespera-" + response[i]["idregistro"] + "'><span id='aceptada" + response[i]["idregistro"] + "' class='buttons-events-wrapper'><img class='buttons-events' src='../assets/ok.png'> Aceptada </span><span id='corregir" + response[i]["idregistro"] +"' class='buttons-events-wrapper'><img class='buttons-events' src='../assets/edit.png'> Aceptada con corrección </span><span id='rechazada" + response[i]["idregistro"] + "' class='buttons-events-wrapper'><img class='buttons-events' src='../assets/rejected.png'> Rechazada </span></div></td>";

                table_body += '</tr>';
            }
            $('#tbody_enespera').html(table_body);
        });
    }

    tabla_aceptadas = function () {
        $.post('/analistaaceptadas', function (response) {
            var table_body = [];
            for (i = 0; i < response.length; i++) {
                table_body += "<tr id='aceptadas" + response[i]["idregistro"] + "' class='aceptadasrow' data-idregistro='" + response[i]["idregistro"] + "'>";

                table_body += '<td>';
                table_body += response[i]["fecha"];
                table_body += '</td>';
               
                table_body += '<td>';
                table_body += response[i]["vendedor"];
                table_body += '</td>';
            
                table_body += '<td>';
                table_body += "<span class='trigger-click-agenda' id='canal" + response[i]["idregistro"] + "' data-toggle='popover'>"
                table_body += response[i]["canal"];
                table_body += '</span></td>';

                table_body += '<td>';
                table_body += "<span class='trigger-click-agenda' id='sisact" + response[i]["idregistro"] + "' data-toggle='popover'>";
                table_body += response[i]["sisact"];
                table_body += '</span></td>';

                if (response[i]["agendada"] == null){
                    table_body += "<td id='" + response[i]["idregistro"] + "' class='text-buttons-events '><img id='trigger-click-agenda" + response[i]["idregistro"] +"' class='buttons-events' data-toggle='popover' src='../assets/calendario.png'></td>"
                }else{
                    table_body += "<td>";
                    table_body += "<span class='trigger-click-agenda' id='trigger-click-agenda" + response[i]["idregistro"] +"' >";
                    table_body += response[i]["agendada"] + " " + response[i]["cac"];
                    table_body += '</span>';
                    table_body += '</td>';
                }

                table_body += '</tr>';
            }
            $('#tbody_aceptadas').html(table_body);
        });
    }

    tabla_analistaagenda = function () {
        $.post('/analistaagenda', function (response) {
            var table_body = [];
            for (i = 0; i < response.length; i++) {
                table_body += "<tr id='analistaagenda" + response[i]["idregistro"] + "' class='analistaagendarow' data-idregistro='" + response[i]["idregistro"] + "'>";

                if (response[i]["agendada"] == null) {
                    table_body += "<td id='" + response[i]["idregistro"] + "' class='text-buttons-events '><img id='trigger-click-agenda" + response[i]["idregistro"] + "' class='buttons-events' data-toggle='popover' src='../assets/calendario.png'> Agendar</td>"
                } else {
                    table_body += "<td>";
                    table_body += "<span class='trigger-click-agenda' id='trigger-click-agenda" + response[i]["idregistro"] + "' >";
                    table_body += response[i]["agendada"];
                    table_body += '</span>';
                    table_body += '</td>';
                }
               
                table_body += '<td>';
                table_body += response[i]["vendedor"];
                table_body += '</td>';
                
                table_body += '<td>';
                table_body += "<span class='trigger-click-agenda' id='canal" + response[i]["idregistro"] + "' data-toggle='popover'>"
                table_body += response[i]["canal"];
                table_body += '</span></td>';

                table_body += '<td>';
                table_body += "<span class='trigger-click-agenda' id='sisact" + response[i]["idregistro"] + "' data-toggle='popover'>";
                table_body += response[i]["sisact"];
                table_body += '</span></td>';

                table_body += '<td>';
                table_body += response[i]["contacto"];
                table_body += '</td>';

                table_body += "<td> <div class='buttons-set-events' id='button-aceptadas-" + response[i]["idregistro"] + "'><span id='finalizado" + response[i]["idregistro"] + "' class='buttons-events-wrapper'><img class='buttons-events' src='../assets/ok.png'> Activada </span><span id='nofinalizado" + response[i]["idregistro"] + "' class='buttons-events-wrapper'><img class='buttons-events' src='../assets/rejected.png'> No activada </span><span id='comnt" + response[i]["idregistro"] + "' class='buttons-events-wrapper'><img class='buttons-events' src='../assets/comnt.png'> Obs.</span></div></td>";

                table_body += '</tr>';
            }
            $('#tbody_agendaanalista').html(table_body);
        });
    }

    tabla_correcciones = function () {
        $.post('/analistacorrecciones', function (response) {
            var table_body = [];
            for (i = 0; i < response.length; i++) {
                if (response[i]["corregido"] == 1){
                    table_body += "<tr ";
                } else if (response[i]["corregido"] == 0){
                    table_body += "<tr class='uncorrected'";
                }
                table_body += "id='correcciones" + response[i]["idregistro"] + "' class='correccionesrow' data-idregistro='" + response[i]["idregistro"] + "'>";

                table_body += '<td>';
                table_body += response[i]["fecha"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["cliente"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["vendedor"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["turno"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["tipoactivacion"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["campania"];
                table_body += '</td>';

                if (response[i]["corregido"] == 1){
                    if (response[i]["analistaasignado"] == null) {
                        table_body += "<td class='btn-asignto'><div id='asignto" + response[i]["idregistro"] + "' class='asignto'>Asignar y ver detalles<div/></td>";
                    } else {
                        table_body += "<td class='analista_capturando' id='verrequest" + response[i]["idregistro"] + "'> Capturando ";
                        table_body += response[i]["analistaasignado"];
                        table_body += '</td>';
                    }
                } else if (response[i]["corregido"] == 0){
                    table_body += "<td class='analista_capturando'>Esperando corrección</td>";
                }
                
                table_body += '</tr>';
            }
            $('#tbody_correcciones').html(table_body);
        });
    }

    tabla_activadas = function () {
        $.post('/analistaactivadas', function (response) {
            var table_body = [];
            for (i = 0; i < response.length; i++) {
                table_body += "<tr>";

                table_body += '<td>';
                table_body += response[i]["fecha"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["cliente"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["vendedor"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["turno"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["campania"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["sisact"];
                table_body += '</td>';

                
                table_body += '</tr>';
            }
            $('#tbody_activadas').html(table_body);
        });
    }


    statistics();
    tabla_pendientes();
    tabla_enespera();
    tabla_aceptadas();
    tabla_correcciones();
    tabla_activadas();
    tabla_analistaagenda();

});