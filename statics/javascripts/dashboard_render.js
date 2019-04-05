//CONTROL DE LINKS A MODO DE APARTADOS CON LAS DIFERENTES SECTIONS

$(document).ready(function () {
    $('#linkfooterdashboard').click(function(){
        $('#bigbodyconnections').css('display', 'none');
        $('#bigbodycorrections').css('display', 'none');
        $('#bigbody').css('display','flex');
        
    });

    $('#linkfooterconexiones').click(function () {
        $('#bigbody').css('display', 'none');
        $('#bigbodycorrections').css('display', 'none');
        $('#bigbodyconnections').css('display', 'flex');
    });

    $('#linkfootercorrecciones').click(function () {
        $('#bigbody').css('display', 'none');
        $('#bigbodyconnections').css('display', 'none');
        $('#bigbodycorrections').css('display', 'flex');
    });
});