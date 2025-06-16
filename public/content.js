
// Content script for LinkedIn Connection Manager
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
    connectionElements = document.querySelectorAll(selector);
    if (connectionElements.length > 0) {
      console.log(`Found ${connectionElements.length} connections using selector: ${selector}`);
      break;
    }
  }

  connectionElements.forEach((element, index) => {
    try {
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

      if (nameEl) {
        const name = nameEl.textContent.trim();
        const title = titleEl ? titleEl.textContent.trim() : 'No title available';
        
        connections.push({
          id: index,
          name: name,
          title: title,
          hasRemoveButton: !!removeBtn
        });
      }
    } catch (error) {
      console.error('Error parsing connection element:', error);
    }
  });

  console.log(`Scanned ${connections.length} connections`);
  return connections;
}

async function removeConnection(connectionId) {
  return new Promise((resolve) => {
    try {
      // Find connection elements again (they might have changed)
      const connectionElements = document.querySelectorAll(
        '.mn-connection-card, [data-test-id="connection-card"], .search-result__info, .reusable-search__result-container'
      );
      
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
          // Look for confirmation dialog buttons
          const confirmBtn = document.querySelector('button[data-control-name="remove_connection_confirm"]') ||
                           document.querySelector('.artdeco-modal__confirm-dialog-btn') ||
                           document.querySelector('button[aria-label*="Remove"]') ||
                           document.querySelector('.artdeco-modal .artdeco-button--primary');

          if (confirmBtn && confirmBtn.textContent.toLowerCase().includes('remove')) {
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

// Helper function to wait for elements to load
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
  });
}
