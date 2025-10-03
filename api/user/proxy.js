// /api/user/proxy.js

export default async function handler(request, response) {
  // Aceita apenas requisições do tipo POST.
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const authorizationToken = request.headers['authorization'];
    if (!authorizationToken) {
      return response.status(401).json({ message: 'Token de autorização não fornecido.' });
    }

    // Prepara os cabeçalhos para a requisição final, incluindo o Content-Type original
    const headers = {
      'Authorization': authorizationToken,
      'Content-Type': request.headers['content-type'],
    };

    // Reencaminha a requisição POST para o servidor final, passando o corpo como um stream
    const apiResponse = await fetch("http://72.60.143.32:3010/api/user/proxy", {
      method: 'POST',
      headers: headers,
      body: request,     // <-- Alteração 1: Passa a requisição diretamente
      duplex: 'half',  // <-- Alteração 2: Necessário para encaminhar o corpo da requisição
    });

    const responseData = await apiResponse.json();
    
    // Retorna a resposta (sucesso ou erro) do servidor final para o frontend
    return response.status(apiResponse.status).json(responseData);

  } catch (error) {
    console.error('Erro crítico na função da Vercel (user/proxy):', error);
    return response.status(500).json({
      success: false,
      message: 'Erro interno no servidor da Vercel: ' + error.message
    });
  }
}
