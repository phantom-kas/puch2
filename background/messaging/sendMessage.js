export function SendMessage(tag, key, value, port) {
  if (!port) return;

  port.postMessage({
    Tag: tag,
    [key]: value,
  });
}