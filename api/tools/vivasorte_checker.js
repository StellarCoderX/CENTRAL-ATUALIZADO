// /api/tools/vivasorte_checker.js

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Método não permitido' });
  }

  try {
    // A Vercel já faz o parse de `FormData` para si.
    // O corpo da requisição (request.body) já contém os dados do arquivo.
    // Aqui, estamos a reencaminhar o corpo inteiro para o seu backend principal.
    const apiResponse = await fetch("http://72.60.143.32:3010/api/vivasorte/db", {
      method: 'POST',
      headers: {
        // O tipo de conteúdo é tratado pelo `FormData` e `fetch`
        // Não defina 'Content-Type' manualmente aqui para deixar o browser fazê-lo
      },
      body: request.body,
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      throw new Error(`Erro do servidor backend: ${apiResponse.status} - ${errorText}`);
    }

    const data = await apiResponse.json();
    response.status(200).json(data);

  } catch (error) {
    console.error('Erro no servidor Vercel:', error);
    response.status(500).json({ success: false, message: 'Erro interno no servidor: ' + error.message });
  }
}
