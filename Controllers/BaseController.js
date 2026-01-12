// controllers/BaseController.js
export class BaseController {
  constructor() {
    this.port = null;
  }

  setPort(port) {
    this.port = port;
  }

  onMessageReceive(message) {
    console.log("BaseController received:", message);
    switch (message.Tag) {
      case "AddUsers":
        this.addUsers(message.Users);
        break;

      case "PostStats":
        this.addStats(message.data);
        break;

      default:
        console.warn("Unknown tag in BaseController:", message.Tag);
    }
  }

   send(tag, domain, payload) {
    if (!this.port) {
      console.warn("No port available for controller");
      return;
    }

    this.port.postMessage({
      tag,
      domain,
      payload,
    });
    

  // Default implementations, can be overridden
  addUsers(users) {
    console.warn("addUsers not implemented in BaseController");
  }

  addStats(data) {
    console.warn("addStats not implemented in BaseController");
  }

  static fromStorage(data) {
    return new UserModel(data);
  }
}
