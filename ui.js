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
    document
      .getElementById("loginForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText =
          submitBtn.querySelector(".btn-text").textContent;

        // Desabilita o botão e mostra o estado de carregamento
        submitBtn.disabled = true;
        submitBtn.querySelector(".btn-text").textContent = "AUTENTICANDO...";

        try {
          await Auth.login(form.email.value, form.password.value);
        } catch (error) {
          // O erro já é exibido pelo api.js, então só precisamos reativar o botão
          submitBtn.disabled = false;
          submitBtn.querySelector(".btn-text").textContent = originalBtnText;
        }
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

    const balance = (user.credits || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    this.appRoot.innerHTML = `
        <div class="dashboard-container cyber-fade-in">
            <header class="dashboard-header">
                <div class="user-info">
                    <div class="user-avatar cyber-glow" id="header-avatar" style="font-size: 1.5rem; background: linear-gradient(135deg, var(--primary), var(--accent));">
                         ${
                           user.avatarUrl
                             ? `<img src="${user.avatarUrl}" style="width:100%; height:100%; border-radius: 50%;">`
                             : user.username
                             ? user.username.charAt(0).toUpperCase()
                             : "U"
                         }
                    </div>
                    <div>
                        <div class="cyber-text">Bem-vindo, ${
                          user.username || user.email
                        }</div>
                        <div class="terminal-text" id="user-balance">Saldo: ${balance} | Sistema: <span class="status-online">ONLINE</span></div>
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
                  
                    <a href="#" class="tool-card cyber-tool-card">
                        <div class="tool-icon cyber-tool-icon"><i class="fas fa-credit-card"></i><div class="tool-icon-glow"></div></div>
                        <h2 class="tool-name cyber-text">CHK CC FULL</h2>
                        <p class="tool-desc terminal-text">DEBITANDO | USE PROXY</p>
                        <div class="tool-status">
                            <span class="status-indicator offline"></span><span class="status-text offline">OFFLINE</span>
                        </div>
                    </a>
                   <a href="#" class="tool-card cyber-tool-card">
                        <div class="tool-icon cyber-tool-icon"><i class="fas fa-rocket"></i><div class="tool-icon-glow"></div></div>
                        <h2 class="tool-name cyber-text">CHK KABUM</h2>
                        <p class="tool-desc terminal-text">CHK LOGIN</p>
                        <div class="tool-status">
                            <span class="status-indicator offline"></span><span class="status-text offline">OFFLINE</span>
                        </div>
                    </a>
                    <a href="#shein-checker" class="tool-card cyber-tool-card">
                        <div class="tool-icon cyber-tool-icon"><i class="fas fa-shield-alt"></i><div class="tool-icon-glow"></div></div>
                        <h2 class="tool-name cyber-text">CHK SHEIN</h2>
                        <p class="tool-desc terminal-text">CHK DE LOGIN Pode sair Falsa Live | USE PROXY!</p>
                        <div class="tool-status">
                            <span class="status-indicator offline"></span><span class="status-text offline">OFFLINE</span>
                        </div>
                    </a>
                    <a href="#vivasorte-checker" class="tool-card cyber-tool-card">
                        <div class="tool-icon cyber-tool-icon"><i class="fas fa-star"></i><div class="tool-icon-glow"></div></div>
                        <h2 class="tool-name cyber-text">CHK VIVASORTE</h2>
                        <p class="tool-desc terminal-text">CHK LOGIN PUXANDO INFORMACOES | USE PROXY</p>
                        <div class="tool-status">
                            <span class="status-indicator online"></span><span class="status-text online">ONLINE</span>
                        </div>
                    </a>
                    
                    <a href="#gg-vtex-checker" class="tool-card cyber-tool-card">
                        <div class="tool-icon cyber-tool-icon"><i class="fas fa-credit-card"></i><div class="tool-icon-glow"></div></div>
                        <h2 class="tool-name cyber-text">CHK GG VTEX</h2>
                        <p class="tool-desc terminal-text">CHK GERADAS GATE VTEX</p>
                        <div class="tool-status">
                            <span class="status-indicator online"></span><span class="status-text online">ONLINE</span>
                        </div>
                    </a>
                    </div>
            </main>
        </div>`;

    document.getElementById("logoutBtn").addEventListener("click", Auth.logout);

    // Lógica para bloquear ferramentas offline
    const toolCards = document.querySelectorAll(".tool-card");
    toolCards.forEach((card) => {
      const isOffline = card.querySelector(".status-indicator.offline");
      if (isOffline) {
        card.style.opacity = "0.5";
        card.style.cursor = "not-allowed";
        card.addEventListener("click", (event) => {
          event.preventDefault();
          UI.showFeedback("Esta ferramenta está offline.", "error");
        });
      }
    });
  },

  // /ui.js

  async renderToolPage() {
    const hash = window.location.hash.substring(1);

    // CORREÇÃO: Converte hífens do nome para underscores para corresponder ao nome da pasta.
    const toolName = hash.replace("-checker", "").replace(/-/g, "_");

    try {
      // O caminho agora será gerado corretamente (ex: ../tools/gg_vtex_checker/index.js)
      const toolModule = await import(`../tools/${toolName}_checker/index.js`);

      if (toolModule && typeof toolModule.render === "function") {
        toolModule.render(this.appRoot);
      } else {
        throw new Error(
          `O módulo da ferramenta ${toolName} não foi encontrado ou não tem a função render.`
        );
      }
    } catch (error) {
      console.error("Erro ao carregar a ferramenta:", error);
      this.appRoot.innerHTML = `<p style="color: red; text-align: center;">Não foi possível carregar a ferramenta.</p>`;
    }
  },

  renderProfilePage() {
    document.title = "Meu Perfil | Central de Checkers Pro";
    const user = Auth.getCurrentUser();
    this.appRoot.innerHTML = `
      <div class="main-container">
        <div class="content-wrapper cyber-fade-in" style="max-width: 700px;">
          <div class="main-card cyber-card">
            <div class="header">
              <div class="logo">
                <div class="logo-icon cyber-icon"><i class="fas fa-user-cog"></i><div class="icon-pulse"></div></div>
                <h1 class="logo-text cyber-title">Meu Perfil</h1>
              </div>
              <p class="subtitle terminal-text">Gerencie suas informações e segurança.</p>
            </div>
            <form id="profileForm">
              <div class="form-group text-center">
                  <label class="form-label cyber-label">Foto de Perfil</label>
                  <div id="avatar-container" class="user-avatar cyber-glow" style="width: 100px; height: 100px; margin: 0 auto 1rem; font-size: 3rem; background: linear-gradient(135deg, var(--primary), var(--accent)); cursor: pointer;">
                      ${
                        user.avatarUrl
                          ? `<img id="avatar-preview" src="${user.avatarUrl}" style="width:100%; height:100%; border-radius: 50%; object-fit: cover;">`
                          : `<span id="avatar-initials">${
                              user.username
                                ? user.username.charAt(0).toUpperCase()
                                : "U"
                            }</span>`
                      }
                  </div>
                  <input type="file" id="avatarUpload" accept="image/*" style="display: none;">
                  <p class="terminal-text" style="font-size: 0.8rem; margin-top: 0.5rem;">Clique na imagem para selecionar um novo avatar.</p>
              </div>
              <hr class="cyber-divider">
              <h2 class="cyber-text" style="text-align:center; margin-bottom: 1.5rem;">Alterar Senha</h2>
              <div class="form-group">
                <label for="currentPassword" class="form-label cyber-label">Senha Atual</label>
                <input type="password" id="currentPassword" class="form-input cyber-input" placeholder="Sua senha atual">
              </div>
              <div class="form-group">
                <label for="newPassword" class="form-label cyber-label">Nova Senha</label>
                <input type="password" id="newPassword" class="form-input cyber-input" placeholder="Mínimo 8 caracteres">
              </div>
              <div class="form-group">
                <label for="confirmPassword" class="form-label cyber-label">Confirmar Nova Senha</label>
                <input type="password" id="confirmPassword" class="form-input cyber-input" placeholder="Repita a nova senha">
              </div>
              <button type="submit" class="btn btn-primary btn-full cyber-btn cyber-execute-btn mt-3">
                <i class="fas fa-save"></i> <span class="btn-text">Salvar Alterações</span><div class="btn-glow"></div>
              </button>
            </form>
            <div class="text-center mt-3">
              <a href="#dashboard" class="link cyber-link">Voltar para o Dashboard</a>
            </div>
          </div>
        </div>
      </div>
    `;

    const avatarContainer = document.getElementById("avatar-container");
    const avatarUploadInput = document.getElementById("avatarUpload");

    avatarContainer.addEventListener("click", () => {
      avatarUploadInput.click();
    });

    avatarUploadInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const initials = document.getElementById("avatar-initials");
          if (initials) initials.remove();
          let preview = document.getElementById("avatar-preview");
          if (!preview) {
            preview = document.createElement("img");
            preview.id = "avatar-preview";
            preview.style.cssText =
              "width:100%; height:100%; border-radius: 50%; object-fit: cover;";
            avatarContainer.appendChild(preview);
          }
          preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    document
      .getElementById("profileForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const file = avatarUploadInput.files[0];

        if (file) {
          UI.showFeedback("Enviando nova foto de perfil...", "info");
          const formData = new FormData();
          formData.append("avatar", file);

          try {
            const response = await API.uploadAvatar(formData);
            if (response.avatarUrl) {
              Auth.updateCurrentUser({ avatarUrl: response.avatarUrl });
              UI.showFeedback(
                "Foto de perfil atualizada com sucesso!",
                "success"
              );
            }
          } catch (error) {
            console.error("Erro ao enviar avatar:", error);
          }
        }

        const newPassword = document.getElementById("newPassword").value;
        if (newPassword) {
          UI.showFeedback(
            "Função de alterar senha ainda não implementada.",
            "info"
          );
        }
      });
  },

  renderCreditsPage() {
    document.title = "Créditos | Central de Checkers Pro";
    const user = Auth.getCurrentUser();
    const balance = (user.credits || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    this.appRoot.innerHTML = `
      <div class="main-container">
        <div class="content-wrapper cyber-fade-in" style="max-width: 600px;">
          <div class="main-card cyber-card">
            <div class="header">
                <div class="logo">
                    <div class="logo-icon cyber-icon"><i class="fas fa-coins"></i><div class="icon-pulse"></div></div>
                    <h1 class="logo-text cyber-title">Adicionar Créditos</h1>
                </div>
                <p class="subtitle terminal-text">Seu saldo atual é: <span class="cyber-text">${balance}</span></p>
            </div>
            
            <div class="cyber-info-panel">
                <p class="terminal-text">Para adicionar créditos à sua conta, entre em contato com o suporte ou utilize um dos métodos abaixo.</p>
            </div>

            <div class="text-center mt-4">
                <button class="btn btn-primary cyber-btn" onclick="alert('Função não implementada')"><i class="fab fa-pix"></i> Adicionar via PIX</button>
            </div>

            <div class="text-center mt-4">
              <a href="#dashboard" class="link cyber-link">Voltar para o Dashboard</a>
            </div>
          </div>
        </div>
      </div>
      `;
  },
};

window.UI = UI;

export default UI;
