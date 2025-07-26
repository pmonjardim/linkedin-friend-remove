// Content script for LinkedIn Connection Manager - Security Hardened
console.log('LinkedIn Connection Manager content script loaded');

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scanConnections') {
    const connections = scanConnections();
    sendResponse({ connections });
  } else if (request.action === 'removeConnection') {
    removeConnection(request.connectionId).then(result => {
      sendResponse({ success: result });
    });
  }
  return true; // Keep message channel open for async response
});

// Input validation and sanitization
function validateAndSanitizeText(text, maxLength = 200) {
  if (typeof text !== 'string') return '';
  
  // Remove any HTML tags and limit length
  const div = document.createElement('div');
  div.textContent = text;
  const sanitized = div.textContent || div.innerText || '';
  
  return sanitized.slice(0, maxLength).trim();
}

function validateConnectionId(id) {
  return typeof id === 'number' && id >= 0 && Number.isInteger(id);
}

function scanConnections() {
  const connections = [];
  
  // Multiple selectors to handle different LinkedIn layouts
  const selectors = [
    '.mn-connection-card',
    '[data-test-id="connection-card"]',
    '.search-result__info',
    '.reusable-search__result-container',
    '.connection-member-info'
  ];

  let connectionElements = [];
  
  // Try each selector until we find elements
  for (const selector of selectors) {
    try {
      connectionElements = document.querySelectorAll(selector);
      if (connectionElements.length > 0) {
        console.log(`Found ${connectionElements.length} connections using selector: ${selector}`);
        break;
      }
    } catch (error) {
      console.error(`Error with selector ${selector}:`, error);
    }
  }

  connectionElements.forEach((element, index) => {
    try {
      // Validate element
      if (!element || !element.querySelector) return;
      
      // Try multiple selectors for name
      const nameEl = element.querySelector('span[aria-hidden="true"]') || 
                   element.querySelector('.actor-name') ||
                   element.querySelector('a[data-control-name="connection_profile"]') ||
                   element.querySelector('.search-result__info h3 a') ||
                   element.querySelector('.member-info__name') ||
                   element.querySelector('h3 a span[aria-hidden="true"]');
      
      // Try multiple selectors for title/occupation
      const titleEl = element.querySelector('.mn-connection-card__occupation') ||
                     element.querySelector('.actor-occupation') ||
                     element.querySelector('.search-result__info p') ||
                     element.querySelector('.member-info__occupation');

      // Find remove button
      const removeBtn = element.querySelector('button[aria-label*="Remove"]') ||
                       element.querySelector('button[data-control-name="remove_connection"]') ||
                       element.querySelector('button[aria-label*="Disconnect"]');

      if (nameEl && nameEl.textContent) {
        const rawName = nameEl.textContent;
        const rawTitle = titleEl ? titleEl.textContent : 'No title available';
        
        // Validate and sanitize data
        const name = validateAndSanitizeText(rawName, 200);
        const title = validateAndSanitizeText(rawTitle, 500);
        
        // Additional validation
        if (name.length > 0 && name.length <= 200 && title.length <= 500) {
          connections.push({
            id: index,
            name: name,
            title: title,
            hasRemoveButton: !!removeBtn
          });
        } else {
          console.warn('Connection data validation failed:', { name, title });
        }
      }
    } catch (error) {
      console.error('Error parsing connection element:', error);
    }
  });

  console.log(`Scanned ${connections.length} valid connections`);
  return connections;
}

async function removeConnection(connectionId) {
  return new Promise((resolve) => {
    try {
      // Validate connection ID
      if (!validateConnectionId(connectionId)) {
        console.error('Invalid connection ID:', connectionId);
        resolve(false);
        return;
      }
      
      // Find connection elements again (they might have changed)
      const connectionElements = document.querySelectorAll(
        '.mn-connection-card, [data-test-id="connection-card"], .search-result__info, .reusable-search__result-container'
      );
      
      if (connectionId >= connectionElements.length) {
        console.error(`Connection ID ${connectionId} out of range`);
        resolve(false);
        return;
      }
      
      const targetElement = connectionElements[connectionId];
      
      if (!targetElement) {
        console.error(`Connection element ${connectionId} not found`);
        resolve(false);
        return;
      }

      // Find and click the remove button
      const removeBtn = targetElement.querySelector('button[aria-label*="Remove"]') ||
                       targetElement.querySelector('button[data-control-name="remove_connection"]') ||
                       targetElement.querySelector('button[aria-label*="Disconnect"]');

      if (!removeBtn) {
        console.error('Remove button not found for connection', connectionId);
        resolve(false);
        return;
      }

      // Click the remove button
      removeBtn.click();
      console.log(`Clicked remove button for connection ${connectionId}`);

      // Wait for confirmation dialog and handle it
      setTimeout(() => {
        try {
          // Look for confirmation dialog buttons with better validation
          const confirmBtns = document.querySelectorAll(
            'button[data-control-name="remove_connection_confirm"], ' +
            '.artdeco-modal__confirm-dialog-btn, ' +
            'button[aria-label*="Remove"], ' +
            '.artdeco-modal .artdeco-button--primary'
          );

          let confirmBtn = null;
          for (const btn of confirmBtns) {
            if (btn.textContent && btn.textContent.toLowerCase().includes('remove')) {
              confirmBtn = btn;
              break;
            }
          }

          if (confirmBtn) {
            confirmBtn.click();
            console.log(`Confirmed removal for connection ${connectionId}`);
            
            // Wait a bit more for the action to complete
            setTimeout(() => {
              resolve(true);
            }, 1000);
          } else {
            console.warn('Confirmation button not found or clicked');
            resolve(true); // Assume success if no confirmation needed
          }
        } catch (error) {
          console.error('Error handling confirmation dialog:', error);
          resolve(false);
        }
      }, 1000);

    } catch (error) {
      console.error('Error removing connection:', error);
      resolve(false);
    }
  });
}

// Helper function to wait for elements to load (with better error handling)
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    // Validate selector
    if (typeof selector !== 'string' || selector.length === 0) {
      reject(new Error('Invalid selector'));
      return;
    }
    
    try {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }
    } catch (error) {
      reject(new Error(`Invalid CSS selector: ${selector}`));
      return;
    }

    const observer = new MutationObserver(() => {
      try {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      } catch (error) {
        observer.disconnect();
        reject(new Error(`Error finding element: ${error.message}`));
      }
    });

    try {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    } catch (error) {
      reject(new Error(`Failed to observe DOM: ${error.message}`));
      return;
    }

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
  });
}