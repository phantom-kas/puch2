// controllers/TikTokController.js
import { BaseController } from "./BaseController.js";
import { TikTokService } from "../services/TikTokService.js";
import { MessageService } from "../services/MessageService.js";

export class TikTokController extends BaseController {
    constructor() {
        super();
    }

    onMessageReceive(message) {
        // TikTok-specific messages
        if (message.Tag.startsWith("TikTok")) {
            this.handleTikTokMessage(message);
        } else {
            // fallback to base
            super.onMessageReceive(message);
        }
    }


    addUsers(users) {
        TikTokService.addUsers(users);
    }

    addStats(data) {
        TikTokService.addStats(data);
    }
}
