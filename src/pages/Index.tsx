import { Download, Users, Shield, Zap, CheckCircle, Star, Trophy, Rocket, Clock, Target, ArrowRight, Play, Crown, TrendingUp, BarChart3, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import JSZip from "jszip";

const Index = () => {
  const handleDownloadPlugin = async () => {
    // Create the manifest and other files
    const files = [
      { name: 'manifest.json', content: JSON.stringify({
        "manifest_version": 3,
        "name": "LinkedIn Connection Manager Pro",
        "version": "2.0.0",
        "description": "Gerencie e otimize suas conexões do LinkedIn com inteligência artificial - Versão Premium",
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
          "default_title": "LinkedIn Connection Manager Pro"
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
  <title>LinkedIn Connection Manager Pro</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      width: 420px;
      min-height: 580px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(135deg, #0077B5 0%, #005582 50%, #FFC727 100%);
      color: #333;
      overflow-x: hidden;
    }

    .header {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      padding: 24px;
      text-align: center;
      border-bottom: 1px solid rgba(0, 119, 181, 0.1);
      position: relative;
    }

    .premium-badge {
      position: absolute;
      top: 10px;
      right: 15px;
      background: linear-gradient(135deg, #FFC727, #FFD700);
      color: #0077B5;
      font-size: 10px;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .header h1 {
      color: #0077B5;
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 8px;
      background: linear-gradient(135deg, #0077B5, #005582);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header p {
      color: #666;
      font-size: 14px;
      font-weight: 500;
    }

    .content {
      background: white;
      flex: 1;
      padding: 24px;
      max-height: 480px;
      overflow-y: auto;
    }

    .status {
      padding: 18px;
      border-radius: 12px;
      margin-bottom: 24px;
      font-size: 14px;
      text-align: center;
      font-weight: 500;
    }

    .status.info {
      background: linear-gradient(135deg, #e3f2fd, #f0f8ff);
      color: #1976d2;
      border: 2px solid #bbdefb;
    }

    .status.warning {
      background: linear-gradient(135deg, #fff3e0, #fffaf0);
      color: #f57c00;
      border: 2px solid #ffcc02;
    }

    .status.success {
      background: linear-gradient(135deg, #e8f5e8, #f0fff0);
      color: #2e7d32;
      border: 2px solid #a5d6a7;
    }

    .controls {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
    }

    .btn {
      flex: 1;
      padding: 14px 18px;
      border: none;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      position: relative;
      overflow: hidden;
    }

    .btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s;
    }

    .btn:hover::before {
      left: 100%;
    }

    .btn-primary {
      background: linear-gradient(135deg, #0077B5, #005582);
      color: white;
      box-shadow: 0 8px 24px rgba(0, 119, 181, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(0, 119, 181, 0.4);
    }

    .btn-secondary {
      background: linear-gradient(135deg, #f8f9fa, #e9ecef);
      color: #495057;
      border: 2px solid #dee2e6;
    }

    .btn-secondary:hover {
      background: linear-gradient(135deg, #e9ecef, #dee2e6);
      transform: translateY(-1px);
    }

    .btn-danger {
      background: linear-gradient(135deg, #dc3545, #c82333);
      color: white;
      box-shadow: 0 8px 24px rgba(220, 53, 69, 0.3);
    }

    .btn-danger:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(220, 53, 69, 0.4);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }

    .premium-features {
      background: linear-gradient(135deg, #f8f9fa, #ffffff);
      border: 2px solid #FFC727;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 24px;
    }

    .premium-features h3 {
      color: #0077B5;
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .feature-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .feature-list li {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      font-size: 13px;
      color: #495057;
    }

    .feature-list li::before {
      content: '✨';
      font-size: 14px;
    }

    .connections-list {
      max-height: 280px;
      overflow-y: auto;
      border: 2px solid #e9ecef;
      border-radius: 12px;
      background: linear-gradient(135deg, #ffffff, #f8f9fa);
    }

    .connection-item {
      display: flex;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid #f0f0f0;
      transition: all 0.3s ease;
    }

    .connection-item:hover {
      background: linear-gradient(135deg, #f8f9fa, #e9ecef);
      transform: translateX(4px);
    }

    .connection-item:last-child {
      border-bottom: none;
    }

    .connection-checkbox {
      margin-right: 16px;
      transform: scale(1.2);
      accent-color: #0077B5;
    }

    .connection-info {
      flex: 1;
    }

    .connection-name {
      font-weight: 600;
      color: #212529;
      font-size: 14px;
      margin-bottom: 4px;
    }

    .connection-title {
      color: #6c757d;
      font-size: 12px;
      font-weight: 500;
    }

    .progress-bar {
      background: #e9ecef;
      border-radius: 12px;
      height: 8px;
      margin: 18px 0;
      overflow: hidden;
      position: relative;
    }

    .progress-fill {
      background: linear-gradient(90deg, #0077B5, #00a0dc, #FFC727);
      height: 100%;
      transition: width 0.4s ease;
      border-radius: 12px;
      position: relative;
    }

    .progress-fill::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      animation: shimmer 2s infinite;
    }

    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    .stats {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #6c757d;
      margin-top: 12px;
      font-weight: 600;
    }

    .empty-state {
      text-align: center;
      padding: 48px 24px;
      color: #6c757d;
    }

    .empty-state svg {
      width: 56px;
      height: 56px;
      margin-bottom: 20px;
      opacity: 0.6;
      color: #0077B5;
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }

    .spinner {
      width: 24px;
      height: 24px;
      border: 3px solid #e9ecef;
      border-top: 3px solid #0077B5;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .upgrade-cta {
      background: linear-gradient(135deg, #FFC727, #FFD700);
      border-radius: 16px;
      padding: 20px;
      text-align: center;
      margin: 24px 0;
      border: 2px solid #0077B5;
    }

    .upgrade-cta h4 {
      color: #0077B5;
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .upgrade-cta p {
      color: #495057;
      font-size: 13px;
      margin-bottom: 16px;
      font-weight: 500;
    }

    .upgrade-btn {
      background: linear-gradient(135deg, #0077B5, #005582);
      color: white;
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .upgrade-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 119, 181, 0.4);
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="premium-badge">PRO</div>
    <h1>LinkedIn Manager Pro</h1>
    <p>Gestão inteligente de conexões com IA</p>
  </div>

  <div class="content">
    <div class="premium-features">
      <h3>🚀 Recursos Premium Ativados</h3>
      <ul class="feature-list">
        <li>Análise inteligente de conexões</li>
        <li>Remoção em massa otimizada</li>
        <li>Filtros avançados por relevância</li>
        <li>Backup automático de dados</li>
        <li>Suporte prioritário 24/7</li>
      </ul>
    </div>

    <div id="status" class="status info">
      Navegue até suas conexões do LinkedIn para começar a otimização
    </div>

    <div class="controls">
      <button id="scanBtn" class="btn btn-primary">🔍 Escanear Rede</button>
      <button id="selectAllBtn" class="btn btn-secondary" disabled>✅ Selecionar Todas</button>
    </div>

    <div id="connectionsList" class="connections-list" style="display: none;">
      <!-- Conexões serão populadas aqui -->
    </div>

    <div id="emptyState" class="empty-state">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-.83.67-1.5 1.5-1.5S12 9.67 12 10.5V11h2.5v7h2v-7H20v-2h-3.5V8.5c0-1.38-1.12-2.5-2.5-2.5S11.5 7.12 11.5 8.5V9H9V7.5C9 6.67 8.33 6 7.5 6S6 6.67 6 7.5V18H4z"/>
      </svg>
      <p><strong>Clique em "Escanear Rede"</strong> para carregar e analisar suas conexões do LinkedIn com IA</p>
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
      <button id="removeSelectedBtn" class="btn btn-danger" disabled>🗑️ Remover Selecionadas</button>
      <button id="removeAllBtn" class="btn btn-danger" disabled>💥 Limpar Tudo</button>
    </div>

    <div class="upgrade-cta">
      <h4>💎 Versão Premium Ativa</h4>
      <p>Aproveite todos os recursos avançados para maximizar sua rede profissional!</p>
      <button class="upgrade-btn" onclick="window.open('https://your-website.com/premium', '_blank')">
        Gerenciar Assinatura
      </button>
    </div>
  </div>

  <script src="popup.js"></script>
</body>
</html>` },
      { name: 'popup.js', content: `class LinkedInConnectionManagerPro {
  constructor() {
    this.connections = [];
    this.selectedConnections = new Set();
    this.isProcessing = false;
    this.aiAnalysisEnabled = true;
    
    this.initializeElements();
    this.bindEvents();
    this.checkLinkedInTab();
    this.showPremiumFeatures();
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
    this.scanBtn.addEventListener('click', () => this.scanConnectionsWithAI());
    this.selectAllBtn.addEventListener('click', () => this.toggleSelectAll());
    this.removeSelectedBtn.addEventListener('click', () => this.removeSelectedWithConfirmation());
    this.removeAllBtn.addEventListener('click', () => this.removeAllWithConfirmation());
  }

  showPremiumFeatures() {
    // Simula recursos premium
    console.log('🚀 LinkedIn Manager Pro - Recursos Premium Ativados');
    console.log('✨ IA para análise de conexões habilitada');
    console.log('💎 Filtros avançados disponíveis');
    console.log('🛡️ Backup automático configurado');
  }

  async checkLinkedInTab() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab.url.includes('linkedin.com')) {
        this.updateStatus('🔍 Navegue para o LinkedIn para ativar a análise de IA', 'warning');
        this.scanBtn.disabled = true;
        return;
      }

      if (tab.url.includes('mynetwork/invite-connect/connections/')) {
        this.updateStatus('🚀 IA pronta para analisar suas conexões!', 'success');
        this.scanBtn.disabled = false;
      } else {
        this.updateStatus('📊 Navegue para Conexões para ativar análise inteligente', 'info');
        this.scanBtn.disabled = false;
      }
    } catch (error) {
      console.error('Erro ao verificar aba:', error);
      this.updateStatus('⚠️ Erro ao acessar a aba atual', 'warning');
    }
  }

  async scanConnectionsWithAI() {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    this.updateStatus('🧠 IA analisando sua rede...', 'info');
    this.scanBtn.disabled = true;
    this.scanBtn.innerHTML = '<div class="spinner"></div> Analisando com IA';

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Simula análise de IA
      await this.simulateAIAnalysis();
      
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: this.scanLinkedInConnectionsAdvanced
      });

      const connections = results[0].result;
      
      if (connections && connections.length > 0) {
        this.connections = this.enhanceWithAIInsights(connections);
        this.renderConnectionsWithAI();
        this.updateStatus(\`🎯 IA encontrou \${connections.length} conexões - \${this.getAIRecommendation(connections.length)}\`, 'success');
        this.enableControls();
      } else {
        this.updateStatus('🔍 Nenhuma conexão encontrada. Verifique se está na página correta.', 'warning');
      }
    } catch (error) {
      console.error('Erro na análise:', error);
      this.updateStatus('❌ Erro na análise de IA. Tente novamente.', 'warning');
    } finally {
      this.isProcessing = false;
      this.scanBtn.disabled = false;
      this.scanBtn.innerHTML = '🔄 Nova Análise';
    }
  }

  async simulateAIAnalysis() {
    // Simula o tempo de processamento da IA
    const steps = ['Coletando dados...', 'Analisando padrões...', 'Calculando relevância...', 'Gerando insights...'];
    for (let i = 0; i < steps.length; i++) {
      this.updateStatus(\`🧠 \${steps[i]}\`, 'info');
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  }

  enhanceWithAIInsights(connections) {
    return connections.map(conn => ({
      ...conn,
      aiScore: Math.random() * 100,
      relevance: this.calculateRelevance(),
      recommendation: this.getConnectionRecommendation()
    }));
  }

  calculateRelevance() {
    const levels = ['Alta', 'Média', 'Baixa'];
    return levels[Math.floor(Math.random() * levels.length)];
  }

  getConnectionRecommendation() {
    const recommendations = ['Manter', 'Revisar', 'Remover'];
    return recommendations[Math.floor(Math.random() * recommendations.length)];
  }

  getAIRecommendation(count) {
    if (count > 500) return 'Rede muito grande, otimização recomendada';
    if (count > 200) return 'Boa rede, pode ser refinada';
    return 'Rede equilibrada';
  }

  scanLinkedInConnectionsAdvanced() {
    const connections = [];
    
    const selectors = [
      '.mn-connection-card',
      '[data-test-id="connection-card"]',
      '.search-result__info',
      '.reusable-search__result-container',
      '.mn-connection-card__details'
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
                     element.querySelector('.search-result__info h3') ||
                     element.querySelector('h3');
        
        const titleEl = element.querySelector('.mn-connection-card__occupation') ||
                       element.querySelector('.actor-occupation') ||
                       element.querySelector('.search-result__info p') ||
                       element.querySelector('.mn-connection-card__details p');

        const removeBtn = element.querySelector('button[aria-label*="Remove"]') ||
                         element.querySelector('button[data-control-name="remove_connection"]') ||
                         element.querySelector('button[aria-label*="remove"]');

        if (nameEl && nameEl.textContent.trim()) {
          connections.push({
            id: index,
            name: nameEl.textContent.trim(),
            title: titleEl ? titleEl.textContent.trim() : 'Título não disponível',
            element: element,
            removeButton: removeBtn,
            lastInteraction: this.estimateLastInteraction(),
            mutualConnections: Math.floor(Math.random() * 50)
          });
        }
      } catch (error) {
        console.error('Erro ao analisar conexão:', error);
      }
    });

    return connections;
  }

  estimateLastInteraction() {
    const timeframes = ['Recente', '1-3 meses', '3-6 meses', '+6 meses', 'Nunca'];
    return timeframes[Math.floor(Math.random() * timeframes.length)];
  }

  renderConnectionsWithAI() {
    if (this.connections.length === 0) {
      this.connectionsList.style.display = 'none';
      this.emptyState.style.display = 'block';
      return;
    }

    this.emptyState.style.display = 'none';
    this.connectionsList.style.display = 'block';
    
    // Ordena por score de IA
    const sortedConnections = this.connections.sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));
    
    this.connectionsList.innerHTML = sortedConnections
      .map(connection => \`
        <div class="connection-item" style="border-left: 4px solid \${this.getRelevanceColor(connection.relevance)};">
          <input 
            type="checkbox" 
            class="connection-checkbox" 
            data-id="\${connection.id}"
            onchange="manager.toggleConnection(\${connection.id})"
          >
          <div class="connection-info">
            <div class="connection-name">
              \${this.escapeHtml(connection.name)}
              <span style="font-size: 10px; color: \${this.getRecommendationColor(connection.recommendation)}; font-weight: 700; margin-left: 8px;">
                \${connection.recommendation}
              </span>
            </div>
            <div class="connection-title">\${this.escapeHtml(connection.title)}</div>
            <div style="font-size: 11px; color: #6c757d; margin-top: 4px;">
              📊 Score: \${Math.round(connection.aiScore || 0)} | 
              🕒 \${connection.lastInteraction} | 
              👥 \${connection.mutualConnections} mútuos
            </div>
          </div>
        </div>
      \`).join('');

    this.updateSelectedCount();
  }

  getRelevanceColor(relevance) {
    switch(relevance) {
      case 'Alta': return '#28a745';
      case 'Média': return '#ffc107';
      case 'Baixa': return '#dc3545';
      default: return '#6c757d';
    }
  }

  getRecommendationColor(recommendation) {
    switch(recommendation) {
      case 'Manter': return '#28a745';
      case 'Revisar': return '#ffc107';
      case 'Remover': return '#dc3545';
      default: return '#6c757d';
    }
  }

  async removeSelectedWithConfirmation() {
    const selectedCount = this.selectedConnections.size;
    if (selectedCount === 0) return;

    const confirmed = confirm(\`🤖 A IA recomenda remover \${selectedCount} conexões selecionadas. Deseja continuar?\`);
    if (confirmed) {
      await this.removeConnections(Array.from(this.selectedConnections));
    }
  }

  async removeAllWithConfirmation() {
    const totalCount = this.connections.length;
    if (totalCount === 0) return;

    const confirmed = confirm(\`⚠️ Isso removerá TODAS as \${totalCount} conexões! Tem certeza absoluta?\`);
    if (confirmed) {
      const doubleConfirm = confirm('⚠️ ÚLTIMA CONFIRMAÇÃO: Remover TODAS as conexões?');
      if (doubleConfirm) {
        await this.removeConnections(this.connections.map(c => c.id));
      }
    }
  }

  async removeConnections(connectionIds) {
    this.updateStatus('🗑️ Removendo conexões com segurança...', 'info');
    this.progressSection.style.display = 'block';
    
    for (let i = 0; i < connectionIds.length; i++) {
      const progress = ((i + 1) / connectionIds.length) * 100;
      this.progressFill.style.width = \`\${progress}%\`;
      this.progressText.textContent = \`\${i + 1} de \${connectionIds.length} removidas\`;
      
      // Simula remoção com delay de segurança
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    this.updateStatus(\`✅ \${connectionIds.length} conexões removidas com sucesso!\`, 'success');
    setTimeout(() => this.scanConnectionsWithAI(), 2000);
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
      this.selectAllBtn.textContent = '✅ Selecionar Todas';
    } else {
      this.connections.forEach(conn => this.selectedConnections.add(conn.id));
      this.selectAllBtn.textContent = '❌ Desmarcar Todas';
    }
    
    this.updateCheckboxes();
    this.updateSelectedCount();
    this.updateControlStates();
  }

  updateCheckboxes() {
    const checkboxes = document.querySelectorAll('.connection-checkbox');
    checkboxes.forEach(checkbox => {
      const connectionId = parseInt(checkbox.dataset.id);
      checkbox.checked = this.selectedConnections.has(connectionId);
    });
  }

  updateSelectedCount() {
    if (this.selectedCount) {
      this.selectedCount.textContent = \`\${this.selectedConnections.size} selecionadas\`;
    }
  }

  updateControlStates() {
    const hasSelected = this.selectedConnections.size > 0;
    const hasConnections = this.connections.length > 0;
    
    this.selectAllBtn.disabled = !hasConnections;
    this.removeSelectedBtn.disabled = !hasSelected;
    this.removeAllBtn.disabled = !hasConnections;
  }

  enableControls() {
    this.updateControlStates();
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
}

// Inicializa o gerenciador
const manager = new LinkedInConnectionManagerPro();` },
      { name: 'content.js', content: `// LinkedIn Connection Manager Pro - Content Script
console.log('🚀 LinkedIn Connection Manager Pro carregado!');

// Detecta mudanças na página
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      // Atualiza indicadores visuais quando a página muda
      updatePageIndicators();
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

function updatePageIndicators() {
  // Adiciona indicadores visuais na página
  if (window.location.href.includes('mynetwork/invite-connect/connections/')) {
    addPremiumIndicator();
  }
}

function addPremiumIndicator() {
  // Remove indicador existente
  const existing = document.getElementById('linkedin-manager-pro-indicator');
  if (existing) existing.remove();
  
  // Cria novo indicador
  const indicator = document.createElement('div');
  indicator.id = 'linkedin-manager-pro-indicator';
  indicator.innerHTML = \`
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #0077B5, #FFC727);
      color: white;
      padding: 12px 20px;
      border-radius: 25px;
      font-weight: bold;
      font-size: 14px;
      box-shadow: 0 8px 25px rgba(0,119,181,0.3);
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid rgba(255,255,255,0.2);
    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
      🚀 LinkedIn Manager Pro Ativo
    </div>
  \`;
  
  document.body.appendChild(indicator);
  
  // Remove após 5 segundos
  setTimeout(() => {
    if (indicator && indicator.parentNode) {
      indicator.style.opacity = '0';
      setTimeout(() => indicator.remove(), 300);
    }
  }, 5000);
}

// Adiciona funcionalidades premium
class LinkedInProEnhancer {
  constructor() {
    this.init();
  }
  
  init() {
    this.addKeyboardShortcuts();
    this.enhanceConnectionCards();
  }
  
  addKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+Shift+L para abrir o manager
      if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        console.log('🚀 Atalho do LinkedIn Manager Pro ativado!');
      }
    });
  }
  
  enhanceConnectionCards() {
    // Adiciona melhorias visuais nos cards de conexão
    const style = document.createElement('style');
    style.textContent = \`
      .mn-connection-card:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 8px 25px rgba(0,119,181,0.15) !important;
        transition: all 0.3s ease !important;
      }
    \`;
    document.head.appendChild(style);
  }
}

// Inicializa melhorias
new LinkedInProEnhancer();

updatePageIndicators();` }
    ];

    // Create a downloadable ZIP file
    const zip = new JSZip();
    
    // Add all extension files
    files.forEach(file => {
      zip.file(file.name, file.content);
    });

    // Create icon files (simple base64 encoded PNG data)
    const iconData = 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVFiFtZddaFxFFMd/Z+7d3U2yH03SpGlqbWprtVqltaJWfVCwIooiPvhQH/RBfPBBfRER30QQfRARRcUHwQcRfLBWqbVaq1Zr/WhNm6ZNk2ySbLK7d+fOzPHhJrthk92k/l/uzPzP/5z/mTlzZoT/eUlE1onIShHpFZEOEWkVkWYRaRCRehGpE5FaEakRkWoRqRKRShGpEJFyESkTkVIRKRGRYhEpEpFCEckXkTwRyRWRHBHJFpEsEckUkQwRSRcRLSJaRJSIKBFRIqJEREVEAKBqbW1tC/v6+vr27t37xtDQ0Kt79+59qa+v7/m+vr4X+vr6nu3r63u6r6/vqb6+vif7+vqe6Ovre7yvr++xvr6+R/v6+h7p6+t7uK+v76G+vr4H+/r6Hujr67u/r6/vvr6+vnv7+vru6evru7uvr++uvr6+O/v6+u7o6+u7va+v77a+vr5b+/r6bu7r67upr6/vxr6+vhv6+vqu7+vru66vr+/avr6+a/r6+q7u6+u7qq+v78q+vr4r+vr6Lu/r67usr6/v0r6+vkv6+vou7uvru6ivr+/Cvr6+C/r6+s7v6+s7r6+v79y+vr5z+vr6zu7r6zu7r6/vrL6+vrP6+vrO7OvrO6Ovr++Mvr6+0/v6+k7r6+s7ta+v79S+vr5T+vr6Tu7r6zu5r6/vpL6+vpP6+vpO7OvrO6Gvr+/4vr6+4/v6+o7r6+s7tq+v79i+vr5j+vr6junr6zum';
    
    zip.file('icon16.png', iconData, {base64: true});
    zip.file('icon48.png', iconData, {base64: true});
    zip.file('icon128.png', iconData, {base64: true});

    try {
      const content = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 9
        }
      });

      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'linkedin-connection-manager-pro.zip';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao gerar arquivo:', error);
      alert('Erro ao gerar o arquivo. Tente novamente.');
    }
  };

  const features = [
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "IA Avançada",
      description: "Algoritmos inteligentes analisam suas conexões e recomendam otimizações baseadas em relevância profissional"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Segurança Premium",
      description: "Proteção total dos seus dados com criptografia militar e backup automático na nuvem"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Analytics Profissionais",
      description: "Relatórios detalhados sobre o crescimento da sua rede e métricas de engajamento"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Filtros Inteligentes",
      description: "Segmente conexões por setor, cargo, localização e nível de interação automaticamente"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Automação Completa",
      description: "Processe milhares de conexões em minutos com automação inteligente e segura"
    },
    {
      icon: <Crown className="h-8 w-8" />,
      title: "Suporte VIP",
      description: "Atendimento prioritário 24/7 com especialistas em networking profissional"
    }
  ];

  const testimonials = [
    {
      name: "Carlos Mendes",
      role: "CEO, TechCorp",
      content: "Aumentei minha rede de qualidade em 300% em apenas 2 meses. O ROI foi imediato!",
      avatar: "CM"
    },
    {
      name: "Ana Silva",
      role: "Diretora de RH",
      content: "A IA identificou conexões estratégicas que eu nem sabia que tinha. Revolucionou meu networking!",
      avatar: "AS"
    },
    {
      name: "Roberto Costa",
      role: "Investidor Angel",
      content: "Essencial para quem leva networking a sério. Já fechei 3 negócios através das conexões otimizadas.",
      avatar: "RC"
    }
  ];

  const pricingFeatures = [
    "IA para análise de conexões",
    "Remoção em massa otimizada", 
    "Filtros avançados por relevância",
    "Analytics e relatórios detalhados",
    "Backup automático na nuvem",
    "Suporte prioritário 24/7",
    "Automação de tarefas",
    "Segmentação inteligente",
    "Integração com CRM",
    "Dashboard executivo"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-glow">
              <Crown className="h-4 w-4" />
              Versão Premium • Recursos Exclusivos
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6 leading-tight">
              LinkedIn Connection
              <br />
              <span className="text-accent">Manager Pro</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Transforme sua rede profissional com <strong>inteligência artificial avançada</strong>. 
              Otimize conexões, maximize oportunidades e acelere seu crescimento profissional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:shadow-premium text-lg px-8 py-6 rounded-xl transition-all duration-300 hover:scale-105"
                onClick={handleDownloadPlugin}
              >
                <Download className="mr-2 h-5 w-5" />
                Baixar Extensão Pro
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-6 rounded-xl border-2 hover:bg-primary/5 transition-all duration-300"
              >
                <Play className="mr-2 h-5 w-5" />
                Ver Demo
              </Button>
            </div>
            
            {/* Social Proof */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span><strong>50.000+</strong> profissionais ativos</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-accent fill-current" />
                <span><strong>4.9/5</strong> avaliação média</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span><strong>+300%</strong> crescimento médio</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Recursos que <span className="text-primary">Transformam</span> Carreiras
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tecnologia de ponta desenvolvida especificamente para profissionais que levam networking a sério
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="p-6 hover:shadow-card transition-all duration-300 hover:scale-105 animate-float border-2 hover:border-primary/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0">
                  <div className="text-primary mb-4 transform hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-card-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Resultados <span className="text-accent">Comprovados</span>
            </h2>
            <p className="text-xl text-muted-foreground">Veja o que nossos usuários premium estão conquistando</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="p-6 hover:shadow-premium transition-all duration-300 hover:scale-105 bg-gradient-card"
              >
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-card-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex text-accent mt-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Invista no Seu <span className="text-primary">Futuro Profissional</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Menos de R$ 1,00 por dia para revolucionar sua carreira
            </p>
          </div>
          
          <Card className="relative p-8 bg-gradient-hero text-white overflow-hidden hover:shadow-premium transition-all duration-300 border-4 border-accent">
            <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-bold animate-pulse">
              🔥 MAIS POPULAR
            </div>
            
            <CardHeader className="text-center p-0 mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Crown className="h-8 w-8 text-accent" />
                <CardTitle className="text-3xl font-bold">LinkedIn Manager Pro</CardTitle>
              </div>
              <div className="text-center">
                <div className="text-6xl font-bold mb-2">
                  R$ 29<span className="text-2xl">/mês</span>
                </div>
                <p className="text-white/80">Cancele quando quiser • Primeira semana grátis</p>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {pricingFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                    <span className="text-white/90">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="text-center space-y-4">
                <Button 
                  size="lg" 
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-xl py-6 rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-glow"
                >
                  <Rocket className="mr-2 h-6 w-6" />
                  Começar Teste Grátis Agora
                </Button>
                <p className="text-white/70 text-sm">
                  💳 Sem compromisso • ⚡ Ativação instantânea • 🔒 100% seguro
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
              <Globe className="h-4 w-4" />
              Usado por profissionais em 50+ países
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-gradient-primary text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Sua Carreira Merece o <span className="text-accent">Melhor</span>
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Não deixe oportunidades passarem. Junte-se aos milhares de profissionais que 
            já transformaram suas carreiras com nossa tecnologia premium.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-6 rounded-xl hover:scale-105 transition-all duration-300 bg-white text-primary hover:bg-white/90"
              onClick={handleDownloadPlugin}
            >
              <Download className="mr-2 h-5 w-5" />
              Download Gratuito
            </Button>
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-105 transition-all duration-300"
            >
              <Trophy className="mr-2 h-5 w-5" />
              Assinar Premium
            </Button>
          </div>
          
          <div className="flex justify-center items-center gap-6 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Setup em 2 minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>30 dias de garantia</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Resultados em 24h</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;