(function() {
    let enabled = true; // Default state
  
    // Listen for toggle messages from popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'PARSI_PLUS_TOGGLE') {
        enabled = message.enabled; // Use the value from the message
        if (enabled) {
          initialize();
        } else {
          removeStyles();
        }
        // Send a response to confirm receipt
        sendResponse({success: true});
        return true; // Indicates async response
      }
    });
  
    function removeStyles() {
      const styleElement = document.getElementById('rtl-override-styles');
      const fontLink = document.querySelector('link[href*="vazirmatn.css"]');
      if (styleElement) styleElement.remove();
      if (fontLink) fontLink.remove();
    }
  
    // Create and inject font link
    function injectVazirmatnFont() {
      // Check if font is already injected
      if (document.querySelector('link[href*="vazirmatn.css"]')) return;
      const fontStyle = document.createElement('link');
      fontStyle.rel = 'stylesheet';
      fontStyle.href = chrome.runtime.getURL('vazirmatn.css');
      document.head.appendChild(fontStyle); // Append to head instead of documentElement
    }
  
    // Forceful style application
    function applyPersianStyles() {
      // Check if styles are already injected
      if (document.getElementById('rtl-override-styles')) return;
      const styleOverride = document.createElement('style');
      styleOverride.id = 'rtl-override-styles';
      styleOverride.textContent = `
        body, body * {
          font-family: 'Vazirmatn', Arial, sans-serif !important;
        }
        body {
          direction: rtl !important;
        }
        body :not(input):not(textarea):not(pre):not(code) {
          text-align: right !important;
        }
        input, textarea {
          text-align: right !important;
          direction: rtl !important;
        }
      `;
      document.head.appendChild(styleOverride); // Append to head instead of documentElement
    }
  
    // Initialize function
    function initialize() {
      if (!enabled) return;
      if (!document.body) {
        // If body isn't ready yet, wait a bit
        setTimeout(initialize, 10);
        return;
      }
      
      try {
        injectVazirmatnFont();
        applyPersianStyles();
      } catch (error) {
        console.error('RTL Extension error:', error);
      }
    }
  
    // Get initial state from storage
    chrome.storage.sync.get(['isParsiFontEnabled'], function(result) {
      enabled = result.isParsiFontEnabled !== false; // Default to true if undefined
      if (enabled) {
        initialize();
      }
    });
  
    // Run after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initialize);
    } else {
      initialize();
    }
  
    // Run again after a delay to ensure application on dynamic sites
    setTimeout(initialize, 1000);
  
    // Observe DOM changes with debouncing
    let timeout;
    const observer = new MutationObserver(() => {
      if (!enabled) return;
      clearTimeout(timeout);
      timeout = setTimeout(initialize, 100);
    });
  
    // Start observing once the DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.documentElement, {
          childList: true,
          subtree: true
        });
      });
    } else {
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }
  })();