
$(document).ready(function () {

    //CONTROL DEL MENU LATERAL PARA MOSTRAR SUBMENU
    $('.menu_item').click(function(){
        $('.submenu_item').slideUp('slow');
        $(this).next('.submenu_item').slideDown('fast');
    });

    $('#titulo_menu').click(function () {
        $('.submenu_item').slideUp('slow');
        
    });

    
});