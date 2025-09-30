async function request(path, method = "POST", body = null, isFormData = false) {
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
    const response = await fetch(path, config);

    // Check if the response has content before trying to parse it as JSON.
    const contentType = response.headers.get("content-type");
    let responseData = {}; // Default to an empty object
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      // If not JSON, you might want to handle it as text or just know it's empty.
      // For a 204 No Content, the body will be empty and this avoids the error.
    }

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
  login: (email, password) =>
    request("/api/auth/login", "POST", { email, password }),
  register: (username, email, password) =>
    request("/api/auth/register", "POST", { username, email, password }),

  // --- NOVA FUNÇÃO ADICIONADA AQUI ---
  uploadAvatar: (formData) =>
    request("/api/auth/upload-avatar", "POST", formData, true),
};

export default API;
