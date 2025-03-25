document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('parsiFontToggle');

    // Always start checked
    toggle.checked = true;

    // Send message to current tab
    function sendToggleMessage() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: 'PARSI_PLUS_TOGGLE'
                });
            }
        });
    }

    // Toggle event
    toggle.addEventListener('change', function() {
        sendToggleMessage();
    });

    // Send initial message
    sendToggleMessage();
});