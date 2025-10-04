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

        submitBtn.disabled = true;
        submitBtn.querySelector(".btn-text").textContent = "AUTENTICANDO...";

        try {
          await Auth.login(form.email.value, form.password.value);
        } catch (error) {
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

    const credits = (user.credits || 0).toLocaleString("pt-BR");

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
                        <div class="terminal-text" id="user-balance">Créditos: ${credits} | Sistema: <span class="status-online">ONLINE</span></div>
                    </div>
                </div>
                <nav class="flex gap-2">
                    <a href="#credits" class="btn btn-primary cyber-btn"><i class="fas fa-coins"></i> Comprar Créditos</a>
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
                  
                    <a href="#cc-full-checker" class="tool-card cyber-tool-card">
                        <div class="tool-icon cyber-tool-icon"><i class="fas fa-credit-card"></i><div class="tool-icon-glow"></div></div>
                        <h2 class="tool-name cyber-text">CHK CC FULL</h2>
                        <p class="tool-desc terminal-text">DEBITANDO | USE PROXY</p>
                        <div class="tool-status">
                            <span class="status-indicator online"></span><span class="status-text online">ONLINE</span>
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
                        <p class="tool-desc terminal-text">CHK DE LOGIN Pode sair Falsa Live!</p>
                        <div class="tool-status">
                            <span class="status-indicator offline"></span><span class="status-text offline">OFFLINE</span>
                        </div>
                    </a>
                    <a href="#vivasorte-checker" class="tool-card cyber-tool-card">
                        <div class="tool-icon cyber-tool-icon"><i class="fas fa-star"></i><div class="tool-icon-glow"></div></div>
                        <h2 class="tool-name cyber-text">CHK VIVASORTE</h2>
                        <p class="tool-desc terminal-text">CHK LOGIN PUXANDO INFORMACOES</p>
                        <div class="tool-status">
                            <span class="status-indicator online"></span><span class="status-text online">ONLINE</span>
                        </div>
                    </a>
                    
                    <a href="#gg-vtex-checker" class="tool-card cyber-tool-card">
                        <div class="tool-icon cyber-tool-icon"><i class="fas fa-shopping-cart"></i><div class="tool-icon-glow"></div></div>
                        <h2 class="tool-name cyber-text">CHK GG VTEX</h2>
                        <p class="tool-desc terminal-text">CHK GG GATE VTEX.</p>
                        <div class="tool-status">
                            <span class="status-indicator online"></span><span class="status-text online">ONLINE</span>
                        </div>
                    </a>
                    </div>
            </main>
        </div>`;

    document.getElementById("logoutBtn").addEventListener("click", Auth.logout);

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

  async renderToolPage() {
    const hash = window.location.hash.substring(1);
    const toolName = hash.replace("-checker", "").replace(/-/g, "_");

    try {
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
              
              <hr class="cyber-divider">
              <h2 class="cyber-text" style="text-align:center; margin-bottom: 1.5rem;">Configurações de Proxy</h2>
              <div class="form-group">
                <label for="proxyHost" class="form-label cyber-label">Host do Proxy</label>
                <input type="text" id="proxyHost" class="form-input cyber-input" placeholder="Ex: meu_host.com:8080">
              </div>
              <div class="form-group">
                <label for="proxyUser" class="form-label cyber-label">Usuário do Proxy</label>
                <input type="text" id="proxyUser" class="form-input cyber-input" placeholder="Opcional">
              </div>
              <div class="form-group">
                <label for="proxyPass" class="form-label cyber-label">Senha do Proxy</label>
                <input type="password" id="proxyPass" class="form-input cyber-input" placeholder="Opcional">
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
        
        let changesMade = false;

        const file = avatarUploadInput.files[0];
        if (file) {
            changesMade = true;
            UI.showFeedback('Enviando nova foto de perfil...', 'info');
            const formData = new FormData();
            formData.append('avatar', file);
            try {
                const response = await API.uploadAvatar(formData);
                if (response.avatarUrl) {
                    Auth.updateCurrentUser({ avatarUrl: response.avatarUrl });
                    UI.showFeedback('Foto de perfil atualizada com sucesso!', 'success');
                }
            } catch (error) {
                console.error("Erro ao enviar avatar:", error);
            }
        }
        
        const newPassword = document.getElementById('newPassword').value;
        if(newPassword){
            changesMade = true;
            UI.showFeedback('Função de alterar senha ainda não implementada.', 'info');
        }

        const proxyHost = document.getElementById('proxyHost').value.trim();
        const proxyUser = document.getElementById('proxyUser').value.trim();
        const proxyPass = document.getElementById('proxyPass').value.trim();

        if (proxyHost) {
            changesMade = true;
            UI.showFeedback('Atualizando configurações de proxy...', 'info');
            try {
                const proxyData = {
                    proxy_host: proxyHost,
                    proxy_user: proxyUser,
                    proxy_pass: proxyPass
                };
                const response = await API.updateProxy(proxyData);
                UI.showFeedback(response.message || 'Proxy atualizado!', 'success');
            } catch (error) {
                // O erro já é tratado e exibido pela função da API
            }
        }

        if (!changesMade) {
            UI.showFeedback('Nenhuma alteração para salvar.', 'info');
        }
      });
  },

  renderCreditsPage() {
    document.title = "Comprar Créditos | Central de Checkers Pro";
    const user = Auth.getCurrentUser();
    const credits = (user.credits || 0).toLocaleString("pt-BR");

    this.appRoot.innerHTML = `
      <div class="main-container">
        <div class="content-wrapper cyber-fade-in" style="max-width: 700px;">
          <div class="main-card cyber-card">
            <div class="header">
                <div class="logo">
                    <div class="logo-icon cyber-icon"><i class="fas fa-coins"></i><div class="icon-pulse"></div></div>
                    <h1 class="logo-text cyber-title">Comprar Créditos</h1>
                </div>
                <p class="subtitle terminal-text">Seu saldo atual é: <span class="cyber-text">${credits} créditos</span></p>
            </div>
            
            <div class="cyber-info-panel">
                <p class="terminal-text" style="text-align: center;">Escolha um pacote abaixo para recarregar sua conta.</p>
            </div>

            <div class="credits-packages" style="display: flex; flex-direction: column; gap: 1rem;">
                <div class="cyber-card" style="padding: 1.5rem; border-color: var(--primary);">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                        <div>
                            <h3 class="cyber-text">Pacote Inicial</h3>
                            <p class="terminal-text"><span style="color: var(--primary);">500 créditos</span> por <span style="color: var(--secondary);">R$ 50,00</span></p>
                        </div>
                        <button id="buy-credits-50" class="btn btn-primary cyber-btn">
                            <i class="fab fa-pix"></i> Comprar
                        </button>
                    </div>
                </div>

                <div class="cyber-card" style="padding: 1.5rem; border-color: var(--secondary);">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                        <div>
                            <h3 class="cyber-text">Pacote Avançado</h3>
                            <p class="terminal-text"><span style="color: var(--primary);">1.200 créditos</span> por <span style="color: var(--secondary);">R$ 100,00</span></p>
                        </div>
                        <button id="buy-credits-100" class="btn btn-primary cyber-btn" style="border-color: var(--secondary); color: var(--secondary);">
                            <i class="fab fa-pix"></i> Comprar
                        </button>
                    </div>
                </div>

                <div class="cyber-card" style="padding: 1.5rem; border-color: var(--accent);">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                        <div>
                            <h3 class="cyber-text">Pacote Profissional</h3>
                            <p class="terminal-text"><span style="color: var(--primary);">2.800 créditos</span> por <span style="color: var(--secondary);">R$ 200,00</span></p>
                        </div>
                        <button id="buy-credits-200" class="btn btn-primary cyber-btn" style="border-color: var(--accent); color: var(--accent);">
                            <i class="fab fa-pix"></i> Comprar
                        </button>
                    </div>
                </div>
            </div>

            <div class="text-center mt-4">
              <a href="#dashboard" class="link cyber-link">Voltar para o Dashboard</a>
            </div>
          </div>
        </div>
      </div>
      `;
    
      const showWipMessage = () => {
          UI.showFeedback('A função de pagamento PIX está em desenvolvimento. Em breve você poderá comprar créditos diretamente por aqui!', 'info', 7000);
      };

      document.getElementById('buy-credits-50').addEventListener('click', showWipMessage);
      document.getElementById('buy-credits-100').addEventListener('click', showWipMessage);
      document.getElementById('buy-credits-200').addEventListener('click', showWipMessage);
  },
};

window.UI = UI;

export default UI;
