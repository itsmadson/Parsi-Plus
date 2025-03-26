document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('parsiFontToggle');

    // Get current state from storage
    chrome.storage.sync.get(['isParsiFontEnabled'], function(result) {
        toggle.checked = result.isParsiFontEnabled ?? true;
    });

    function sendToggleMessage() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: 'PARSI_PLUS_TOGGLE'
                });
                // Update storage
                chrome.storage.sync.set({
                    isParsiFontEnabled: toggle.checked
                });
            }
        });
    }

    toggle.addEventListener('change', sendToggleMessage);
});