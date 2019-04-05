var statistics, tabla_concentrado, tabla_aceptadassin, tabla_aceptadasdom ,tabla_agendadas, tabla_activadas;
$(document).ready(function(){



    statistics = function () {
        $.post('/statisticscerrador', function (response) {
            var concentrado, aceptadassin, aceptadasdom, agendadas, activaciones;

            concentrado = response[0]["concentrado"];
            aceptadassin = response[0]["aceptadassin"];
            aceptadasdom = response[0]["aceptadasdom"];
            agendadas = response[0]["agendadas"];
            activaciones = response[0]["activaciones"];

            $('#concentrado').html(concentrado);
            $('#aceptadassin').html(aceptadassin);
            $('#aceptadasdom').html(aceptadasdom);
            $('#agendadas').html(agendadas);
            $('#activaciones').html(activaciones);
        });
    }

    tabla_concentrado = function () {
        $.post('/cerradorconcentrado', function (response) {
            var table_body = [];
            for (i = 0; i < response.length; i++) {
                table_body += "<tr id='row" + response[i]["idrequest"] +"' class='rowhover concentradotr' data-idrequest='" + response[i]["idrequest"]+"'>";

                table_body += '<td>';
                table_body += response[i]["fecha"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["cliente"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["contacto"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["vendedor"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += "<span class='trigger-click-agenda' id='canal" + response[i]["idrequest"] + "' data-toggle='popover'>"
                table_body += response[i]["canal"];
                table_body += '</span></td>';

                table_body += '<td>';
                table_body += "<span class='trigger-click-agenda' id='sisact" + response[i]["idrequest"] + "' data-toggle='popover'>";
                table_body += response[i]["sisact"];
                table_body += '</span></td>';

                table_body += '<td>';
                table_body += "<div class='dropdown'>"
                table_body += "<span class='style_spanbutton dropdown_toggle' data-toggle='dropdown'><img class='buttons-events' src='../assets/actions.png'><span style='border-bottom: 2px solid black'> OPCIONES</span></span>";
                table_body += "<ul class='dropdown-menu'><li><a onclick='modal(&quot;" + response[i]["idrequest"] + "&quot;,&quot;reject&quot;)' href='javascript:void(0);'><img class='buttons-events' src='../assets/rejected.png'> Rechazada p/cliente</a></li><li><a onclick='modal(&quot;" + response[i]["idrequest"] + "&quot;,&quot;comnt&quot;)' href='javascript:void(0);'><img class='buttons-events' src='../assets/comnt.png'> Seguimiento</a></li><li><a onclick='modal(&quot;" + response[i]["idrequest"] + "&quot;,&quot;agenda&quot;)' href='javascript:void(0);'><img class='buttons-events' src='../assets/calendario.png'> Agendar</a></li></ul>"
                table_body += "</div>"
                table_body += '</td>';

                table_body += '</tr>';
                table_body += "<tr class='concentradotr2'>";
                table_body += "<td colspan='7' style='border-top:none; color: #4D85BE'> SEGUIMIENTO: ";
                if (response[i]["comentario"]==null){
                    table_body += " ";
                }else{
                    table_body += response[i]["comentario"];
                }

                table_body += '</tr>';
            }
            $('#tbody_concentrado').html(table_body);
        });
    }

    tabla_aceptadassin = function () {
        $.post('/cerradoraceptadassin', function (response) {
            var table_body = [];
            for (i = 0; i < response.length; i++) {
                table_body += "<tr id='row" + response[i]["idrequest"] + "' class='rowhover' data-idrequest='" + response[i]["idrequest"] + "'>";

                table_body += '<td>';
                table_body += response[i]["fecha"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["cliente"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["contacto"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["vendedor"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += "<span class='trigger-click-agenda' id='canal" + response[i]["idrequest"] + "' data-toggle='popover'>"
                table_body += response[i]["canal"];
                table_body += '</span></td>';

                table_body += '<td>';
                table_body += "<span class='trigger-click-agenda' id='sisact" + response[i]["idrequest"] + "' data-toggle='popover'>";
                table_body += response[i]["sisact"];
                table_body += '</span></td>';

                table_body += '<td>';
                table_body += "<div class='dropdown'>"
                table_body += "<span class='style_spanbutton dropdown_toggle' data-toggle='dropdown'><img class='buttons-events' src='../assets/actions.png'><span style='border-bottom: 2px solid black'> OPCIONES</span></span>";
                table_body += "<ul class='dropdown-menu'><li><a onclick='modal(&quot;" + response[i]["idrequest"] + "&quot;,&quot;reject&quot;)' href='javascript:void(0);'><img class='buttons-events' src='../assets/rejected.png'> Rechazada p/cliente</a></li><li><a onclick='modal(&quot;" + response[i]["idrequest"] + "&quot;,&quot;comnt&quot;)' href='javascript:void(0);'><img class='buttons-events' src='../assets/comnt.png'> Seguimiento</a></li><li><a onclick='modal(&quot;" + response[i]["idrequest"] + "&quot;,&quot;agenda&quot;)' href='javascript:void(0);'><img class='buttons-events' src='../assets/calendario.png'> Agendar</a></li></ul>"
                table_body += "</div>"
                table_body += '</td>';

                table_body += '</tr>';
                table_body += '<tr>';
                table_body += "<td colspan='7' style='border-top:none; color: #4D85BE'> SEGUIMIENTO: ";
                if (response[i]["comentario"] == null) {
                    table_body += " ";
                } else {
                    table_body += response[i]["comentario"];
                }

                table_body += '</tr>';
            }
            $('#tbody_aceptadassin').html(table_body);
        });
    }

    tabla_aceptadasdom = function () {
        $.post('/cerradoraceptadasdom', function (response) {
            var table_body = [];
            for (i = 0; i < response.length; i++) {
                table_body += "<tr id='row" + response[i]["idrequest"] + "' class='rowhover' data-idrequest='" + response[i]["idrequest"] + "'>";

                table_body += '<td>';
                table_body += response[i]["fecha"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["cliente"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["contacto"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["vendedor"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += "<span class='trigger-click-agenda' id='canal" + response[i]["idrequest"] + "' data-toggle='popover'>"
                table_body += response[i]["canal"];
                table_body += '</span></td>';

                table_body += '<td>';
                table_body += "<span class='trigger-click-agenda' id='sisact" + response[i]["idrequest"] + "' data-toggle='popover'>";
                table_body += response[i]["sisact"];
                table_body += '</span></td>';

                table_body += '<td>';
                table_body += "<div class='dropdown'>"
                table_body += "<span class='style_spanbutton dropdown_toggle' data-toggle='dropdown'><img class='buttons-events' src='../assets/actions.png'><span style='border-bottom: 2px solid black'> OPCIONES</span></span>";
                table_body += "<ul class='dropdown-menu'><li><a onclick='modal(&quot;" + response[i]["idrequest"] + "&quot;,&quot;reject&quot;)' href='javascript:void(0);'><img class='buttons-events' src='../assets/rejected.png'> Rechazada p/cliente</a></li><li><a onclick='modal(&quot;" + response[i]["idrequest"] + "&quot;,&quot;comnt&quot;)' href='javascript:void(0);'><img class='buttons-events' src='../assets/comnt.png'> Seguimiento</a></li><li><a onclick='modal(&quot;" + response[i]["idrequest"] + "&quot;,&quot;activa&quot;)' href='javascript:void(0);'><img class='buttons-events' src='../assets/ok.png'> Activa</a></li></ul>"
                table_body += "</div>"
                table_body += '</td>';

                table_body += '</tr>';
                table_body += '<tr>';
                table_body += "<td colspan='7' style='border-top:none; color: #4D85BE'> SEGUIMIENTO: ";
                if (response[i]["comentario"] == null) {
                    table_body += " ";
                } else {
                    table_body += response[i]["comentario"];
                }

                table_body += '</tr>';
            }
            $('#tbody_aceptadasdom').html(table_body);
        });
    }

    tabla_agendadas = function () {
        $.post('/cerradoragendadas', function (response) {
            var table_body = [];
            for (i = 0; i < response.length; i++) {
                table_body += "<tr id='row" + response[i]["idrequest"] + "' class='rowhover agendadastr' data-idrequest='" + response[i]["idrequest"] + "'>";

                table_body += '<td>';
                table_body += response[i]["capturada"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["cliente"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["vendedor"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["contacto"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += "<span class='trigger-click-agenda' id='canal" + response[i]["idrequest"] + "' data-toggle='popover'>"
                table_body += response[i]["canal"];
                table_body += '</span></td>';

                table_body += '<td>';
                table_body += "<span class='trigger-click-agenda' id='sisact" + response[i]["idrequest"] + "' data-toggle='popover'>";
                table_body += response[i]["sisact"];
                table_body += '</span></td>';

                table_body += '<td>';
                table_body += response[i]["agendada"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += "<div class='dropdown'>"
                table_body += "<span class='style_spanbutton dropdown_toggle' data-toggle='dropdown'><img class='buttons-events' src='../assets/actions.png'><span style='border-bottom: 2px solid black'> OPCIONES</span></span>";
                table_body += "<ul class='dropdown-menu'><li><a onclick='modal(&quot;" + response[i]["idrequest"] + "&quot;,&quot;reject&quot;)' href='javascript:void(0);'><img class='buttons-events' src='../assets/rejected.png'> Rechazada p/cliente</a></li><li><a onclick='modal(&quot;" + response[i]["idrequest"] + "&quot;,&quot;comnt&quot;)' href='javascript:void(0);'><img class='buttons-events' src='../assets/comnt.png'> Seguimiento</a></li><li><a onclick='modal(&quot;" + response[i]["idrequest"] + "&quot;,&quot;agenda&quot;)' href='javascript:void(0);'><img class='buttons-events' src='../assets/calendario.png'> Agendar</a></li><li><a onclick='modal(&quot;" + response[i]["idrequest"] + "&quot;,&quot;activa&quot;)' href='javascript:void(0);'><img class='buttons-events' src='../assets/ok.png'> Activa</a></li></ul>"
                table_body += "</div>"
                table_body += '</td>';

                table_body += '</tr>';
                table_body += "<tr class='agendadastr2'>";
                table_body += "<td colspan='8' style='border-top:none; color: #4D85BE'> SEGUIMIENTO: ";
                if (response[i]["comentario"] == null) {
                    table_body += " ";
                } else {
                    table_body += response[i]["comentario"];
                }

                table_body += '</tr>';
            }
            $('#tbody_agendadas').html(table_body);
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
    tabla_concentrado();
    tabla_aceptadassin();
    tabla_aceptadasdom();
    tabla_agendadas();
    tabla_activadas();

});
