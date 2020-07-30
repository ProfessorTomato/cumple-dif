// Nota sobre el objeto Date (fecha): Al crear una fecha, por ejemplo, new Date (1980, 2, 10), los meses van de 0 (enero) a 11 (diciembre),
// con lo que este ejemplo sería el 10 de marzo de 1980.

//
// Función que devuelve el tiempo restante en segundos hasta una fecha determinada
//
function tiempo_restante_s(cumple) {
  let ahora = new Date();
  let a_nacimiento = cumple.getFullYear();
  let este_ano = ahora.getFullYear();
  cumple.setFullYear(este_ano);

  let dif = cumple - ahora;

  if (dif < 0) {
    cumple.setFullYear(este_ano + 1);
    dif = cumple - ahora;
  }

  // Se deja el año de nacimiento original
  cumple.setFullYear(a_nacimiento);

  return Math.round(dif / 1000);
}

//
// Función que convierte los segundos en días, horas, minutos y segundos (array)
//
function restante(tiempo_en_s) {
  let array_restante = [];
  // Guardar los días
  let dias = Math.floor(tiempo_en_s / (60 * 60 * 24));
  array_restante.push(dias);
  // Guardar las horas (el resto al quitar los días)
  let horas = Math.floor((tiempo_en_s % (60 * 60 * 24)) / (60 * 60));
  array_restante.push(horas);
  // Guardar los minutos (el resto al dividir por las horas)
  let minutos = Math.floor((tiempo_en_s % (60 * 60)) / 60);
  array_restante.push(minutos);
  // Guardar los minutos (el resto al dividir por las horas)
  let segundos = tiempo_en_s % 60;
  array_restante.push(segundos);

  // Devolver el array de [días,horas,minutos,segundos]
  return array_restante;
}

//
// Función que comprueba si un cumpleaños es hoy (getDate obtiene el día del mes)
//
function es_hoy(fecha) {
  let ahora = new Date();
  // Devuelve true si el cumpleaños es hoy y false en caso contrario
  return (
    ahora.getDate() == fecha.getDate() && ahora.getMonth() == fecha.getMonth()
  );
}

//
// Función que indica cuántos años cumplirá una persona
//
function cuantos_cumple(cumple) {
  const a_nacimiento = cumple.getFullYear();

  let ahora = new Date();
  let este_ano = ahora.getFullYear();
  cumple.setFullYear(este_ano);

  let dif = cumple - ahora;

  if (dif < 0) {
    if (!es_hoy(cumple)) {
      cumple.setFullYear(este_ano + 1);
    }
  }
  return cumple.getFullYear() - a_nacimiento;
}

//
// Se ordena el array de cumpleaños (la función de ordenación hace que los más cercanos al cumpleaños aparezcan antes)
//
data_cumples.sort(function (a, b) {
  let cumple_a = new Date(a.aaaa, a.mm - 1, a.dd);
  let cumple_b = new Date(b.aaaa, b.mm - 1, b.dd);

  var restante_a = tiempo_restante_s(cumple_a);
  var restante_b = tiempo_restante_s(cumple_b);

  if (es_hoy(cumple_a)) restante_a = 0;
  if (es_hoy(cumple_b)) restante_b = 0;

  return restante_a - restante_b;
});

//
// Se crea la tabla con los datos
//
// var crea_tabla = (id) => {
//   for (var cumple in data_cumples) {
//     let nodo = document.createElement("P"); // Se crea un <p>
//     let attr = document.createAttribute("id");
//     attr.value = data_cumples[cumple].id;
//     nodo.setAttributeNode(attr);

//     let nodo2 = document.createElement("HR");

//     var diff_div = document.querySelector(id);
//     diff_div.appendChild(nodo);

//     diff_div.appendChild(nodo2);
//   }
//   // Se elimina la última línea horizontal
//   diff_div.lastChild.remove();
// };

var crea_tabla = (id) => {
  html_cumple = "";
  clase_color_header = "";
  for (var cumple in data_cumples) {
    let fecha_cumple = new Date(
      data_cumples[cumple].aaaa,
      data_cumples[cumple].mm - 1,
      data_cumples[cumple].dd
    );
    let dias_restantes = restante(tiempo_restante_s(fecha_cumple))[0];
    if (es_hoy(fecha_cumple)) {
      dias_restantes = 0;
    }
    console.log(dias_restantes);
    if (dias_restantes == 0) {
      clase_color_header = "es-hoy";
    } else if (dias_restantes < 30) {
      clase_color_header = "este-mes";
    } else if (dias_restantes < 180) {
      clase_color_header = "seis-meses";
    } else {
      clase_color_header = "queda-mucho";
    }
    html_cumple =
      html_cumple +
      `<div class='card' id='${data_cumples[cumple].id}'>
        <header class='${clase_color_header}'></header>
        <div class='content'></div>
        <footer></footer>
       </div>`;
  }
  var diff_div = document.querySelector(id);
  diff_div.innerHTML = html_cumple;
};

crea_tabla("#diff");

function array_to_string(array_restante) {
  let dias = array_restante[0];
  let horas = array_restante[1];
  let minutos = array_restante[2];
  let segundos = array_restante[3];

  return (
    "Quedan " +
    dias +
    " días, " +
    horas +
    " horas, " +
    minutos +
    " minutos y " +
    segundos +
    " segundos."
  );
}

// Animación de cabeceras según el tiempo que queda
gsap.to(".es-hoy", {
  duration: 2,
  backgroundColor: "#FFD700",
  yoyo: true,
  repeat: -1,
  ease: "power1.inOut",
});
gsap.to(".este-mes", {
  duration: 2,
  backgroundColor: "#32CD32",
  yoyo: true,
  repeat: -1,
  ease: "power1.inOut",
});
gsap.to(".seis-meses", {
  duration: 2,
  backgroundColor: "#FFA500",
  yoyo: true,
  repeat: -1,
  ease: "power1.inOut",
});
gsap.to(".queda-mucho", {
  duration: 2,
  backgroundColor: "#FF4500",
  yoyo: true,
  repeat: -1,
  ease: "power1.inOut",
});

setInterval(function () {
  for (var cumple in data_cumples) {
    let fecha_cumple = new Date(
      data_cumples[cumple].aaaa,
      data_cumples[cumple].mm - 1,
      data_cumples[cumple].dd
    );

    let array_restante = restante(tiempo_restante_s(fecha_cumple));

    let mensaje1 = "";
    let mensaje2 = "";

    if (es_hoy(fecha_cumple)) {
      mensaje1 = "¡Hoy es su cumpleaños!";
      mensaje2 = `Cumple <span class='enf'>${cuantos_cumple(
        fecha_cumple
      )}</span> años.`;
    } else {
      mensaje1 = array_to_string(array_restante);
      mensaje2 = `Cumplirá <span class='enf'>${cuantos_cumple(
        fecha_cumple
      )}</span> años.`;
    }
    document
      .querySelector("#" + data_cumples[cumple].id)
      .getElementsByTagName(
        "HEADER"
      )[0].innerHTML = `<span class='nombre'>${data_cumples[cumple].nombre} ${data_cumples[cumple].desc}</span>`;
    document
      .querySelector("#" + data_cumples[cumple].id)
      .getElementsByTagName("DIV")[0].innerHTML = mensaje1;
    document
      .querySelector("#" + data_cumples[cumple].id)
      .getElementsByTagName("FOOTER")[0].innerHTML = mensaje2;
  }
}, 1000);
