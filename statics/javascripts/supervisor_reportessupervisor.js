var getTablePreview;
$(document).ready(function () {

    //MOSTRAR MODAL DE DETALLES DE SUPERVISOR CON AJAX
    $('#tbody_maintable_supervisor').on('click','.rowsupervision',function () { 
        var idsupervision = $(this).data('idsupervision');

        //AJAX DE DETALLES DE PERFIL
        $.post('/getDetailsSupervisor',{idsupervision:idsupervision},function(response){
            console.table(response);
            
            for(i=0;i<response.length;i++){
                $("#detalles_supervisor_id").html(response[i]["idsupervision"]);

                $("#detalles_supervisor_asesor").html(response[i]["asesor"]);
                $("#detalles_supervisor_numero").html(response[i]["numero"]);
                $("#detalles_supervisor_asunto").html(response[i]["asunto"]);

                $("#detalles_supervisor_asignado").html(response[i]["propietario"]);
                $("#detalles_supervisor_estatus").html(response[i]["estatus"]);
                $("#detalles_supervisor_creado").html(moment(response[i]["creado"]).format('DD/MM/YYYY HH:mm'));

                $("#detalles_supervisor_contacto").html(response[i]["contacto"]);
                $("#detalles_supervisor_descripcion").html(response[i]["descripcion"]);

                $("#comentario_cierre").html(response[i]["comentario"]);
                
            }
        });

        //DESPLEGAR PANEL
        $('#asesor_modal_detallessupervisor').css('display', 'flex');
        $('#overlay-back').css('display', 'block');
        $('body').addClass('modal-open');


    });

    //validar y enviar id con campos de actualizacion para id actual
    //obtener id
    //primero reviso que el picklist tenga valor
    //validar si el campo del picklist es cerrado 
    //entonces reviso que el campo de comentarios este lleno y envio los mismos campos que los de abajo agregandole el campo de comentarios de cierre
    //sino campturo el id del reporte, el id del asesor procesando, y el estatus nuevo
    $("#btn_actualizarrepsup").click(function () { 
        valselect = $("#estatusrepsuper").val();
        if (valselect != "") {
            if (valselect == "Cerrado") {
                comentarios = $('#textarearepsup').val();
                if (comentarios != "") {
                    //preparo datos de envio con cierre
                    idreporte = $('#detalles_supervisor_id').html();
                    supervisor = $('body').data('iduser');
                    estatus = $('#estatusrepsuper').val();
                    comentarios = $('#textarearepsup').val();

                    $.post("/updateDetailsSupervisor", { idreporte: idreporte, supervisor: supervisor, estatus: estatus, comentarios: comentarios },
                        function (response) {
                            if (response == "Correcto") {
                                alert("Actualizado correctamente");
                                $('.closebuttonn').trigger('click');
                                getTablePreview();
                            } else {
                                alert("Error: " + response)
                            }
                        });

                } else {
                    alert('Ingresar comentarios de cierre')
                }
            }else{
                //preparo datos de envio sin cierre
                idreporte = $('#detalles_supervisor_id').html()
                supervisor = $('body').data('iduser');
                estatus = $('#estatusrepsuper').val();
                comentarios = "";

                $.post("/updateDetailsSupervisor", { idreporte: idreporte, supervisor: supervisor, estatus: estatus, comentarios: comentarios },
                    function (response) {
                        if (response == "Correcto") {
                            alert("Actualizado correctamente");
                            $('.closebuttonn').trigger('click');
                            getTablePreview();
                        } else {
                            alert("Error: " + response)
                        }
                    });
            }
            
        }else{
            alert("Selecciona un estatus nuevo")
        }


    });


    //AL CLICKEAR CLOSEBUTTON DE SUPERVISOR
    $('.closebuttonn').click(function () {
        $('#asesor_modal_detallessupervisor').hide();
        $('#overlay-back').hide();
        $('body').removeClass('modal-open');
        $(".form_element_supervisor").val("").trigger('change');
    });

    //SELECT2 DEL CAMBIO DE ESTATUS
    $('#estatusrepsuper').select2({
        dropdownParent: $("#rightside_footer"),
        placeholder: "ESTATUS",
        allowClear: false
    });

    //EVENTO PARA MOSTRAR TEXTAREA DE COMENTARIO DE CIERRE AL VALUE "CERRADO"
    $("#estatusrepsuper").change(function () { 
        var value = $(this).val();

        if (value=="Cerrado"){
            $("#hideshow_textarea").show();
        }else{
            $("#hideshow_textarea").hide();
        }
    });

    getTablePreview = function(){
        $.get('/getPreviewTableSuper',function(response){
            var table_body = [];
            for (i = 0; i < response.length; i++) {
                table_body += "<tr id='row" + response[i]["idsupervision"] + "' class='rowsupervision' data-idsupervision='" + response[i]["idsupervision"] + "'>";

                table_body += '<td>';
                table_body += moment(response[i]["creado"]).format('DD/MM/YYYY HH:mm');
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["idsupervision"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["asesor"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["numero"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["estatus"];
                table_body += '</td>';

                if (response[i]["cerrado"] == null) {
                    table_body += '<td>';
                    table_body += "N/A"
                    table_body += '</td>';
                } else {
                    table_body += '<td>';
                    table_body += moment(response[i]["cerrado"]).format('DD/MM/YYYY HH:mm');
                    table_body += '</td>';
                }

                if (response[i]["propietario"] == null) {
                    table_body += '<td>';
                    table_body += "N/A"
                    table_body += '</td>';
                } else {
                    table_body += '<td>';
                    table_body += response[i]["propietario"];
                    table_body += '</td>';
                }

                table_body += '</tr>';
            }
            $('#tbody_maintable_supervisor').html(table_body);
        });
    }

    getTablePreview();

    //BUSQUEDA EN TABLA
    $('#main_searchbox_supervisor').keyup(function () {
        var filterBy = this;
        $.each($('.rowsupervision'), function (i, val) {
            if ($(val).text().toLowerCase().indexOf($(filterBy).val().toLowerCase()) == -1) {
                $('.rowsupervision').eq(i).hide();
            } else {
                $('.rowsupervision').eq(i).show();
            }
        });
    });
    
});
