// /tools/gg_vtex_checker/index.js

export function render(appRoot) {
  document.title = "Checker GG VTEX | Central de Checkers Pro";

  appRoot.innerHTML = `
    <style>
      .checker-container { max-width: 900px; margin: 20px auto; color: #00ff41; }
      .form-section, .results-section, .stats-section { margin-bottom: 20px; }
      .results-area { min-height: 100px; max-height: 300px; overflow-y: auto; background-color: rgba(0,0,0,0.8); border: 1px solid var(--primary); padding: 10px; border-radius: 8px; font-family: 'JetBrains Mono', monospace; }
      .result-item { padding: 5px; border-bottom: 1px solid #333; }
      .result-item.aprovada { color: #28a745; }
      .result-item.reprovada { color: #dc3545; }
      .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 10px; }
      .stat-box { background: var(--bg-card); padding: 15px; border-radius: 8px; text-align: center; border: 1px solid var(--primary); }
      .stat-title { font-size: 0.8em; text-transform: uppercase; color: var(--text-secondary); }
      .stat-value { font-size: 1.5em; font-weight: bold; }
      #status-message { margin-top: 15px; padding: 10px; background: rgba(0, 20, 0, 0.9); border-radius: 5px; text-align: center; }
      #error-message { color: #ff0040; margin-top: 10px; font-family: 'JetBrains Mono', monospace; }
      .cyber-info-panel {
        background: rgba(0, 20, 0, 0.8);
        border: 1px solid var(--primary);
        border-radius: var(--radius-md);
        padding: 1rem;
        margin-bottom: 1.5rem;
        backdrop-filter: blur(10px);
        box-shadow: inset 0 0 20px rgba(0, 255, 65, 0.1);
        font-family: 'JetBrains Mono', monospace;
      }
    </style>

    <div class="checker-container cyber-fade-in">
      <div class="main-card cyber-card">
        <div class="header">
          <div class="logo">
              <div class="logo-icon cyber-icon"><i class="fas fa-shopping-cart"></i></div>
              <h1 class="logo-text cyber-title">Checker GG VTEX</h1>
          </div>
          <p class="subtitle terminal-text">Envie um arquivo .txt para testar as contas.</p>
          <a href="#dashboard" class="link cyber-link" style="position: absolute; top: 20px; left: 20px;"><i class="fas fa-arrow-left"></i> Voltar</a>
        </div>

        <div class="cyber-info-panel">
            <p class="terminal-text" style="text-align: center;">
                <strong>CUSTO POR VERIFICAÇÃO:</strong><br>
                <span style="color: var(--success);">Aprovada (Live):</span> 25 créditos<br>
                <span style="color: var(--danger);">Reprovada:</span> 0 créditos
            </p>
        </div>

        <form id="gg-vtex-form">
          <div class="form-section">
            <h3 class="cyber-text">Arquivo de Contas</h3>
            <div class="form-group">
              <label for="file-upload" class="form-label cyber-label">Selecione o arquivo (.txt)</label>
              <input id="file-upload" type="file" accept=".txt" class="form-input cyber-input" required>
            </div>
          </div>

          <button type="submit" id="submit-btn" class="btn btn-primary btn-full cyber-btn cyber-execute-btn">
            <i class="fas fa-play"></i> <span class="btn-text">Verificar</span>
          </button>
        </form>

        <div id="status-message" class="terminal-text" style="display: none;"></div>
        <p id="error-message"></p>

        <div class="stats-section">
            <h3 class="cyber-text">Estatísticas</h3>
            <div class="stat-grid">
                <div class="stat-box"><div class="stat-title">Aprovadas</div><div class="stat-value" id="aprovadas-count">0</div></div>
                <div class="stat-box"><div class="stat-title">Reprovadas</div><div class="stat-value" id="reprovadas-count">0</div></div>
            </div>
        </div>

        <div class="results-section">
          <h3 class="cyber-text">Resultados</h3>
          <div class="row" style="display: flex; gap: 15px;">
            <div class="col-md-6" style="flex: 1;">
              <h4>Aprovadas</h4>
              <div id="aprovadas-results" class="results-area"></div>
            </div>
            <div class="col-md-6" style="flex: 1;">
              <h4>Reprovadas</h4>
              <div id="reprovadas-results" class="results-area"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  initVtexLogic();
}

function initVtexLogic() {
  const form = document.getElementById("gg-vtex-form");
  const fileInput = document.getElementById("file-upload");
  const submitBtn = document.getElementById("submit-btn");
  const statusMessage = document.getElementById("status-message");
  const errorMessage = document.getElementById("error-message");
  const aprovadasCount = document.getElementById("aprovadas-count");
  const reprovadasCount = document.getElementById("reprovadas-count");
  const aprovadasResults = document.getElementById("aprovadas-results");
  const reprovadasResults = document.getElementById("reprovadas-results");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const file = fileInput.files[0];

    if (!file) {
      errorMessage.textContent = "Por favor, selecione um arquivo .txt.";
      return;
    }

    if (!file.name.toLowerCase().endsWith(".txt")) {
      errorMessage.textContent = "Erro: Apenas arquivos .txt são permitidos.";
      fileInput.value = "";
      return;
    }

    errorMessage.textContent = "";
    statusMessage.style.display = "block";
    statusMessage.textContent = "Enviando arquivo e validando créditos...";
    submitBtn.disabled = true;
    submitBtn.querySelector(".btn-text").textContent = "Enviando...";
    aprovadasResults.innerHTML = "";
    reprovadasResults.innerHTML = "";
    aprovadasCount.textContent = "0";
    reprovadasCount.textContent = "0";

    const formData = new FormData();
    formData.append("txtFile", file);

    const token = localStorage.getItem("accessToken");
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch("/api/tools/gg_vtex_checker", {
        method: "POST",
        headers: headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || data.status === "error") {
        throw new Error(data.message || "Ocorreu um erro desconhecido na API.");
      }

      if (data.clientId) {
        statusMessage.textContent = data.message;
        errorMessage.textContent = "";
        submitBtn.disabled = false;
        submitBtn.querySelector(".btn-t ext").textContent = "Verificar";
        return;
      }

      statusMessage.textContent = "Processamento concluído!";
      const aprovadas = data.Aprovadas || [];
      const reprovadas = data.Reprovadas || [];

      aprovadasCount.textContent = aprovadas.length;
      reprovadasCount.textContent = reprovadas.length;

      aprovadas.forEach((item) => {
        const div = document.createElement("div");
        div.className = "result-item aprovada";
        div.textContent = item;
        aprovadasResults.appendChild(div);
      });

      reprovadas.forEach((item) => {
        const div = document.createElement("div");
        div.className = "result-item reprovada";
        div.textContent = item;
        reprovadasResults.appendChild(div);
      });
    } catch (err) {
      errorMessage.textContent = `${err.message}`;
      statusMessage.style.display = "none";
    } finally {
      if (submitBtn.disabled) {
        submitBtn.disabled = false;
        submitBtn.querySelector(".btn-text").textContent = "Verificar";
      }
    }
  });
}
