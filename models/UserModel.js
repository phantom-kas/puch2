// models/UserModel.js
import { BaseModel } from "./BaseModel.js";
import { RuntimeState } from "./RuntimeState.js";
export class UserModel extends BaseModel {
  constructor({ user_id = Date.now(),CSRF = null, username=null, plan=null, user_pic_url=null }) {
    this.username = username;
    this.plan = plan;
    this.user_pic_url = user_pic_url;
    this.user_id = user_id;
    this.user_pic_url = user_pic_url ;
    this.CSRF = CSRF ;
  }

  // Example of pure model logic
  isPremium() {
    return ["lifetime", "instoogold", "instoopro"].includes(this.plan);
  }
  save() {
    localStorage.setItem("userModel", JSON.stringify(this));
  }

  load() {
    const data = localStorage.getItem("userModel");
    if (data) Object.assign(this, JSON.parse(data));
  }

  addUser(username) {
    const existing = this.users.find((u) => u.username === username);
    if (existing) return existing;

    const user = new UserModel(username);
    this.users.push(user);
    return user;
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      stats: this.stats,
    };
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      stats: this.stats,
    };
  }

  static fromStorage(data) {
    return new UserModel(data);
  }

  loadFromStorage(callback) {
    chrome.storage.local.get("users", (result) => {
      if (result.users) {
        this.users = result.users.map(
          (u) => new UserModel(u.username, u.id, u.stats)
        );
      }
      if (callback) callback(this.users);
    });
  }


   async addUsersToDatabase(rawUsers) {
    let added = false;

    for (const raw of rawUsers) {
      if (!RuntimeState.hasUser(raw.user_id)) {
        const user = new UserModel(raw);
        RuntimeState.addUser(user);
        added = true;
      }
    }

    if (added) {
      await StorageService.saveRuntimeState(RuntimeState);
    }
  }
}

// singleton instance
export const userModel = new UserModel();
