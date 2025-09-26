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

    // --- INÍCIO DA CORREÇÃO: MUDANÇA PARA 'x-www-form-urlencoded' ---

    const targetUrl = `http://72.60.143.32:3010/api/vivasorte/db`;

    // 1. Usa URLSearchParams para construir o corpo no formato 'key=value&key2=value2'
    const bodyParams = new URLSearchParams();
    bodyParams.append('lista', lista);

    // Adiciona os dados de proxy se eles forem fornecidos e não estiverem vazios
    if (proxy_host && proxy_host[0]) {
      bodyParams.append('proxy_host', proxy_host[0]);
    }
    if (proxy_port && proxy_port[0]) {
      bodyParams.append('proxy_port', proxy_port[0]);
    }
    if (proxy_user && proxy_user[0]) {
      bodyParams.append('proxy_user', proxy_user[0]);
    }
    if (proxy_pass && proxy_pass[0]) {
      bodyParams.append('proxy_pass', proxy_pass[0]);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    // 2. Altera o 'Content-Type' e envia o corpo formatado
    const apiResponse = await fetch(targetUrl, {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // <- MUDANÇA CRÍTICA
      },
      body: bodyParams, // Envia o corpo formatado pelo URLSearchParams
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
