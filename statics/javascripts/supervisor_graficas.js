var activacionesDiarias, feedCounterBoxes, capturasDiarias, feedLiveStatistics, feedProductivity;
$(document).ready(function(){
    moment.locale();
    //obteniendo 7 ultimos dias para los labels
    var fecha = new Date();
    var labels_graph = []; 
    
    for(i = 6; i >= 0; i-- ){
        labels_graph.push(moment(fecha).subtract(i, 'day').format('MMMM[ ]DD'))
    }

    //ajax que obtiene estadisticas de los ultimos dias 
    

    activacionesDiarias = function(){
        $.post('/getDashboardSevenDays',function(response){

            var labels_excelentes = [];
            var labels_estrena = [];
            var labels_total = [];
            
            for(i = 0; i<=6; i++ ){
                labels_excelentes.push(response[i]);
            }

            for (i = 7; i < 14; i++) {
                labels_estrena.push(response[i]);
            }

            for (i = 0; i <= 6; i++) {
                labels_total.push(labels_excelentes[i] + labels_estrena[i]);
            }
           //CONFIGURACION DE GRAFICA FUNCIONAL FORMA SPLINE
            Highcharts.chart('container_graph_a', {
                chart: {
                    type: 'spline',
                    animation: false
                },
                title: {
                    text: 'Activaciones de los ultimos 7 dias'
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
                    name: 'EXCELENTES',
                    data: labels_excelentes
                }, {
                    name: 'ESTRENA',
                    data: labels_estrena
                }, {
                    name: 'TOTAL',
                    data: labels_total
                }]
            });

            //COMIENZO DE GRAFICA DE PRUEBA
            /*Highcharts.chart('maindashboard', {
                chart: {
                    type: 'areaspline'
                },
                title: {
                    text: 'Activaciones de los ultimos 7 dias'
                },
                subtitle: {
                    text: 'T E L E M A R K E T I N G'
                },
                legend: {
                    layout: 'vertical',
                    align: 'left',
                    verticalAlign: 'top',
                    x: 150,
                    y: 100,
                    floating: true,
                    borderWidth: 1,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                },
                xAxis: {
                    categories: labels_graph,
                    plotBands: [{ // visualize the weekend
                        from: 4.5,
                        to: 6.5,
                        //color: 'rgba(68, 170, 213, .2)'
                    }]
                },
                yAxis: {
                    title: {
                        text: 'ACTIVACIONES'
                    }
                },
                tooltip: {
                    shared: true,
                    valueSuffix: ' activas'
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    areaspline: {
                        fillOpacity: 0.5
                    }
                },
                series: [{
                    name: 'EXCELENTES',
                    data: labels_excelentes
                }, {
                    name: 'ESTRENA',
                    data: labels_estrena
                },{
                    name: 'TOTAL',
                    data: labels_total
                }]
            });
            //FIN DE GRAFICA DE PRUEBA
        */
        });
    }

    // ajax que obtiene las capturas diarias
    capturasDiarias = function () {
        $.post('/getDashboardSevenDaysCapturas', function (response) {

            var labels_excelentes_capturas = [];
            var labels_estrena_capturas = [];
            var labels_total_capturas = [];

            for (i = 0; i <= 6; i++) {
                labels_excelentes_capturas.push(response[i]);
            }

            for (i = 7; i < 14; i++) {
                labels_estrena_capturas.push(response[i]);
            }

            for (i = 0; i <= 6; i++) {
                labels_total_capturas.push(labels_excelentes_capturas[i] + labels_estrena_capturas[i]);
            }
            //CONFIGURACION DE GRAFICA FUNCIONAL FORMA SPLINE
            Highcharts.chart('container_graph_c', {
                chart: {
                    type: 'spline',
                    
                },
                title: {
                    text: 'Capturas de los ultimos 7 dias'
                },
                subtitle: {
                    text: 'T E L E M A R K E T I N G'
                },
                xAxis: {
                    categories: labels_graph
                },
                yAxis: {
                    title: {
                        text: 'CAPTURAS'
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
                    name: 'EXCELENTES',
                    data: labels_excelentes_capturas
                }, {
                    name: 'ESTRENA',
                    data: labels_estrena_capturas
                }, {
                    name: 'TOTAL',
                    data: labels_total_capturas
                }]
            });

            //COMIENZO DE GRAFICA DE PRUEBA
            /*Highcharts.chart('maindashboard', {
                chart: {
                    type: 'areaspline'
                },
                title: {
                    text: 'Activaciones de los ultimos 7 dias'
                },
                subtitle: {
                    text: 'T E L E M A R K E T I N G'
                },
                legend: {
                    layout: 'vertical',
                    align: 'left',
                    verticalAlign: 'top',
                    x: 150,
                    y: 100,
                    floating: true,
                    borderWidth: 1,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                },
                xAxis: {
                    categories: labels_graph,
                    plotBands: [{ // visualize the weekend
                        from: 4.5,
                        to: 6.5,
                        //color: 'rgba(68, 170, 213, .2)'
                    }]
                },
                yAxis: {
                    title: {
                        text: 'ACTIVACIONES'
                    }
                },
                tooltip: {
                    shared: true,
                    valueSuffix: ' activas'
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    areaspline: {
                        fillOpacity: 0.5
                    }
                },
                series: [{
                    name: 'EXCELENTES',
                    data: labels_excelentes
                }, {
                    name: 'ESTRENA',
                    data: labels_estrena
                },{
                    name: 'TOTAL',
                    data: labels_total
                }]
            });
            //FIN DE GRAFICA DE PRUEBA
        */
        });
    }

    feedCounterBoxes = function(){
        $.post('/getDataLeftDashboard', function (response) {
            
            $('#activacionesMes').html(response[0]["activaciones"]);
            $('#capturasMes').html(response[0]["capturas"]);
            $('#rechazosMes').html(response[0]["rechazos"]);
            $('#capturasDia').html(response[0]["capturasdia"]);
            $('#activacionesDia').html(response[0]["activacionesdia"]);
            $('#aceptadasDia').html(response[0]["aceptadasdia"]);
            $('#rechazosDia').html(response[0]["rechazosdia"]);
        });
    }

    feedLiveStatistics = function () {
        $.post('/statisticsanalista', function (response) {
            $('#live_pendientes').html(response[0]["pendientes"]);
            $('#live_enespera').html(response[0]["enesperaderespuesta"]);
            $('#live_aceptadas').html(response[0]["aceptadas"]);
            $('#live_correcciones').html(response[0]["correcciones"]);
            $('#live_activaciones').html(response[0]["activaciones"]);
        });
    }

    feedProductivity = function(){
        $.post('/getDataAgentDashboard', function (response) {
            var table_body = [];
            for (i = 0; i < response.length; i++) {
                table_body += "<tr>";

                table_body += '<td>';
                table_body += response[i]["vendedor"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["capturas"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["activadas"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["nofinalizadas"];
                table_body += '</td>';
                
                table_body += '</tr>';
            }
            $('#tbody_productividadtabla').html(table_body);

            
            $('#tabla_productividadasesor').DataTable().destroy();
            $('#tabla_productividadasesor').DataTable({
                dom: '<lf<t>Bp>',
                buttons: [
                    'excel'
                ]
            });
            
            $("select[name='tabla_productividadasesor_length']").trigger('change');
        });
    }

    
    
    //dibujando la grafica
    activacionesDiarias();
    capturasDiarias();
    feedCounterBoxes();
    feedLiveStatistics();
    feedProductivity();
    
    
    
});