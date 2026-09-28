const $ = (s, r = document) => r.querySelector(s);

// Cuenta regresiva
const cuenta = $('#cuenta');
const meta = new Date(cuenta.dataset.fecha).getTime();
function tick() {
  let resto = meta - Date.now();
  if (resto <= 0) { cuenta.textContent = 'Gracias por ser parte de nuestro día'; return clearInterval(timer); }
  cuenta.innerHTML = [['días', 864e5], ['horas', 36e5], ['min', 6e4], ['seg', 1e3]].map(([l, ms]) => {
    const n = Math.floor(resto / ms); resto %= ms;
    return `<div><b>${n}</b><span>${l}</span></div>`;
  }).join('');
}
const timer = setInterval(tick, 1000); tick();

// Música (los navegadores exigen un toque para reproducir)
const audio = $('#audio'), btnMusica = $('#musica');
btnMusica.onclick = () => {
  audio.paused ? audio.play() : audio.pause();
  btnMusica.textContent = audio.paused ? 'Escuchar nuestra canción' : 'Pausar la canción';
};

// Galería
// Carrusel Infinito (1 activa + 2 laterales con blur)
const galeria = $('#galeria');
const fotos = Array.from(galeria.querySelectorAll('img'));
let indiceActual = 0;

function actualizarCarrusel() {
  const total = fotos.length;
  
  fotos.forEach((foto, i) => {
    foto.className = ''; // Limpia clases previas
    
    // Cálculo cíclico de los índices
    const esActiva = i === indiceActual;
    const esAnterior = i === (indiceActual - 1 + total) % total;
    const esSiguiente = i === (indiceActual + 1) % total;

    if (esActiva) {
      foto.classList.add('activa');
    } else if (esAnterior) {
      foto.classList.add('anterior');
    } else if (esSiguiente) {
      foto.classList.add('siguiente');
    }
  });
}

// Navegación con flechas (Infinito)
document.querySelectorAll('[data-dir]').forEach((btn) => {
  btn.onclick = () => {
    const direccion = Number(btn.dataset.dir);
    const total = fotos.length;
    indiceActual = (indiceActual + direccion + total) % total;
    actualizarCarrusel();
  };
});

// Inicializar estado
actualizarCarrusel();

// Confirmación de asistencia
const form = $('#rsvp'), num = $('#num'), acomp = $('#acomp'), msg = $('#msg');
num.onchange = () => {
  acomp.innerHTML = '';
  for (let i = 1; i <= num.value; i++)
    acomp.insertAdjacentHTML('beforeend', `<label>Nombre del acompañante ${i}<input name="acompanante_${i}" required maxlength="100" autocomplete="off"></label>`);
};
form.onsubmit = async (e) => {
  e.preventDefault();
  const btn = $('button', form);
  btn.disabled = true; msg.className = 'msg'; msg.textContent = 'Enviando…';
  try {
    const r = await fetch('/sub', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error);
    form.reset(); acomp.innerHTML = '';
    msg.className = 'msg ok'; msg.textContent = j.mensaje;
  } catch (err) {
    msg.className = 'msg err'; msg.textContent = err.message || 'No pudimos guardar tu confirmación. Inténtalo de nuevo.';
    btn.disabled = false;
  }
};
