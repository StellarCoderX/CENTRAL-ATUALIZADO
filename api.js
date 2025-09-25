async function request(endpoint, method = "POST", body = null) {
  const headers = {
    "Content-Type": "application/json",
  };

  const token = localStorage.getItem("accessToken");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, config);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Ocorreu um erro no servidor.");
    }

    return responseData;
  } catch (error) {
    console.error("Erro na API:", error);

    // --- INÍCIO DA MODIFICAÇÃO: MENSAGENS CUSTOMIZADAS ---
    let displayMessage = error.message; // Pega a mensagem de erro original

    if (error.message === "Invalid login credentials") {
      displayMessage = "LOGIN INVÁLIDO"; // Troca a mensagem de login
    } else if (error.message === "Email not confirmed") {
      displayMessage = "Para poder entrar você precisa verificar seu EMAIL"; // Troca a mensagem de email não confirmado
    }
    // --- FIM DA MODIFICAÇÃO ---

    if (window.UI && typeof window.UI.showFeedback === "function") {
      // Exibe a mensagem (original ou modificada)
      window.UI.showFeedback(displayMessage, "error");
    }
    throw error;
  }
}
