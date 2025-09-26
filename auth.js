import API from "./api.js";

let currentUser = null;

// Função para decodificar o token JWT e extrair os dados do usuário
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Erro ao decodificar o token:", e);
    return null;
  }
}


function loadUserFromToken() {
  const token = localStorage.getItem("accessToken");
  if (token) {
    try {
      const payload = parseJwt(token);

      // Extrai os dados do usuário do payload do token
      currentUser = {
        uid: payload.sub, // ID do usuário
        email: payload.email,
        username: payload.user_metadata?.username || "Usuário", // Pega o username de dentro do user_metadata
        credits: payload.user_metadata?.credits || 0, // Assume 0 se não houver créditos no token
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
      
      // --- MODIFICAÇÃO PRINCIPAL AQUI ---
      // Procuramos por 'token' em vez de 'accessToken'
      if (responseData.token) {
        const token = responseData.token;
        localStorage.setItem("accessToken", token);

        // Decodificamos o token para obter os dados do usuário
        const payload = parseJwt(token);
        if (payload) {
             currentUser = {
                uid: payload.sub,
                email: payload.email,
                username: payload.user_metadata?.username || "Usuário",
                credits: payload.user_metadata?.credits || 0, // Assumimos 0 créditos por padrão
             };
        }
        // --- FIM DA MODIFICAÇÃO ---

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
