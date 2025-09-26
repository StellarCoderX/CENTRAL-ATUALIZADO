/**
 * /api/tools/vivasorte_checker.js (Versão Final e Robusta)
 *
 * Este script atua como um proxy seguro e eficiente.
 * 1. Não requer dependências externas (sem 'busboy').
 * 2. Transmite o arquivo diretamente (streaming), economizando memória.
 * 3. É robusto: não quebra se o servidor final retornar um texto que não seja JSON.
 */

// Configuração para a Vercel: Desabilita o processador de corpo automático.
// Isso nos permite receber o arquivo como um fluxo de dados (stream) e evitar a necessidade do 'busboy'.
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(request, response) {
  // Aceita apenas requisições do tipo POST.
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Método não permitido' });
  }

  try {
    // Reencaminha a requisição para o servidor final.
    const apiResponse = await fetch("http://72.60.143.32:3010/api/vivasorte/db", {
      method: 'POST',
      headers: {
        // Passa o cabeçalho 'Content-Type' original, essencial para o upload de arquivos.
        'Content-Type': request.headers['content-type'],
      },
      // Passa a requisição como um stream. A opção 'duplex' é necessária
      // para compatibilidade com as versões mais recentes do Node.js.
      body: request,
      duplex: 'half',
    });

    // Lê a resposta do servidor final como texto para evitar erros de JSON.
    const responseText = await apiResponse.text();

    let responseData;
    try {
      // Tenta converter o texto da resposta em um objeto JSON.
      responseData = JSON.parse(responseText);
    } catch (jsonError) {
      // Se a conversão falhar (ex: a resposta foi "ok" ou um erro de HTML),
      // o proxy não vai quebrar. Em vez disso, ele reportará o erro.
      console.error("Erro de JSON: O servidor final não retornou um JSON válido.", {
        status: apiResponse.status,
        respostaRecebida: responseText,
      });
      // Retorna um erro 502 (Bad Gateway), que significa que o proxy recebeu
      // uma resposta inválida do servidor ao qual se conectou.
      return response.status(502).json({
        success: false,
        message: "Erro de comunicação: O servidor final retornou uma resposta inesperada.",
        backendResponse: responseText,
      });
    }

    // Se o JSON for válido, envia os dados e o status originais para o frontend.
    return response.status(apiResponse.status).json(responseData);

  } catch (error) {
    // Se ocorrer um erro de rede ou qualquer outro erro inesperado na função,
    // ele será capturado aqui.
    console.error('Erro crítico na função serverless da Vercel:', error);
    return response.status(500).json({
      success: false,
      message: 'Erro interno no servidor da Vercel: ' + error.message
    });
  }
}
