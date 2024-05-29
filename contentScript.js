const newProfilePictureUrl = 'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?q=80&w=1904&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

let originalProfilePictures = {};

function changeProfilePictures() {
    const profilePics = document.getElementsByClassName('update-components-actor__avatar-image');
    Array.from(profilePics).forEach((profilePic, index) => {
        // Store the original profile picture URL if not already stored
        if (!originalProfilePictures[index]) {
            originalProfilePictures[index] = profilePic.src;
        }
        profilePic.src = newProfilePictureUrl;
    });
}

function restoreProfilePictures() {
    const profilePics = document.getElementsByClassName('update-components-actor__avatar-image');
    Array.from(profilePics).forEach((profilePic, index) => {
        if (originalProfilePictures[index]) {
            profilePic.src = originalProfilePictures[index];
        }
    });
}

// Initial state from storage
chrome.storage.sync.get(['enabled'], function (result) {
    if (result.enabled) {
        observeMutations();
    }
});

// Function to observe DOM mutations
function observeMutations() {
    changeProfilePictures();

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                changeProfilePictures();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.enabled) {
        observeMutations();
    } else {
        restoreProfilePictures();
    }
});
