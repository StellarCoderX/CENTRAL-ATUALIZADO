// /api/tools/vivasorte_checker.js (Versão Final Corrigida)

// A LINHA "import fetch from 'node-fetch';" FOI REMOVIDA DAQUI.

export default async function handler(request, response) {
  // Aceita apenas o método POST
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Método não permitido' });
  }

  try {
    // Reencaminha a requisição (com o ficheiro .txt) para o seu servidor final
    // A função 'fetch' é nativa no ambiente da Vercel e não precisa de importação
    const apiResponse = await fetch("http://72.60.143.32:3010/api/vivasorte/db", {
      method: 'POST',
      headers: {
        // Passa os cabeçalhos originais, importantes para o envio de ficheiros
        'Content-Type': request.headers['content-type'],
      },
      body: request.body, // Reencaminha o corpo da requisição (o ficheiro)
    });

    // Lê a resposta do seu servidor
    const responseData = await apiResponse.json();

    // Se o seu servidor retornou um erro, envia esse erro de volta para o frontend
    if (!apiResponse.ok) {
      // Devolve a mensagem de erro vinda do seu servidor para depuração
      console.error("Erro retornado pelo backend principal:", responseData);
      return response.status(apiResponse.status).json(responseData);
    }

    // Se tudo correu bem, envia a resposta de sucesso para o frontend
    response.status(200).json(responseData);

  } catch (error) {
    // Se ocorrer um erro nesta função, reporta-o
    console.error('Erro na função serverless da Vercel:', error);
    response.status(500).json({ success: false, message: 'Erro interno no servidor da Vercel: ' + error.message });
  }
}
