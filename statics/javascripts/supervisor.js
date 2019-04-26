var reload_everything;
$(document).ready(function(){
    

    $(document).ready(function () {

        //-----------------------------------------------------------------------
        //-------------------------------WEBSOCKETS------------------------------
        //-----------------------------------------------------------------------
        socket = io.connect('http://192.168.3.62:2264');

        
        socket.on('new', function (msg) {
            console.log("Socket: " + msg);
            
            reload_everything();
        });
        //-----------------------------------------------------------------------
        //-------------------------------WEBSOCKETS------------------------------
        //-----------------------------------------------------------------------


        //al tener abierto algun modal lo cierro con esc
        $(window).keyup(function (e) {
            if (e.keyCode === 27) $('.closebuttonn').trigger('click');
        });

        
        //CLICK EN BOTONES DE CIERRES DE MODAL
        $('.closebuttonn').click(function () {

            $('#asesor_modal_detallesdecaptura').css('display', 'none');
            $('#overlay-back').css('display', 'none');
            $('body').removeClass('modal-open');
            //reset_all();
        });

        ////////////////////////////////////////

        reload_everything = function(){

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

            //reload dashboard
            reload_all();
        }
        /////////////////////////////////////////



    });
});