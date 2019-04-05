var editarcaptura;
$(document).ready(function(){

    
    
    var reset_userfields;
    //CLICK AL ROW Y REDIRECCIONA A DETALLES DEL ASESOR
    $('#tbody_users').on('click', '.rows_usuario', function () {
        $("input[type='password']").removeClass('.mandatory');
        var userid = $(this).data('userid');
        $('#statusbartablaasesores, #containersectiontablaasesores').css('display', 'none');
        $('#statusbaredituser, #contentsectionedituser').css('display','flex');

        //Se llama a la funcion que hace la consulta de los datos de usuario y los escribe en el campo
        //correspondiente. supervisor_ajax.js
        getUserData(userid);
    });


    //PARA REGRESAR AL MENU DE USUARIOS ---------------------------------
    $('#returnme').click(function(){
        $('#statusbaredituser, #contentsectionedituser').css('display', 'none');
        $('#statusbartablaasesores, #containersectiontablaasesores').css('display', 'flex');
        reset_userfields();
    });

     

    
    
    //GUARDAR NUEVO USUARIO
    $('#btn_guardarusuario').click(function(){
        
        var mandatory = $('.mandatory').length;
        var validated = ($('.has-success').find('.mandatory').length);
        if (validated == mandatory) {
            userInsertUpdate();
        } else {
            alert('Se ha detectado uso incorrecto de la plataforma. No es posible insertar usuario.');
        }
        $('#statusbaredituser, #contentsectionedituser').css('display', 'none');
        $('#statusbartablaasesores, #containersectiontablaasesores').css('display', 'flex');
        reset_userfields();
    });

    //DAR DE ALTA NUEVO USUARIO
    $('#nuevousuariobtn').click(function(){
        reset_userfields();
        $("input[type='password']").addClass('mandatory');
        $('#statusbartablaasesores, #containersectiontablaasesores').css('display', 'none');
        $('#statusbaredituser, #contentsectionedituser').css('display', 'flex');
    });


    //PARA ENSENAR PASSWORD EN EL INPUT DE PASSWORD
    $('#showpassword').click(function(){
        var selector_pass = $('#edit_password');
        var stat = selector_pass.data('password');

        if(stat == 'password'){
            selector_pass.removeAttr('type');
            selector_pass.data('password','no-password');
        }else if(stat == 'no-password'){
            selector_pass.attr('type', 'password');
            selector_pass.data('password', 'password');
        }
    });


    //RESETEO DE CAMPOS DE FORMULARIO AL SALIR O AL CLICK EN GUARDAR
    reset_userfields = function(){
        var thisflag = $('.resetflag');
        thisflag.val('');
        $('#edit_password').removeClass('mandatory');
        $('.has-success, .has-error').removeClass('has-success').removeClass('has-error');
        $('#formfield_left').attr('data-userid','none');
        $('#edit_password').attr('type', 'password');
        $('#btn_guardarusuario').prop('disabled',true);
    }

    //BUSQUEDA DE USUARIOS POR APELLIDOS O POR USERNAME AL HACER KEYUP
    $('#searchfield').keyup(function(){
        //var busqueda = $('#searchfield').val();
        //var busquedapor = $('#busquedapor').val();
        //buscarusuario(busqueda, busquedapor); //supervisor_ajax.js


        var filterBy = this;

        $.each($('.rows_usuario'), function (i, val) {
            if ($(val).text().toLowerCase().indexOf($(filterBy).val().toLowerCase()) == -1) {
                
                $('.rows_usuario').eq(i).hide();
            } else {
               
                $('.rows_usuario').eq(i).show();
            }
        });
    });

    //VALIDAR SI EL USUARIO EXISTE EN LA DB
    $('#edit_username').focus(function(){
        $(this).keyup(function () {
            var value = $(this).val();
            validateDuplicatedUsername(value);
        });
        
    });
    


    //SELECCION DE GRAFICA A MOSTRAR
    $('#select_graph').val('capturas')
    $('#select_graph').change(function(){
        var value = $(this).val();
        if (value == 'capturas'){
            $('#container_graph_c').css('display','block');
            $('#container_graph_a').css('display', 'none');
        }else if(value == 'activaciones'){
            $('#container_graph_c').css('display', 'none');
            $('#container_graph_a').css('display', 'block');
        }
    });

    //--------------------------------------------------------------------
    //SECCION DE PANEL DE CONFIGURACIONES

    $('#listener_reportes').click(function () {
        $('#contentplanes , #contentcapturas').css('display','none');
        $('#contentreportes').css('display','block');
    });

    $('#listener_planes').click(function () {
        $('#contentreportes , #contentcapturas').css('display','none');
        $('#contentplanes').css('display','block');
    });

    $('#listener_capturas').click(function () {
        $('#contentplanes , #contentreportes').css('display','none');
        $('#contentcapturas').css('display','block');
    });

    //INSTANCIA DE DATETIMPICKER UTIL PARA CAMPOS DE RANGOS DE FECHA ---------------------------------------
    $('.datetimepicker').datetimepicker({
        //format: 'Y/m/d',
        //timepicker: false,
        //validateOnBlur: false

        format: 'Y/m/d',
            onShow: function (ct) {
                this.setOptions({
                    maxDate: jQuery('#fechafinal').val() ? jQuery('#fechafinal').val() : false
                })
            },
            timepicker: false
        });
        jQuery('#fechafinal').datetimepicker({
            format: 'Y/m/d',
            onShow: function (ct) {
                this.setOptions({
                    minDate: jQuery('#fechainicio').val() ? jQuery('#fechainicio').val() : false
                })
            },
            timepicker: false
        
    });
    //FIN INSTANCIA DE DATETIMPICKER UTIL PARA CAMPOS DE RANGOS DE FECHA 

    
    
    //---------------------------------------

    //LLAMADA A AJAX PARA MOSTRAR CAPTURAS
    $("#btn_search").click(function(){
        var inicio = $('#fechainicio').val();
        var fin = $('#fechafinal').val();
        var status = $("select[name=statuscapturaselect]").val();
        listacapturas(inicio,fin, status); //function in supervisor_tablas.js

    });

    //CAMPO DE BUSQUEDA --------------------------------------
    //FILTRO DE TABLA CAPTURAS
    $('#buscacaptura').keyup(function () {
        var filterBy = this;
        $.each($('.rows_captura'), function (i, val) {
            
            if ($(val).text().toLowerCase().indexOf($(filterBy).val().toLowerCase()) == -1) {
                $('.rows_captura').eq(i).hide();
            } else {
                $('.rows_captura').eq(i).show();
            }
        });
    });

    //FILTRO DE TABLA PLANES
    $('#buscaplanes').keyup(function () {
        var filterBy = this;
        $.each($('.rows_plan'), function (i, val) {
            if ($(val).text().toLowerCase().indexOf($(filterBy).val().toLowerCase()) == -1) {
                $('.rows_plan').eq(i).hide();
            } else {
                $('.rows_plan').eq(i).show();
            }
        });
    });

    //FUNCTIONS PARA GESTIONAR LAS CAPTURAS -----------------------------------
    editarcaptura = function(idrequest,accion){
        
        if(accion == 'delete'){
            deleterequest(idrequest);
        }else if(accion == 'reasign'){
            $('#overlay_supervisor').css('display', 'block');
            $('#modalreasignar').css('display','block');
            getdatamodal(idrequest); //ajax en supervisor_ajax.js
        }   
    }

    //AL PRESIONAR EL BOTON DE CANCELAR
    $('#close_modalreasignar').click(function(){
        $('#overlay_supervisor').css('display', 'none');
        $('#modalreasignar').css('display', 'none');
        $('#idrequestmodalreasignar').html(' ');
    });


    //VALIDACION DEL SUBMIT EN supervisor_validacion.js

    //AL PRESIONAR EL BOTON DE GUARDAR
    $('#submitmodalreasignar').click(function(){
        var iduser = $('#selectmodalreasignar').val();
        var idrequest = $('#idrequestmodalreasignar').html();
        reasignrequest(idrequest,iduser);
        $('#close_modalreasignar').trigger('click');
        //reasignrequest(iduser,idrequest)
    });

    //---------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------
    //EDICION DE CAMPOS EN LA TABLA DE PLANES
    //NOMBRE,CLAVE,PLAN,STATUS
    
    $('#tbody_listaplanes').on('click', '.rows_plan', function () {
        var idregistro = $(this).data('idplan');
        

        // POPOVER DE EDICION DE NOMBRE-------------------------------------------------------------------------

        var titulo_popover = "Editar nombre de plan " + idregistro;
        $('#nombre' + idregistro).popover({ title: titulo_popover, content: "<div class='content-popover'>Nombre:  <input id='nombreplanfield" + idregistro + "'type='text'><button  id='btn-nombreplan" + idregistro + "' class='btn btn-default'>Actualizar</button></div>", placement: "bottom", html: true });


        

        $('#btn-nombreplan' + idregistro).click(function (e) {
            var nombreplan = $('#nombreplanfield' + idregistro).val();
            var nombreplanlen = nombreplan.length;
            if((nombreplan=='') || (nombreplanlen > 30)){
                alert("Campos vacios o superan la longitud maxima de 30 caracteres");
            }else{
                setNewDataPlan(idregistro, nombreplan, 'nombreplan'); //funcion en supervisor_ajax.js
            }
            e.stopImmediatePropagation();
            e.preventDefault();
        });

        //--------------- CLAVE ----------------------------//

        var titulo_popover = "Editar clave de plan " + idregistro;
        $('#clave' + idregistro).popover({ title: titulo_popover, content: "<div class='content-popover'>Clave:  <input id='claveplanfield" + idregistro + "'type='text'><button  id='btn-claveplan" + idregistro + "' class='btn btn-default'>Actualizar</button></div>", placement: "bottom", html: true });


        $('#btn-claveplan' + idregistro).click(function (e) {
            var claveplan = $('#claveplanfield' + idregistro).val();
            var claveplanlen = claveplan.length;
            if ((claveplan == '') || (claveplanlen > 10)) {
                alert("Campos vacios o superan la longitud maxima de 10 caracteres");
            } else {
                setNewDataPlan(idregistro, claveplan, 'claveplan'); //funcion en supervisor_ajax.js
                
            }

           
            
            e.stopImmediatePropagation();
            e.preventDefault();
        });

        //--------------- PLAZO ----------------------------//

        var titulo_popover = "Editar plazo del plan " + idregistro;
        $('#plazo' + idregistro).popover({ title: titulo_popover, content: "<div class='content-popover'>plazo:  <input id='plazoplanfield" + idregistro + "'type='text'><button  id='btn-plazoplan" + idregistro + "' class='btn btn-default'>Actualizar</button></div>", placement: "bottom", html: true });



        $('#btn-plazoplan' + idregistro).click(function (e) {
            var plazoplan = $('#plazoplanfield' + idregistro).val();
            var plazoplanlen = plazoplan.length; 
            if ((plazoplan == '') || (plazoplanlen > 5)) {
                alert("Campos vacios o superan la longitud maxima de 5 caracteres");
            } else {
                setNewDataPlan(idregistro, plazoplan, 'plazoplan'); //funcion en supervisor_ajax.js
                
            }
            
            e.stopImmediatePropagation();
            e.preventDefault();
        });

        //--------------- STATUS ----------------------------//

        var titulo_popover = "Editar status del plan " + idregistro;
        $('#status' + idregistro).popover({ title: titulo_popover, content: "<div class='content-popover'>Status:  <select id='statusplanfield" + idregistro + "'type='text' class='form-control'><option value='1'>Activo</option><option value='0'>No activo</option></select><button  id='btn-statusplan" + idregistro + "' class='btn btn-default'>Actualizar</button></div>", placement: "bottom", html: true });



        $('#btn-statusplan' + idregistro).click(function (e) {
            var statusplan = $('#statusplanfield' + idregistro).val();
            
            
            setNewDataPlan(idregistro, statusplan, 'statusplan'); //funcion en supervisor_ajax.js
            
            e.stopImmediatePropagation();
            e.preventDefault();
        });

        //FIN DE POPOVER----------------------------------------------------------------------------------------------
    });


    //INSERCION DE PLAN A BASE DE DATOS
    $('#btn_saveplan').click(function(){
        var nombre = $('#nombreplan').val();
        var claveplan = $('#claveplan').val();
        var plazoplan = $('#plazoplan').val();
        var statusplan = $('#statusplanselect').val();

        if ((nombre == ' ') || (claveplan == ' ') || (plazoplan == ' ') || (statusplan == ' ')){
            alert("Campo vacío. Favor de validar.")
        }else{
            insertnewplan(nombre, claveplan, plazoplan, statusplan);
        }

        
    });

    //TABLA DE REPORTES ------------------------------------------------------------------------------------


  
    
    //INSTANCIA DE DATETIMPICKER UTIL PARA CAMPOS DE RANGOS DE FECHA ---------------------------------------
    $('.datetimepickerreporte').datetimepicker({
        //format: 'Y/m/d',
        //timepicker: false,
        //validateOnBlur: false

        format: 'Y/m/d',
        onShow: function (ct) {
            this.setOptions({
                maxDate: jQuery('#fechafinalreporte').val() ? jQuery('#fechafinalreporte').val() : false
            })
        },
        timepicker: false
    });
    jQuery('#fechafinalreporte').datetimepicker({
        format: 'Y/m/d',
        onShow: function (ct) {
            this.setOptions({
                minDate: jQuery('#fechainicioreporte').val() ? jQuery('#fechainicioreporte').val() : false
            })
        },
        timepicker: false

    });
    //FIN INSTANCIA DE DATETIMPICKER UTIL PARA CAMPOS DE RANGOS DE FECHA 

    $('#btn_exportar').on('click',function(){
        var fechainicio = $('#fechainicioreporte').val();
        var fechafin = $('#fechafinalreporte').val();
        generateglobalreport(fechainicio,fechafin);
        
    });

    
});


