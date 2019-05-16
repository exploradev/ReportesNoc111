var reload_everything;
$(document).ready(function(){
    
    var reload_supervision;
    $(document).ready(function () {

        //-----------------------------------------------------------------------
        //-------------------------------WEBSOCKETS------------------------------
        //-----------------------------------------------------------------------
        socket = io.connect('http://192.168.3.62:2264');
        //var socket = io.connect('http://localhost:2264');
        
        socket.on('new', function (msg) {
            console.log("Socket: " + msg);
            
            if (msg == "nueva_captura_super" || msg =="nuevo_seguimiento_super"){
                reload_supervision();
            }
            
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

           
            $('#overlay-back').css('display', 'none');
            $('body').removeClass('modal-open');
            //reset_all();
        });

        ////////////////////////////////////////

        reload_supervision = function(){
            //reload supervision
            getTablePreview();
            
        }
        /////////////////////////////////////////



    });
});