document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('toggle-button');

    // Get the current state from storage
    chrome.storage.sync.get(['enabled'], function (result) {
        if (result.enabled) {
            toggleButton.textContent = 'Disable';
        } else {
            toggleButton.textContent = 'Enable';
        }
    });

    // Add click event listener to toggle the state
    toggleButton.addEventListener('click', function () {
        chrome.storage.sync.get(['enabled'], function (result) {
            const newState = !result.enabled;
            chrome.storage.sync.set({ enabled: newState }, function () {
                toggleButton.textContent = newState ? 'Disable' : 'Enable';

                // Send a message to the content script to update its state
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { enabled: newState });
                });
            });
        });
    });
});
