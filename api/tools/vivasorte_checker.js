// /api/tools/vivasorte_checker.js

import FormData from "form-data";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  try {
    // Arquivo vem do FormData do frontend
    const file = req.body?.txtFile || req.files?.txtFile;

    if (!file) {
      return res.status(400).json({ success: false, message: "Arquivo não enviado." });
    }

    // Monta o form para repassar ao backend real
    const form = new FormData();
    form.append("txtFile", file, file.name || "db.txt");

    const response = await fetch("http://72.60.143.32:3010/api/vivasorte/db", {
      method: "POST",
      body: form,
      headers: form.getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro no servidor destino: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    console.error("Erro no vivasorte_checker:", err);
    return res.status(500).json({ success: false, message: "Erro interno: " + err.message });
  }
}
