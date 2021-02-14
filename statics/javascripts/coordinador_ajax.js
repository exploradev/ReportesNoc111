var load_users, fill_tablesoptions;
$(document).ready(function () {
  //descomentar antes de pruebas finales y puesta en produccion
  $("#show_dashboard").trigger("click");

  //CONTROL DE ALTA Y ACTUALIZACIONES ---------------------------
  $("#btn_nuevouser").click(function () {
    var conteo_inputs = 0;
    $(".form_altauser").each(function () {
      //cuento cuantos inputs hay
      conteo_inputs++;
    });

    var no_vacios = 0;
    $(".form_altauser").each(function () {
      //conteo de cuantos campos llenos
      var value = $(this).val();
      if (value != "") {
        no_vacios++;
      }
    });

    //si los campos existentes son igual a los llenos entonces procedo
    if (conteo_inputs == no_vacios) {
      respuestas = [];

      $(".form_altauser").each(function () {
        //conteo de cuantos campos llenos
        var value = $(this).val();
        respuestas.push(value);
      });
      $.post(
        "/guardar_nuevousuario",
        {
          nombre: respuestas[0],
          username: respuestas[1],
          password: md5(respuestas[2]),
          rol: respuestas[3],
          turno: respuestas[4],
          estatus: respuestas[5],
        },
        function (response) {
          if (response == "Correcto") {
            $(
              "input[type=text].form_altauser, input[type=password].form_altauser"
            )
              .val("")
              .trigger("change");
            load_users();
            $("#estatus_toggle").prop("checked", false);
            alert("Agregado correctamente");
          } else {
            alert("ERROR: " + response["sqlMessage"]);
          }
        }
      );
    } else {
      alert("Llenar todos los campos");
    }
  });

  //despliega inputs de edicion al click
  $("#tbody_maintable_users").on("click", ".row_usuarios", function () {
    var iduser = $(this).data("iduser");
    $("#overlay-back").css("display", "block");
    $("body").addClass("modal-open");
    $("#coordinador_modaledicionusuarios").slideDown("slow");

    $.post(
      "/getSingleUser",
      {
        iduser: iduser,
      },
      function (response) {
        $("#actualizar_iduser_u").html(response[0]["iduser"]);
        $("#actualizar_nombre").val(response[0]["nombre"]);
        $("#actualizar_username").val(response[0]["username"]);

        $("#actualizar_rol").val(response[0]["rol"]).trigger("change");
        $("#actualizar_turno").val(response[0]["turno"]).trigger("change");
        $("#actualizar_estatus").val(response[0]["estatus"]).trigger("change");
      }
    );
  });

  $("#btn_actualizaruser").click(function () {
    var conteo_inputs = 0;
    $(".form_actualizaruser").each(function () {
      //cuento cuantos inputs hay
      conteo_inputs++;
    });

    var no_vacios = 0;
    $(".form_actualizaruser").each(function () {
      //conteo de cuantos campos llenos
      var value = $(this).val();
      if (value != "") {
        no_vacios++;
      }
    });

    //si los campos existentes son igual a los llenos entonces procedo
    if (conteo_inputs == no_vacios && conteo_inputs != 0) {
      var iduser = $("#actualizar_iduser_u").html();
      var nombre = $("#actualizar_nombre").val();
      var username = $("#actualizar_username").val();
      var password = $("#actualizar_password").val();
      if (password == "") {
        password = "sincambios";
      } else {
        password = md5(password);
      }

      var rol = $("#actualizar_rol").val();
      var turno = $("#actualizar_turno").val();
      var estatus = $("#actualizar_estatus").val();

      $.post(
        "/actualizar_usuario",
        {
          iduser: iduser,
          nombre: nombre,
          username: username,
          password: password,
          rol: rol,
          turno: turno,
          estatus: estatus,
        },
        function (response) {
          if (response == "Correcto") {
            $(
              "input[type=text].form_altauser, input[type=password].form_altauser"
            )
              .val("")
              .trigger("change");
            $("#actualizar_password").val("");
            load_users();
            $("#estatus_toggle").prop("checked", false);
            alert("Actualizado correctamente");
          } else {
            alert("ERROR: " + response["sqlMessage"]);
          }
        }
      );
    } else {
      alert("Llenar todos los campos obligatorios (*)");
    }
  });

  //FIN DE CONTROL DE ALTA Y ACTUALIZACIONES --------------------

  //OBTENER REPORTES
  $("#generar_export").click(function () {
    var parametros = [];
    var conteo_inputs = 0;
    $(".elemento_porexportar").each(function () {
      //cuento cuantos inputs hay
      conteo_inputs++;
    });

    var no_vacios = 0;
    $(".elemento_porexportar").each(function () {
      //conteo de cuantos campos llenos
      var value = $(this).val();
      if (value != "") {
        no_vacios++;
      }
    });

    //si los campos existentes son igual a los llenos entonces procedo
    if (conteo_inputs == no_vacios && conteo_inputs != 0) {
      $(".elemento_porexportar").each(function () {
        //conteo de cuantos campos llenos
        var value = $(this).val();
        parametros.push(value);
      });

      $.post(
        "/getReport",
        {
          tipo: parametros[0],
          desde: parametros[1],
          hasta: parametros[2],
        },
        function (response) {
          console.table(response);
          if (response == "") {
            console.log("Sin resultados o tabla incorrecta - Defensa de XSS");
            alert("Sin resultados");
            return;
          } else {
            JSONToCSVConvertor(response, parametros[0], true);
          }
        }
      );
    } else {
      alert("Llenar todos los campos obligatorios (*)");
    }
  });

  //AJAX PARA GENERAR LAS LISTAS DE USUARIOS -------------------------------------

  load_users = function () {
    $.post("/get_userlist_activos", function (response) {
      var table_body = [];
      for (i = 0; i < response.length; i++) {
        table_body +=
          "<tr id='row" +
          response[i]["iduser"] +
          "' class='row_usuarios' data-iduser='" +
          response[i]["iduser"] +
          "'>";

        table_body += "<td>";
        table_body += response[i]["iduser"];
        table_body += "</td>";

        table_body += "<td>";
        table_body += response[i]["nombre"];
        table_body += "</td>";

        table_body += "<td>";
        table_body += response[i]["username"];
        table_body += "</td>";

        table_body += "<td>";
        table_body += moment(response[i]["creado"]).format("DD/MM/YYYY HH:mm");
        table_body += "</td>";

        table_body += "<td>";
        table_body += response[i]["rol"];
        table_body += "</td>";

        table_body += "<td>";
        table_body += response[i]["turno"];
        table_body += "</td>";

        table_body += "<td>";
        table_body += response[i]["estatus"];
        table_body += "</td>";

        if (response[i]["ultimologin"] == null) {
          table_body += "<td>";
          table_body += "Usuario nuevo";
          table_body += "</td>";
        } else {
          table_body += "<td>";
          table_body += moment(response[i]["ultimologin"])
            .locale("es")
            .fromNow();
          table_body += "</td>";
        }

        table_body += "</tr>";

        //------------------------------------------------------
      }
      $("#tbody_maintable_users").html(table_body);
    });
  };

  load_inactivos = function () {
    $.post("/get_userlist_inactivos", function (response) {
      var table_body = [];
      for (i = 0; i < response.length; i++) {
        table_body +=
          "<tr id='row" +
          response[i]["iduser"] +
          "' class='row_usuarios' data-iduser='" +
          response[i]["iduser"] +
          "'>";

        table_body += "<td>";
        table_body += response[i]["iduser"];
        table_body += "</td>";

        table_body += "<td>";
        table_body += response[i]["nombre"];
        table_body += "</td>";

        table_body += "<td>";
        table_body += response[i]["username"];
        table_body += "</td>";

        table_body += "<td>";
        table_body += moment(response[i]["creado"]).format("DD/MM/YYYY HH:mm");
        table_body += "</td>";

        table_body += "<td>";
        table_body += response[i]["rol"];
        table_body += "</td>";

        table_body += "<td>";
        table_body += response[i]["turno"];
        table_body += "</td>";

        table_body += "<td>";
        table_body += response[i]["estatus"];
        table_body += "</td>";

        if (response[i]["ultimologin"] == null) {
          table_body += "<td>";
          table_body += "Usuario nuevo";
          table_body += "</td>";
        } else {
          table_body += "<td>";
          table_body += moment(response[i]["ultimologin"])
            .locale("es")
            .fromNow();
          table_body += "</td>";
        }

        table_body += "</tr>";

        //------------------------------------------------------
      }
      $("#tbody_maintable_users").html(table_body);
    });
  };

  //AJAX PARA MOSTRAR U OCULTAR USUARIOS ACTIVADOS O DESACTIVADOS
  $("#estatus_toggle").change(function () {
    let estatus = $(this).prop("checked");
    if (estatus) {
      //si es true se muestran los inactivos
      load_inactivos();
    } else {
      //si es false se muestran los activos
      load_users();
    }
  });

  ///////////////////////////////////////////////////////////////
  //funcion para exportar reportes en excel
  //jsfiddle: http://jsfiddle.net/hybrid13i/JXrwM/
  function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != "object" ? JSON.parse(JSONData) : JSONData;

    var CSV = "";
    //Set Report title in first row or line

    CSV += ReportTitle + "\r\n\n";

    //This condition will generate the Label/Header
    if (ShowLabel) {
      var row = "";

      //This loop will extract the label from 1st index of on array
      for (var index in arrData[0]) {
        //Now convert each value to string and comma-seprated
        row += index + ",";
      }

      row = row.slice(0, -1);

      //append Label row with line break
      CSV += row + "\r\n";
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
      var row = "";

      //2nd loop will extract each column and convert it in string comma-seprated
      for (var index in arrData[i]) {
        row += '"' + arrData[i][index] + '",';
      }

      row.slice(0, row.length - 1);

      //add a line break after each row
      CSV += row + "\r\n";
    }

    if (CSV == "") {
      alert("Invalid data");
      return;
    }

    //Generate a file name
    var fileName = "Reporte_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g, "_");

    //Initialize file format you want csv or xls
    var uri = "data:text/csv;charset=utf-8," + escape(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  ////////////////////////////////////////////////////////////////

  //TABLAS POR EXPORTAR
  //correr funcion para popular el select de opciones
  fill_tablesoptions = function () {
    $.post("/getTables", function (response) {
      var table_body =
        "<option></option><option value = 'global'>Global</option>";
      for (i = 0; i < response.length; i++) {
        table_body +=
          "<option value='" +
          response[i]["tabla"] +
          "'>" +
          response[i]["tabla"] +
          "</option>";
      }
      $("#tiporeporte").html(table_body);
    });
  };

  fill_tablesoptions();
  load_users();
});
