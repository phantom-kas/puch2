// services/TabService.js
export class TabService {
    /**
     * Reload a tab if it exists, or open it if it doesn't.
     * @param {string} url
     * @param {() => void} callback
     */
    static reloadOrOpenTab(url, callback) {
        chrome.tabs.query({ url: url + "*", currentWindow: true }, (tabs) => {
            if (tabs.length === 0) {
                chrome.tabs.create({ url });
            } else {
                chrome.tabs.reload(tabs[0].id);
            }
            if (callback) callback();
        });
    }

    /**
     * Update a tab's URL
     * @param {number} tabId
     * @param {string} url
     */
    static updateTabUrl(tabId, url) {
        chrome.tabs.update(tabId, { url });
    }

    /**
     * Open the dashboard tab (bot.html)
     */
    static openDashboard() {
        chrome.tabs.create({ url: chrome.runtime.getURL("bot.html") });
    }

    /**
     * Open Instagram, optionally for a specific username, closing any existing Instagram tabs first
     * @param {string} username
     */
    static openInstagram(username = "") {
        chrome.tabs.query({ url: "https://www.instagram.com/*", currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                tabs.forEach(t => chrome.tabs.remove(t.id));
            }
            const url = username ? `https://www.instagram.com/${username}` : "https://www.instagram.com/";
            chrome.tabs.create({ url });
        });
    }
}
