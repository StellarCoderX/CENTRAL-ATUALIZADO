async function enviarArquivo(file) {
  const formData = new FormData();
  formData.append("txtFile", file, file.name);

  try {
    const response = await fetch("http://72.60.143.32:3010/api/vivasorte/db", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Erro servidor: ${response.status}`);
    }

    const data = await response.json();
    console.log("Resposta:", data);
    return data;
  } catch (err) {
    console.error("Erro upload:", err);
    return { success: false, message: err.message };
  }
}
