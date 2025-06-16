
class LinkedInConnectionManager {
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
        this.updateStatus('Please navigate to LinkedIn first', 'warning');
        this.scanBtn.disabled = true;
        return;
      }

      if (tab.url.includes('mynetwork/invite-connect/connections/')) {
        this.updateStatus('Ready to scan connections!', 'success');
        this.scanBtn.disabled = false;
      } else {
        this.updateStatus('Navigate to LinkedIn Connections page', 'info');
        this.scanBtn.disabled = false;
      }
    } catch (error) {
      console.error('Error checking tab:', error);
      this.updateStatus('Error accessing current tab', 'warning');
    }
  }

  async scanConnections() {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    this.updateStatus('Scanning connections...', 'info');
    this.scanBtn.disabled = true;
    this.scanBtn.innerHTML = '<div class="spinner"></div>';

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Inject the content script to scan connections
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: this.scanLinkedInConnections
      });

      const connections = results[0].result;
      
      if (connections && connections.length > 0) {
        this.connections = connections;
        this.renderConnections();
        this.updateStatus(`Found ${connections.length} connections`, 'success');
        this.enableControls();
      } else {
        this.updateStatus('No connections found. Make sure you\'re on the connections page.', 'warning');
      }
    } catch (error) {
      console.error('Scan error:', error);
      this.updateStatus('Error scanning connections. Please try again.', 'warning');
    } finally {
      this.isProcessing = false;
      this.scanBtn.disabled = false;
      this.scanBtn.textContent = 'Rescan';
    }
  }

  // This function runs in the LinkedIn page context
  scanLinkedInConnections() {
    const connections = [];
    
    // Try different selectors for LinkedIn connection items
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
            title: titleEl ? titleEl.textContent.trim() : 'No title available',
            element: element,
            removeButton: removeBtn
          });
        }
      } catch (error) {
        console.error('Error parsing connection:', error);
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
      .map(connection => `
        <div class="connection-item">
          <input 
            type="checkbox" 
            class="connection-checkbox" 
            data-id="${connection.id}"
            onchange="manager.toggleConnection(${connection.id})"
          >
          <div class="connection-info">
            <div class="connection-name">${this.escapeHtml(connection.name)}</div>
            <div class="connection-title">${this.escapeHtml(connection.title)}</div>
          </div>
        </div>
      `).join('');

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
      this.selectAllBtn.textContent = 'Select All';
    } else {
      this.connections.forEach(conn => this.selectedConnections.add(conn.id));
      this.selectAllBtn.textContent = 'Deselect All';
    }

    // Update checkboxes
    const checkboxes = document.querySelectorAll('.connection-checkbox');
    checkboxes.forEach(cb => {
      cb.checked = !allSelected;
    });

    this.updateSelectedCount();
    this.updateControlStates();
  }

  updateSelectedCount() {
    this.selectedCount.textContent = `${this.selectedConnections.size} selected`;
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
    
    const confirmed = confirm(`Are you sure you want to remove ${this.selectedConnections.size} selected connections?`);
    if (!confirmed) return;

    await this.removeConnections(Array.from(this.selectedConnections));
  }

  async removeAll() {
    if (this.connections.length === 0) return;
    
    const confirmed = confirm(`Are you sure you want to remove ALL ${this.connections.length} connections? This action cannot be undone.`);
    if (!confirmed) return;

    const allIds = this.connections.map(conn => conn.id);
    await this.removeConnections(allIds);
  }

  async removeConnections(connectionIds) {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    this.progressSection.style.display = 'block';
    this.updateStatus('Removing connections...', 'info');
    
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
          
          // Add delay to avoid rate limiting
          await this.delay(1000);
          
        } catch (error) {
          console.error(`Error removing connection ${connectionId}:`, error);
        }
      }

      // Remove processed connections from local state
      this.connections = this.connections.filter(conn => !connectionIds.includes(conn.id));
      connectionIds.forEach(id => this.selectedConnections.delete(id));
      
      this.renderConnections();
      this.updateStatus(`Successfully removed ${processed} connections`, 'success');
      
    } catch (error) {
      console.error('Bulk removal error:', error);
      this.updateStatus('Error during removal process', 'warning');
    } finally {
      this.isProcessing = false;
      setTimeout(() => {
        this.progressSection.style.display = 'none';
      }, 2000);
    }
  }

  // This function runs in the LinkedIn page context
  removeConnection(connectionId) {
    return new Promise((resolve) => {
      try {
        // Find the connection element and click remove
        const connectionElements = document.querySelectorAll('.mn-connection-card, [data-test-id="connection-card"]');
        const targetElement = connectionElements[connectionId];
        
        if (targetElement) {
          const removeBtn = targetElement.querySelector('button[aria-label*="Remove"], button[data-control-name="remove_connection"]');
          if (removeBtn) {
            removeBtn.click();
            
            // Wait for confirmation dialog and click confirm
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
        console.error('Remove connection error:', error);
        resolve(false);
      }
    });
  }

  updateProgress(processed, total) {
    const percentage = (processed / total) * 100;
    this.progressFill.style.width = `${percentage}%`;
    this.progressText.textContent = `${processed} of ${total} processed`;
  }

  updateStatus(message, type) {
    this.statusEl.textContent = message;
    this.statusEl.className = `status ${type}`;
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

// Initialize the manager
const manager = new LinkedInConnectionManager();

// Make it globally available for onclick handlers
window.manager = manager;
