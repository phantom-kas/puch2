// services/MessageService.js
export class MessageService {
    /**
     * Send a message via chrome.runtime.sendMessage
     * @param {string} tag
     * @param {string} type
     * @param {any} data
     */
    static sendMessage(tag, type, data) {
        chrome.runtime.sendMessage({ Tag: tag, Type: type, Data: data });
    }

    /**
     * Send a message via a specific port
     * @param {string} tag
     * @param {string} type
     * @param {any} payload
     * @param {chrome.runtime.Port} port
     */
    static sendViaPort(tag, type, payload, port) {
        if (!port) return;
        const msg = { Tag: tag };
        msg[type] = payload;
        port.postMessage(msg);
    }

    /**
     * POST JSON data to a URL
     * @param {string} url
     * @param {any} data
     * @returns {Promise<any>}
     */
    static async postData(url, data) {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return res.json();
    }
}
