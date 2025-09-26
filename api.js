const API_BASE_URL = "/api/auth";

async function request(endpoint, method = "POST", body = null, isFormData = false) {
  const headers = {};
  const token = localStorage.getItem("accessToken");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
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

    let displayMessage = error.message;

    if (error.message === "Invalid login credentials") {
      displayMessage = "LOGIN INVÁLIDO";
    } else if (error.message === "Email not confirmed") {
      displayMessage = "Para poder entrar você precisa verificar seu EMAIL";
    }

    if (window.UI && typeof window.UI.showFeedback === "function") {
      window.UI.showFeedback(displayMessage, "error");
    }
    throw error;
  }
}

const API = {
  login: (email, password) => request("login", "POST", { email, password }),
  register: (username, email, password) =>
    request("register", "POST", { username, email, password }),
  
  // --- NOVA FUNÇÃO ADICIONADA AQUI ---
  uploadAvatar: (formData) => request("upload-avatar", "POST", formData, true),
};

export default API;
