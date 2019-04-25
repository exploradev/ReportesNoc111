
$(document).ready(function () {
    $('#show_dashboard').click(function () {
        $('#menu_lateral, #tabla_principal').hide();
        $('#dashboard').css('display','initial');
        $(".highch").html("<img src='../assets/loader1.gif'>");
        reload_all();
    
        
    });

    $('#show_tablas').click(function () {
        $('#dashboard').hide();
        $('#menu_lateral, #tabla_principal').show();
    });
});

