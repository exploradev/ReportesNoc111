var listausuarios, listaplanes, listacapturas;


$(document).ready(function(){
    listausuarios = function () {

        $.post('/listausuarios', function (response) {
            var table_body = [];
            for (i = 0; i < response.length; i++) {
                table_body += "<tr id='usuario" + response[i]['numempleado'] + "' class='rows_usuario' data-userid='" + response[i]['numempleado'] + "'>";

                table_body += '<td>';
                table_body += response[i]["numempleado"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["usuario"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["username"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["campaign"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["rol"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["fechaingreso"];
                table_body += '</td>';


                if (response[i]["activo"] == 1) {
                    table_body += "<td style='color: green'>";
                    table_body += 'Activo'
                    table_body += '</td>';
                } else if (response[i]["activo"] == 0) {
                    table_body += "<td style='color: #CB7171'>";
                    table_body += 'Baja'
                    table_body += '</td>';
                }



                table_body += '</tr>';
            }
            $('#tbody_users').html(table_body);


        });
    }

    listaplanes = function () {

        $.post('/listaplanes', function (response) {

            var table_body = [];
            for (i = 0; i < response.length; i++) {
                table_body += "<tr id='plan" + response[i]['idplan'] + "' class='rows_plan' data-idplan='" + response[i]['idplan'] + "'>";

                table_body += "<td><span id='nombre" + response[i]["idplan"] +"' data-toggle='popover'>";
                table_body += response[i]["nombre"];
                table_body += "</span></td>";

                table_body += "<td><span id='clave" + response[i]["idplan"] +"' data-toggle='popover'>";
                table_body += response[i]["clave"];
                table_body += "</span></td>";

                table_body += "<td><span id='plazo" + response[i]["idplan"] +"' data-toggle='popover'>";
                table_body += response[i]["plazo"];
                table_body += "</span></td>";
                
                if (response[i]["activo"] == 1) {
                    table_body += "<td style='color: green'><span id='status" + response[i]["idplan"] +"' data-toggle='popover'>";
                    table_body += 'Activo'
                    table_body += '</span></td>';
                } else if (response[i]["activo"] == 0) {
                    table_body += "<td style='color: #CB7171'><span id='status" + response[i]["idplan"] +"' data-toggle='popover'>";
                    table_body += 'Baja'
                    table_body += '</span></td>';
                }

                table_body += '</tr>';
            }
            $('#tbody_listaplanes').html(table_body);


        });
    }

    listacapturas = function (inicio,fin,status) {

        $.post('/listacapturas',{inicio:inicio, fin:fin, status:status},  function (response) {
            var table_body = [];
            for (i = 0; i < response.length; i++) {
                table_body += "<tr id='captura" + response[i]['idrequest'] + "' class='rows_captura' data-idrequest='" + response[i]['idrequest'] + "'>";

                table_body += '<td>';
                table_body += response[i]["creado"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["cliente"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["vendedor"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["sisact"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["canal"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["status"];
                table_body += '</td>';

                /*table_body += '<td>';
                table_body += "<select class='asigntouserselect'></select> ";
                table_body += '</td>';*/

                table_body += '<td>';
                table_body += "<div class='dropdown'>"
                table_body += "<span class='style_spanbutton dropdown_toggle' data-toggle='dropdown'><img class='buttons-events' src='../assets/actions.png'><span style='border-bottom: 2px solid black'> </span></span>";
                table_body += "<ul class='dropdown-menu pull-left'><li><a onclick='editarcaptura(&quot;" + response[i]["idrequest"] + "&quot;,&quot;reasign&quot;)' href='#'><img class='buttons-events' src='../assets/transferblack.png'> Reasignar</a></li><li><a onclick='editarcaptura(&quot;" + response[i]["idrequest"] + "&quot;,&quot;delete&quot;)' href='#'><img class='buttons-events' src='../assets/rejected.png'> Borrar</a></li></ul>"
                table_body += "</div>"
                table_body += '</td>';



                table_body += '</tr>';

                //SE RELLENA EL SELECT PARA REASIGNACION 
                $.post('/selectusers', function (response) {
                    var table_body = [];
                    var table_body = "<option value='default' selected disabled>Cambiar para guardar</option>";
                    for (i = 0; i < response.length; i++) {
                        table_body += "<option value ='" + response[i]["iduser"] + "'>";
                        table_body += response[i]["asesor"];
                        table_body += "</option>";
                    }
                    $('#selectmodalreasignar').html(table_body);
                    $('#selectmodalreasignar').trigger('change');                 
                });
            }
            $('#tbody_capturasglobal').html(table_body);
            


            


        });
    }

    listausuarios();
    listaplanes();
});

