$(document).ready(function () {

    //trigger buttons
    var btnpendientes = $('#btn-pendientes');
    var btnenesperaderespuesta = $('#btn-enesperaderespuesta');
    var btnaceptadas = $('#btn-aceptadas');
    var btncorrecciones = $('#btn-correcciones');
    var btnactivaciones = $('#btn-activaciones');
    

    //sections tables
    var tab_pendientes = $('#tab_pendientes');
    var tab_enespera = $('#tab_enespera');
    var tab_aceptadas = $('#tab_aceptadas');
    var tab_correcciones = $('#tab_correcciones');
    var tab_activadas = $('#tab_activadas');
    

    //eventhandlers
    btnpendientes.on('click', function () {
        showSection(tab_pendientes, btnpendientes);
    });
    btnenesperaderespuesta.on('click', function () {
        showSection(tab_enespera, btnenesperaderespuesta);
    });
    btnaceptadas.on('click', function () {
        showSection(tab_aceptadas, btnaceptadas);
    });
    btncorrecciones.on('click', function () {
        showSection(tab_correcciones, btncorrecciones);
    });
    btnactivaciones.on('click', function () {
        showSection(tab_activadas, btnactivaciones);
    });
    

    function showSection(section, linktab) {
        tab_pendientes.css("display", "none");
        btnpendientes.removeClass("linktabactive");

        tab_enespera.css("display", "none");
        btnenesperaderespuesta.removeClass("linktabactive");

        tab_aceptadas.css("display", "none");
        btnaceptadas.removeClass("linktabactive");

        tab_correcciones.css("display", "none");
        btncorrecciones.removeClass("linktabactive");

        tab_activadas.css("display", "none");
        btnactivaciones.removeClass("linktabactive");

        

        //----------------------------------------------
        section.css("display", "block");
        linktab.addClass("linktabactive");
    }

    //---------------------------------------------------------------------------------------

    
});