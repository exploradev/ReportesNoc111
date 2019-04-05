$(document).ready(function () {

    //trigger buttons
    var btnconcentrado = $('#btn-concentrado');
    var btnaceptadassin = $('#btn-aceptadassin');
    var btnaceptadasdom = $('#btn-aceptadasdom');
    var btnagendadas = $('#btn-agendadas');
    var btnactivaciones = $('#btn-activaciones');
    

    //sections tables
    var tab_concentrado = $('#tab_concentrado');
    var tab_aceptadassin = $('#tab_aceptadassin');
    var tab_aceptadasdom = $('#tab_aceptadasdom');
    var tab_agendadas = $('#tab_agendadas');
    var tab_activadas = $('#tab_activadas');
    

    //eventhandlers
    btnconcentrado.on('click', function () {
        showSection(tab_concentrado, btnconcentrado);
    });
    btnaceptadassin.on('click', function () {
        showSection(tab_aceptadassin, btnaceptadassin);
    });
    btnaceptadasdom.on('click', function () {
        showSection(tab_aceptadasdom, btnaceptadasdom);
    });
    btnagendadas.on('click', function () {
        showSection(tab_agendadas, btnagendadas);
    });
    btnactivaciones.on('click', function () {
        showSection(tab_activadas, btnactivaciones);
    });
    

    function showSection(section, linktab) {
        tab_concentrado.css("display", "none");
        btnconcentrado.removeClass("linktabactive");

        tab_aceptadassin.css("display", "none");
        btnaceptadassin.removeClass("linktabactive");

        tab_aceptadasdom.css("display", "none");
        btnaceptadasdom.removeClass("linktabactive");

        tab_agendadas.css("display", "none");
        btnagendadas.removeClass("linktabactive");

        tab_activadas.css("display", "none");
        btnactivaciones.removeClass("linktabactive");

        

        //----------------------------------------------
        section.css("display", "block");
        linktab.addClass("linktabactive");
    }

    //---------------------------------------------------------------------------------------

    
});