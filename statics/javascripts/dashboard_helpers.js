var resetfields, setdatamodal, getdatarequestwithid;
$(document).ready(function () {
    //EN ESTE JS:
    
    

    
    //AJAX PARA ALIMENTAR PANEL DE DETALLES AL HACER CLICK A LOS TR DE LA TABLA DE ACTIVACIONES
    $('#table_corrections').on('click', '.rows_correcciones',function(){
        var idrequest = $(this).data('idrequest');
        //$('#panelContainerDetails').addClass('bigger');
        $('#panelContainerDetails').css('display', 'block');
        
        $('#overlay-back').css('visibility', 'visible');
        //$('#date_agenda, #cac_agenda').val('');
        getdatarequestwithid(idrequest);
        //alert(idrequest);
    });

    

   

    //FUNCION PARA ESCRIBIR RESPONSE EN DETAILPANEL DE CAPTURAS Y CORRECCIONES
    getdatarequestwithid = function (idrequest) {
        $.post('/getdatarequest', { idregistro: idrequest }, function (response) {

            //hacer request de estatus, sisact y canal
            $('#get_capturaid').html(idrequest);
            $('#get_sisact').html(response[0]["sisact"]);
            $('#get_canal2').html(response[0]["canal2"]);
            $('#get_status').html(response[0]["status"]);


            //console.log(response);
            $('#analistaasignado').html('Asignado a: ' + response[0]["analistaasignado"]);
            $('#fechadecaptura').html('Capturado: ' + response[0]["created"]);

            //datos personales
            $('#get_sexo').html(response[1]["gender"]);
            $('#get_nombresapellidos').html(response[1]["name"] + ' ' + response[1]["lastname"]);
            $('#get_fechadenacimiento').html(response[1]["birthday"]);
            $('#get_numcliente').html(response[1]["contact_num"]);
            $('#get_email').html(response[1]["email"]);
            $('#get_rfc').html(response[1]["rfc"]);

            //datos del plan
            $('#get_tipoactivacion').html(response[2]["tipo"]);
            $('#get_procedencia').html(response[2]["origen"]);
            $('#get_numamigrar').html(response[2]["amigrar"]);
            $('#get_refacta').html(response[2]["refacta"]);
            $('#get_canal').html(response[2]["canal"]);
            $('#get_plan').html(response[2]["nombreplan"]);
            $('#get_plazo').html(response[2]["plazoplan"]);
            $('#get_claveplan').html(response[2]["claveplan"]);
            $('#get_equipo').html(response[2]["equipocelular"]);
            $('#get_pagoinicial').html(response[2]["pagoinicial"]);
            $('#get_costoamigo').html(response[2]["preciodelista"]);

            //address
            $('#get_ciudadestado').html(response[3]["city"] + ", " + response[3]["state"]);
            $('#get_callecliente').html(response[3]["street"]);
            $('#get_numexterior').html(response[3]["num_ext"]);
            $('#get_numinterior').html(response[3]["num_int"]);
            $('#get_cruzamientos').html(response[3]["between_streets"]);
            $('#get_colonia').html(response[3]["district"]);
            $('#get_codigopostal').html(response[3]["postalcode"]);
            $('#get_numcelularofijo').html(response[3]["local_phonenumber"]);
            $('#get_horariovisita').html(response[3]["availability"]);
            $('#get_referencias').html(response[3]["reference"]);

            //datos laborales
            $('#get_nombreempresa').html(response[4]["jobname"]);
            $('#get_cargo').html(response[4]["job"]);
            $('#get_celofijolaboral').html(response[4]["phonenumber"]);
            $('#get_extensionlaboral').html(response[4]["extension"]);
            $('#get_horariovisitalaboral').html(response[4]["availability"]);

            //referencias
            var referencia1 = response[5]["refname"] + " " + response[5]["reflastname"] + " " + response[5]["refphonenumber"] + " " + response[5]["refavailability"];
            var referencia2 = response[6]["refname"] + " " + response[6]["reflastname"] + " " + response[6]["refphonenumber"] + " " + response[6]["refavailability"];

            if (response[8]) {
                var referencia3 = response[7]["refname"] + " " + response[7]["reflastname"] + " " + response[7]["refphonenumber"] + " " + response[7]["refavailability"];
                $('#get_referencia3').html(referencia3);
                //observaciones
                $('#get_observacionesadicionales').html(response[8]["observation"]);
                
            }else{
                //observaciones
                $('#get_observacionesadicionales').html(response[7]["observation"]);
            }

            
            $('#get_referencia1').html(referencia1);
            $('#get_referencia2').html(referencia2);
            



            
            $('#comentarioanalista').html(response[0]["comentario"]);
            $('#get_motivorechazo').html(response[0]["rechazo"]);
            $('#get_correccion').html(response[0]["correccion"]);
            $('#get_motivoaceptacion').html(response[0]["aceptacion"]);
            $('#get_fechaagenda').html(response[0]["fechaagenda"]);
            $('#get_cacagenda').html(response[0]["cacagenda"]);


            if (response[0]["status"] == 'corregir') {
                $('#showmodalforcorrection').css('display', 'block');
            } else {
                $('#showmodalforcorrection').css('display', 'none');
            }

            //Solo para panel details
            //$('#link_agenda').html("<a href='#' id='agenda_asesor"+ idrequest +"'>(Click para agendar)</a>");
            

            

        });//fin del post de select all
    }

    
    //cerrar panel de detalles

    $('#closePanelDetails').click(function(){

        $('#panelContainerDetails').css('display','none');
        $('#overlay-back').css('visibility', 'hidden');
        
    });

   
    $(window).keyup(function (e) {
        if (e.keyCode === 27) $('#closePanelDetails').trigger('click');   // esc
    });
    

   
});