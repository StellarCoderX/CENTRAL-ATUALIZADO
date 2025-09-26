import fs from "fs";
import FormData from "form-data";

async function enviarArquivo() {
  try {
    const form = new FormData();
    form.append("txtFile", fs.createReadStream("db.txt")); // campo txtFile

    const response = await fetch("http://72.60.143.32:3010/api/vivasorte/db", {
      method: "POST",
      body: form,
      headers: form.getHeaders(),
    });

    const data = await response.json();
    console.log("Resposta:", data);
  } catch (error) {
    console.error("Erro ao enviar arquivo:", error);
  }
}

enviarArquivo();
