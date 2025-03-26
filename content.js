(function() {
    let enabled = true;  // Default state

    // Listen for toggle messages from popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === 'PARSI_PLUS_TOGGLE') {
            enabled = !enabled;
            if (enabled) {
                initialize();
            } else {
                removeStyles();
            }
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
        document.documentElement.appendChild(fontStyle);
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
                direction: rtl !important;
            }
            
            body :not(input):not(textarea) {
                text-align: right !important;
            }
            
            input, textarea {
                text-align: right !important;
                direction: rtl !important;
            }
        `;
        
        document.documentElement.appendChild(styleOverride);
    }

    // Modify initialize() to check enabled state
    function initialize() {
        if (!enabled) return;
        
        try {
            injectVazirmatnFont();
            applyPersianStyles();
            document.body && document.body.offsetHeight;
        } catch (error) {
            console.error('RTL Extension error:', error);
        }
    }

    // Get initial state from storage
    chrome.storage.sync.get(['isParsiFontEnabled'], function(result) {
        enabled = result.isParsiFontEnabled ?? true;
        if (enabled) {
            initialize();
        }
    });

    // Run immediately and after a delay to ensure proper application
    initialize();
    setTimeout(initialize, 1000);

    // Observe DOM changes with debouncing
    let timeout;
    const observer = new MutationObserver(() => {
        clearTimeout(timeout);
        timeout = setTimeout(initialize, 100);
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();