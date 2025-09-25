import API from "./api.js";

let currentUser = null;

function loadUserFromToken() {
  const token = localStorage.getItem("accessToken");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      currentUser = {
        uid: payload.id,
        email: payload.email,
        username: payload.username,
        credits: payload.credits,
      };
    } catch (e) {
      console.error("Token inválido. Limpando...", e);
      localStorage.removeItem("accessToken");
      currentUser = null;
    }
  } else {
    currentUser = null;
  }
  window.dispatchEvent(new Event("authstatechanged"));
}

const Auth = {
  async register(username, email, password) {
    try {
      const response = await API.register(username, email, password);

      window.UI.showFeedback(
        response.message || "Registro concluído! Faça o login.",
        "success",
        3000
      );

      setTimeout(() => {
        window.location.hash = "#login";
      }, 2500);
    } catch (error) {
      console.error("Erro no registro:", error);
    }
  },

  async login(email, password) {
    try {
      const responseData = await API.login(email, password);

      if (responseData.accessToken) {
        localStorage.setItem("accessToken", responseData.accessToken);

        currentUser = responseData.user;

        window.UI.showFeedback(
          "Login realizado! Redirecionando...",
          "success",
          2000
        );

        window.dispatchEvent(new Event("authstatechanged"));
      } else {
        throw new Error("Token de acesso não recebido do servidor.");
      }
    } catch (error) {
      console.error("Erro no login:", error);
    }
  },

  logout() {
    currentUser = null;
    localStorage.removeItem("accessToken");
    window.UI.showFeedback("Você foi desconectado com segurança.", "info");

    window.dispatchEvent(new Event("authstatechanged"));
  },

  isAuthenticated: () => !!currentUser,

  getCurrentUser: () => currentUser,

  init() {
    loadUserFromToken();
  },
};

Auth.init();

export default Auth;
