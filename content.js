// Content script to apply RTL and Vazirmatn font
(function() {
    // Function to add Vazirmatn font
    function addVazirmatnFont() {
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: 'Vazirmatn';
                src: url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css');
                font-weight: normal;
                font-style: normal;
            }
        `;
        document.head.appendChild(style);
    }

    // Function to apply RTL and Vazirmatn to the entire page
    function applyPersianSupport() {
        // Add RTL direction and Vazirmatn font to body
        document.body.style.direction = 'rtl';
        document.body.style.fontFamily = 'Vazirmatn, Arial, sans-serif';

        // Apply to all text elements
        const textElements = document.querySelectorAll('*');
        textElements.forEach(element => {
            element.style.direction = 'rtl';
            element.style.fontFamily = 'Vazirmatn, Arial, sans-serif';
            
            // Adjust text alignment
            if (element.tagName !== 'INPUT' && element.tagName !== 'TEXTAREA') {
                element.style.textAlign = 'right';
            }
        });

        // Special handling for input and textarea elements
        const inputElements = document.querySelectorAll('input, textarea');
        inputElements.forEach(input => {
            input.style.direction = 'rtl';
            input.style.textAlign = 'right';
            input.style.fontFamily = 'Vazirmatn, Arial, sans-serif';
        });
    }

    // Run the functions
    addVazirmatnFont();
    applyPersianSupport();

    // Optional: Observe DOM changes and apply styles to dynamically added elements
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                applyPersianSupport();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
