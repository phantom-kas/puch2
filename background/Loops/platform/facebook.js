import { SendMessage } from "../../messaging/sendMessage";

export function updateFacebook(delta) {
  facebookTime.Time -= delta;

  if (!Startfacebook || facebookTime.Time > 0) return;

  facebookTime.Time = getRandomInt(
    facebookSettings.TimeMin,
    facebookSettings.TimeMax
  );

  SendMessage(
    "LikeFollow",
    "story",
    buildFacebookPayload(),
    ComPortfacebook
  );
}
