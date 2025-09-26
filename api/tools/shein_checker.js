// /api/tools/shein_checker.js

// Esta é a sua Serverless Function para a Vercel.
// Ela atua como o backend seguro para a sua ferramenta.
export default async function handler(request, response) {
  // Apenas permite requisições do tipo POST
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Método não permitido' });
  }

  try {
    // Pega os dados enviados pelo frontend
    const { lista, proxy_host, proxy_port, proxy_user, proxy_pass } = request.body;

    if (!lista) {
      return response.status(400).json({ success: false, message: 'Parâmetro "lista" não fornecido.' });
    }

    // Monta a URL da API externa que será chamada
    let targetUrl = `https://shein-apil-production.up.railway.app/api/login?lista=${encodeURIComponent(lista)}`;

    if (proxy_host && proxy_port) {
      targetUrl += `&proxy_host=${encodeURIComponent(proxy_host)}`;
      targetUrl += `&proxy_port=${encodeURIComponent(proxy_port)}`;
      if (proxy_user) {
        targetUrl += `&proxy_user=${encodeURIComponent(proxy_user)}`;
      }
      if (proxy_pass) {
        targetUrl += `&proxy_pass=${encodeURIComponent(proxy_pass)}`;
      }
    }

    // Faz a chamada para a API externa
    const apiResponse = await fetch(targetUrl, {
      method: 'GET',
      timeout: 98000, // Timeout em milissegundos
    });

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      throw new Error(`Erro na API externa: ${apiResponse.status} ${apiResponse.statusText} - ${errorBody}`);
    }

    // Envia a resposta da API externa de volta para o seu frontend
    const data = await apiResponse.json();
    response.status(200).json(data);

  } catch (error) {
    console.error('Erro no servidor:', error);
    response.status(500).json({ success: false, message: 'Erro interno no servidor: ' + error.message });
  }
}