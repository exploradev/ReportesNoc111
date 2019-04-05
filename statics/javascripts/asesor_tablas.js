var feedactivadores;
var feedcampanias;
var feedminidash;
var tabla_borradores;
var tabla_capturas;
var tabla_agenda;
var tabla_correcciones;

$(document).ready(function () {


    var selectplan = function(){
        
        //data-clave y data-plazo
        //import select options from ajax 

        $.post('/selectoptions', function (response) {
            //var table_body = [];
            var table_body = '<option></option>';
            for (i = 0; i < response.length; i++) {
                table_body += "<option value ='" + response[i]["idplan"] + "' data-keyname = '" + response[i]["keyname"] + "' data-term = '" + response[i]["term"] + "'>";
                table_body += response[i]["name"];
                table_body += "</option>";
            }
            $('#selectplan').html(table_body);
            $('#dom_plan').html(table_body);
            
        }); 

    }
    
    feedactivadores = function(){
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
            $('#topactivadores').html(table_body);
        });   
    }

    feedcampanias = function(){
        $.post('/feedcampanias', function (response) {
            var table_body = [];
            for (i = 0; i < response.length; i++) {
                table_body += '<tr>';

                table_body += '<td>';
                table_body += response[i]["campaign_name"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["quantity"];
                table_body += '</td>';

                table_body += '</tr>';
            }
            $('#topcampanias').html(table_body);
        });
    }

    feedminidash = function() {
        var userLoggedIn = $('#seccionconfirmarcaptura').data('user');
        $.post('/feedminidash',{
            userLoggedIn: userLoggedIn
        }, function (response) {
            
            var activaciones = response[0]["activaciones"];
            var capturas = response[0]["capturas"];
            var meta = response[0]["meta"];
              
            $('#lineasactivadas').html("<span>"+activaciones+"<span/>");
            $('#cantidadactivas').html(activaciones);
            $('#capturasrealizadas').html("<span>" + capturas + "<span/>");
            $('#meta').html(meta);


            var width_mainbar = 272.266
            //math barra capturas
            var pctj = (capturas*100)/meta;
            var val_capturas = (pctj*width_mainbar)/100;

            //math barra ativas
            pctj = (activaciones * 100) / meta;
            var val_activas = (pctj * width_mainbar) / 100;

            
            //si se pasa de rosca lo limitamos al max width
            if (val_activas > width_mainbar) {
                val_capturas = width_mainbar
            }

            if(val_activas > width_mainbar){
                val_activas = width_mainbar
            }

            $('#capturasbar').css('width', val_capturas);
            $('#activasbar').css('width', val_activas);
            
            
        });
    }

    tabla_capturas = function(){
        var userLoggedIn = $('#seccionconfirmarcaptura').data('user');
        $.post('/tablacapturas', {
            userLoggedIn: userLoggedIn
        }, function (response) {
            var table_body = [];
                var cantidad = response.length;
                $('.cantidadnormales').html(cantidad);
            $('#notification_capturas').html(response.length);
            for (i = 0; i < response.length; i++) {


                table_body += "<tr id='statuscapturas"+ response[i]['idrequest'] +"' class='rows_capturas' data-idrequest='"+response[i]['idrequest']+"'>";

                table_body += '<td>';
                table_body += response[i]["fecha"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["cliente"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["contacto"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["plan"];
                table_body += '</td>';

                //table_body += '<td>';
                //table_body += response[i]["canal"];
                //table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["estatus"];
                table_body += '</td>';

                table_body += '</tr>';
            }
            $('#statuscapturas').html(table_body);


        });
    }

    tabla_borradores = function(){
        var userLoggedIn = $('#seccionconfirmarcaptura').data('user');
        $.post('/tablaborradores', {
            userLoggedIn: userLoggedIn
        }, function (response) {
            var table_body = [];
                
            $('#notification_borradores').html(response.length);
            for (i = 0; i < response.length; i++) {
                table_body += "<tr id='statusborrador" + response[i]['idrequest'] + "' class='rows_borrador' data-idrequest='" + response[i]['idrequest'] + "'>";

                table_body += '<td>';
                table_body += response[i]["fecha"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["cliente"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["contacto"];
                table_body += '</td>';

                table_body += '</tr>';
            }
            $('#statusborrador').html(table_body);
            

        });
    }

    tabla_agenda = function(){
        var userLoggedIn = $('#seccionconfirmarcaptura').data('user');
        $.post('/tablaagenda', {
            userLoggedIn: userLoggedIn
        }, function (response) {
            var table_body = [];

            $('#notification_agendadas').html(response.length);
            for (i = 0; i < response.length; i++) {
                table_body += "<tr id='statusagenda" + response[i]['idrequest'] + "' class='rows_agenda' data-idrequest='" + response[i]['idrequest'] + "'>";

                table_body += '<td>';
                table_body += response[i]["agendado"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["cliente"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["contacto"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["hora"];
                table_body += '</td>';

                table_body += '</tr>';
            }
            $('#statusagenda').html(table_body);


        });
    }

    tabla_correcciones = function(){
        var userLoggedIn = $('#seccionconfirmarcaptura').data('user');
        $.post('/tablacorrecciones', {
            userLoggedIn: userLoggedIn
        }, function (response) {
            var table_body = [];
            var cantidad = response.length;
            $('.cantidadcorrecciones').html(cantidad);
            $('#notification_correcciones').html(response.length);
            for (i = 0; i < response.length; i++) {
                table_body += "<tr id='statuscorrecciones" + response[i]['idrequest'] + "' class='rows_correcciones' data-idrequest='" + response[i]['idrequest'] + "'>";

                table_body += '<td>';
                table_body += response[i]["fecha"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["cliente"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["contacto"];
                table_body += '</td>';

                table_body += '<td>';
                table_body += response[i]["plan"];
                table_body += '</td>';

                if(response[i]["corregido"]==1){
                    table_body += '<td>';
                    table_body += 'reenviado';
                    table_body += '</td>';
                }else{
                    table_body += '<td>';
                    table_body += response[i]["estatus"];
                    table_body += '</td>';
                }
                

                table_body += '</tr>';
            }
            $('#statuscorregir').html(table_body);


        });
    }


    //feeds onload
    feedactivadores();
    feedcampanias();
    feedminidash();
    
    tabla_borradores();
    tabla_capturas();
    tabla_correcciones();
    tabla_agenda();

    selectplan();
});