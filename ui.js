import Auth from "./auth.js";
import API from "./api.js";

const UI = {
  appRoot: document.getElementById("app-root"),

  showFeedback(message, type = "info", duration = 5000) {
    const existingFeedback = document.querySelector(".feedback-container");
    if (existingFeedback) {
      existingFeedback.remove();
    }
    const feedbackContainer = document.createElement("div");
    feedbackContainer.className = "feedback-container";
    const feedbackDiv = document.createElement("div");
    feedbackDiv.className = `feedback ${type} cyber-feedback`;
    const icon = type === "success" ? "check-circle" : "exclamation-triangle";
    feedbackDiv.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
    feedbackContainer.appendChild(feedbackDiv);
    document.body.appendChild(feedbackContainer);
    setTimeout(() => feedbackDiv.classList.add("visible"), 10);
    setTimeout(() => {
      feedbackDiv.classList.remove("visible");
      setTimeout(() => feedbackContainer.remove(), 500);
    }, duration);
  },

  renderLoginPage() {
    document.title = "Login | Central de Checkers Pro";
    this.appRoot.innerHTML = `
        <div class="main-container">
            <div class="content-wrapper cyber-fade-in">
                <div class="main-card cyber-card">
                    <div class="header">
                        <div class="logo">
                            <div class="logo-icon cyber-icon"><i class="fas fa-shield-alt"></i><div class="icon-pulse"></div></div>
                            <h1 class="logo-text cyber-title">Central de Checkers</h1>
                        </div>
                        <p class="subtitle terminal-text">Dev - ALVINCODER</p>
                    </div>
                    <form id="loginForm" class="cyber-form">
                        <div class="form-group">
                            <label for="email" class="form-label cyber-label">E-mail</label>
                            <input type="email" id="email" name="email" class="form-input cyber-input" placeholder="Digite seu e-mail" required>
                        </div>
                        <div class="form-group">
                            <label for="password" class="form-label cyber-label">Senha</label>
                            <input type="password" id="password" name="password" class="form-input cyber-input" placeholder="Digite sua senha" required>
                        </div>
                        <button type="submit" class="btn btn-primary btn-full cyber-btn cyber-execute-btn">
                            <i class="fas fa-sign-in-alt"></i> <span class="btn-text">Entrar</span><div class="btn-glow"></div>
                        </button>
                    </form>
                    <div class="text-center mt-3">
                        <p class="terminal-text">Não possui uma conta? <a href="#register" class="link cyber-link">Criar Conta</a></p>
                    </div>
                </div>
            </div>
        </div>`;
    document.getElementById("loginForm").addEventListener("submit", (e) => {
      e.preventDefault();
      Auth.login(e.target.email.value, e.target.password.value);
    });
  },

  renderRegisterPage() {
    document.title = "Criar Conta | Central de Checkers Pro";
    this.appRoot.innerHTML = `
        <div class="main-container">
            <div class="content-wrapper cyber-fade-in">
                <div class="main-card cyber-card">
                    <div class="header">
                        <div class="logo">
                            <div class="logo-icon cyber-icon"><i class="fas fa-user-plus"></i><div class="icon-pulse"></div></div>
                            <h1 class="logo-text cyber-title">Criar Conta</h1>
                        </div>
                        <p class="subtitle terminal-text">Registre-se para acessar o sistema.</p>
                    </div>
                    <form id="registerForm" class="cyber-form">
                        <div class="form-group">
                            <label for="username" class="form-label cyber-label">Usuário</label>
                            <input type="text" id="username" name="username" class="form-input cyber-input" placeholder="Digite seu nome de usuário" required minlength="3">
                        </div>
                        <div class="form-group">
                            <label for="email" class="form-label cyber-label">E-mail</label>
                            <input type="email" id="email" name="email" class="form-input cyber-input" placeholder="Digite seu e-mail" required>
                        </div>
                        <div class="form-group">
                            <label for="password" class="form-label cyber-label">Senha</label>
                            <input type="password" id="password" name="password" class="form-input cyber-input" placeholder="Mínimo 8 caracteres" required minlength="8">
                        </div>
                        <button type="submit" class="btn btn-primary btn-full cyber-btn cyber-execute-btn">
                            <i class="fas fa-user-plus"></i> <span class="btn-text">Criar Conta</span><div class="btn-glow"></div>
                        </button>
                    </form>
                    <div class="text-center mt-3">
                        <p class="terminal-text">Já possui uma conta? <a href="#login" class="link cyber-link">Fazer Login</a></p>
                        <p class="cyber-text" style="color: var(--success); font-size: 0.9rem; margin-top: 1rem;">
                            <i class="fas fa-gift"></i> Novos usuários podem receber créditos!
                        </p>
                    </div>
                </div>
            </div>
        </div>`;
    document.getElementById("registerForm").addEventListener("submit", (e) => {
      e.preventDefault();
      Auth.register(
        e.target.username.value,
        e.target.email.value,
        e.target.password.value
      );
    });
  },

  async renderDashboardPage() {
    document.title = "Dashboard | Central de Checkers Pro";
    const user = Auth.getCurrentUser();
    if (!user) {
      window.location.hash = "#login";
      return;
    }
    this.appRoot.innerHTML = `
        <div class="dashboard-container cyber-fade-in">
            <header class="dashboard-header">
                <div class="user-info">
                    <div class="user-avatar cyber-glow" id="header-avatar">
                        ${
                          user.avatarUrl
                            ? `<img src="${user.avatarUrl}">`
                            : `<i class="fas fa-user-circle" style="font-size: 40px;"></i>`
                        }
                    </div>
                    <div>
                        <div class="cyber-text">Bem-vindo, ${
                          user.username || user.email
                        }</div>
                        <div class="terminal-text" id="user-balance">Saldo: Carregando... | Sistema: <span class="status-online">ONLINE</span></div>
                    </div>
                </div>
                <nav class="flex gap-2">
                    <a href="#credits" class="btn btn-primary cyber-btn"><i class="fas fa-coins"></i> Créditos</a>
                    <a href="#profile" class="btn btn-secondary cyber-btn"><i class="fas fa-user-cog"></i> Perfil</a>
                    <button id="logoutBtn" class="btn btn-danger cyber-btn"><i class="fas fa-sign-out-alt"></i> Sair</button>
                </nav>
            </header>
            <main class="main-card cyber-card">
                 <div class="header">
                    <div class="logo">
                        <div class="logo-icon cyber-icon"><i class="fas fa-shield-alt"></i><div class="icon-pulse"></div></div>
                        <h1 class="logo-text cyber-title">Central de Checkers</h1>
                    </div>
                    <p class="subtitle terminal-text">Selecione uma ferramenta para iniciar a operação.</p>
                </div>
                <div class="tools-grid" id="tools-grid">
                    <div class="text-center" style="grid-column: 1 / -1; padding: 3rem;"><i class="fas fa-spinner fa-spin cyber-pulse" style="font-size: 4rem;"></i><h3 class="terminal-text">Carregando ferramentas...</h3></div>
                </div>
            </main>
        </div>`;
    document.getElementById("logoutBtn").addEventListener("click", Auth.logout);
    setTimeout(() => {
      document.getElementById("user-balance").innerHTML = `Saldo: ${
        user.credits || 0
      } Créditos | Sistema: <span class="status-online">ONLINE</span>`;
      const toolsGrid = document.getElementById("tools-grid");
      toolsGrid.innerHTML = `
                 <a href="#" class="tool-card cyber-tool-card">
                    <div class="tool-icon cyber-tool-icon"><i class="fas fa-credit-card"></i><div class="tool-icon-glow"></div></div>
                    <h2 class="tool-name cyber-text">Checker Exemplo</h2>
                    <p class="tool-desc terminal-text">Uma ferramenta de exemplo para demonstração.</p>
                    <div class="tool-status"><span class="status-indicator"></span><span class="status-text">online</span></div>
                </a>
            `;
    }, 1000);
  },
};

window.UI = UI;

export default UI;
