import { buildStatusPayload } from "../builders/buildStatusPayload";
import { SendMessage } from "../messaging/sendMessage";

export function updateStatus(delta, port) {
  StatusUpdateTime.Time -= delta;

  if (StatusUpdateTime.Time > 0 || !port) return;

  StatusUpdateTime.Time = StatusUpdateInterval;

  SendMessage("StatusUpdate", "Status", buildStatusPayload(), port);
}
