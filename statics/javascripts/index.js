$(document).ready(function(){

    /*/particles
    particlesJS.load('particles-js', '../javascripts/particlesjs-config.json', function () {
        console.log('callback - particles.js config loaded');
    });
    //particles end
    /*/
    submitbtn = $('#submit');
    userfield = $('#user');
    passwordfield = $('#password');
    inputs = $('input');

    //reseteando los inputs en caso de error
    inputs.on('focus',function(){
        $(this).removeClass('red-border');
    });

    //forzando el focus al campo de username por UX
    $("#user").trigger('focus');

    //al hacer submit se capturan los datos de los inputs y se envian a la func login
    submitbtn.on('click',function(){
        user = userfield.val();
        password = passwordfield.val();
        
        if((user == "") || (password == "")){
            $('#loginerr').addClass('visible-item').fadeOut('fast').fadeIn('fast');
            inputs.addClass('red-border');
        }else{
            login(user, md5(password));
        }
        
    });

    //se encarga de hacer el login con los datos capturados por medio de post
    //funciona de error handler y de router
    function login(user, password) {
        $.post('/login', { user: user, password: password }, function (response) {
            if (response == 'asesor') {
                location.href = '/asesor';
            } else if (response == 'noc') {
                location.href = '/noc';
            } else if (response == 'supervisor') {
                location.href = '/supervisor';
            } else if (response == 'coordinador') {
                location.href = '/coordinador';
            }
        
        else {
                $('#loginerr').addClass('visible-item').fadeOut('fast').fadeIn('fast');
                inputs.addClass('red-border');
            }
        });
    }

    //evento enter
    $("html").keyup(function(event){
        tecla = event.which;
        if(tecla == 13){
            submitbtn.trigger('click');
        }
    });
    

});