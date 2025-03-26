chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === 'install' || details.reason === 'update') {
        chrome.storage.sync.set({isParsiFontEnabled: true});
    }
});