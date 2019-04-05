$(document).ready(function(){

    //clipboard init
    //datetimepicker config

    new ClipboardJS('.copytoclipboard');
    
    //seccion de pendientes --------------------------------------------------------------
    var tbody_pendientes = $('#tbody_pendientes');

    tbody_pendientes.on('click','.rowhover',function(){
        var idregistro = $(this).data('idregistro');

        //si ya esta asignado entonces:
        $('#verrequest' + idregistro).click(function(e){
            $('#side-panel').css('display', 'block');
            $('#side-panel').animate({ right: 0 }, 200, "linear");
            showdata(idregistro);
            e.stopImmediatePropagation();
            e.preventDefault();
        });


        //para asignar y ver
        $('#asignto'+idregistro).css('visibility', 'visible');
        $('#asignto' + idregistro).click(function (e) {
            //alert(idregistro);
            $('#side-panel').css('display', 'block');
            $('#side-panel').animate({right: 0}, 200, "linear");
            fillsidepanel(idregistro);
            
            e.stopImmediatePropagation();
            e.preventDefault();
        });

        //toggle para cerrar el side-panel
        $('#close-sidepanel').click(function () {
            $('#side-panel').animate({ right: -2000 }, 100, "linear");
            $('#side-panel').css('display', 'none');
        });
    });

    //desaparecer el boton de asignado en caso de que no se oprima
    tbody_pendientes.on('mouseleave', '.rowhover', function() {
        var idregistro = $(this).data('idregistro');
        $('#asignto' + idregistro).css('visibility', 'hidden');
    });   

    //picklist de captura
    formaccepted = $('#formaccepted');
    formcorrected = $('#formcorrected');
    formrejected = $('#formrejected');

    //conficional para mostrar y ocultar forms de capturas
    $('#select_estatuscaptura').change(function(){
        var value_selected = $(this).val();
        if(value_selected == 'capturada'){
            formcorrected.css('display', 'none');
            formrejected.css('display', 'none');
            formaccepted.css('display','block');
        } else if (value_selected == 'corregir'){
            formaccepted.css('display', 'none');
            formrejected.css('display', 'none');
            formcorrected.css('display', 'block');
        } else if (value_selected == 'rechazada'){
            formaccepted.css('display', 'none');
            formcorrected.css('display', 'none');
            formrejected.css('display', 'block');
        }
    });
    

    //regex para validacion de campos de texto del sidepanel.
    //habilitar el boton siempre y cuando no se pase del rango
    $('#sisactfield, #canalfield').keyup(function(){
        var longsisact = $('#sisactfield').val();
        var longcanal = $('#canalfield').val();
        var regex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s\d]{1,15}$/;
        if(longsisact.match(regex) && longcanal.match(regex)){
            $('#btn_guardarsisact').prop('disabled',false);
        }else{
            $('#btn_guardarsisact').prop('disabled', true);
        }
    });

    $('#observacionescorreccion, #observacionesrechazo').keyup(function () {
        var longobservacionescorreccion = $('#observacionescorreccion').val();
        var longobservacionesrechazo = $('#observacionesrechazo').val();
        var regex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s\d]{1,200}$/;
        
        //form de correccion
        if (longobservacionescorreccion.match(regex)) {
            $('#btn_guardarcorreccion').prop('disabled', false);
        } else {
            $('#btn_guardarcorreccion').prop('disabled', true);
        }

        //form de rechazo
        if (longobservacionesrechazo.match(regex)) {
            $('#btn_guardarrechazo').prop('disabled', false);
        } else {
            $('#btn_guardarrechazo').prop('disabled', true);
        }
    });



    
    //seccion de en espera --------------------------------------------------------------

    var tbody_enespera = $('#tbody_enespera');

    function close_modalhelper() {
        $('#modalRechazoCorreccion').animate({ right: -2000 }, 200, "linear");
        $('#overlay_analista').css('display', 'none');
        $('#modalRechazoCorreccion').css('display', 'none');
        $('#motivorespuestatelcel').val('');
        $('#btn_submit_modalhelper').prop('disabled',true);

        $('#modalRechazo').animate({ right: -2000 }, 200, "linear");
        $('#overlay_analista').css('display', 'none');
        $('#modalRechazo').css('display', 'none');
        $('#motivoderechazo').val('');
        $('#btn_submit_motivorechazo').prop('disabled', true);

        $('#modalObservacion').animate({ right: -2000 }, 200, "linear");
        $('#overlay_analista').css('display', 'none');
        $('#modalObservacion').css('display', 'none');
        $('#comentarioagenda').val('');
        $('#btn_comentarioagenda').prop('disabled', true);
    }

    tbody_enespera.on('click', '.enesperarow', function () {
        $('#motivorespuestatelcel').val('');
        
        var idregistro = $(this).data('idregistro');
        $('#button-enespera-' + idregistro).css('visibility', 'visible');

        // POPOVER DE EDICION DE FOLIO-------------------------------------------------------------------------

        var titulo_popover = "Editar SISACT de captura " + idregistro;
        $('#sisact' + idregistro).popover({ title: titulo_popover, content: "<div class='content-popover'>SISACT:  <input id='sisactfield" + idregistro + "'type='text'><button disabled id='btn-sisact" + idregistro + "' class='btn btn-default'>Actualizar</button></div>", placement: "bottom", html: true });


        //validando si los campos estan vacios al keyup para habilitar el boton de submit
        $('#sisactfield' + idregistro).keyup(function () {
            var valorsisact = $('#sisactfield' + idregistro).val();
            // old var regexdate = /^([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(\d{4})(\s)([0-1][0-9]|2[0-3])(:)([0-5][0-9])$/;
            var regexsisact = /^[\d\w]{1,15}$/;
            if (valorsisact.match(regexsisact)) {
                $('#btn-sisact' + idregistro).prop('disabled', false);
            } else {
                $('#btn-sisact' + idregistro).prop('disabled', true);
            }
        });

        $('#btn-sisact' + idregistro).click(function (e) {
            var folio = $('#sisactfield' + idregistro).val();
            setSisactCanal(idregistro, folio, 'sisact'); //funcion en analista_ajax.js
            
            e.stopImmediatePropagation();
            e.preventDefault();
        });

        //--------------- CANAL ----------------------------//

        var titulo_popover = "Editar CANAL de captura " + idregistro;
        $('#canal' + idregistro).popover({ title: titulo_popover, content: "<div class='content-popover'>CANAL:  <input id='canalfield" + idregistro + "'type='text'><button disabled id='btn-canal" + idregistro + "' class='btn btn-default'>Actualizar</button></div>", placement: "bottom", html: true });


        //validando si los campos estan vacios al keyup para habilitar el boton de submit
        $('#canalfield' + idregistro).keyup(function () {
            var valorcanal = $('#canalfield' + idregistro).val();
            // old var regexdate = /^([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(\d{4})(\s)([0-1][0-9]|2[0-3])(:)([0-5][0-9])$/;
            var regexcanal = /^[\d\w]{1,15}$/;
            if (valorcanal.match(regexcanal)) {
                $('#btn-canal' + idregistro).prop('disabled', false);
            } else {
                $('#btn-canal' + idregistro).prop('disabled', true);
            }
        });

        $('#btn-canal' + idregistro).click(function (e) {
            var folio = $('#canalfield' + idregistro).val();
            setSisactCanal(idregistro, folio, 'canal'); //funcion en analista_ajax.js

            e.stopImmediatePropagation();
            e.preventDefault();
        });

        //FIN DE POPOVER----------------------------------------------------------------------------------------------


        $('#aceptada' + idregistro).click(function (e) {
            $('#dynamictitle_modalhelper').html("OBS. DE CAPTURA ACEPTADA ID " + idregistro);
            $('#overlay_analista').css('display', 'block');
            $('#modalRechazoCorreccion').css('display', 'block');
            $('#modalRechazoCorreccion').animate({ right: 0 }, 200, "linear");
            $('#dynamictitle_modalhelper').data('modalhelper', idregistro);
            $('#dynamictitle_modalhelper').data('modalstatus', 'aceptada');

            $('#btn_submit_modalhelper').click(function (e) {
                var registro = $('#dynamictitle_modalhelper').data('modalhelper');
                var status = $('#dynamictitle_modalhelper').data('modalstatus');
                var motivo = $('#motivorespuestatelcel').val();
                justifyrejectorcorrection(registro, motivo, status);
                close_modalhelper();
                e.stopImmediatePropagation();
                e.preventDefault();
            });

            $('#motivorespuestatelcel').keyup(function () {
                var motivo = $('#motivorespuestatelcel').val();
                if (motivo.length != 0) {
                    $('#btn_submit_modalhelper').prop('disabled', false);
                } else {
                    $('#btn_submit_modalhelper').prop('disabled', true);
                }
            });

            $('#close_modalhelper').click(function (e) {
                close_modalhelper();
                e.stopImmediatePropagation();
                e.preventDefault();
            });
            e.stopImmediatePropagation();
            e.preventDefault();

        });

        $('#rechazada' + idregistro).click(function (e) {
            //setStatusFromTelcel(idregistro, 'rechazada');
            //abrir mini modal con formulario para ingresar motivo del rechazo
            $('#dynamictitle_modalhelper').html("MOTIVO DEL RECHAZO CAPTURA ID " + idregistro);
            $('#overlay_analista').css('display', 'block');
            $('#modalRechazoCorreccion').css('display', 'block');
            $('#modalRechazoCorreccion').animate({ right: 0 }, 200, "linear");
            $('#dynamictitle_modalhelper').data('modalhelper',idregistro);
            $('#dynamictitle_modalhelper').data('modalstatus', 'rechazada');

            $('#btn_submit_modalhelper').click(function(e){
                var registro = $('#dynamictitle_modalhelper').data('modalhelper');
                var status = $('#dynamictitle_modalhelper').data('modalstatus');
                var motivo = $('#motivorespuestatelcel').val();
                justifyrejectorcorrection(registro, motivo, status);
                close_modalhelper();
                e.stopImmediatePropagation();
                e.preventDefault();
            });

            $('#motivorespuestatelcel').keyup(function () {
                var motivo = $('#motivorespuestatelcel').val();
                if (motivo.length != 0) {
                    $('#btn_submit_modalhelper').prop('disabled', false);
                } else {
                    $('#btn_submit_modalhelper').prop('disabled', true);
                }
            });
            
            //setStatusFromTelcel(idregistro, 'rechazada');
            //para cerrar el modal_helper
            $('#close_modalhelper').click(function(e){
                close_modalhelper();
                e.stopImmediatePropagation();
                e.preventDefault();
            });
            e.stopImmediatePropagation();
            e.preventDefault();
        });

        $('#corregir' + idregistro).click(function (e) {
            //setStatusCorrectitFromTelcel(idregistro, 'aceptada');
            //abrir mini modal con formulario para ingresar motivo de la correccion
            $('#dynamictitle_modalhelper').html("MOTIVO DE LA CORRECCIÓN CAPTURA ID " + idregistro);
            $('#overlay_analista').css('display', 'block');
            $('#modalRechazoCorreccion').css('display', 'block');
            $('#modalRechazoCorreccion').animate({ right: 0 }, 200, "linear");
            $('#dynamictitle_modalhelper').data('modalhelper', idregistro);
            $('#dynamictitle_modalhelper').data('modalstatus', 'aceptadacc');

            $('#btn_submit_modalhelper').click(function (e) {
                var registro = $('#dynamictitle_modalhelper').data('modalhelper');
                var status = $('#dynamictitle_modalhelper').data('modalstatus');
                var motivo = $('#motivorespuestatelcel').val();
                justifyrejectorcorrection(registro, motivo, status);
                close_modalhelper();
                e.stopImmediatePropagation();
                e.preventDefault();
            });

            $('#motivorespuestatelcel').keyup(function () {
                var motivo = $('#motivorespuestatelcel').val();
                if (motivo.length != 0) {
                    $('#btn_submit_modalhelper').prop('disabled', false);
                } else {
                    $('#btn_submit_modalhelper').prop('disabled', true);
                }
            });
            //setStatusFromTelcel(idregistro, 'aceptada c/c');
            //para cerrar el modal_helper
            $('#close_modalhelper').click(function () {
                $('#modalRechazoCorreccion').animate({ right: -2000 }, 200, "linear");
                $('#overlay_analista').css('display', 'none');
                $('#modalRechazoCorreccion').css('display', 'none');
            });
            e.stopImmediatePropagation();
            e.preventDefault();
        });
    });

    tbody_enespera.on('mouseleave', '.enesperarow', function () {
        var idregistro = $(this).data('idregistro');
        $('#button-enespera-' + idregistro).css('visibility', 'hidden');
    });

   

    //seccion de aceptadas --------------------------------------------------------------


    
    var tbody_aceptadas2 = $('#tbody_aceptadas');

    tbody_aceptadas2.on('click', '.aceptadasrow', function () {
        var idregistro = $(this).data('idregistro');
        
    var titulo_popover = "Agendar en captura " + idregistro;
        $('#trigger-click-agenda' + idregistro).popover({ title: titulo_popover, content: "<div class='content-popover'>Día y hora:  <input class='datetimepicker' id='date"+idregistro+"'type='text'> CAC: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <input id='cac"+idregistro+"' type='text'> <button disabled id='btn-agendar"+idregistro+"' class='btn btn-default'>Agendar <img class='buttons-events' src='../assets/calendario.png'></button></div>", placement: "bottom", html: true});

        // DATETIME PICKER --------------------------------------------------------------------------------------
        $('.datetimepicker').datetimepicker({
            format: 'Y/m/d H:m:s',
            validateOnBlur: false
        });
        // DATETIME PICKER --------------------------------------------------------------------------------------

        //validando si los campos estan vacios al keyup para habilitar el boton de submit
        $('#cac' + idregistro + ', #date'+ idregistro).keyup(function(){
            var valordate = $('#date'+idregistro).val();
            var valorcac = $('#cac'+idregistro).val();
            // old var regexdate = /^([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(\d{4})(\s)([0-1][0-9]|2[0-3])(:)([0-5][0-9])$/;
            var regexdate = /^(\d{4})(\/)(0[1-9]|1[0-2])\2([0-2][0-9]|3[0-1])(\s)([0-1][0-9]|2[0-3])(:)([0-5][0-9])(:)([0-5][0-9])$/;
            var regexcac = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s\d]{1,20}$/;
            if(valordate.match(regexdate) && valorcac.match(regexcac)){
                $('#btn-agendar' + idregistro).prop('disabled',false);
            }else{
                $('#btn-agendar' + idregistro).prop('disabled', true);
            }
        });

        $('#btn-agendar' + idregistro).click(function (e) {
            var fecha = $('#date' + idregistro).val();
            var cac = $('#cac' + idregistro).val();
            setScheduleForRequest(fecha,cac,idregistro);
            e.stopImmediatePropagation();
            e.preventDefault();
        });

        // POPOVER DE EDICION DE FOLIO-------------------------------------------------------------------------

        var titulo_popover = "Editar SISACT de captura " + idregistro;
        $('#sisact' + idregistro).popover({ title: titulo_popover, content: "<div class='content-popover'>SISACT:  <input id='sisactfield" + idregistro + "'type='text'><button disabled id='btn-sisact" + idregistro + "' class='btn btn-default'>Actualizar</button></div>", placement: "bottom", html: true });


        //validando si los campos estan vacios al keyup para habilitar el boton de submit
        $('#sisactfield' + idregistro).keyup(function () {
            var valorsisact = $('#sisactfield' + idregistro).val();
            // old var regexdate = /^([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(\d{4})(\s)([0-1][0-9]|2[0-3])(:)([0-5][0-9])$/;
            var regexsisact = /^[\d\w]{1,15}$/;
            if (valorsisact.match(regexsisact)) {
                $('#btn-sisact' + idregistro).prop('disabled', false);
            } else {
                $('#btn-sisact' + idregistro).prop('disabled', true);
            }
        });

        $('#btn-sisact' + idregistro).click(function (e) {
            var folio = $('#sisactfield' + idregistro).val();
            setSisactCanal(idregistro, folio, 'sisact'); //funcion en analista_ajax.js

            e.stopImmediatePropagation();
            e.preventDefault();
        });

        //--------------- CANAL ----------------------------//

        var titulo_popover = "Editar CANAL de captura " + idregistro;
        $('#canal' + idregistro).popover({ title: titulo_popover, content: "<div class='content-popover'>CANAL:  <input id='canalfield" + idregistro + "'type='text'><button disabled id='btn-canal" + idregistro + "' class='btn btn-default'>Actualizar</button></div>", placement: "bottom", html: true });


        //validando si los campos estan vacios al keyup para habilitar el boton de submit
        $('#canalfield' + idregistro).keyup(function () {
            var valorcanal = $('#canalfield' + idregistro).val();
            // old var regexdate = /^([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(\d{4})(\s)([0-1][0-9]|2[0-3])(:)([0-5][0-9])$/;
            var regexcanal = /^[\d\w]{1,15}$/;
            if (valorcanal.match(regexcanal)) {
                $('#btn-canal' + idregistro).prop('disabled', false);
            } else {
                $('#btn-canal' + idregistro).prop('disabled', true);
            }
        });

        $('#btn-canal' + idregistro).click(function (e) {
            var folio = $('#canalfield' + idregistro).val();
            setSisactCanal(idregistro, folio, 'canal'); //funcion en analista_ajax.js

            e.stopImmediatePropagation();
            e.preventDefault();
        });

        //FIN DE POPOVER----------------------------------------------------------------------------------------------

    
    });


    //TABLA DE AGENDA ES LA QUE LLEVA EL CONTROL Y REEDICION DE ENTRADAS------------------------------
    var tbody_aceptadas = $('#tbody_agendaanalista');
    
    tbody_aceptadas.on('click', '.analistaagendarow', function () {
        var idregistro = $(this).data('idregistro');
        $('#button-aceptadas-' + idregistro).css('visibility', 'visible');
        
        //AL CLICKEAR EL ICONO DE COMENTARIO SE ABRE MODAL:
        $('#comnt' + idregistro).click(function (e) {
            //RETRIEVE AND SHOW DATA
            //getComntFromAnalista(idrequest');
            $('#overlay_analista').css('display', 'block');
            $('#modalObservacion').css('display', 'block');
            $('#modalObservacion').animate({ right: 0 }, 200, "linear");
            $('#comentid').html(idregistro);

            //SE OBTIENE LA INFO
            getComment(idregistro);

            $('#btn_comentarioagenda').click(function(e){
                var comentario = $('#comentarioagenda').val();
                var idregistro = $('#comentid').html();
                setComment(idregistro,comentario);
                
                $('#comentarioagenda').val('');
                $(this).prop('disabled',true);
                e.stopImmediatePropagation();
                e.preventDefault();
            });

            //-------------VALIDACION TEXTAREA------------------
            $('#comentarioagenda').keyup(function(){
                var texto = $(this).val();
                if(texto.length < 250){
                    $('#btn_comentarioagenda').prop('disabled',false);
                }else if(texto == ''){
                    $('#btn_comentarioagenda').prop('disabled', true);
                }else{
                    alert('Limite de longitud son 250 caracteres. Cantidad actual: ' + texto.length);
                    $('#btn_comentarioagenda').prop('disabled', true);
                }
            });

            //-------------FIN VALIDACION TEXTAREA---------------

            //click a cerrar:
            $('#close_modalobservacion').click(function (e) {
                close_modalhelper();
                e.stopImmediatePropagation();
                e.preventDefault();
            });
            e.stopImmediatePropagation();
            e.preventDefault();
        });

        //AL CLICKEAR ICONO DE PALOMITA Y FINALIZADO
        $('#finalizado' + idregistro).click(function (e) {
            setStatusFromTelcel(idregistro, 'activa');
            e.stopImmediatePropagation();
            e.preventDefault();
        });

        //AL CLICKEAR A LA CRUZ DE NO FINALIZADO SE ABRE MODAL
        $('#nofinalizado' + idregistro).click(function (e) {
            $('#dynamictitle_modalrechazo').html("MOTIVO DE ACTIVACION INCONCLUSA ID " + idregistro);
            $('#overlay_analista').css('display', 'block');
            $('#modalRechazo').css('display', 'block');
            $('#modalRechazo').animate({ right: 0 }, 200, "linear");
            $('#dynamictitle_modalrechazo').data('modalhelper', idregistro);
            $('#dynamictitle_modalrechazo').data('modalstatus', 'no finalizada');

            $('#btn_submit_motivorechazo').click(function (e) {
                var registro = $('#dynamictitle_modalrechazo').data('modalhelper');
                var status = $('#dynamictitle_modalrechazo').data('modalstatus');
                var motivo = $('#motivoderechazo').val();
                justifyrejectorcorrection(registro, motivo, status);
                close_modalhelper();
                e.stopImmediatePropagation();
                e.preventDefault();
            });

            $('#motivoderechazo').keyup(function () {
                var motivo = $('#motivoderechazo').val();
                if (motivo.length != 0) {
                    $('#btn_submit_motivorechazo').prop('disabled', false);
                } else {
                    $('#btn_submit_motivorechazo').prop('disabled', true);
                }
            });

            //setStatusFromTelcel(idregistro, 'rechazada');
            //para cerrar el modal_helper
            $('#close_modalrechazo').click(function (e) {
                close_modalhelper();
                e.stopImmediatePropagation();
                e.preventDefault();
            });

            e.stopImmediatePropagation();
            e.preventDefault();
        });

        //POPOVER DE AGENDA ---------------------------------------------------------------------------------
        var titulo_popover = "Agendar en captura " + idregistro;
        $('#trigger-click-agenda' + idregistro).popover({ title: titulo_popover, content: "<div class='content-popover'>Día y hora:  <input class='datetimepicker' id='date"+idregistro+"'type='text'> CAC: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <input id='cac"+idregistro+"' type='text'> <button disabled id='btn-agendar"+idregistro+"' class='btn btn-default'>Agendar <img class='buttons-events' src='../assets/calendario.png'></button></div>", placement: "bottom", html: true});
        
        // DATETIME PICKER --------------------------
        $('.datetimepicker').datetimepicker({
            format: 'Y/m/d H:m:s',
            validateOnBlur: false
        });
        // DATETIME PICKER ----------------------------
        
        //validando si los campos estan vacios al keyup para habilitar el boton de submit
        $('#cac' + idregistro + ', #date'+ idregistro).keyup(function(){
            var valordate = $('#date'+idregistro).val();
            var valorcac = $('#cac'+idregistro).val();
            // old var regexdate = /^([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(\d{4})(\s)([0-1][0-9]|2[0-3])(:)([0-5][0-9])$/;
            var regexdate = /^(\d{4})(\/)(0[1-9]|1[0-2])\2([0-2][0-9]|3[0-1])(\s)([0-1][0-9]|2[0-3])(:)([0-5][0-9])(:)([0-5][0-9])$/;
            var regexcac = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s\d]{1,20}$/;
            if(valordate.match(regexdate) && valorcac.match(regexcac)){
                $('#btn-agendar' + idregistro).prop('disabled',false);
            }else{
                $('#btn-agendar' + idregistro).prop('disabled', true);
            }
        });

        $('#btn-agendar' + idregistro).click(function (e) {
            var fecha = $('#date' + idregistro).val();
            var cac = $('#cac' + idregistro).val();
            setScheduleForRequest(fecha,cac,idregistro);
            e.stopImmediatePropagation();
            e.preventDefault();
        });
        //----------------------------------------------------------------------------------------------------
        // POPOVER DE EDICION DE FOLIO-------------------------------------------------------------------------

        var titulo_popover = "Editar SISACT de captura " + idregistro;
        $('#sisact' + idregistro).popover({ title: titulo_popover, content: "<div class='content-popover'>SISACT:  <input id='sisactfield" + idregistro + "'type='text'><button disabled id='btn-sisact" + idregistro + "' class='btn btn-default'>Actualizar</button></div>", placement: "bottom", html: true });


        //validando si los campos estan vacios al keyup para habilitar el boton de submit
        $('#sisactfield' + idregistro).keyup(function () {
            var valorsisact = $('#sisactfield' + idregistro).val();
            // old var regexdate = /^([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(\d{4})(\s)([0-1][0-9]|2[0-3])(:)([0-5][0-9])$/;
            var regexsisact = /^[\d\w]{1,15}$/;
            if (valorsisact.match(regexsisact)) {
                $('#btn-sisact' + idregistro).prop('disabled', false);
            } else {
                $('#btn-sisact' + idregistro).prop('disabled', true);
            }
        });

        $('#btn-sisact' + idregistro).click(function (e) {
            var folio = $('#sisactfield' + idregistro).val();
            setSisactCanal(idregistro, folio, 'sisact'); //funcion en analista_ajax.js

            e.stopImmediatePropagation();
            e.preventDefault();
        });

        //--------------- CANAL ----------------------------//

        var titulo_popover = "Editar CANAL de captura " + idregistro;
        $('#canal' + idregistro).popover({ title: titulo_popover, content: "<div class='content-popover'>CANAL:  <input id='canalfield" + idregistro + "'type='text'><button disabled id='btn-canal" + idregistro + "' class='btn btn-default'>Actualizar</button></div>", placement: "bottom", html: true });


        //validando si los campos estan vacios al keyup para habilitar el boton de submit
        $('#canalfield' + idregistro).keyup(function () {
            var valorcanal = $('#canalfield' + idregistro).val();
            // old var regexdate = /^([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(\d{4})(\s)([0-1][0-9]|2[0-3])(:)([0-5][0-9])$/;
            var regexcanal = /^[\d\w]{1,15}$/;
            if (valorcanal.match(regexcanal)) {
                $('#btn-canal' + idregistro).prop('disabled', false);
            } else {
                $('#btn-canal' + idregistro).prop('disabled', true);
            }
        });

        $('#btn-canal' + idregistro).click(function (e) {
            var folio = $('#canalfield' + idregistro).val();
            setSisactCanal(idregistro, folio, 'canal'); //funcion en analista_ajax.js

            e.stopImmediatePropagation();
            e.preventDefault();
        });

        //FIN DE POPOVER----------------------------------------------------------------------------------------------
        
    });

    tbody_aceptadas.on('mouseleave', '.analistaagendarow', function () {
        var idregistro = $(this).data('idregistro');
        $('#button-aceptadas-' + idregistro).css('visibility', 'hidden');
    });



    //Seccion de correciones --------------------------------------------------------------

    var tbody_correcciones = $('#tbody_correcciones');

    tbody_correcciones.on('click', '.correccionesrow', function () {
        var idregistro = $(this).data('idregistro');

        //si ya esta asignado entonces:
        $('#verrequest' + idregistro).click(function (e) {
            $('#side-panel2').css('display', 'block');
            $('#side-panel2').animate({ right: 0 }, 200, "linear");
            showdata2(idregistro);
            e.stopImmediatePropagation();
            e.preventDefault();
        });

        //para asignar y ver
        $('#asignto' + idregistro).css('visibility', 'visible');
        $('#asignto' + idregistro).click(function (e) {
            $('#side-panel2').css('display', 'block');
            $('#side-panel2').animate({ right: 0 }, 200, "linear");
            fillsidepanel2(idregistro);
            
            e.stopImmediatePropagation();
            e.preventDefault();
        });

        //toggle para cerrar el side-panel
        $('#close-sidepanel2').click(function () {
            $('#side-panel2').animate({ right: -2000 }, 100, "linear");
            $('#side-panel2').css('display', 'none');
        });
    });

    tbody_correcciones.on('mouseleave', '.correccionesrow', function () {
        var idregistro = $(this).data('idregistro');
        $('#asignto' + idregistro).css('visibility', 'hidden');
    });

    //picklist de captura
    formaccepted2 = $('#formaccepted2');
    formcorrected2 = $('#formcorrected2');
    formrejected2 = $('#formrejected2');

    //condicional para mostrar y ocultar forms de capturas
    $('#select_estatuscaptura2').change(function () {
        var value_selected2 = $(this).val();
        if (value_selected2 == 'capturada') {
            formcorrected2.css('display', 'none');
            formrejected2.css('display', 'none');
            formaccepted2.css('display', 'block');
        } else if (value_selected2 == 'corregir') {
            formaccepted2.css('display', 'none');
            formrejected2.css('display', 'none');
            formcorrected2.css('display', 'block');
        } else if (value_selected2 == 'rechazada') {
            formaccepted2.css('display', 'none');
            formcorrected2.css('display', 'none');
            formrejected2.css('display', 'block');
        }
    });

    //regex para validacion de campos de texto del sidepanel.
    //habilitar el boton siempre y cuando no se pase del rango
    $('#sisactfield2, #canalfield2').keyup(function () {
        var longsisact2 = $('#sisactfield2').val();
        var longcanal2 = $('#canalfield2').val();
        var regex2 = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s\d]{1,15}$/;
        if (longsisact2.match(regex2) && longcanal2.match(regex2)) {
            $('#btn_guardarsisact2').prop('disabled', false);
        } else {
            $('#btn_guardarsisact2').prop('disabled', true);
        }
    });

    $('#observacionescorreccion2, #observacionesrechazo2').keyup(function () {
        var longobservacionescorreccion2 = $('#observacionescorreccion2').val();
        var longobservacionesrechazo2 = $('#observacionesrechazo2').val();
        var regex2 = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s\d]{1,200}$/;

        //form de correccion
        if (longobservacionescorreccion2.match(regex2)) {
            $('#btn_guardarcorreccion2').prop('disabled', false);
        } else {
            $('#btn_guardarcorreccion2').prop('disabled', true);
        }

        //form de rechazo
        if (longobservacionesrechazo2.match(regex2)) {
            $('#btn_guardarrechazo2').prop('disabled', false);
        } else {
            $('#btn_guardarrechazo2').prop('disabled', true);
        }
    });


    
    
});
