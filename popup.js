document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('parsiFontToggle');
    
    // Get current state from storage
    chrome.storage.sync.get(['isParsiFontEnabled'], function(result) {
      toggle.checked = result.isParsiFontEnabled !== false; // Default to true
    });
  
    function sendToggleMessage() {
      // Update storage first
      chrome.storage.sync.set({
        isParsiFontEnabled: toggle.checked
      }, function() {
        // Then send message to all tabs matching your permission patterns
        chrome.tabs.query({url: [
          "https://chat.openai.com/*",
          "https://gemini.google.com/*",
          "https://www.deepseek.com/*",
          "https://www.wikipedia.org/*"
        ]}, function(tabs) {
          if (tabs.length > 0) {
            tabs.forEach(tab => {
              chrome.tabs.sendMessage(tab.id, {
                type: 'PARSI_PLUS_TOGGLE',
                enabled: toggle.checked
              }, function(response) {
                console.log('Response from tab:', response);
              });
            });
          }
        });
      });
    }
    
    toggle.addEventListener('change', sendToggleMessage);
  });