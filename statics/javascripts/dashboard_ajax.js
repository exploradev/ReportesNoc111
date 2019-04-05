var dailyandmonthly, statisticsanalista, statisticscerrador, toptenactivadores, countercampaign, shametopten, graficaHighchart, update_tableconnections, getDailyCreatedByCampaign, getCorrections;
$(document).ready(function(){

    //-----------------------------------------------------------------------
    //-------------------------------WEBSOCKETS------------------------------
    //-----------------------------------------------------------------------

    var socket = io.connect('http://192.168.3.62');
    //var socket = io.connect('http://10.162.45.20:4040');
    //var socket = io.connect('http://localhost:4040');

    
    socket.on('refreshdashboard', function (msg) {
        console.log('Actualizando divs');
        dailyandmonthly();
        statisticsanalista();
        statisticscerrador();
        toptenactivadores();
        countercampaign();
        shametopten();
        graficaHighchart();
        update_tableconnections();
        getDailyCreatedByCampaign();
        getCorrections();
    });

    
    //AL HABER CAMBIOS EJECUTO LA FUNCION
    socket.on('update_tableconnections', function (msg) {
        setTimeout(update_tableconnections,2000);
    });

    

    //--------------------FUNCION QUE INVOCA EL ROUTE-------------------------
    //custom_routes.js
    update_tableconnections = function () {
        //var update = function(){
        $.post('/getNodeConnections', function (response) {

            $('#contadorconexionestabla').html(response.length);
            $('#contadorconexioneslinkdashboard').html(response.length);

            var table_body = [];
            for (i = 0; i < response.length; i++) {
                table_body += '<tr>';

                table_body += '<td>';
                table_body += "<img src='../assets/connected.png' alt='icon_conexion'><span> &nbsp;&nbsp;"
                table_body += response[i]["asesor"] + "  <span style='color:grey;'> (" + response[i]["campania"] + ")</span>";
                table_body += '</span></td>';

                if (response[i]["borrador"] != 0) {
                    table_body += "<td style='color:orange'>";
                    table_body += response[i]["borrador"];
                    table_body += '</td>';
                } else {
                    table_body += "<td>";
                    table_body += response[i]["borrador"];
                    table_body += '</td>';
                }

                if (response[i]["enviado"] != 0) {
                    table_body += "<td style='color:orange'>";
                    table_body += response[i]["enviado"];
                    table_body += '</td>';
                } else {
                    table_body += "<td>";
                    table_body += response[i]["enviado"];
                    table_body += '</td>';
                }

                if (response[i]["corregir"] != 0) {
                    table_body += "<td style='color:orange'>";
                    table_body += response[i]["corregir"];
                    table_body += '</td>';
                } else {
                    table_body += "<td>";
                    table_body += response[i]["corregir"];
                    table_body += '</td>';
                }

                if (response[i]["enespera"] != 0) {
                    table_body += "<td style='color:orange'>";
                    table_body += response[i]["enespera"];
                    table_body += '</td>';
                } else {
                    table_body += "<td>";
                    table_body += response[i]["enespera"];
                    table_body += '</td>';
                }

                if (response[i]["rechazada"] != 0) {
                    table_body += "<td style='color:orange'>";
                    table_body += response[i]["rechazada"];
                    table_body += '</td>';
                } else {
                    table_body += "<td>";
                    table_body += response[i]["rechazada"];
                    table_body += '</td>';
                }

                if (response[i]["aceptada"] != 0) {
                    table_body += "<td style='color:orange'>";
                    table_body += response[i]["aceptada"];
                    table_body += '</td>';
                } else {
                    table_body += "<td>";
                    table_body += response[i]["aceptada"];
                    table_body += '</td>';
                }

                if (response[i]["aceptadacc"] != 0) {
                    table_body += "<td style='color:orange'>";
                    table_body += response[i]["aceptadacc"];
                    table_body += '</td>';
                } else {
                    table_body += "<td>";
                    table_body += response[i]["aceptadacc"];
                    table_body += '</td>';
                }

                if (response[i]["nofinalizada"] != 0) {
                    table_body += "<td style='color:orange'>";
                    table_body += response[i]["nofinalizada"];
                    table_body += '</td>';
                } else {
                    table_body += "<td>";
                    table_body += response[i]["nofinalizada"];
                    table_body += '</td>';
                }

                if (response[i]["activa"] != 0) {
                    table_body += "<td style='color:orange'>";
                    table_body += response[i]["activa"];
                    table_body += '</td>';
                } else {
                    table_body += "<td>";
                    table_body += response[i]["activa"];
                    table_body += '</td>';
                }

                table_body += '</tr>';
            }
            $('#tbody_tableconnections').html(table_body);
        });
        //}

        //setTimeout(update,5000);

    }



    //evento que refresca manualmente la tabla de conexiones
    $('#updateConnectionsNow').on('click', function(){
        update_tableconnections();
    });

    

    //-----------------------------------------------------------------------
    //-------------------------------WEBSOCKETS------------------------------
    //-----------------------------------------------------------------------

    

    dailyandmonthly = function () {
        //custom_routes_supervisor
        $.post('/getDataLeftDashboard', function (response) {

            //lado derecho del dashboard en apartado de graficas
            $('#hccounter_capturas').html(response[0]["capturas"]);
            $('#hccounter_activaciones').html(response[0]["activaciones"]);
            
            //bigboxes principales
            $('#bc_capturas').html(response[0]["capturasdia"]);
            $('#bc_activaciones').html(response[0]["activacionesdia"]);
            $('#bc_rechazos').html(response[0]["rechazosdia"]);
        });
    } // fin de function

    statisticsanalista = function(){
        //custom_routes_analista
        $.post('/statisticsanalista', function (response) {
            $('#lrana_pendientes').html(response[0]["pendientes"]);
            $('#lrana_enespera').html(response[0]["enesperaderespuesta"]);
            $('#lrana_aceptadas').html(response[0]["aceptadas"]);
            $('#lrana_correcciones').html(response[0]["correcciones"]);
        });
    } // fin de function

    statisticscerrador = function () {
        //custom_routes_supervisor
        $.post('/statisticscerrador', function (response) {
            $('#lrcerr_concentrado').html(response[0]["concentrado"]);
            $('#lrcerr_aceptadas').html(response[0]["aceptadassin"]);
            $('#lrcerr_agendadas').html(response[0]["agendadas"]);
            $('#lrcerr_domicilio').html(response[0]["aceptadasdom"]);
        });
    }// fin de function

    toptenactivadores = function(){
        $.post('/feedactivadores', function (response) {
            var table_body = [];
            for (i = 0; i < response.length; i++) {
                table_body += '<tr>';

                table_body += '<td>';
                table_body += response[i]["person_name"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["quantity"];
                table_body += '</td>';

                table_body += '</tr>';
            }
            $('#tbody_topactivadores').html(table_body);
        });
    }//fin de function

    shametopten = function () {
        $.post('/shametopten', function (response) {
            var table_body = [];
            for (i = 0; i < response.length; i++) {
                table_body += '<tr>';

                table_body += '<td>';
                table_body += response[i]["vendedor"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["capturas"];
                table_body += '</td>';

                table_body += '</tr>';
            }
            $('#tbody_topbajaparticipacion').html(table_body);
        });
    }//fin de function

    countercampaign = function () {
        //custom_routes_supervisor
        $.post('/countercampaign', function (response) {
            $('#numbers_excelentes').html(response[0]["excelentes"]);
            $('#numbers_estrena').html(response[0]["estrena"]);
        });
    }// fin de function

    getDailyCreatedByCampaign = function () {
        //custom_routes_supervisor
        $.post('/getDailyCreatedByCampaign', function (response) {
            $('#cdiarias_excelentes').html(response[0]["excelentes"]);
            $('#cdiarias_estrena').html(response[0]["estrena"]);
        });
    }// fin de function
    
    graficaHighchart = function () {

        labels_activaciones = new Array(31);
        labels_capturas = [];
        labels_graph = [];
        
        var fecha = new Date();
        
        //los labels son dinamicos. Desde el dia 1 hasta el dia de hoy con .getDate()
        for(i = 0; i < fecha.getDate(); i ++){
            labels_graph.push((i+1));
        }
      
        
        $.post('/getActivasBlackdashboard', function (response) {
            

            /*for (i = 0; i < fecha.getDate(); i++) {
                for(j = 0; j <response.length; j++){
                    if(i==(response[j]['dia']-1)){
                        newvalue = Number(response[j]['activas']);
                        labels_activaciones[i] = newvalue;
                    }else{
                        labels_activaciones[i] = 0;
                    }
                }
        }*/

            for (i = 0; i < response.length; i++) {
                labels_activaciones[(response[i]["dia"]) - 1] = Number(response[i]["activas"]);
            }

            for (i = 0; i < fecha.getDate(); i++) {
                if (labels_activaciones[i] == null) {
                    labels_activaciones[i] = 0
                }
            }

            $.post('/getCapturasBlackdashboard', function (response) {
                for (i = 0; i < response.length; i++) {
                    labels_capturas[(response[i]["dia"]) - 1] = Number(response[i]["capturas"]);
                }

                for (i = 0; i < fecha.getDate(); i++) {
                    if (labels_capturas[i] == null) {
                        labels_capturas[i] = 0
                    }
                }

                Highcharts.chart('highchart_main', {
                    chart: {
                        type: 'spline',

                    },
                    title: {
                        text: 'Capturas y activas del mes'
                    },
                    subtitle: {
                        text: 'T E L E M A R K E T I N G'
                    },
                    xAxis: {
                        categories: labels_graph
                    },
                    yAxis: {
                        title: {
                            text: 'ACTIVACIONES'
                        }
                    },
                    plotOptions: {
                        series: {
                            animation: false
                        },
                        spline: {
                            marker: {
                                radius: 4,
                                lineColor: '#666666',
                                lineWidth: 1
                            }
                        }
                    },
                    series: [{
                        name: 'Activas',
                        data: labels_activaciones
                    }, {
                        name: 'Capturas',
                        data: labels_capturas
                    }]
                }); // FIN DEL HIGHCHART
            }); //FIN DEL SEGUNDO POST
        }); //FIN DEL PRIMER POST

    }

    getCorrections = function () {
        $.post('/analistacorrecciones', function (response) {
            var table_body = [];
            $('#contadorcorreccionestabla').html(response.length);
            $('#contadorcorreccioneslinkdashboard').html(response.length);
            for (i = 0; i < response.length; i++) {
                table_body += "<tr class='rows_correcciones' data-idrequest=' "+ response[i]["idregistro"] +"' >";

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

                if (response[i]["analistaasignado"] == null){
                    table_body += '<td>';
                    table_body += " "
                    table_body += '</td>';
                }else{
                    table_body += '<td>';
                    table_body += response[i]["analistaasignado"];
                    table_body += '</td>';
                }

                if (response[i]["corregido"] == 0){
                    table_body += '<td>';
                    table_body += "Esperando corrección";
                    table_body += '</td>';
                } else if (response[i]["corregido"] == 1){
                    table_body += '<td>';
                    table_body += "CORREGIDO";
                    table_body += '</td>';
                }

                

                

                table_body += '</tr>';
            }
            $('#tbody_tablecorrections').html(table_body);
        });
    }//fin de function






    //instancias iniciales
    dailyandmonthly();
    statisticsanalista();
    statisticscerrador();
    toptenactivadores();
    countercampaign();
    shametopten();
    getDailyCreatedByCampaign();
    graficaHighchart();
    getCorrections();
    
});