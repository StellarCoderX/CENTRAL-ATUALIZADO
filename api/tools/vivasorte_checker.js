// /api/tools/vivasorte_checker.js

import { promises as fs } from 'fs';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ message: "Método não permitido" });
  }

  try {
    const data = await new Promise((resolve, reject) => {
      const form = formidable({});
      form.parse(request, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const { proxy_host, proxy_port, proxy_user, proxy_pass } = data.fields;
    const uploadedFile = data.files.txtFile;

    if (!uploadedFile || uploadedFile.length === 0) {
      return response.status(400).json({ success: false, message: 'Nenhum arquivo enviado.' });
    }

    const filePath = uploadedFile[0].filepath;
    const lista = await fs.readFile(filePath, 'utf8');

    if (!lista) {
      return response.status(400).json({ success: false, message: 'O arquivo enviado está vazio.' });
    }

    // --- INÍCIO DA CORREÇÃO: MUDANÇA PARA POST ---

    // 1. A URL de destino agora não precisa da lista
    let targetUrl = `http://72.60.143.32:3010/api/vivasorte/db`;

    // 2. Os dados a serem enviados no corpo da requisição
    const requestBody = {
      lista: lista, // Envia a lista de contas
    };

    // Adiciona os dados de proxy ao corpo, se existirem
    if (proxy_host && proxy_port) {
      requestBody.proxy_host = proxy_host[0];
      requestBody.proxy_port = proxy_port[0];
      if (proxy_user && proxy_user[0]) {
        requestBody.proxy_user = proxy_user[0];
      }
      if (proxy_pass && proxy_pass[0]) {
        requestBody.proxy_pass = proxy_pass[0];
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    // 3. A chamada fetch agora é um POST
    const apiResponse = await fetch(targetUrl, {
      method: "POST", // Método alterado para POST
      headers: {
        'Content-Type': 'application/json', // Informa que estamos enviando JSON
      },
      body: JSON.stringify(requestBody), // Envia os dados no corpo, convertidos para string JSON
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    // --- FIM DA CORREÇÃO ---

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      throw new Error(`Erro na API externa: ${apiResponse.status} - ${errorBody}`);
    }

    const responseData = await apiResponse.json();
    response.status(200).json(responseData);

  } catch (error) {
    if (error.name === 'AbortError') {
      console.error("Fetch para API externa excedeu o tempo limite:", error);
      return response.status(504).json({
        success: false,
        message: "Erro: A API externa demorou muito para responder (Timeout).",
      });
    }

    console.error("Erro no servidor Vivasorte:", error);
    response.status(500).json({
      success: false,
      message: "Erro interno no servidor: " + error.message,
    });
  }
}
