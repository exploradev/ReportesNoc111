
$(document).ready(function () {

    //AL CLICKEAR EN LA TABLA DE REPORTES DISPONIBLES 
    //MUESTRO EL MODAL DE DETALLES

    

    $('#tbody_reportesexistentes').on('click', '.rowdetallesdisponibles', function () {
        var idmetadatos = $(this).data('idmetadatos');
        var tipofalla = $(this).data('tipofalla');
        $('#asesor_modal_detallesdecaptura').css('display', 'block');
        $('.body_modal_detalles').css('display', 'none');
        
        switch(tipofalla){
            case 'aclaraciones':
                $('#body_modal_detallesaclaraciones').css('display','grid');
                break;
            case 'general':
                $('#body_modal_detallesgeneral').css('display','grid');
                break;
            case 'cobertura':
                $('#body_modal_detallescobertura').css('display','grid');
                break;
            case 'iccid':
                $('#body_modal_detallesiccid').css('display','grid');
                break;
            case 'llamadas':
                $('#body_modal_detallesllamadas').css('display','grid');
                break;
            case 'navegacion':
                $('#body_modal_detallesnavegacion').css('display','grid');
                break;
            case 'recargas':
                $('#body_modal_detallesrecargas').css('display','grid');
                break;
            case 'promociones':
                $('#body_modal_detallespromociones').css('display', 'grid');
                break;
            case 'servicios':
                $('#body_modal_detallesservicios').css('display','grid');
                break;
            case 'callback':
                $('#body_modal_detallescallback').css('display','grid');
                break;
        }
        $.post('/get_detallescaptura',{
            idmetadatos: idmetadatos,
            tipofalla: tipofalla
        },function(response){
            console.log(response);
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
            
            $("#asesor_modal_reportesdisponibles").css('display','none');
            $("#asesor_modal_detallesdecaptura").css('display', 'block');
        });

        //LLAMAR AJAX PARA LLENAR TABLA DE DETALLES

    }); // FIN DE EVENTO

    //FUNCIONES GLOBALES PARA LLENAR LOS DETALLES MANTENIENDO LEGIBLE EL CODIGO


});