var reload_all;
$(document).ready(function () {

    graficaHighchartMayor = function () {

        
        labels_graph = [];

        labels_total = [];
        labels_aclaraciones = [];
        labels_callback = [];
        labels_cobertura = [];
        labels_general = [];
        labels_iccid = [];
        labels_llamadas = [];
        labels_navegacion = [];
        labels_promociones = [];
        labels_recargas = [];
        labels_servicios = [];

        var fecha = new Date();

        //los labels son dinamicos. Desde el dia 1 hasta el dia de hoy con .getDate()
        for (i = 0; i < fecha.getDate(); i++) {
            labels_graph.push((i + 1));
        }


        $.post('/getTotalReportes', function (response) {

            for (i = 0; i < response.length; i++) {
                labels_total[(response[i]["dia"]) - 1] = Number(response[i]["fallas"]);
            }

            for (i = 0; i < fecha.getDate(); i++) {
                if (labels_total[i] == null) {
                    labels_total[i] = 0
                }
            }

            $.post('/getConteoDiarioAclaraciones', function (response) {
                for (i = 0; i < response.length; i++) {
                    labels_aclaraciones[(response[i]["dia"]) - 1] = Number(response[i]["fallas"]);
                }

                for (i = 0; i < fecha.getDate(); i++) {
                    if (labels_aclaraciones[i] == null) {
                        labels_aclaraciones[i] = 0
                    }
                }

                $.post('/getConteoDiarioCallback', function (response) {
                    for (i = 0; i < response.length; i++) {
                        labels_callback[(response[i]["dia"]) - 1] = Number(response[i]["fallas"]);
                    }

                    for (i = 0; i < fecha.getDate(); i++) {
                        if (labels_callback[i] == null) {
                            labels_callback[i] = 0
                        }
                    }
                    $.post('/getConteoDiarioCobertura', function (response) {
                        for (i = 0; i < response.length; i++) {
                            labels_cobertura[(response[i]["dia"]) - 1] = Number(response[i]["fallas"]);
                        }

                        for (i = 0; i < fecha.getDate(); i++) {
                            if (labels_cobertura[i] == null) {
                                labels_cobertura[i] = 0
                            }
                        }
                        $.post('/getConteoDiarioGeneral', function (response) {
                            for (i = 0; i < response.length; i++) {
                                labels_general[(response[i]["dia"]) - 1] = Number(response[i]["fallas"]);
                            }

                            for (i = 0; i < fecha.getDate(); i++) {
                                if (labels_general[i] == null) {
                                    labels_general[i] = 0
                                }
                            }
                            $.post('/getConteoDiarioICCID', function (response) {
                                for (i = 0; i < response.length; i++) {
                                    labels_iccid[(response[i]["dia"]) - 1] = Number(response[i]["fallas"]);
                                }

                                for (i = 0; i < fecha.getDate(); i++) {
                                    if (labels_iccid[i] == null) {
                                        labels_iccid[i] = 0
                                    }
                                }

                                $.post('/getConteoDiarioLlamadas', function (response) {
                                    for (i = 0; i < response.length; i++) {
                                        labels_llamadas[(response[i]["dia"]) - 1] = Number(response[i]["fallas"]);
                                    }

                                    for (i = 0; i < fecha.getDate(); i++) {
                                        if (labels_llamadas[i] == null) {
                                            labels_llamadas[i] = 0
                                        }
                                    }
                                    $.post('/getConteoDiarioPromociones', function (response) {
                                        for (i = 0; i < response.length; i++) {
                                            labels_promociones[(response[i]["dia"]) - 1] = Number(response[i]["fallas"]);
                                        }

                                        for (i = 0; i < fecha.getDate(); i++) {
                                            if (labels_promociones[i] == null) {
                                                labels_promociones[i] = 0
                                            }
                                        }
                                        $.post('/getConteoDiarioRecargas', function (response) {
                                            for (i = 0; i < response.length; i++) {
                                                labels_recargas[(response[i]["dia"]) - 1] = Number(response[i]["fallas"]);
                                            }

                                            for (i = 0; i < fecha.getDate(); i++) {
                                                if (labels_recargas[i] == null) {
                                                    labels_recargas[i] = 0
                                                }
                                            }
                                            $.post('/getConteoDiarioServicios', function (response) {
                                                for (i = 0; i < response.length; i++) {
                                                    labels_servicios[(response[i]["dia"]) - 1] = Number(response[i]["fallas"]);
                                                }

                                                for (i = 0; i < fecha.getDate(); i++) {
                                                    if (labels_servicios[i] == null) {
                                                        labels_servicios[i] = 0
                                                    }
                                                }
                                                $.post('/getConteoDiarioNavegacion', function (response) {
                                                    for (i = 0; i < response.length; i++) {
                                                        labels_navegacion[(response[i]["dia"]) - 1] = Number(response[i]["fallas"]);
                                                    }

                                                    for (i = 0; i < fecha.getDate(); i++) {
                                                        if (labels_navegacion[i] == null) {
                                                            labels_navegacion[i] = 0
                                                        }
                                                    }

                                                    Highcharts.chart('grafica_mayor', {
                                                        chart: {
                                                            type: 'areaspline',

                                                        },
                                                        title: {
                                                            text: 'REPORTES NOC *264'
                                                        },
                                                        subtitle: {
                                                            text: 'Fallas por día'
                                                        },
                                                        xAxis: {
                                                            categories: labels_graph
                                                        },
                                                        yAxis: {
                                                            title: {
                                                                text: 'Cantidad'
                                                            }
                                                        },
                                                        plotOptions: {
                                                        
                                                            series: {
                                                                animation: false,
                                                                dataLabels: {
                                                                    enabled: true
                                                                }
                                                            },
                                                            spline: {
                                                                marker: {
                                                                    radius: 4,
                                                                    lineColor: '#666666',
                                                                    lineWidth: 1
                                                                }
                                                            }
                                                        },
                                                        series: [
                                                            {
                                                                name: 'Total Reportes',
                                                                data: labels_total
                                                            }, {
                                                                name: 'Aclaraciones',
                                                                data: labels_aclaraciones
                                                            }, {
                                                                name: 'Afectación general',
                                                                data: labels_general
                                                            }, {
                                                                name: 'Calidad en el servicio/cobertura',
                                                                data: labels_cobertura
                                                            }, {
                                                                name: 'Callback',
                                                                data: labels_callback
                                                            }, {
                                                                name: 'Cambio de ICCID',
                                                                data: labels_iccid
                                                            }, {
                                                                name: 'Llamadas/SMS',
                                                                data: labels_llamadas
                                                            }, {
                                                                name: 'Falla en navegación',
                                                                data: labels_navegacion
                                                            }, {
                                                                name: 'Falla en recargas',
                                                                data: labels_recargas
                                                            }, {
                                                                name: 'Promociones',
                                                                data: labels_servicios
                                                            }, {
                                                                name: 'Altas o bajas de servicios',
                                                                data: labels_servicios
                                                            }
                                                        ]
                                                    }); // FIN DEL HIGHCHART

                                                }); //FIN DEL 11 POST
                                            }); //FIN DEL 10 POST
                                        }); //FIN DEL 9 POST
                                    }); //FIN DEL 8 POST
                                }); //FIN DEL 7 POST
                            }); //FIN DEL 6 POST
                        }); //FIN DEL 5 POST
                    }); //FIN DEL 4 POST
                }); //FIN DEL 3 POST
            }); //FIN DEL 2 POST
        }); //FIN DEL 1 POST

    }// fin de la funcion que genera la grafica
    
    graficaHighchartBarra = function(){

        $.post('/getConteoTotalPorFalla',function(response){
            // Create the chart
            Highcharts.chart('tablatop_izq', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Conteo por tipo de falla'
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    title: {
                        text: 'Cantidad de reportes generados'
                    }

                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        animation: false,
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            //format: '{point.y:.1f}'
                        }
                    }
                },



                series: [
                    {
                        name: "Reportes",
                        colorByPoint: true,
                        data: [

                            {
                                name: "Aclaraciones",
                                y: response[0]["aclaraciones"],

                            },
                            {
                                name: "Afectación general",
                                y: response[0]["general"],

                            },
                            {
                                name: "Calidad en el servicio/cobertura",
                                y: response[0]["cobertura"],

                            },
                            {
                                name: "Callback",
                                y: response[0]["callback"],

                            },
                            {
                                name: "Cambio de ICCID",
                                y: response[0]["iccid"],

                            },
                            {
                                name: "Llamadas/SMS",
                                y: response[0]["llamadas"],

                            },
                            {
                                name: "Falla en navegación",
                                y: response[0]["navegacion"],

                            },
                            {
                                name: "Falla en recargas",
                                y: response[0]["recargas"],

                            },
                            {
                                name: "Promociones",
                                y: response[0]["promociones"],

                            },
                            {
                                name: "Altas o bajas de servicios",
                                y: response[0]["servicios"],

                            }
                        ]
                    }
                ]

            });
        })
        
    }
    
    graficaHighchartSpider = function(){
        $.post('/getSpiderStatus',function(response){
            
            
            Highcharts.chart('tablatop_der', {

                chart: {
                    polar: true,
                    type: 'line'
                },

                title: {
                    text: 'Reportes abiertos y cerrados',
                    x: -80
                },

                pane: {
                    size: '80%'
                },

                xAxis: {
                    categories: ['Aclaraciones', 'Callback', 'Calidad en el servicio/cobertura', 'Afectación general', 
                        'Cambio de ICCID', 'Llamadas/SMS', 'Promociones', 'Falla en recargas', 'Altas o bajas de servicios', 'Falla en navegación'],
                    tickmarkPlacement: 'on',
                    lineWidth: 0
                },

                yAxis: {
                    gridLineInterpolation: 'polygon',
                    lineWidth: 0,
                    min: 0
                },

                tooltip: {
                    shared: true,
                    pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}</b><br/>'
                },

                legend: {

                    verticalAlign: 'bottom'
                },

                series: [{
                    animation: false,
                    name: 'Abiertos',
                    data: [
                        response[0]['abiertos_aclaraciones'],
                        response[0]['abiertos_callback'],
                        response[0]['abiertos_cobertura'],
                        response[0]['abiertos_general'],
                        response[0]['abiertos_iccid'],
                        response[0]['abiertos_llamadas'],
                        response[0]['abiertos_promociones'],
                        response[0]['abiertos_recargas'],
                        response[0]['abiertos_servicios'],
                        response[0]['abiertos_navegacion']
                    ],
                    pointPlacement: 'on'
                }, {
                        animation: false,
                    name: 'Cerrados',
                    data: [
                        response[0]['cerrados_aclaraciones'],
                        response[0]['cerrados_callback'],
                        response[0]['cerrados_cobertura'],
                        response[0]['cerrados_general'],
                        response[0]['cerrados_iccid'],
                        response[0]['cerrados_llamadas'],
                        response[0]['cerrados_promociones'],
                        response[0]['cerrados_recargas'],
                        response[0]['cerrados_servicios'],
                        response[0]['cerrados_navegacion']
                    ],
                    pointPlacement: 'on'
                }],

                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            legend: {
                                align: 'center',
                                verticalAlign: 'bottom'
                            },
                            pane: {
                                size: '70%'
                            }
                        }
                    }]
                }

            });
        });//fin del post
        
    }
    
    tabla_productividad = function () {
        $.post('/getProductividad', function (response) {
            var table_body = [];
            total_global = 0

            response.forEach(element => {
                total_global += element.total;
            });

            for (i = 0; i < response.length; i++) {
                table_body += "<tr>";

                table_body += "<td>";
                table_body += response[i]["asesor"];
                table_body += '</td>';

                table_body += "<td bgcolor='#3F4658'>";
                table_body += response[i]["nuevos"];
                table_body += '</td>';

                table_body += "<td bgcolor='#3F4658'>";
                table_body += response[i]["enproceso"];
                table_body += '</td>';

                table_body += "<td bgcolor='#3F4658'>";
                table_body += response[i]["pendientes"];
                table_body += '</td>';

                table_body += "<td bgcolor='#3F4658'>";
                table_body += response[i]["cerrados"];
                table_body += '</td>';

                table_body += "<td>";
                table_body += response[i]["total"];
                table_body += '</td>';

                table_body += "<td>";
                var total = response[i]["total"];
                var cerrados = response[i]['cerrados'];
                var num = ((cerrados / total) * 100);
                num = num.toFixed(2);
                table_body += num + "%";
                table_body += '</td>';

                table_body += "<td>";
                var num = (response[i]["total"] / total_global) * 100;
                num = num.toFixed(2);
                table_body += num + "%";
                table_body += '</td>';

                table_body += '</tr>';
            }
            $('#tbody_tablaproductividad').html(table_body);
        });
    }

    estatus_actuales = function () {
        $.post('/getEstatusActuales', function (response) {    
            $('#conteo_nuevos').html(response[0]['nuevos']);
            $('#conteo_enproceso').html(response[0]['enproceso']);
            $('#conteo_pendientes').html(response[0]['pendientes']);
            $('#conteo_cerrados').html(response[0]['cerrados']);
            var cerrados = response[0]['cerrados'];
            var total = response[0]['total'];
            var num = (cerrados/total)*100;
            num = num.toFixed(2);
            $('#conteo_productividad').html(num+"%");
        });
    }
    
    reload_all = function(){
        estatus_actuales();
        graficaHighchartMayor();
        graficaHighchartBarra();
        graficaHighchartSpider();
        tabla_productividad();
    }

    //reload_all();
    
});

