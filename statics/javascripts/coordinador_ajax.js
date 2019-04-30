var load_users;
$(document).ready(function(){
    //descomentar antes de pruebas finales y puesta en produccion
    $('#show_dashboard').trigger('click');


    //CONTROL DE ALTA Y ACTUALIZACIONES ---------------------------
    $('#btn_nuevouser').click(function(){
        var conteo_inputs = 0;
        $('.form_altauser').each(function () {
            //cuento cuantos inputs hay 
            conteo_inputs++;
        });

        var no_vacios = 0
        $('.form_altauser').each(function () {
            //conteo de cuantos campos llenos
            var value = $(this).val();
            if (value != ""){
                no_vacios++;   
            }
        });

        //si los campos existentes son igual a los llenos entonces procedo
        if(conteo_inputs == no_vacios){
            respuestas = [];

            $('.form_altauser').each(function () {
                //conteo de cuantos campos llenos
                var value = $(this).val();
                respuestas.push(value);
            });
            $.post('/guardar_nuevousuario',{
                nombre: respuestas[0],
                username: respuestas[1],
                password: md5(respuestas[2]),
                rol: respuestas[3],
                turno: respuestas[4],
                estatus: respuestas[5]
            },function(response){
                if(response=="Correcto"){
                    $('input[type=text].form_altauser, input[type=password].form_altauser').val("").trigger('change');
                    load_users();
                    alert("Agregado correctamente");
                }else{
                    alert("ERROR: "+response['sqlMessage']);
                }
            });
            

        }else{
            alert("Llenar todos los campos");
        }


    });

    //despliega inputs de edicion al click
    $('#tbody_maintable_users').on('click', '.row_usuarios', function () {
        var iduser = $(this).data('iduser');
        $('#overlay-back').css('display', 'block');
        $('body').addClass('modal-open');
        $("#coordinador_modaledicionusuarios").slideDown('slow');

        $.post('/getSingleUser',{
            iduser:iduser
        },function(response){

                $("#actualizar_iduser_u").html(response[0]['iduser']);
                $("#actualizar_nombre").val(response[0]['nombre']);
                $("#actualizar_username").val(response[0]['username']);
                
                $("#actualizar_rol").val(response[0]['rol']).trigger('change');
                $("#actualizar_turno").val(response[0]['turno']).trigger('change');
                $("#actualizar_estatus").val(response[0]['estatus']).trigger('change');
                
        });
    });

    $('#btn_actualizaruser').click(function(){
        var conteo_inputs = 0;
        $('.form_actualizaruser').each(function () {
            //cuento cuantos inputs hay 
            conteo_inputs++;
        });

        var no_vacios = 0
        $('.form_actualizaruser').each(function () {
            //conteo de cuantos campos llenos
            var value = $(this).val();
            if (value != "") {
                no_vacios++;
            }
        });

        
        //si los campos existentes son igual a los llenos entonces procedo
        if (conteo_inputs == no_vacios && conteo_inputs != 0) {
            var iduser = $("#actualizar_iduser_u").html();
            var nombre = $("#actualizar_nombre").val();
            var username = $("#actualizar_username").val();
            var password = $("#actualizar_password").val();
            if(password == ""){password="sincambios";}else{password=md5(password);}
            
            var rol = $("#actualizar_rol").val();
            var turno = $("#actualizar_turno").val();
            var estatus = $("#actualizar_estatus").val();
            

            $.post('/actualizar_usuario', {
                iduser: iduser,
                nombre: nombre,
                username: username,
                password: password,
                rol: rol,
                turno: turno,
                estatus: estatus
            }, function (response) {
                if (response == "Correcto") {
                    $('input[type=text].form_altauser, input[type=password].form_altauser').val("").trigger('change');
                    $("#actualizar_password").val("");
                    load_users();
                    alert("Actualizado correctamente");
                } else {
                    alert("ERROR: " + response['sqlMessage']);
                }
            });


        } else {
            alert("Llenar todos los campos obligatorios (*)");
        }

    });

    //FIN DE CONTROL DE ALTA Y ACTUALIZACIONES --------------------

    //AJAX PARA GENERAR LAS LISTAS DE USUARIOS -------------------------------------
    
    load_users = function(){
        $.post('/get_userlist',function(response){
            var table_body = [];
            for (i = 0; i < response.length; i++) {
                table_body += "<tr id='row" + response[i]["iduser"] + "' class='row_usuarios' data-iduser='" + response[i]["iduser"] + "'>";

                table_body += '<td>';
                table_body += response[i]["iduser"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["nombre"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["username"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += moment(response[i]["creado"]).format('DD/MM/YYYY HH:mm');
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["rol"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["turno"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["estatus"];
                table_body += '</td>';

                if(response[i]["ultimologin"]==null){
                    table_body += '<td>';
                    table_body += "Usuario nuevo";
                    table_body += '</td>';
                }else{
                    table_body += '<td>';
                    table_body += moment(response[i]["ultimologin"]).format('DD/MM/YYYY HH:mm');
                    table_body += '</td>';
                }
                

                

                table_body += '</tr>';

                //------------------------------------------------------


            }
            $('#tbody_maintable_users').html(table_body);
        });

        
    }

    load_users();

});