
import { Download, Users, Shield, Zap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const handleDownloadPlugin = () => {
    // Create a zip file with all plugin files
    const files = [
      { name: 'manifest.json', content: JSON.stringify({
        "manifest_version": 3,
        "name": "LinkedIn Connection Manager",
        "version": "1.0.0",
        "description": "Gerencie e remova conexões do LinkedIn em massa de forma eficiente",
        "permissions": [
          "activeTab",
          "scripting",
          "storage"
        ],
        "host_permissions": [
          "https://*.linkedin.com/*"
        ],
        "action": {
          "default_popup": "popup.html",
          "default_title": "LinkedIn Connection Manager"
        },
        "content_scripts": [
          {
            "matches": ["https://*.linkedin.com/*"],
            "js": ["content.js"]
          }
        ],
        "icons": {
          "16": "icon16.png",
          "48": "icon48.png",
          "128": "icon128.png"
        }
      }, null, 2) },
      { name: 'popup.html', content: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gerenciador de Conexões LinkedIn</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      width: 400px;
      min-height: 500px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(135deg, #0077B5 0%, #005582 100%);
      color: #333;
    }

    .header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      padding: 20px;
      text-align: center;
      border-bottom: 1px solid rgba(0, 119, 181, 0.1);
    }

    .header h1 {
      color: #0077B5;
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 5px;
    }

    .header p {
      color: #666;
      font-size: 13px;
    }

    .content {
      background: white;
      flex: 1;
      padding: 20px;
      max-height: 400px;
      overflow-y: auto;
    }

    .status {
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 14px;
      text-align: center;
    }

    .status.info {
      background: #e3f2fd;
      color: #1976d2;
      border: 1px solid #bbdefb;
    }

    .status.warning {
      background: #fff3e0;
      color: #f57c00;
      border: 1px solid #ffcc02;
    }

    .status.success {
      background: #e8f5e8;
      color: #2e7d32;
      border: 1px solid #a5d6a7;
    }

    .controls {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    .btn {
      flex: 1;
      padding: 12px 16px;
      border: none;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #0077B5, #005582);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 119, 181, 0.3);
    }

    .btn-secondary {
      background: #f5f5f5;
      color: #666;
      border: 1px solid #ddd;
    }

    .btn-secondary:hover {
      background: #e0e0e0;
    }

    .btn-danger {
      background: linear-gradient(135deg, #d32f2f, #b71c1c);
      color: white;
    }

    .btn-danger:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }

    .connections-list {
      max-height: 250px;
      overflow-y: auto;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }

    .connection-item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid #f0f0f0;
      transition: background 0.2s ease;
    }

    .connection-item:hover {
      background: #f8f9fa;
    }

    .connection-item:last-child {
      border-bottom: none;
    }

    .connection-checkbox {
      margin-right: 12px;
      transform: scale(1.1);
    }

    .connection-info {
      flex: 1;
    }

    .connection-name {
      font-weight: 500;
      color: #333;
      font-size: 14px;
      margin-bottom: 2px;
    }

    .connection-title {
      color: #666;
      font-size: 12px;
    }

    .progress-bar {
      background: #e0e0e0;
      border-radius: 10px;
      height: 6px;
      margin: 15px 0;
      overflow: hidden;
    }

    .progress-fill {
      background: linear-gradient(90deg, #0077B5, #00a0dc);
      height: 100%;
      transition: width 0.3s ease;
      border-radius: 10px;
    }

    .stats {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #666;
      margin-top: 10px;
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: #666;
    }

    .empty-state svg {
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid #e0e0e0;
      border-top: 2px solid #0077B5;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Gerenciador de Conexões</h1>
    <p>Gerencie suas conexões do LinkedIn de forma eficiente</p>
  </div>

  <div class="content">
    <div id="status" class="status info">
      Navegue até a página de conexões do LinkedIn para começar
    </div>

    <div class="controls">
      <button id="scanBtn" class="btn btn-primary">Escanear Conexões</button>
      <button id="selectAllBtn" class="btn btn-secondary" disabled>Selecionar Todas</button>
    </div>

    <div id="connectionsList" class="connections-list" style="display: none;">
      <!-- Conexões serão populadas aqui -->
    </div>

    <div id="emptyState" class="empty-state">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-.83.67-1.5 1.5-1.5S12 9.67 12 10.5V11h2.5v7h2v-7H20v-2h-3.5V8.5c0-1.38-1.12-2.5-2.5-2.5S11.5 7.12 11.5 8.5V9H9V7.5C9 6.67 8.33 6 7.5 6S6 6.67 6 7.5V18H4z"/>
      </svg>
      <p>Clique em "Escanear Conexões" para carregar suas conexões do LinkedIn</p>
    </div>

    <div id="progressSection" style="display: none;">
      <div class="progress-bar">
        <div id="progressFill" class="progress-fill" style="width: 0%"></div>
      </div>
      <div class="stats">
        <span id="progressText">0 de 0 processadas</span>
        <span id="selectedCount">0 selecionadas</span>
      </div>
    </div>

    <div class="controls" style="margin-top: 20px;">
      <button id="removeSelectedBtn" class="btn btn-danger" disabled>Remover Selecionadas</button>
      <button id="removeAllBtn" class="btn btn-danger" disabled>Remover Todas</button>
    </div>
  </div>

  <script src="popup.js"></script>
</body>
</html>` },
      { name: 'popup.js', content: `class LinkedInConnectionManager {
  constructor() {
    this.connections = [];
    this.selectedConnections = new Set();
    this.isProcessing = false;
    
    this.initializeElements();
    this.bindEvents();
    this.checkLinkedInTab();
  }

  initializeElements() {
    this.statusEl = document.getElementById('status');
    this.scanBtn = document.getElementById('scanBtn');
    this.selectAllBtn = document.getElementById('selectAllBtn');
    this.removeSelectedBtn = document.getElementById('removeSelectedBtn');
    this.removeAllBtn = document.getElementById('removeAllBtn');
    this.connectionsList = document.getElementById('connectionsList');
    this.emptyState = document.getElementById('emptyState');
    this.progressSection = document.getElementById('progressSection');
    this.progressFill = document.getElementById('progressFill');
    this.progressText = document.getElementById('progressText');
    this.selectedCount = document.getElementById('selectedCount');
  }

  bindEvents() {
    this.scanBtn.addEventListener('click', () => this.scanConnections());
    this.selectAllBtn.addEventListener('click', () => this.toggleSelectAll());
    this.removeSelectedBtn.addEventListener('click', () => this.removeSelected());
    this.removeAllBtn.addEventListener('click', () => this.removeAll());
  }

  async checkLinkedInTab() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab.url.includes('linkedin.com')) {
        this.updateStatus('Por favor, navegue para o LinkedIn primeiro', 'warning');
        this.scanBtn.disabled = true;
        return;
      }

      if (tab.url.includes('mynetwork/invite-connect/connections/')) {
        this.updateStatus('Pronto para escanear conexões!', 'success');
        this.scanBtn.disabled = false;
      } else {
        this.updateStatus('Navegue para a página de Conexões do LinkedIn', 'info');
        this.scanBtn.disabled = false;
      }
    } catch (error) {
      console.error('Erro ao verificar aba:', error);
      this.updateStatus('Erro ao acessar a aba atual', 'warning');
    }
  }

  async scanConnections() {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    this.updateStatus('Escaneando conexões...', 'info');
    this.scanBtn.disabled = true;
    this.scanBtn.innerHTML = '<div class="spinner"></div>';

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: this.scanLinkedInConnections
      });

      const connections = results[0].result;
      
      if (connections && connections.length > 0) {
        this.connections = connections;
        this.renderConnections();
        this.updateStatus(\`Encontradas \${connections.length} conexões\`, 'success');
        this.enableControls();
      } else {
        this.updateStatus('Nenhuma conexão encontrada. Certifique-se de estar na página de conexões.', 'warning');
      }
    } catch (error) {
      console.error('Erro no escaneamento:', error);
      this.updateStatus('Erro ao escanear conexões. Tente novamente.', 'warning');
    } finally {
      this.isProcessing = false;
      this.scanBtn.disabled = false;
      this.scanBtn.textContent = 'Escanear Novamente';
    }
  }

  scanLinkedInConnections() {
    const connections = [];
    
    const selectors = [
      '.mn-connection-card',
      '[data-test-id="connection-card"]',
      '.search-result__info',
      '.reusable-search__result-container'
    ];

    let connectionElements = [];
    
    for (const selector of selectors) {
      connectionElements = document.querySelectorAll(selector);
      if (connectionElements.length > 0) break;
    }

    connectionElements.forEach((element, index) => {
      try {
        const nameEl = element.querySelector('span[aria-hidden="true"]') || 
                     element.querySelector('.actor-name') ||
                     element.querySelector('a[data-control-name="connection_profile"]') ||
                     element.querySelector('.search-result__info h3');
        
        const titleEl = element.querySelector('.mn-connection-card__occupation') ||
                       element.querySelector('.actor-occupation') ||
                       element.querySelector('.search-result__info p');

        const removeBtn = element.querySelector('button[aria-label*="Remove"]') ||
                         element.querySelector('button[data-control-name="remove_connection"]') ||
                         element.querySelector('button:contains("Remove")');

        if (nameEl) {
          connections.push({
            id: index,
            name: nameEl.textContent.trim(),
            title: titleEl ? titleEl.textContent.trim() : 'Título não disponível',
            element: element,
            removeButton: removeBtn
          });
        }
      } catch (error) {
        console.error('Erro ao analisar conexão:', error);
      }
    });

    return connections;
  }

  renderConnections() {
    if (this.connections.length === 0) {
      this.connectionsList.style.display = 'none';
      this.emptyState.style.display = 'block';
      return;
    }

    this.emptyState.style.display = 'none';
    this.connectionsList.style.display = 'block';
    
    this.connectionsList.innerHTML = this.connections
      .map(connection => \`
        <div class="connection-item">
          <input 
            type="checkbox" 
            class="connection-checkbox" 
            data-id="\${connection.id}"
            onchange="manager.toggleConnection(\${connection.id})"
          >
          <div class="connection-info">
            <div class="connection-name">\${this.escapeHtml(connection.name)}</div>
            <div class="connection-title">\${this.escapeHtml(connection.title)}</div>
          </div>
        </div>
      \`).join('');

    this.updateSelectedCount();
  }

  toggleConnection(connectionId) {
    if (this.selectedConnections.has(connectionId)) {
      this.selectedConnections.delete(connectionId);
    } else {
      this.selectedConnections.add(connectionId);
    }
    this.updateSelectedCount();
    this.updateControlStates();
  }

  toggleSelectAll() {
    const allSelected = this.selectedConnections.size === this.connections.length;
    
    if (allSelected) {
      this.selectedConnections.clear();
      this.selectAllBtn.textContent = 'Selecionar Todas';
    } else {
      this.connections.forEach(conn => this.selectedConnections.add(conn.id));
      this.selectAllBtn.textContent = 'Desmarcar Todas';
    }

    const checkboxes = document.querySelectorAll('.connection-checkbox');
    checkboxes.forEach(cb => {
      cb.checked = !allSelected;
    });

    this.updateSelectedCount();
    this.updateControlStates();
  }

  updateSelectedCount() {
    this.selectedCount.textContent = \`\${this.selectedConnections.size} selecionadas\`;
  }

  updateControlStates() {
    const hasSelected = this.selectedConnections.size > 0;
    const hasConnections = this.connections.length > 0;
    
    this.removeSelectedBtn.disabled = !hasSelected;
    this.removeAllBtn.disabled = !hasConnections;
    this.selectAllBtn.disabled = !hasConnections;
  }

  enableControls() {
    this.updateControlStates();
  }

  async removeSelected() {
    if (this.selectedConnections.size === 0) return;
    
    const confirmed = confirm(\`Tem certeza que deseja remover \${this.selectedConnections.size} conexões selecionadas?\`);
    if (!confirmed) return;

    await this.removeConnections(Array.from(this.selectedConnections));
  }

  async removeAll() {
    if (this.connections.length === 0) return;
    
    const confirmed = confirm(\`Tem certeza que deseja remover TODAS as \${this.connections.length} conexões? Esta ação não pode ser desfeita.\`);
    if (!confirmed) return;

    const allIds = this.connections.map(conn => conn.id);
    await this.removeConnections(allIds);
  }

  async removeConnections(connectionIds) {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    this.progressSection.style.display = 'block';
    this.updateStatus('Removendo conexões...', 'info');
    
    let processed = 0;
    const total = connectionIds.length;

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      for (const connectionId of connectionIds) {
        const connection = this.connections.find(c => c.id === connectionId);
        if (!connection) continue;

        try {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: this.removeConnection,
            args: [connectionId]
          });

          processed++;
          this.updateProgress(processed, total);
          
          await this.delay(1000);
          
        } catch (error) {
          console.error(\`Erro ao remover conexão \${connectionId}:\`, error);
        }
      }

      this.connections = this.connections.filter(conn => !connectionIds.includes(conn.id));
      connectionIds.forEach(id => this.selectedConnections.delete(id));
      
      this.renderConnections();
      this.updateStatus(\`\${processed} conexões removidas com sucesso\`, 'success');
      
    } catch (error) {
      console.error('Erro no processo de remoção em massa:', error);
      this.updateStatus('Erro durante o processo de remoção', 'warning');
    } finally {
      this.isProcessing = false;
      setTimeout(() => {
        this.progressSection.style.display = 'none';
      }, 2000);
    }
  }

  removeConnection(connectionId) {
    return new Promise((resolve) => {
      try {
        const connectionElements = document.querySelectorAll('.mn-connection-card, [data-test-id="connection-card"]');
        const targetElement = connectionElements[connectionId];
        
        if (targetElement) {
          const removeBtn = targetElement.querySelector('button[aria-label*="Remove"], button[data-control-name="remove_connection"]');
          if (removeBtn) {
            removeBtn.click();
            
            setTimeout(() => {
              const confirmBtn = document.querySelector('button[data-control-name="remove_connection_confirm"], .artdeco-modal__confirm-dialog-btn');
              if (confirmBtn) {
                confirmBtn.click();
              }
              resolve(true);
            }, 500);
          } else {
            resolve(false);
          }
        } else {
          resolve(false);
        }
      } catch (error) {
        console.error('Erro ao remover conexão:', error);
        resolve(false);
      }
    });
  }

  updateProgress(processed, total) {
    const percentage = (processed / total) * 100;
    this.progressFill.style.width = \`\${percentage}%\`;
    this.progressText.textContent = \`\${processed} de \${total} processadas\`;
  }

  updateStatus(message, type) {
    this.statusEl.textContent = message;
    this.statusEl.className = \`status \${type}\`;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

const manager = new LinkedInConnectionManager();
window.manager = manager;` },
      { name: 'content.js', content: `// Script de conteúdo para o Gerenciador de Conexões LinkedIn
console.log('Gerenciador de Conexões LinkedIn carregado');

// Adiciona estilos para melhorar a visualização durante o processo
const addStyles = () => {
  const style = document.createElement('style');
  style.textContent = \`
    .linkedin-manager-highlight {
      border: 2px solid #0077B5 !important;
      background-color: rgba(0, 119, 181, 0.1) !important;
    }
    
    .linkedin-manager-processing {
      opacity: 0.5 !important;
      pointer-events: none !important;
    }
  \`;
  document.head.appendChild(style);
};

// Inicializa os estilos quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addStyles);
} else {
  addStyles();
}

// Escuta mensagens do popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'highlight-connections') {
    highlightConnections();
    sendResponse({ success: true });
  }
});

function highlightConnections() {
  const selectors = [
    '.mn-connection-card',
    '[data-test-id="connection-card"]',
    '.search-result__info',
    '.reusable-search__result-container'
  ];

  let connectionElements = [];
  
  for (const selector of selectors) {
    connectionElements = document.querySelectorAll(selector);
    if (connectionElements.length > 0) break;
  }

  connectionElements.forEach(element => {
    element.classList.add('linkedin-manager-highlight');
    setTimeout(() => {
      element.classList.remove('linkedin-manager-highlight');
    }, 3000);
  });
}` }
    ];

    // Create and download zip file
    const zip = new JSZip();
    files.forEach(file => {
      zip.file(file.name, file.content);
    });

    zip.generateAsync({ type: 'blob' }).then(content => {
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'linkedin-connection-manager.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-20 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-8">
            <Users className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Gerenciador de Conexões
            <span className="text-blue-600"> LinkedIn</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Gerencie e remova suas conexões do LinkedIn em massa. 
            Chega de remover uma por uma!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleDownloadPlugin}
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Baixar Plugin
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-4 text-lg border-slate-300 hover:bg-slate-50"
              onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Ver Como Funciona
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-16">
              Por que usar o Gerenciador de Conexões?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Remoção em Massa</h3>
                  <p className="text-slate-600">
                    Remova centenas de conexões de uma só vez, economizando horas do seu tempo.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Seleção Inteligente</h3>
                  <p className="text-slate-600">
                    Escolha exatamente quais conexões remover com checkboxes individuais.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Seguro e Confiável</h3>
                  <p className="text-slate-600">
                    Confirmações de segurança e progresso em tempo real para total controle.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div id="como-funciona" className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-16">
              Como Funciona
            </h2>
            
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">
                    Instale a Extensão
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Baixe o arquivo ZIP, extraia e carregue a extensão no Chrome em 
                    chrome://extensions/ ativando o "Modo desenvolvedor".
                  </p>
                </div>
                <div className="flex-1 bg-white rounded-xl p-6 shadow-lg">
                  <div className="text-sm text-slate-500 mb-2">Chrome Extensions</div>
                  <div className="bg-slate-100 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
                      <div>
                        <div className="font-medium">LinkedIn Connection Manager</div>
                        <div className="text-sm text-slate-500">Versão 1.0.0</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row-reverse items-center gap-8">
                <div className="flex-1">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                    <span className="text-white font-bold text-lg">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">
                    Acesse suas Conexões
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Vá para linkedin.com/mynetwork/invite-connect/connections/ 
                    onde você pode ver todas as suas conexões atuais.
                  </p>
                </div>
                <div className="flex-1 bg-white rounded-xl p-6 shadow-lg">
                  <div className="text-sm text-slate-500 mb-2">LinkedIn</div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full"></div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">João Silva</div>
                        <div className="text-xs text-slate-500">Desenvolvedor</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full"></div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">Maria Santos</div>
                        <div className="text-xs text-slate-500">Designer</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                    <span className="text-white font-bold text-lg">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">
                    Gerencie com Facilidade
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Clique no ícone da extensão, escaneie suas conexões, 
                    selecione quais remover e clique em "Remover Selecionadas".
                  </p>
                </div>
                <div className="flex-1 bg-white rounded-xl p-6 shadow-lg">
                  <div className="text-sm text-slate-500 mb-4">Gerenciador de Conexões</div>
                  <div className="space-y-3">
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium">
                      Escanear Conexões
                    </button>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-slate-100 text-slate-700 py-2 px-4 rounded-lg text-sm">
                        Selecionar Todas
                      </button>
                      <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg text-sm">
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Section */}
      <div className="bg-amber-50 border-t border-amber-200 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Uso Responsável
            </h3>
            <p className="text-slate-700 leading-relaxed">
              ⚠️ Use com responsabilidade e respeite os termos de serviço do LinkedIn. 
              Esta ferramenta é destinada apenas ao gerenciamento pessoal de conexões.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
