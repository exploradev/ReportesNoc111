$(document).ready(function(){
    var capturanormal = $('.btn-capturas');
    var capturadomicilio = $('.btn-domicilio');


    capturanormal.on('click',function(){
        showSection(secciondatospersonales, datospersonales);
    });

    capturadomicilio.on('click', function () {
        showSection2(secciondatosentrega, datosparaentrega);
    });

    //trigger buttons
    var datosdelplan = $('#datosdelplan');
    var datospersonales = $('#datospersonales');
    var domiciliocliente = $('#domiciliocliente'); 
    var datoslaborales = $('#datoslaborales');
    var referencias = $('#referenciasbtn');
    var confirmarcaptura = $('#confirmarcaptura'); 

    //trigger buttons de modal de entrega a domicilio-------
    var datosparaentrega = $('#datosparaentrega');
    var datosdeltramite = $('#datosdeltramite');
    var confirmarprospecto = $('#confirmarprospecto');
  

    //sections modal
    var secciondatosdelplan = $('#secciondatosdelplan');
    var secciondatospersonales = $('#secciondatospersonales');
    var secciondomiciliocliente = $('#secciondomiciliocliente');
    var secciondatoslaborales = $('#secciondatoslaborales');
    var seccionreferencias = $('#seccionreferencias');
    var seccionconfirmarcaptura = $('#seccionconfirmarcaptura');

    //sections modal de entrega a domicilio ---------------------
    //sections modal
    var secciondatosentrega = $('#secciondatosentrega');
    var secciondatostramite = $('#secciondatostramite');
    var seccionconfirmarprospecto = $('#seccionconfirmarprospecto');
   

    //eventhandlers
    datosdelplan.on('click', function () {
        showSection(secciondatosdelplan, datosdelplan); 
    });
    datospersonales.on('click', function () {
        showSection(secciondatospersonales, datospersonales);
    });
    domiciliocliente.on('click', function () {
        showSection(secciondomiciliocliente, domiciliocliente);
    });
    datoslaborales.on('click', function () {
        showSection(secciondatoslaborales, datoslaborales);
    });
    referencias.on('click', function () {
        showSection(seccionreferencias, referencias);
    });
    confirmarcaptura.on('click', function () {
        showSection(seccionconfirmarcaptura, confirmarcaptura);
    });

    //eventhandlers de modal domicilio -----------------------
    datosparaentrega.on('click', function () {
        showSection2(secciondatosentrega, datosparaentrega);
    });
    datosdeltramite.on('click', function () {
        showSection2(secciondatostramite, datosdeltramite);
    });
    confirmarprospecto.on('click', function () {
        showSection2(seccionconfirmarprospecto, confirmarprospecto);
    });
 

    function showSection(section,linktab){
        secciondatosdelplan.css("display", "none");
        datosdelplan.removeClass("linktabactive");
        secciondatospersonales.css("display", "none");
        datospersonales.removeClass("linktabactive");
        secciondomiciliocliente.css("display", "none"); 
        domiciliocliente.removeClass("linktabactive");
        secciondatoslaborales.css("display", "none");
        datoslaborales.removeClass("linktabactive"); 
        seccionreferencias.css("display", "none");
        referencias.removeClass("linktabactive"); 
        seccionconfirmarcaptura.css("display", "none");
        confirmarcaptura.removeClass("linktabactive"); 

        section.css("display","block");
        linktab.addClass("linktabactive");
    }


    //funcion para el modal 2 de entrega a domicilio
    function showSection2(section, linktab) {
        secciondatosentrega.css("display", "none");
        datosparaentrega.removeClass("linktabactive");
        secciondatostramite.css("display", "none");
        datosdeltramite.removeClass("linktabactive");
        seccionconfirmarprospecto.css("display", "none");
        confirmarprospecto.removeClass("linktabactive");

        section.css("display", "block");
        linktab.addClass("linktabactive");
    }

    //condicional DATOS DEL PLAN RADIOBUTTONS
    var migrar = $('#numeromigracion');
    var lineanueva = $('#numerolineanueva');
    var numeromsr = $('#numeromsr');
    var condnumamigrar = $('#condnumamigrar');

    migrar.on('click', function(){
        condnumamigrar.css("display","block");
        $('#numeroamigrar').addClass('mandatory').val("");
        $('#conf_numamigrar').html("");
    });

    lineanueva.on('click',function(){
        condnumamigrar.css("display","none");
        $('#numeroamigrar').removeClass('mandatory').val("lineanueva");
        $("input[name='numamigrar']").closest('div').removeClass('has-success').removeClass('has-error');
        $('#conf_numamigrar').html("Linea Nueva");
        
    });

    numeromsr.on('click', function () {
        condnumamigrar.css("display", "none");
        $('#numeroamigrar').removeClass('mandatory').val("msr");
        $("input[name='numamigrar']").closest('div').removeClass('has-success').removeClass('has-error');
        $('#conf_numamigrar').html("MSR");

    });

    


    

    //auxiliares
    //capturanormal.trigger("click");

    //botones navegacion
   /*function navigatetabs(event){
       tecla = String.fromCharCode(event.which)

       switch (tecla) {
           case "1":
               datospersonales.trigger('click');
               break;
           case "2":
               datosdelplan.trigger('click');
               break;
           case "3":
               domiciliocliente.trigger('click');
               break;
           case "4":
               datoslaborales.trigger('click');
               break;
           case "5":
               referencias.trigger('click');
               break;
           case "6":
               confirmarcaptura.trigger('click');
               break;

           default:
               break;
       }
    }

    $("input").focusout(function () {
        $('html').bind('keypress', navigatetabs);
    });

    $("input").focusin(function () {
        $('html').unbind('keypress', navigatetabs);
    });
    */
    


});