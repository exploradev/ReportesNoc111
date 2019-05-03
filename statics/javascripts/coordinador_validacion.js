$(document).ready(function(){

  //FILTRO DE TABLA CONCENTRADO
  $('#filtro_concentrado').keyup(function(){
    var filterBy = this;

    $.each($('.concentradotr'),function(i,val){
      if($(val).text().toLowerCase().indexOf($(filterBy).val().toLowerCase()) == -1){
        $('.concentradotr + tr').eq(i).hide();
        $('.concentradotr').eq(i).hide();
      }else{
        $('.concentradotr + tr').eq(i).show();
        $('.concentradotr').eq(i).show();
      }
    });
  });

  //FILTRO DE TABLA AGENDADAS
  $('#filtro_agendadas').keyup(function(){
    var filterBy = this;

    $.each($('.agendadastr'),function(i,val){
      if($(val).text().toLowerCase().indexOf($(filterBy).val().toLowerCase()) == -1){
        $('.agendadastr + tr').eq(i).hide();
        $('.agendadastr').eq(i).hide();
      }else{
        $('.agendadastr + tr').eq(i).show();
        $('.agendadastr').eq(i).show();
      }
    });
  });

    //EVITA EL SUBMIT AL CLICKEAR ANTES
    $(window).keydown(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });

    //INSTANCIA DE DATETIMEPICKER
    // DATETIME PICKER ---------------------------------------------------------------------------------
    $('.datetimepicker').datetimepicker({
      format: 'Y/m/d H:m:s',
      validateOnBlur: false
    });

    //datetimepicker por rango
  jQuery('#exportar_desde').datetimepicker({
    format: 'Y/m/d',
    onShow: function (ct) {
      this.setOptions({
        maxDate: jQuery('#exportar_hasta').val() ? jQuery('#exportar_hasta').val() : false
      })
    },
    timepicker: false,
    theme: 'dark'
  });
  jQuery('#exportar_hasta').datetimepicker({
    format: 'Y/m/d',
    onShow: function (ct) {
      this.setOptions({
        minDate: jQuery('#exportar_desde').val() ? jQuery('#exportar_desde').val() : false
      })
    },
    timepicker: false,
    theme: 'dark'
  });
    // DATETIME PICKER ---------------------------------------------------------------------------------

    //VALIDACION DE CAMPOS DE LOS MODALES

    $('#textareamodalrechazo').keyup(function(){
        var texto = $(this).val();
        var regex = /^([a-zA-ZñÑáéíóúÁÉÍÓÚ\s,\d\.\-_\/\\\']){1,250}$/;

        if(texto.match(regex)){
            $('#submitmodalrechazo').prop('disabled',false);
        }else{
            $('#submitmodalrechazo').prop('disabled', true);
        }
    });

    //------------------------------------------------------------------

    $('#textareamodalcomentario').keyup(function () {
        var texto = $(this).val();
        var regex = /^([a-zA-ZñÑáéíóúÁÉÍÓÚ\s,\d\.\-_\/\\\']){1,250}$/;

        if (texto.match(regex)) {
            $('#submitmodalcomentario').prop('disabled', false);
        } else {
            $('#submitmodalcomentario').prop('disabled', true);
        }
    });

    //------------------------------------------------------------------

    $('#fechaagendainput ,#canalagendainput').keyup(function () {
        var valordate = $('#fechaagendainput').val();
        var valorcac = $('#canalagendainput').val();

        // old var regexdate = /^([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(\d{4})(\s)([0-1][0-9]|2[0-3])(:)([0-5][0-9])$/;
        var regexdate = /^(\d{4})(\/)(0[1-9]|1[0-2])\2([0-2][0-9]|3[0-1])(\s)([0-1][0-9]|2[0-3])(:)([0-5][0-9])(:)([0-5][0-9])$/;
        var regexcac = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s\d]{1,20}$/;
        if (valordate.match(regexdate) && valorcac.match(regexcac)) {
            $('#submitmodalagenda').prop('disabled', false);
        } else {
            $('#submitmodalagenda').prop('disabled', true);
        }
    });



});
