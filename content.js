(function() {
    // Create and inject font link
    function injectVazirmatnFont() {
        const fontStyle = document.createElement('link');
        fontStyle.rel = 'stylesheet';
        fontStyle.href = chrome.runtime.getURL('vazirmatn.css');
        
        // Inject as early as possible
        if (document.head) {
            document.head.appendChild(fontStyle);
        } else {
            // Fallback for very early document stages
            document.documentElement.appendChild(fontStyle);
        }
    }

    // Forceful style application
    function applyPersianStyles() {
        // Create style element to force RTL and font
        const styleOverride = document.createElement('style');
        styleOverride.textContent = `
            * {
                font-family: 'Vazirmatn', Arial, sans-serif !important;
                direction: rtl !important;
                text-align: right !important;
            }
            body, html {
                font-family: 'Vazirmatn', Arial, sans-serif !important;
            }
            input, textarea {
                font-family: 'Vazirmatn', Arial, sans-serif !important;
                direction: rtl !important;
                text-align: right !important;
            }
        `;
        
        // Inject style
        if (document.head) {
            document.head.appendChild(styleOverride);
        } else {
            document.documentElement.appendChild(styleOverride);
        }

        // Recursive style application
        function applyStylesRecursive(element) {
            if (element.nodeType === Node.ELEMENT_NODE) {
                element.style.setProperty('font-family', 'Vazirmatn, Arial, sans-serif', 'important');
                element.style.setProperty('direction', 'rtl', 'important');
                
                if (element.tagName !== 'INPUT' && element.tagName !== 'TEXTAREA') {
                    element.style.setProperty('text-align', 'right', 'important');
                }
            }

            // Recursively apply to child nodes
            Array.from(element.childNodes).forEach(applyStylesRecursive);
        }

        // Apply to body if it exists
        if (document.body) {
            applyStylesRecursive(document.body);
        }
    }

    // Initialize
    function initialize() {
        injectVazirmatnFont();
        applyPersianStyles();
    }

    // Run immediately
    initialize();

    // Observe DOM changes
    const observer = new MutationObserver(() => {
        initialize();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();