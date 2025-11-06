document.addEventListener('DOMContentLoaded', () => {
  iniciarNavegacion();
  ejecutarScriptActual();
});

function iniciarNavegacion() {
  const btnCreate = document.getElementById('btn-go-create');
  if (btnCreate) btnCreate.addEventListener('click', () => cambiarPagina('/create'));

  const btnHome = document.getElementById('btn-go-home');
  if (btnHome) btnHome.addEventListener('click', () => cambiarPagina('/home'));
}

function cambiarPagina(ruta) {
  history.pushState(null, null, ruta);

  fetch(ruta)
    .then(res => res.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const nuevoContenido = doc.querySelector('#app').innerHTML;
      document.querySelector('#app').innerHTML = nuevoContenido;

      iniciarNavegacion();
      ejecutarScriptActual(); // 👈 ejecuta script de la nueva vista
    })
    .catch(console.error);
}

function ejecutarScriptActual() {
  const path = window.location.pathname;

  if (path === '/' || path === '/home') {
    import('/js/home.js').then(mod => mod.init && mod.init());
  } else if (path === '/create') {
    import('/js/create.js').then(mod => mod.init && mod.init());
  }
}

window.addEventListener('popstate', () => cambiarPagina(location.pathname));
