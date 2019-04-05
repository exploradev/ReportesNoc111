var getUserData, buscarusuario, userInsertUpdate, validateDuplicatedUsername, getdatamodal, deleterequest, reasignrequest, setNewDataPlan, insertnewplan, generateglobalreport;
$(document).ready(function(){


    //-----------------------------------------------------------------------
    //-------------------------------WEBSOCKETS------------------------------
    //-----------------------------------------------------------------------


    var socket = io.connect('http://192.168.3.62');
    //var socket = io.connect('http://10.162.45.20:4040');
    //var socket = io.connect('http://localhost:4040');

    socket.on('refreshalldivs', function (msg) {
        console.log('Actualizando divs');
        //activacionesDiarias();
        //capturasDiarias();
        //feedCounterBoxes();
        //feedLiveStatistics();
        //feedProductivity();
    });

    socket.on('capturaactivada', function (msg) {
        activacionesDiarias();
        feedCounterBoxes();
        feedLiveStatistics();
        feedProductivity();
    });

    socket.on('nuevacapturaoasignacion', function (msg) {
        capturasDiarias();
        feedCounterBoxes();
        feedLiveStatistics();
        feedProductivity();
    });

    //-----------------------------------------------------------------------
    //-------------------------------WEBSOCKETS------------------------------
    //-----------------------------------------------------------------------
    
    //GET DATA USUARIO PARA EL PANEL DE DETALLES
    getUserData = function(userid){
        $.post('/getuserdata',{userid: userid},function(response){

            $('#formfield_left').attr('data-userid', response[0]['userid']);
            $('#edit_nombres').val(response[0]['name']);
            $('#edit_apellidos').val(response[0]['lastname']);
            $('#edit_username').val(response[0]['username']);
            $('#edit_rol').val(response[0]['idrol']).trigger('change');
            $('#edit_campania').val(response[0]['idcampaign']).trigger('change');
            $('#edit_turno').val(response[0]['shift']).trigger('change');
            $('#edit_estatus').val(response[0]['active']).trigger('change');

            //control extra de los campos
            $('.manualstyle_input').trigger('keyup');
            
        });
    }

    buscarusuario = function(busqueda, busquedapor){
        $.post('/busquedausuarios', {busqueda: busqueda, buscarpor: busquedapor }, function (response) {

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

                table_body += '</tr>';
            }
            $('#tbody_users').html(table_body);

        });
        //alert(busqueda + busquedapor);
    }

    //INSERT O UPDATE DE USUARIOS NUEVOS

    userInsertUpdate = function(){
        //capturando valores de los campos

        var action;
        var userid = $('#formfield_left').attr('data-userid');
        var edit_nombres = $('#edit_nombres').val();
        var edit_apellidos = $('#edit_apellidos').val();
        var edit_username = $('#edit_username').val();
        var edit_password = $('#edit_password').val();
        var edit_rol = $('#edit_rol').val();
        var edit_campania = $('#edit_campania').val();
        var edit_turno = $('#edit_turno').val();
        var edit_estatus = $('#edit_estatus').val();
        

        //si el campo esta vacio se declara como null
        if ((edit_nombres == undefined) || (edit_nombres == '')) { edit_nombres = null; }
        if (edit_apellidos == undefined || (edit_apellidos == '')) { edit_apellidos = null; }
        if (edit_username == undefined || (edit_username == '')) { edit_username = null; }
        if (edit_password == undefined || (edit_password == '')) { edit_password = null; }
        if (edit_rol == undefined || (edit_rol == '')) { edit_rol = null; }
        if (edit_campania == undefined || (edit_campania == '')) { edit_campania = null; }
        if (edit_turno == undefined || (edit_turno == '')) { edit_turno = null; }
        if (edit_estatus == undefined || (edit_estatus == '')) { edit_estatus = null; }

        //se detecta la accion a tomar
        if(userid=='none'){
            action = 'insert';
        }else{
            action = 'update';
        }

        //se detecta si se modifico el campo de password al momento de editar usuario
        if((edit_password != null)&&(edit_password != ' ')){
            edit_password = md5(edit_password);
        }
       
        $.post('/userInsertUpdate',{
            action: action,
            userid: userid,
            edit_nombres: edit_nombres,
            edit_apellidos: edit_apellidos,
            edit_username: edit_username,
            edit_password: edit_password,
            edit_rol: edit_rol,
            edit_campania: edit_campania,
            edit_turno: edit_turno,
            edit_estatus: edit_estatus
        },function(response){
            if (response == 'exito'){
                listausuarios();
                alert('Usuario ingresado o modificado correctamente');
            }else{
                alert('Error al ingresar o editar usuario');
            } 
        });
    } 

    //VALIDACION DE EXISTENCIA DE USERNAME PARA EL ALTA
    validateDuplicatedUsername = function(value){
        $.post('/validateDuplicatedUsername',{value: value}, function(response){
            if(response == 'duplicado'){
                alert('nombre de usuario ya existente');
                $('#edit_username').closest('div').removeClass('has-success');
                $('#edit_username').closest('div').addClass('has-error');
                buttonsforsubmit();
            }else if(response == 'unico'){
                $('#edit_username').closest('div').removeClass('has-error');
                buttonsforsubmit();
            }
        });
    }


    //LA RUTA DE LA SIGUIENTE FUNCION SE ENCUENTRA EN custom_routes_cerrador.js
    getdatamodal = function(idrequest){
        $.post('/getdatamodal',{idrequest:idrequest},function(response){
            $('#idrequestmodalreasignar').html(idrequest);
            $('#nombremodalreasignar').html(response[0]["cliente"]);
            $('#propietariomodalreasignar').html(response[0]["propietario"]);
            $('#sisactmodalreasignar').html(response[0]["sisact"]);
            $('#canalmodalreasignar').html(response[0]["canal"]);
        });
    }

    //CRUD DE CAPTURAS

    deleterequest = function(idrequest){
        $.post('/deleterequest', { idrequest: idrequest }, function (response) {
            if(response == 'deleted'){
                $('#btn_search').trigger('click');
                $('#buscacaptura').trigger('keyup');
                alert('Eliminado correctamente');
                
            }else{
                alert('Ocurrio un error');
            }
            
        });

    }

    reasignrequest = function(idrequest,iduser){
        $.post('/reasignrequest', { idrequest: idrequest, iduser: iduser }, function (response) {
            if (response == 'updated') {
                $('#btn_search').trigger('click');
                $('#buscacaptura').trigger('keyup');
                alert('Reasignado correctamente');
            } else {
                alert('Ocurrio un error');
            }
        });
    }

    //AJAX PARA EDITAR CAMPOS DE LOS PLANES-----------------------------------------------
    setNewDataPlan = function(idrequest,modificacion,atributo){
        $.post('/setnewdataplan',{idrequest:idrequest,modificacion:modificacion,atributo:atributo},function(response){
            if(response=="updated"){
                alert('Actualizacion exitosa');
                listaplanes();

            }else{
                alert('Ocurrio un error');
            }
        });
    }

    insertnewplan = function (name, keyname, term, active) {
        $.post('/insertplan', { name: name, keyname: keyname, term: term, active: active }, function (response) {
            if (response == "updated") {
                alert('Se ingreso correctamente');
                listaplanes();
                $('#nombreplan').val(" ");
                $('#claveplan').val(" ");
                $('#plazoplan').val(" ");
                
            } else {
                alert('Ocurrio un error');
            }
        });
    }


    //AJAX PARA LLENAR LA TABLA DE REPORTE GENERAL
    generateglobalreport = function(fechainicio,fechafin){
        $.post('/generateReport',{fechainicio: fechainicio, fechafin: fechafin},function(response){
            var table_body = [];
            $('#tbody_tablareportegeneral').html('');
            $('#tablareportegeneral').DataTable().destroy();
            
            for (i = 0; i < response.length; i++) {
                table_body += "<tr>";

                table_body += '<td>';
                table_body += response[i]["capturada"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["campania"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["sisact"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["numero"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["migracion"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["ctamobile"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["canal"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["cliente"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["plan"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["plazo"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["vendedor"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["activada"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["status"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["equipo"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["sisactdesdecreacion"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["seguimientodesdesisact"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["activadadesdesisact"];
                table_body += '</td>';


                table_body += '<td>';
                table_body += response[i]["tiempoenactivarglobal"];
                table_body += '</td>';

               
                


                table_body += '</tr>';
            }
            $('#tbody_tablareportegeneral').html(table_body);

            
            $('#tablareportegeneral').DataTable({
                dom: '<Bp>',
                buttons: [
                    'excel'
                ]
            });

            $("select[name='tablareportegeneral_length']").trigger('change');
        });
    }

    
});