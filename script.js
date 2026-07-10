/* =========================================================
   NAVEGACIÓN ENTRE SECCIONES (SPA)
========================================================= */
const botonesMenu = document.querySelectorAll('.menu-btn');
const secciones = document.querySelectorAll('.tool');

botonesMenu.forEach(boton => {
  boton.addEventListener('click', () => {
    const destino = boton.dataset.target;

    botonesMenu.forEach(b => b.classList.remove('active'));
    boton.classList.add('active');

    secciones.forEach(s => s.classList.remove('active'));
    document.getElementById(destino).classList.add('active');
  });
});


/* =========================================================
   PROYECTO 1: CALCULADORA DE EDAD
========================================================= */
const selDia = document.getElementById('dia');
const selMes = document.getElementById('mes');
const selAnio = document.getElementById('anio');
const formEdad = document.getElementById('form-edad');
const errorEdad = document.getElementById('error-edad');
const resultadoEdad = document.getElementById('resultado-edad');

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

function llenarSelectoresFecha() {
  // Días 1-31
  selDia.innerHTML = '<option value="" disabled selected>Día</option>';
  for (let d = 1; d <= 31; d++) {
    selDia.innerHTML += `<option value="${d}">${d}</option>`;
  }

  // Meses
  selMes.innerHTML = '<option value="" disabled selected>Mes</option>';
  meses.forEach((nombreMes, index) => {
    selMes.innerHTML += `<option value="${index + 1}">${nombreMes}</option>`;
  });

  // Años (desde el actual hacia 120 años atrás)
  const anioActual = new Date().getFullYear();
  selAnio.innerHTML = '<option value="" disabled selected>Año</option>';
  for (let a = anioActual; a >= anioActual - 120; a--) {
    selAnio.innerHTML += `<option value="${a}">${a}</option>`;
  }
}

llenarSelectoresFecha();

formEdad.addEventListener('submit', (e) => {
  e.preventDefault();
  errorEdad.textContent = '';
  resultadoEdad.textContent = '';

  const dia = parseInt(selDia.value);
  const mes = parseInt(selMes.value);
  const anio = parseInt(selAnio.value);

  if (!dia || !mes || !anio) {
    errorEdad.textContent = 'Por favor selecciona día, mes y año.';
    return;
  }

  const fechaNacimiento = new Date(anio, mes - 1, dia);
  const hoy = new Date();

  // Validar que la fecha exista realmente (ej. 31 de febrero no es válido)
  const fechaValida =
    fechaNacimiento.getFullYear() === anio &&
    fechaNacimiento.getMonth() === mes - 1 &&
    fechaNacimiento.getDate() === dia;

  if (!fechaValida) {
    errorEdad.textContent = 'La fecha ingresada no es válida.';
    return;
  }

  if (fechaNacimiento > hoy) {
    errorEdad.textContent = 'La fecha de nacimiento no puede ser en el futuro.';
    return;
  }

  let anios = hoy.getFullYear() - fechaNacimiento.getFullYear();
  let mesesDif = hoy.getMonth() - fechaNacimiento.getMonth();
  let diasDif = hoy.getDate() - fechaNacimiento.getDate();

  if (diasDif < 0) {
    mesesDif--;
  }
  if (mesesDif < 0) {
    anios--;
    mesesDif += 12;
  }

  resultadoEdad.textContent = `Tienes ${anios} años y ${mesesDif} meses`;
});


/* =========================================================
   PROYECTO 2: CONVERSOR DE TEMPERATURA
========================================================= */
const valorTemp = document.getElementById('valor-temp');
const unidadOrigen = document.getElementById('unidad-origen');
const unidadDestino = document.getElementById('unidad-destino');
const btnConvertir = document.getElementById('btn-convertir');
const formTemp = document.getElementById('form-temp');
const resultadoTemp = document.getElementById('resultado-temp');

function validarCamposTemp() {
  const completo =
    valorTemp.value.trim() !== '' &&
    unidadOrigen.value !== '' &&
    unidadDestino.value !== '';

  btnConvertir.disabled = !completo;
}

[valorTemp, unidadOrigen, unidadDestino].forEach(campo => {
  campo.addEventListener('input', validarCamposTemp);
  campo.addEventListener('change', validarCamposTemp);
});

const nombresUnidad = { C: 'Celsius', F: 'Fahrenheit', K: 'Kelvin' };

function convertirTemperatura(valor, origen, destino) {
  // Primero convertimos todo a Celsius
  let celsius;
  switch (origen) {
    case 'C': celsius = valor; break;
    case 'F': celsius = (valor - 32) * (5 / 9); break;
    case 'K': celsius = valor - 273.15; break;
  }

  // Luego de Celsius a la unidad destino
  switch (destino) {
    case 'C': return celsius;
    case 'F': return celsius * (9 / 5) + 32;
    case 'K': return celsius + 273.15;
  }
}

formTemp.addEventListener('submit', (e) => {
  e.preventDefault();

  const valor = parseFloat(valorTemp.value);
  const origen = unidadOrigen.value;
  const destino = unidadDestino.value;

  const resultado = convertirTemperatura(valor, origen, destino);

  resultadoTemp.textContent =
    `${valor} ${nombresUnidad[origen]} es ${resultado.toFixed(2)} ${nombresUnidad[destino]}`;
});


/* =========================================================
   PROYECTO 3: GESTOR DE TAREAS
========================================================= */
const inputTarea = document.getElementById('input-tarea');
const listaTareas = document.getElementById('lista-tareas');

// Estructura de datos interna
let tareas = [];

function renderTasks() {
  listaTareas.innerHTML = '';

  // Pendientes primero, completadas al final
  const pendientes = tareas.filter(t => !t.completada);
  const completadas = tareas.filter(t => t.completada);
  const ordenadas = [...pendientes, ...completadas];

  ordenadas.forEach(tarea => {
    const li = document.createElement('li');
    li.dataset.id = tarea.id;
    if (tarea.completada) li.classList.add('completada');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = tarea.completada;
    checkbox.addEventListener('change', () => alternarTarea(tarea.id));

    const span = document.createElement('span');
    span.textContent = tarea.descripcion;

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = '🗑';
    btnEliminar.classList.add('btn-eliminar');
    btnEliminar.addEventListener('click', () => eliminarTarea(tarea.id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(btnEliminar);
    listaTareas.appendChild(li);
  });
}

function agregarTarea(descripcion) {
  tareas.push({
    id: Date.now(),
    descripcion,
    completada: false
  });
  renderTasks();
}

function alternarTarea(id) {
  tareas = tareas.map(t =>
    t.id === id ? { ...t, completada: !t.completada } : t
  );
  renderTasks();
}

function eliminarTarea(id) {
  tareas = tareas.filter(t => t.id !== id);
  renderTasks();
}

inputTarea.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && inputTarea.value.trim() !== '') {
    agregarTarea(inputTarea.value.trim());
    inputTarea.value = '';
  }
});

renderTasks();
