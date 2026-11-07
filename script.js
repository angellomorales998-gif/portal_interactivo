"use strict";

// Referencias a los elementos del formulario y del resumen.
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");
const resumenDatos = document.querySelector("#resumen-datos");
const valorTotal = document.querySelector("#valor-total");

// Precios ficticios establecidos en la guía del proyecto.
const preciosCursos = {
  HTML: 100000,
  CSS: 120000,
  JavaScript: 150000
};
const recargoPresencial = 20000;
const formatoPesos = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
});

/** Devuelve el precio base según el curso seleccionado. */
function obtenerPrecio(curso) {
  return preciosCursos[curso] ?? 0;
}

/** Agrega una pareja etiqueta/valor al resumen sin interpretar HTML del usuario. */
function agregarDato(etiqueta, valor) {
  const contenedor = document.createElement("div");
  const termino = document.createElement("dt");
  const descripcion = document.createElement("dd");

  termino.textContent = etiqueta;
  descripcion.textContent = valor;
  contenedor.append(termino, descripcion);
  resumenDatos.append(contenedor);
}

// Calcula y muestra el resumen cuando se envía el formulario.
formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  // checkValidity y reportValidity aplican las reglas required, type, min y max.
  if (!formulario.checkValidity()) {
    formulario.reportValidity();
    return;
  }

  // Obtener y convertir los valores ingresados.
  const nombre = document.querySelector("#nombre").value.trim();
  const correo = document.querySelector("#correo").value.trim();
  const edad = Number(document.querySelector("#edad").value);
  const curso = document.querySelector("#curso").value;
  const modalidad = document.querySelector("#modalidad").value;

  // Validaciones adicionales para asegurar un nombre y una edad válidos.
  if (nombre.length < 3 || nombre.length > 60 || !Number.isFinite(edad) || edad < 14 || edad > 100) {
    resultado.hidden = true;
    formulario.reportValidity();
    return;
  }

  // Calcular el valor: precio base más recargo, únicamente si es presencial.
  let precio = obtenerPrecio(curso);
  if (modalidad === "Presencial") {
    precio += recargoPresencial;
  }

  // Crear el resumen usando textContent a través de agregarDato.
  resumenDatos.replaceChildren();
  agregarDato("Nombre", nombre);
  agregarDato("Correo", correo);
  agregarDato("Edad", `${edad} años`);
  agregarDato("Curso", curso);
  agregarDato("Modalidad", modalidad);
  valorTotal.textContent = formatoPesos.format(precio);
  resultado.hidden = false;
}
);

// Al limpiar, también se oculta el resumen anterior.
formulario.addEventListener("reset", () => {
  resultado.hidden = true;
  resumenDatos.replaceChildren();
  valorTotal.textContent = formatoPesos.format(0);
});

// Los enlaces de las tarjetas llevan al formulario y preseleccionan el curso.
document.querySelectorAll("[data-curso]").forEach((enlace) => {
  enlace.addEventListener("click", () => {
    document.querySelector("#curso").value = enlace.dataset.curso;
  });
});
