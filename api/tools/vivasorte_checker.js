// /api/tools/vivasorte_checker.js (Versão Simplificada)

import { promises as fs } from 'fs';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false, // Essencial para formidable funcionar
  },
};

export default async function handler(request, response) {
  // Apenas aceita requisições POST
  if (request.method !== "POST") {
    return response.status(405).json({ message: "Método não permitido" });
  }

  try {
    // 1. Processa o formulário para obter o arquivo enviado
    const data = await new Promise((resolve, reject) => {
      const form = formidable({});
      form.parse(request, (err, fields, files) => {
        if (err) {
          return reject(err);
        }
        resolve({ files });
      });
    });

    const uploadedFile = data.files.txtFile;

    // 2. Valida se o arquivo foi realmente enviado
    if (!uploadedFile || uploadedFile.length === 0) {
      return response.status(400).json({ success: false, message: 'Nenhum arquivo foi enviado no campo "txtFile".' });
    }

    // 3. Lê o conteúdo do arquivo para obter a lista
    const filePath = uploadedFile[0].filepath;
    const lista = await fs.readFile(filePath, 'utf8');

    if (!lista) {
      return response.status(400).json({ success: false, message: 'O arquivo enviado está vazio.' });
    }

    // 4. Prepara e envia os dados para a API externa
    const targetUrl = `http://72.60.143.32:3010/api/vivasorte/db`;
    const bodyParams = new URLSearchParams();
    bodyParams.append('lista', lista); // Adiciona a lista ao corpo da requisição

    const apiResponse = await fetch(targetUrl, {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: bodyParams,
    });

    // 5. Retorna a resposta da API externa para o usuário
    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      throw new Error(`Erro na API externa: ${apiResponse.status} - ${errorBody}`);
    }

    const responseData = await apiResponse.json();
    return response.status(200).json(responseData);

  } catch (error) {
    console.error("Erro no servidor Vivasorte:", error);
    return response.status(500).json({
      success: false,
      message: "Erro interno no servidor: " + error.message,
    });
  }
}
