$(document).ready(function () {

    //CONTROL DE VENTANAS
    $(window).keyup(function (e) {
        if (e.keyCode === 27) $('.closebuttonn').trigger('click');
    });

    //CLICK EN BOTONES DE CIERRES DE MODAL
    $('.closebuttonn').click(function () {
        $('#coordinador_modaledicionusuarios').css('display', 'none');
        $('#overlay-back').css('display', 'none');
        $('body').removeClass('modal-open');
        //reset_form_users();
    });

    //desploega panel de inputs para alta de usuarios
    $('#opciones_tabla').click(function(){
        $('#altausuario_container').toggle();    
    });


    $("#showpassword").click(function(){
        if ($('#actualizar_password').attr('psswd-shown') == 'false') {

            $('#actualizar_password').removeAttr('type');
            $('#actualizar_password').attr('type', 'text');

            $('#actualizar_password').removeAttr('psswd-shown');
            $('#actualizar_password').attr('psswd-shown', 'true');

            

        } else {

            $('#actualizar_password').removeAttr('type');
            $('#actualizar_password').attr('type', 'password');

            $('#actualizar_password').removeAttr('psswd-shown');
            $('#actualizar_password').attr('psswd-shown', 'false');

            

        }
    });
    
});