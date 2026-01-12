// import { RuntimeState } from "../models/RuntimeState.js";

export class StorageService {
  static load(keys, callback) {
    if (callback) {
      chrome.storage.local.get(keys, callback);
    } else {
      return new Promise((resolve) => {
        chrome.storage.local.get(keys, (result) => resolve(result));
      });
    }
  }

  static save(data, callback) {
    if (callback) {
      chrome.storage.local.set(data, callback);
    } else {
      return new Promise((resolve) => {
        chrome.storage.local.set(data, () => resolve());
      });
    }
  }

  static async saveRuntimeState(state) {
    return chrome.storage.local.set({
      RuntimeState: state.serialize(),
    });
  }
}
