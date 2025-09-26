import formidable from "formidable";
import fs from "fs";
import FormData from "form-data";

export const config = {
  api: {
    bodyParser: false, // Desliga o body parser padrão
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Erro ao parsear:", err);
      return res.status(500).json({ success: false, message: "Erro ao processar arquivo." });
    }

    try {
      const file = files.txtFile;

      if (!file) {
        return res.status(400).json({ success: false, message: "Arquivo txtFile não enviado." });
      }

      // Monta novo form para repassar ao backend real
      const forwardForm = new FormData();
      forwardForm.append("txtFile", fs.createReadStream(file.filepath), file.originalFilename);

      const response = await fetch("http://72.60.143.32:3010/api/vivasorte/db", {
        method: "POST",
        body: forwardForm,
        headers: forwardForm.getHeaders(),
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
  });
}
