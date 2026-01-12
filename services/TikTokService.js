// services/TikTokService.js
import { BaseService } from "./BaseService.js";
import { UserModel } from "../models/UserModel.js";

export class TikTokService extends BaseService {
    constructor() {
        super();
        this.startLike = false;
        this.startComment = false;
        this.tagPool = [];
    }

    addUsers(users) {
        UserModel.UserPool.push(...users);
        console.log("TikTokService added users:", users.length);
    }

    addTag(tag) {
        this.tagPool.push(tag);
    }

    addStats(data) {
        UserModel.user_stats.push(data);
    }

    saveDatabase() {
        localStorage.setItem("myDB", JSON.stringify(UserModel));
    }
}

// Export a singleton instance
export const tikTokService = new TikTokService();
