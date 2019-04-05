$(document).ready(function(){
    
    $('#dashboard').click(function(){
        $('#statusbardashboard, #containersectiondashboard').css('display','flex');
        $('#statusbartablaasesores, #containersectiontablaasesores').css('display', 'none');
        $('#statusbaredituser, #contentsectionedituser').css('display', 'none');
        $('#statusbarconfig, #contentsectionconfig').css('display', 'none');
    });

    $('#usuarios').click(function () {
        $('#statusbardashboard, #containersectiondashboard').css('display', 'none');
        $('#statusbartablaasesores, #containersectiontablaasesores').css('display', 'flex');
        $('#statusbaredituser, #contentsectionedituser').css('display', 'none');
        $('#statusbarconfig, #contentsectionconfig').css('display', 'none');
    });

    $('#capturas').click(function () {
        $('#statusbardashboard, #containersectiondashboard').css('display', 'none');
        $('#statusbartablaasesores, #containersectiontablaasesores').css('display', 'none');
        $('#statusbaredituser, #contentsectionedituser').css('display', 'none');
        $('#statusbarconfig, #contentsectionconfig').css('display', 'flex');
        
        //SE RELLENA EL SELECT PARA REASIGNACION 
        $.post('/selectusers', function (response) {
            var table_body = [];
            var table_body = "<option value='default' selected disabled>SELECIONAR NUEVO PROPIETARIO</option>";
            for (i = 0; i < response.length; i++) {
                table_body += "<option value ='" + response[i]["iduser"] + "'>";
                table_body += response[i]["asesor"];
                table_body += "</option>";
            }
            $('#selectmodalreasignar').html(table_body);
            $('#selectmodalreasignar').trigger('change');
        });

    });
});