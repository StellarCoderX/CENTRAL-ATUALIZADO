// /api/tools/vivasorte_lives.js

export default async function handler(request, response) {
  // Aceita apenas requisições do tipo GET.
  if (request.method !== 'GET') {
    return response.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const authorizationToken = request.headers['authorization'];
    if (!authorizationToken) {
      return response.status(401).json({ message: 'Token de autorização não fornecido.' });
    }

    const headers = {
      'Authorization': authorizationToken,
    };

    // Faz a requisição GET para o endpoint que lista as LIVES
    const apiResponse = await fetch("http://72.60.143.32:3010/api/vivasorte/live", {
      method: 'GET',
      headers: headers,
    });

    const responseData = await apiResponse.json();
    
    if (!apiResponse.ok) {
        // Se a API externa retornar um erro (ex: 401, 500), repassa a mensagem.
        throw new Error(responseData.message || "Erro ao buscar as lives no servidor final.");
    }

    // Se tudo deu certo, envia os dados para o frontend.
    return response.status(200).json(responseData);

  } catch (error) {
    console.error('Erro crítico na função serverless (vivasorte_lives):', error);
    return response.status(500).json({
      success: false,
      message: 'Erro interno no servidor da Vercel: ' + error.message
    });
  }
}