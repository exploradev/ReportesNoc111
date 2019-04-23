
$(document).ready(function () {

//-----------------------------------------------------------------------
//-------------------------------WEBSOCKETS------------------------------
//-----------------------------------------------------------------------
    socket = io.connect('http://localhost:2264');

    socket.on('default_handshake', function (msg) {
        //REPORTE A SERVER AL CARGAR
        idasesor = $("body").data('iduser');
        sockid = socket.id;
        socket.emit('reportealista', { idasesor: idasesor, sockid: sockid });
    });
//-----------------------------------------------------------------------
//-------------------------------WEBSOCKETS------------------------------
//-----------------------------------------------------------------------


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