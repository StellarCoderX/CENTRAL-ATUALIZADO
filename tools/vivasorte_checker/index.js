// /tools/vivasorte_checker/index.js (Código Final)

export function render(appRoot) {
  document.title = "Checker Vivasorte | Central de Checkers Pro";

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
    </style>

    <div class="checker-container cyber-fade-in">
      <div class="main-card cyber-card">
        <div class="header">
          <div class="logo">
              <div class="logo-icon cyber-icon"><i class="fas fa-star"></i></div>
              <h1 class="logo-text cyber-title">Checker Vivasorte</h1>
          </div>
          <p class="subtitle terminal-text">Envie um arquivo .txt para testar as contas.</p>
          <a href="#dashboard" class="link cyber-link" style="position: absolute; top: 20px; left: 20px;"><i class="fas fa-arrow-left"></i> Voltar</a>
        </div>

        <form id="vivasorte-form">
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

  initSimplifiedLogic();
}

function initSimplifiedLogic() {
  const form = document.getElementById('vivasorte-form');
  const fileInput = document.getElementById('file-upload');
  const submitBtn = document.getElementById('submit-btn');
  const statusMessage = document.getElementById('status-message');
  const errorMessage = document.getElementById('error-message');
  const aprovadasCount = document.getElementById('aprovadas-count');
  const reprovadasCount = document.getElementById('reprovadas-count');
  const aprovadasResults = document.getElementById('aprovadas-results');
  const reprovadasResults = document.getElementById('reprovadas-results');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const file = fileInput.files[0];

    if (!file) {
      errorMessage.textContent = 'Por favor, selecione um arquivo .txt.';
      return;
    }

    if (!file.name.toLowerCase().endsWith('.txt')) {
      errorMessage.textContent = 'Erro: Apenas arquivos .txt são permitidos.';
      fileInput.value = ''; 
      return;
    }

    errorMessage.textContent = '';
    statusMessage.style.display = 'block';
    statusMessage.textContent = 'Enviando arquivo...';
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Enviando...';
    aprovadasResults.innerHTML = '';
    reprovadasResults.innerHTML = '';
    aprovadasCount.textContent = '0';
    reprovadasCount.textContent = '0';

    const formData = new FormData();
    formData.append('txtFile', file);
    
    // Pega o token de login armazenado no navegador.
    const token = localStorage.getItem('accessToken');

    // Prepara os cabeçalhos da requisição.
    const headers = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch("/api/tools/vivasorte_checker", {
        method: 'POST',
        headers: headers, // Adiciona o cabeçalho com o token
        body: formData,
      });

      const data = await response.json();

      // Verifica se a resposta indica um erro, mesmo com status 200 OK.
      if (!response.ok || data.status === 'error') {
          // Se o código for de créditos insuficientes, joga um erro com a mensagem específica.
          if (data.code === 'INSUFFICIENT_CREDITS') {
              throw new Error(data.message);
          }
          // Para outros erros, usa a mensagem padrão.
          throw new Error(data.message || 'Ocorreu um erro desconhecido.');
      }
      
      statusMessage.textContent = 'Processamento concluído!';
      
      const aprovadas = data.Aprovadas || [];
      const reprovadas = data.Reprovadas || [];

      aprovadasCount.textContent = aprovadas.length;
      reprovadasCount.textContent = reprovadas.length;

      aprovadas.forEach(item => {
        const div = document.createElement('div');
        div.className = 'result-item aprovada';
        div.textContent = item;
        aprovadasResults.appendChild(div);
      });

      reprovadas.forEach(item => {
        const div = document.createElement('div');
        div.className = 'result-item reprovada';
        div.textContent = item;
        reprovadasResults.appendChild(div);
      });

    } catch (err) {
      // Exibe a mensagem de erro (incluindo a de créditos) para o usuário.
      errorMessage.textContent = `Erro: ${err.message}`;
      statusMessage.style.display = 'none';
    } finally {
        // Reabilita o botão, independentemente do resultado.
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = 'Verificar';
    }
  });
}
