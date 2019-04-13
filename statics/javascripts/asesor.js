$(document).ready(function(){
    
    //al tener abierto algun modal lo cierro con esc
    $(window).keyup(function (e) {
        if (e.keyCode === 27) $('.closebuttonn').trigger('click');
    });

   
    
    $('#btn_nuevoreporte').click(function(){
        $('#asesor_modal_seleccionartiporeporte').css('display','block');
        $('#overlay-back').css('display', 'block');
    });

    $('.closebuttonn').click(function () {
        $('#asesor_modal_seleccionartiporeporte').css('display', 'none');
        $('#asesor_modal_formularios').css('display', 'none');
        $('#overlay-back').css('display', 'none');
    });


    
});