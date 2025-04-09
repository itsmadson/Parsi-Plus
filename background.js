chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === 'install' || details.reason === 'update') {
      chrome.storage.sync.set({isParsiFontEnabled: true});
    }
  });
  
  // Add listener for tab updates
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url) {
      // Check if tab URL matches any of our patterns
      const patterns = [
        "https://chat.openai.com/*",
        "https://gemini.google.com/*",
        "https://www.deepseek.com/*",
        "https://www.wikipedia.org/*"
      ];
      
      const matchesPattern = patterns.some(pattern => {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(tab.url);
      });
      
      if (matchesPattern) {
        // Get current state and send to content script
        chrome.storage.sync.get(['isParsiFontEnabled'], function(result) {
          chrome.tabs.sendMessage(tabId, {
            type: 'PARSI_PLUS_TOGGLE',
            enabled: result.isParsiFontEnabled !== false
          });
        });
      }
    }
  });