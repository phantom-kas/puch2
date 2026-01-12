import { TikTokController } from "./Controllers/TikTokController.js";
import { InstagramController } from "./Controllers/InstagramController.js";
import { TikTokService } from "./services/TikTokService.js";
import { TabService } from "./services/TabService.js";
import { updateStatus } from "./background/Loops/updateStatus.js";

// Instantiate controllers
const controllers = {
  tiktok: new TikTokController(),
  instagram: new InstagramController(),
};

// Handle PORT connections ONLY
chrome.runtime.onConnect.addListener((port) => {
  const type = port.name; // "tiktok", "instagram", etc.
  if (type === "INIT_DATA") {
    // Initialize alarms, timing models, etc.
    console.log("Received data in background:", msg.payload);
    initializeExtension(msg.payload);
    return;
  }

  const controller = controllers[type];

  if (!controller) {
    console.warn("No controller registered for port:", type);
    return;
  }

  // Give controller ownership of the port
  controller.setPort(port);

  // Remember: ports use postMessage, not sendResponse
  port.onMessage.addListener((message) => {
    controller.onMessageReceive(message);
  });

  port.onDisconnect.addListener(() => {
    controller.setPort(null);
  });
});

// One-time initialization
(async () => {
  await TikTokService.loadDatabase();
  console.log("TikTokService initialized");
})();

// Toolbar click
chrome.action.onClicked.addListener(() => {
  TabService.openDashboard();
  TabService.openInstagram();
});

async function initializeExtension(data) {
  console.log("Initializing extension:", data);

  if (data.refunded !== 10) {
    // Ensure only one alarm exists
    chrome.alarms.clear("updateLoop", () => {
      chrome.alarms.create("updateLoop", {
        periodInMinutes: 1 / 60, // every second
      });
    });

    await chrome.storage.local.set({
      timing_model: {
        min: data.min,
        max: data.max,
        long: data.long,
      },
    });
  }

  RuntimeState.initializeDefaults();
}

initializeExtension;

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name !== "updateLoop") return;

  // Single source of truth
  mainUpdateLoop();
});


function mainUpdateLoop(){
     var a = new Date().getTime() / 1e3,
      b = a - LastUpdateTime;
    LastUpdateTime = a;
    updateStatus(b,controllers.instagram.port)
    controllers.instagram.updateStory(LastUpdateTime || 1);
} 
