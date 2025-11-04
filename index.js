window.onload = async function() {
  try {
    const response = await fetch("/tags");
    if (!response.ok) throw new Error("HTTP error " + response.status);
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.error("Error fetching tags:", err);
  }
  // Ejemplo de uso

};
  window.onload = () => {
    addTag("MiTag", "hola", "Contenido de ejemplo");
  };
  
  async function addTag(tagName, usability, content) {
  try {
    const response = await fetch("/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tags: tagName, usability,content})
    });

    if (!response.ok) {
      // Capturar errores HTTP
      const errorData = await response.json();
      throw new Error(errorData.error || "Error desconocido");
    }

    const newTag = await response.json();
    console.log("Nuevo tag agregado:", newTag);

    // Aquí puedes actualizar la UI si quieres
  } catch (err) {
    console.error("Error agregando tag:", err);
  }
}