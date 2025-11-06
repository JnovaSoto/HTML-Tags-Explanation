export async function init() {
  console.log('🏠 Home script ejecutado');

  async function getTags() {
    const response = await fetch('/tags');
    if (!response.ok) throw new Error('Error al obtener los tags');
    return await response.json();
  }

  try {
    const tags = await getTags();
    console.log('✅ Tags cargados:', tags);

    const table = document.querySelector(".tagTable");

    // Limpiamos las filas anteriores (menos la primera fila de encabezados)
    const header = table.querySelector("tr");
    table.innerHTML = "";
    table.appendChild(header);

    // Generamos las filas dinámicamente
    tags.forEach(tag => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${tag.tagName}</td>
        <td>${tag.usability}</td>
        <td>
          <button>
            <strong>Tags inside</strong>
            <span class="material-symbols-outlined arrow">arrow_drop_down</span>
          </button>
        </td>
      `;

      table.appendChild(row);
    });

  } catch (error) {
    console.error('❌ Error cargando tags:', error.message);
  }
}
