$(document).ready(function(){

    

    //CONTROL DE MODALES Y VENTANAS
    
    //al tener abierto algun modal lo cierro con esc
    $(window).keyup(function (e) {
        if (e.keyCode === 27){
            $('#asesor_modal_seleccionartiporeporte').css('display', 'none');
            $('#asesor_modal_formularios').css('display', 'none');
            $('#asesor_modal_reportesdisponibles').css('display', 'none');
            $('#asesor_modal_detallesdecaptura').css('display', 'none');
            $('#asesor_modal_fallasmasivas').css('display', 'none');
            $('#asesor_modal_reportessupervisor').css('display', 'none');
            $('#modal_checklist').css('display', 'none');

            $('#overlay-back').css('display', 'none');
            $('body').removeClass('modal-open');
            reset_all();
            
        }
    });

    $('#input_buscador').keyup(function (e) {
        if (e.keyCode === 13) $('#btn_buscador').trigger('click');
    });

   
    

    //CLICK EN BOTONES DE NUEVO REPORTE
    $('#btn_nuevoreporte').click(function () {
        $('#asesor_modal_seleccionartiporeporte').css('display', 'block');
        $('#overlay-back').css('display', 'block');
        $('body').addClass('modal-open');
        reset_all();
    });

    //CLICK EN BOTONES DE NUEVO REPORTE
    $('#btn_nuevoreportesupervisor').click(function () {
        $('#asesor_modal_reportessupervisor').css('display', 'block');
        $('#overlay-back').css('display', 'block');
        $('body').addClass('modal-open');
        reset_all();
    });

    //CLICK EN BOTONES DE NUEVO REPORTE
    $('#btn_modalchecklist').click(function () {
        $('#modal_checklist').css('display', 'block');
        $('#overlay-back').css('display', 'block');
        $('body').addClass('modal-open');
    });


    //CLICK EN BOTONES DE CIERRES DE MODAL
    $('.closebuttonn, .btn_cancelarcaptura').click(function () {
        $('#asesor_modal_seleccionartiporeporte').css('display', 'none');
        $('#asesor_modal_formularios').css('display', 'none');
        $('#asesor_modal_reportesdisponibles').css('display', 'none');
        $('#asesor_modal_detallesdecaptura').css('display', 'none');
        $('#asesor_modal_fallasmasivas').css('display', 'none');
        $('#asesor_modal_reportessupervisor').css('display', 'none');

        $('#overlay-back').css('display', 'none');
        $('body').removeClass('modal-open');
        reset_all();
    });

    $('.close_checklist').click(function () {
        $('#modal_checklist').css('display', 'none');
        

        $('#overlay-back').css('display', 'none');
        $('body').removeClass('modal-open');
        
    });

    

    //REGRESO A MODAL ANTERIOR AL CLICKEAR
    $('#regresar_modaldetalles').click(function(){
        $('#asesor_modal_detallesdecaptura').css('display', 'none');
        $('#asesor_modal_reportesdisponibles').css('display', 'block');
    });


    
});