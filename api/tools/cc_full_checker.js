// /api/tools/cc_full_checker.js

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ message: "Método não permitido" });
  }

  try {
    const authorizationToken = request.headers["authorization"];
    const headers = {
      "Content-Type": request.headers["content-type"],
    };

    if (authorizationToken) {
      headers["Authorization"] = authorizationToken;
    }

    // TODO: Ajuste a URL final para a API do checker de CC FULL.
    const apiResponse = await fetch("http://72.60.143.32:3010/api/cc-full/db", {
      method: "POST",
      headers: headers,
      body: request,
      duplex: "half",
    });

    const responseText = await apiResponse.text();
    let responseData;

    try {
      responseData = JSON.parse(responseText);
    } catch (jsonError) {
      console.error(
        "Erro de JSON (CC FULL): O servidor final não retornou um JSON válido.",
        {
          status: apiResponse.status,
          respostaRecebida: responseText,
        }
      );
      return response.status(502).json({
        success: false,
        message: "Erro de comunicação com o servidor final.",
        backendResponse: responseText,
      });
    }

    return response.status(apiResponse.status).json(responseData);
  } catch (error) {
    console.error("Erro crítico na função da Vercel (CC FULL):", error);
    return response.status(500).json({
      success: false,
      message: "Erro interno no servidor da Vercel: " + error.message,
    });
  }
}