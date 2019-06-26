var setMetadataForBigTable;
$(document).ready(function () {



    

    //CONTROL DEL MENU LATERAL PARA MOSTRAR SUBMENU
    $('.menu_item').click(function(){
        $('.submenu_item').slideUp('slow');
        $(this).next('.submenu_item').slideDown('fast');
    });

    $('#titulo_menu').click(function () {
        $('.submenu_item').slideUp('slow');
    });

    //CAMBIO DE TITULO  A LA TABLA AL CLICKEAR CADA MENU
    $("#countergroup").click(function () {
        $("#tiporeporte_header").html("TODAS LAS FALLAS");
    });

    //CAMBIA TITULO A LA TABLA GRANDE Y LE AGREGA UN FILTER PARA FUTUROS RELOADS
    setMetadataForBigTable = function(titulo,filterclick){
        $("#tiporeporte_header").html(titulo);
        $("#tiporeporte_header").attr('data-filterclick',filterclick);
    }

    //HELPER PARA SELECT2
    $('#estatus_seguimiento_nuevo').select2({
        dropdownParent: $("#form_seguimiento"),
        placeholder: "ELEGIR ESTATUS",
        allowClear: false
    });

    $('#estatus_seguimiento_solucionado').select2({
        dropdownParent: $("#form_seguimiento"),
        placeholder: "ELEGIR ESTATUS",
        allowClear: false
    });


    $('#codificacion_noc').select2({
        dropdownParent: $(".container_modal"),
        placeholder: "ELEGIR TIPIFICACIÓN",
        allowClear: false
    });

    //BUSQUEDA SEARCHBOX
    //BUSQUEDA DE CAPTURAS EN TABLAS AL HACER KEYUP
    $('#main_searchbox').keyup(function () {
        var filterBy = this;
        $.each($('.rowdetallesdisponibles'), function (i, val) {
            if ($(val).text().toLowerCase().indexOf($(filterBy).val().toLowerCase()) == -1) {
                $('.rowdetallesdisponibles').eq(i).hide();
            } else {
                $('.rowdetallesdisponibles').eq(i).show();
            }
        });
    });

    //AL CLICKEAR CLOSEBUTTON DE COORDINADOR
    $('.closebuttonn').click(function(){
        $('#codificacion_noc').val();
    });

    
});