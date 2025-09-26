import { useState } from 'react';

// Componente para exibir os resultados de forma organizada
function ResultsDisplay({ data }) {
  // Se não houver dados, não renderiza nada
  if (!data) {
    return null;
  }

  // Tenta extrair as listas de 'Aprovadas' e 'Reprovadas'
  const aprovadas = data.Aprovadas || [];
  const reprovadas = data.Reprovadas || [];

  return (
    <div className="results-container">
      <h2>Resultados da Verificação</h2>
      <div className="results-section">
        <h3 className="aprovadas-title">✅ Aprovadas ({aprovadas.length})</h3>
        <div className="results-list">
          {aprovadas.length > 0 ? (
            aprovadas.map((item, index) => (
              <div key={index} className="result-item aprovada">
                {typeof item === 'object' ? JSON.stringify(item) : item}
              </div>
            ))
          ) : (
            <p>Nenhuma conta aprovada.</p>
          )}
        </div>
      </div>
      <div className="results-section">
        <h3 className="reprovadas-title">❌ Reprovadas ({reprovadas.length})</h3>
        <div className="results-list">
          {reprovadas.length > 0 ? (
            reprovadas.map((item, index) => (
              <div key={index} className="result-item reprovada">
                {typeof item === 'object' ? JSON.stringify(item) : item}
              </div>
            ))
          ) : (
            <p>Nenhuma conta reprovada.</p>
          )}
        </div>
      </div>
    </div>
  );
}


export default function VivaSorteCheckerPage() {
  // Estados para os campos do formulário
  const [file, setFile] = useState(null);
  const [proxyHost, setProxyHost] = useState('');
  const [proxyPort, setProxyPort] = useState('');
  const [proxyUser, setProxyUser] = useState('');
  const [proxyPass, setProxyPass] = useState('');

  // Estados para controlar a interface
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setError('Por favor, selecione um arquivo .txt antes de enviar.');
      return;
    }

    // Limpa estados antigos e inicia o carregamento
    setIsLoading(true);
    setError('');
    setResults(null);

    const formData = new FormData();
    formData.append('txtFile', file);
    
    // Adiciona os dados de proxy apenas se eles existirem
    if (proxyHost) formData.append('proxy_host', proxyHost);
    if (proxyPort) formData.append('proxy_port', proxyPort);
    if (proxyUser) formData.append('proxy_user', proxyUser);
    if (proxyPass) formData.append('proxy_pass', proxyPass);

    try {
      const response = await fetch('/api/tools/vivasorte_checker', {
        method: 'POST',
        body: formData,
        // O navegador define o 'Content-Type' como 'multipart/form-data' automaticamente
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro no servidor: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data);

    } catch (err) {
      setError(err.message);
      console.error("Falha na requisição:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 40px auto;
          padding: 20px;
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 8px;
        }
        h1, h2, h3 {
          color: #333;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .form-section {
          padding: 15px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        label {
          margin-bottom: 5px;
          font-weight: bold;
        }
        input[type="text"], input[type="file"] {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        button {
          padding: 12px 20px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.2s;
        }
        button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        button:hover:not(:disabled) {
          background-color: #005bb5;
        }
        .error-message {
          color: red;
          background-color: #ffebee;
          padding: 10px;
          border: 1px solid red;
          border-radius: 4px;
        }
        .results-container { margin-top: 30px; }
        .results-section { margin-bottom: 20px; }
        .aprovadas-title { color: #2e7d32; }
        .reprovadas-title { color: #c62828; }
        .results-list {
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid #eee;
            padding: 10px;
            border-radius: 4px;
            background-color: #fff;
        }
        .result-item {
            padding: 5px;
            border-bottom: 1px solid #f0f0f0;
            font-family: monospace;
        }
        .result-item.aprovada { color: #2e7d32; }
        .result-item.reprovada { color: #c62828; }
      `}</style>

      <main className="container">
        <h1>Verificador de Contas Vivasorte</h1>
        <form onSubmit={handleSubmit}>
          
          <div className="form-section">
            <h3>1. Selecione o Arquivo</h3>
            <div className="form-group">
              <label htmlFor="file-upload">Lista de contas (.txt)</label>
              <input 
                id="file-upload"
                type="file" 
                accept=".txt" 
                onChange={handleFileChange} 
                required 
              />
            </div>
          </div>

          <div className="form-section">
            <h3>2. Configurar Proxy (Opcional)</h3>
            <div className="form-group">
              <label htmlFor="proxy-host">Host</label>
              <input id="proxy-host" type="text" value={proxyHost} onChange={(e) => setProxyHost(e.target.value)} placeholder="ex: 127.0.0.1" />
            </div>
            <div className="form-group">
              <label htmlFor="proxy-port">Porta</label>
              <input id="proxy-port" type="text" value={proxyPort} onChange={(e) => setProxyPort(e.target.value)} placeholder="ex: 8080" />
            </div>
            <div className="form-group">
              <label htmlFor="proxy-user">Usuário</label>
              <input id="proxy-user" type="text" value={proxyUser} onChange={(e) => setProxyUser(e.target.value)} placeholder="Opcional" />
            </div>
            <div className="form-group">
              <label htmlFor="proxy-pass">Senha</label>
              <input id="proxy-pass" type="text" value={proxyPass} onChange={(e) => setProxyPass(e.target.value)} placeholder="Opcional" />
            </div>
          </div>
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Verificando...' : 'Verificar Contas'}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}
        
        {isLoading && <p>Processando sua lista, por favor aguarde...</p>}

        {results && <ResultsDisplay data={results} />}
      </main>
    </>
  );
}
