chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ enabled: false });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        chrome.storage.sync.get(['enabled'], function (result) {
            if (result.enabled) {
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ['contentScript.js']
                });
            }
        });
    }
});
