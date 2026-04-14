const FORCED_LOGOUT_EVENT_NAME = "xilolo:auth-forced-logout";
const FORCED_LOGOUT_STORAGE_KEY = "xilolo:auth:forced-logout";
const CHANNEL_NAME = "xilolo-auth-session";

function getChannel() {
  if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") {
    return null;
  }

  return new BroadcastChannel(CHANNEL_NAME);
}

export function emitForcedLogout(detail = {}) {
  if (typeof window === "undefined") return;

  const payload = {
    reason: detail.reason || "another_device",
    message:
      detail.message ||
      "You have been logged out because you have logged in on another device.",
    at: Date.now(),
  };

  window.dispatchEvent(
    new CustomEvent(FORCED_LOGOUT_EVENT_NAME, {
      detail: payload,
    })
  );

  try {
    localStorage.setItem(FORCED_LOGOUT_STORAGE_KEY, JSON.stringify(payload));
    localStorage.removeItem(FORCED_LOGOUT_STORAGE_KEY);
  } catch {
    // ignore storage quota/security issues
  }

  const channel = getChannel();
  if (channel) {
    channel.postMessage(payload);
    channel.close();
  }
}

export function subscribeToForcedLogout(handler) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const onWindowEvent = (event) => {
    handler(event?.detail || {});
  };

  const onStorage = (event) => {
    if (event.key !== FORCED_LOGOUT_STORAGE_KEY || !event.newValue) return;

    try {
      handler(JSON.parse(event.newValue));
    } catch {
      handler({});
    }
  };

  const channel = getChannel();
  const onChannelMessage = (event) => {
    handler(event?.data || {});
  };

  window.addEventListener(FORCED_LOGOUT_EVENT_NAME, onWindowEvent);
  window.addEventListener("storage", onStorage);
  channel?.addEventListener("message", onChannelMessage);

  return () => {
    window.removeEventListener(FORCED_LOGOUT_EVENT_NAME, onWindowEvent);
    window.removeEventListener("storage", onStorage);
    channel?.removeEventListener("message", onChannelMessage);
    channel?.close();
  };
}
