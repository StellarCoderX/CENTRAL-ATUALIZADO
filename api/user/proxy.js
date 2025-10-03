// /api/user/proxy.js

export default async function handler(request, response) {
  // Altera a verificação para aceitar apenas o método PATCH
  if (request.method !== 'PATCH') {
    return response.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const authorizationToken = request.headers['authorization'];
    if (!authorizationToken) {
      return response.status(401).json({ message: 'Token de autorização não fornecido.' });
    }

    const headers = {
      'Authorization': authorizationToken,
      'Content-Type': 'application/json', // O servidor final espera JSON
    };

    // Reencaminha a requisição usando o método PATCH
    const apiResponse = await fetch("http://72.60.143.32:3010/api/user/proxy", {
      method: 'PATCH', // <-- MÉTODO ALTERADO PARA PATCH
      headers: headers,
      body: JSON.stringify(request.body), // Envia o corpo da requisição como JSON
    });

    const responseData = await apiResponse.json();
    
    return response.status(apiResponse.status).json(responseData);

  } catch (error) {
    console.error('Erro crítico na função da Vercel (user/proxy):', error);
    return response.status(500).json({
      success: false,
      message: 'Erro interno no servidor da Vercel: ' + error.message
    });
  }
}
