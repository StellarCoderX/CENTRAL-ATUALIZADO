// /api/tools/vivasorte_checker.js

// Backend para a ferramenta Vivasorte
export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ message: "Método não permitido" });
  }

  try {
    const { lista, proxy_host, proxy_port, proxy_user, proxy_pass } =
      request.body;

    if (!lista) {
      return response
        .status(400)
        .json({ success: false, message: 'Parâmetro "lista" não fornecido.' });
    }

    // --- ATENÇÃO: SUBSTITUA PELA URL CORRETA DA API VIVASORTE ---
    let targetUrl = `https://URL_DA_SUA_API_VIVASORTE.com/api/login?lista=${encodeURIComponent(
      lista
    )}`;
    // -----------------------------------------------------------------

    if (proxy_host && proxy_port) {
      targetUrl += `&proxy_host=${encodeURIComponent(proxy_host)}`;
      targetUrl += `&proxy_port=${encodeURIComponent(proxy_port)}`;
      if (proxy_user) {
        targetUrl += `&proxy_user=${encodeURIComponent(proxy_user)}`;
      }
      if (proxy_pass) {
        targetUrl += `&proxy_pass=${encodeURIComponent(proxy_pass)}`;
      }
    }

    const apiResponse = await fetch(targetUrl, {
      method: "GET",
      timeout: 98000,
    });

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      throw new Error(
        `Erro na API externa: ${apiResponse.status} ${apiResponse.statusText} - ${errorBody}`
      );
    }

    const data = await apiResponse.json();
    response.status(200).json(data);
  } catch (error) {
    console.error("Erro no servidor Vivasorte:", error);
    response.status(500).json({
      success: false,
      message: "Erro interno no servidor: " + error.message,
    });
  }
}
