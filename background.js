chrome.runtime.onInstalled.addListener(function() {
    // Ensure default state is on
    chrome.storage.sync.set({isParsiFontEnabled: true});
});