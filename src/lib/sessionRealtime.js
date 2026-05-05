import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

let echoInstance = null;

function buildApiUrl(apiUrl, path) {
  const normalizedBase = String(apiUrl || "").replace(/\/+$/, "");
  const normalizedPath = String(path || "").startsWith("/")
    ? path
    : `/${path}`;

  if (normalizedBase.endsWith("/api") && normalizedPath.startsWith("/api/")) {
    return `${normalizedBase.slice(0, -4)}${normalizedPath}`;
  }

  return `${normalizedBase}${normalizedPath}`;
}

export function connectSessionRealtime({
  apiUrl,
  token,
  userId,
  reverbKey,
  reverbHost,
  reverbPort,
  forceTLS,
  onRevoked,
}) {
  if (!token || !userId || !reverbKey || !reverbHost || !reverbPort) {
    return null;
  }

  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }

  echoInstance = new Echo({
    broadcaster: "pusher",
    key: reverbKey,
    cluster: "mt1",
    wsHost: reverbHost,
    wsPort: Number(reverbPort),
    wssPort: Number(reverbPort),
    forceTLS: Boolean(forceTLS),
    encrypted: Boolean(forceTLS),
    enabledTransports: forceTLS ? ["wss"] : ["ws", "wss"],
    authEndpoint: buildApiUrl(apiUrl, "/api/v1/realtime/pusher/auth"),
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  });

  echoInstance.private(`user.${userId}`).listen(".session.revoked", (payload) => {
    onRevoked?.(payload);
  });

  return echoInstance;
}

export function disconnectSessionRealtime() {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
}
