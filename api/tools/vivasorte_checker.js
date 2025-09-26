import busboy from 'busboy';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Método não permitido' });
  }

  const backendUrl = "http://72.60.143.32:3010/api/vivasorte/db";

  try {
    const bb = busboy({ headers: request.headers } );
    request.pipe(bb);

    bb.on('file', (fieldname, file, _filename, _encoding, _mimetype) => {
      fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': request.headers['content-type'],
        },
        body: file,
      })
      .then(apiResponse => {
        return apiResponse.json().then(data => ({ status: apiResponse.status, body: data }));
      })
      .then(({ status, body }) => {
        response.status(status).json(body);
      })
      .catch(err => {
        console.error('Erro ao contatar o servidor de backend:', err);
        response.status(500).json({ success: false, message: 'Erro de comunicação com o servidor final: ' + err.message });
      });
    });

    bb.on('error', (err) => {
        console.error('Erro no processamento do Busboy:', err);
        response.status(500).json({ success: false, message: 'Erro ao processar o arquivo enviado.' });
    });

  } catch (error) {
    console.error('Erro na função serverless da Vercel:', error);
    response.status(500).json({ success: false, message: 'Erro interno no servidor da Vercel: ' + error.message });
  }
}
