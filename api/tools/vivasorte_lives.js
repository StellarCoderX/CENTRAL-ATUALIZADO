// /api/tools/vivasorte_lives.js

export default async function handler(request, response) {
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

    const apiResponse = await fetch("http://72.60.143.32:3010/api/vivasorte/live", {
      method: 'GET',
      headers: headers,
    });

    // AJUSTE 1: Ler a resposta como texto primeiro para evitar erros de JSON
    const responseText = await apiResponse.text();
    let responseData;

    // AJUSTE 2: Tentar converter o texto para JSON dentro de um bloco try...catch
    try {
      responseData = JSON.parse(responseText);
    } catch (jsonError) {
      // Se a conversão falhar, é porque a API final retornou um erro (provavelmente HTML ou texto simples)
      console.error("Erro de JSON (vivasorte_lives): O servidor final não retornou um JSON válido.", {
        status: apiResponse.status,
        respostaRecebida: responseText,
      });
      // Retorna uma mensagem de erro mais clara para o frontend
      return response.status(502).json({ // 502 Bad Gateway é mais apropriado aqui
        success: false,
        message: "Erro de comunicação com o servidor final. A API pode estar offline ou instável.",
        backendResponse: responseText,
      });
    }
    
    // Se a resposta da API externa indicar um erro (mesmo sendo um JSON válido)
    if (!apiResponse.ok) {
        throw new Error(responseData.message || "Ocorreu um erro ao buscar as lives no servidor final.");
    }

    // Se tudo correu bem, envia os dados para o frontend
    return response.status(200).json(responseData);

  } catch (error) {
    console.error('Erro crítico na função serverless (vivasorte_lives):', error);
    return response.status(500).json({
      success: false,
      message: 'Bug' + error.message
    });
  }
}

