import { updateStatus } from "./updateStatus";
import { updateStory } from "./platform/instagramStory";
import { updateFacebook } from "./platform/facebook";
import { updateTikTok } from "./platform/tiktok";

export function UpdateLoop() {
  if (!IsUserLoggedIn) return;

  const now = Date.now() / 1000;
  const delta = now - LastUpdateTime;
  LastUpdateTime = now;

  updateStatus(delta, ComPortIndex);
  updateStory(delta);
  updateTikTok(delta);
  updateFacebook(delta);
}