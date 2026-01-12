import { StorageService } from "../services/StorageService.js";

export async function ExportDatabase() {
    try {
        const result = await StorageService.load("InstaBaitDatabase");
        let db = result.InstaBaitDatabase || [];
        const exportObj = { Tag: "InstaBaiterExportedFile", Content: db };

        // Convert object to UTF-8 Base64 string safely without 'unescape'
        const jsonStr = JSON.stringify(exportObj);
        const base64Str = btoa(
            new TextEncoder().encode(jsonStr).reduce((data, byte) => data + String.fromCharCode(byte), "")
        );

        const dataUrl = "data:application/json;base64," + base64Str;

        chrome.downloads.download({
            url: dataUrl,
            filename: "Instoo.json",
            saveAs: true
        });
    } catch (err) {
        console.error("Failed to export database:", err);
    }
}


export function getCookie(name) {
  return document.cookie
    .split(";")
    .map(c => c.trim())
    .find(c => c.startsWith(name + "="))
    ?.split("=")[1] || null;
}


export function  getRandomInt(a, n) {
  return Math.floor(Math.random() * (n - a + 1)) + a;
}
