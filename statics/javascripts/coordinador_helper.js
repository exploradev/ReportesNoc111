var modal;
$(document).ready(function(){

    //clipboard init
    //datetimepicker config

    

    //SECCION DE CONCENTRADO
    //funcion que abre el modal correspondiente a la accion clickeada
    modal = function(idrequest,action){
        if(action == 'reject'){
            $('#overlay_analista').css('display', 'block');
            $('#modalrechazo').css('display','flex');
            getDataModal(idrequest,action);

        }else if(action == 'comnt'){
            $('#overlay_analista').css('display', 'block');
            $('#modalcomentario').css('display', 'flex');
            getDataModal(idrequest,action);

        } else if (action == 'agenda') {
            $('#overlay_analista').css('display', 'block');
            $('#modalagenda').css('display', 'flex');
            getDataModal(idrequest, action);
        } else if (action == 'activa') {
            setRequestActive(idrequest);
        }
    }

    

    //validacion de campos va en cerrador_validacion.js

    //al clickear para cerrar
    $('#close_modalrechazo,#close_modalcomentario,#close_modalagenda').click(function () {
        $('#modalrechazo,#modalcomentario,#modalagenda').css('display', 'none');
        $('#overlay_analista').css('display', 'none');
        $('#textareamodalrechazo').val('');
        $('#textareamodalcomentario').val('');
        $('#fechaagendainput').val('');
        $('#canalagendainput').val('');
        $('#submitmodalrechazo').prop('disabled', true);
        $('#submitmodalcomentario').prop('disabled', true);
        $('#submitmodalagenda').prop('disabled', true);
    });

    
    var tbody_selected = $('#tbody_concentrado, #tbody_aceptadassin, #tbody_aceptadasdom, #tbody_agendadas, #tbody_activadas ');

    tbody_selected.on('click', '.rowhover', function () {
        var idrequest = $(this).data('idrequest');
        
        // POPOVER DE EDICION DE FOLIO-------------------------------------------------------------------------

        var titulo_popover = "Editar SISACT de captura " + idrequest;
        $('#sisact' + idrequest).popover({ title: titulo_popover, content: "<div class='content-popover'>SISACT:  <input id='sisactfield" + idrequest + "'type='text'><button disabled id='btn-sisact" + idrequest + "' class='btn btn-default'>Actualizar</button></div>", placement: "bottom", html: true });


        //validando si los campos estan vacios al keyup para habilitar el boton de submit
        $('#sisactfield' + idrequest).keyup(function () {
            var valorsisact = $('#sisactfield' + idrequest).val();
            // old var regexdate = /^([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(\d{4})(\s)([0-1][0-9]|2[0-3])(:)([0-5][0-9])$/;
            var regexsisact = /^[\d\w]{1,15}$/;
            if (valorsisact.match(regexsisact)) {
                $('#btn-sisact' + idrequest).prop('disabled', false);
            } else {
                $('#btn-sisact' + idrequest).prop('disabled', true);
            }
        });

        $('#btn-sisact' + idrequest).click(function (e) {
            var folio = $('#sisactfield' + idrequest).val();
            setSisactCanal(idrequest, folio, 'sisact'); //funcion en analista_ajax.js

            e.stopImmediatePropagation();
            e.preventDefault();
        });

        //--------------- CANAL ----------------------------//

        var titulo_popover = "Editar CANAL de captura " + idrequest;
        $('#canal' + idrequest).popover({ title: titulo_popover, content: "<div class='content-popover'>CANAL:  <input id='canalfield" + idrequest + "'type='text'><button disabled id='btn-canal" + idrequest + "' class='btn btn-default'>Actualizar</button></div>", placement: "bottom", html: true });


        //validando si los campos estan vacios al keyup para habilitar el boton de submit
        $('#canalfield' + idrequest).keyup(function () {
            var valorcanal = $('#canalfield' + idrequest).val();
            // old var regexdate = /^([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(\d{4})(\s)([0-1][0-9]|2[0-3])(:)([0-5][0-9])$/;
            var regexcanal = /^[\d\w]{1,15}$/;
            if (valorcanal.match(regexcanal)) {
                $('#btn-canal' + idrequest).prop('disabled', false);
            } else {
                $('#btn-canal' + idrequest).prop('disabled', true);
            }
        });

        $('#btn-canal' + idrequest).click(function (e) {
            var folio = $('#canalfield' + idrequest).val();
            setSisactCanal(idrequest, folio, 'canal'); //funcion en analista_ajax.js

            e.stopImmediatePropagation();
            e.preventDefault();
        });

        //FIN DE POPOVER----------------------------------------------------------------------------------------------

    });

    
    


    
    
});
