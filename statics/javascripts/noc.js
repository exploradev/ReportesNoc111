
$(document).ready(function () {

    //al tener abierto algun modal lo cierro con esc
    $(window).keyup(function (e) {
        if (e.keyCode === 27) $('.closebuttonn').trigger('click');
    });

    $('#input_buscador').keyup(function (e) {
        if (e.keyCode === 13) $('#btn_buscador').trigger('click');
    });
    //CLICK EN BOTONES DE CIERRES DE MODAL
    $('.closebuttonn').click(function () {
        
        $('#asesor_modal_detallesdecaptura').css('display', 'none');
        $('#overlay-back').css('display', 'none');
        $('body').removeClass('modal-open');
        //reset_all();
    });



});