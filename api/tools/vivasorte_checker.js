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

    let targetUrl = `http://72.60.143.32:3010/api/vivasorte/db?lista=${encodeURIComponent(lista)}`;

    if (proxy_host && proxy_port) {
      targetUrl += `&proxy_host=${encodeURIComponent(proxy_host[0])}`;
      targetUrl += `&proxy_port=${encodeURIComponent(proxy_port[0])}`;
      if (proxy_user && proxy_user[0]) {
        targetUrl += `&proxy_user=${encodeURIComponent(proxy_user[0])}`;
      }
      if (proxy_pass && proxy_pass[0]) {
        targetUrl += `&proxy_pass=${encodeURIComponent(proxy_pass[0])}`;
      }
    }

    // --- INÍCIO DA CORREÇÃO: ADICIONANDO TIMEOUT ---
    const controller = new AbortController();
    // Define um tempo limite de 30 segundos. Se a API externa não responder, a requisição é cancelada.
    const timeoutId = setTimeout(() => controller.abort(), 30000); 

    const apiResponse = await fetch(targetUrl, {
      method: "GET",
      signal: controller.signal, // Associa o controlador de timeout à requisição
    });

    // Limpa o timeout, pois a requisição foi concluída a tempo.
    clearTimeout(timeoutId);
    // --- FIM DA CORREÇÃO ---

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      throw new Error(`Erro na API externa: ${apiResponse.status} - ${errorBody}`);
    }

    const responseData = await apiResponse.json();
    response.status(200).json(responseData);

  } catch (error) {
    // --- INÍCIO DA CORREÇÃO: CAPTURANDO O ERRO DE TIMEOUT ---
    // Se o erro foi causado pelo cancelamento (timeout), envia uma mensagem específica.
    if (error.name === 'AbortError') {
      console.error("Fetch para API externa excedeu o tempo limite:", error);
      return response.status(504).json({ // 504 Gateway Timeout
        success: false,
        message: "Erro: A API externa demorou muito para responder (Timeout). Tente novamente mais tarde.",
      });
    }
    // --- FIM DA CORREÇÃO ---

    console.error("Erro no servidor Vivasorte:", error);
    response.status(500).json({
      success: false,
      message: "Erro interno no servidor: " + error.message,
    });
  }
}
