
$(document).ready(function () {

//-----------------------------------------------------------------------
//-------------------------------WEBSOCKETS------------------------------
//-----------------------------------------------------------------------
    socket = io.connect('http://'+location.host);

    socket.on('default_handshake', function (msg) {
        //REPORTE A SERVER AL CARGAR
        idasesor = $("body").data('iduser');
        sockid = socket.id;
        socket.emit('reportealista', { idasesor: idasesor, sockid: sockid });
    });

    socket.on('new',function(msg){
        console.log("Socket: " + msg);
        //reload_conteos
        var mios = $("input[name=mios]:checked").val();
        if (mios == 'show') {
            llenar_conteos_propios();
        } else {
            llenar_conteos_todos();
        }
        //reload tabla actual trtgger click de panel abierto
        var panelabierto = $('#tiporeporte_header').attr("data-filterclick");
        $('.clickable_filter[data-filter="' + panelabierto + '"]').trigger('click');
        llenarContadoresSuperiores();
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
        $('#folio_bit').val("");
        $('#folio_cpd').val("");
        $('#folio_usd').val("");
        $('#folio_reporsis').val("");
        $('#overlay-back').css('display', 'none');
        $('body').removeClass('modal-open');
        //reset_all();
    });



});