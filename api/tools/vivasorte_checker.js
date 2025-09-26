// /api/tools/vivasorte_checker.js (Versão Final Corrigida)

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const apiResponse = await fetch("http://72.60.143.32:3010/api/vivasorte/db", {
      method: 'POST',
      headers: {
        'Content-Type': request.headers['content-type'],
      },
      body: request,
      duplex: 'half', // <-- A CORREÇÃO ESTÁ AQUI
    });

    const responseData = await apiResponse.json();

    if (!apiResponse.ok) {
      console.error("Erro retornado pelo backend principal:", responseData);
      return response.status(apiResponse.status).json(responseData);
    }

    response.status(200).json(responseData);

  } catch (error) {
    console.error('Erro na função serverless da Vercel:', error);
    response.status(500).json({ success: false, message: 'Erro interno no servidor da Vercel: ' + error.message });
  }
}
