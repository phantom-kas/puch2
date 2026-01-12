import { StorageService } from "../services/StorageService.js";
import { BaseController } from "./BaseController.js";
import { RuntimeState } from "../models/RuntimeState.js";
export class UserController extends BaseController  {
  constructor() {
    this.currentUser = null;
    this.load();
  }

  async load() {
    const result = await StorageService.load("userModel");
    this.currentUser = result.userModel || null;
    return this.currentUser;
  }

  async saveUser(data) {
    this.currentUser = data;
    await StorageService.save({ userModel: data });
    return this.currentUser;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  onMessageReceive(message, sender) {
    switch (message.Tag) {
      case "UserHeaders":
        RuntimeState.currentUser = {
          csrf: message.csrf,
          userId: message.userId,
        };
        break;

      // case "StoryPageDetected":
      //   this.handleStoryPage(sender.tab.id);
      //   break;

      case "DMPageDetected":
        this.handleDMPage(sender.tab.id);
        break;
    }
  }
}
