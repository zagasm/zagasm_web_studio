import Pusher from "pusher-js";

function getPusherConfig() {
  const key = import.meta.env.VITE_PUSHER_KEY;
  const cluster = import.meta.env.VITE_PUSHER_CLUSTER;
  const baseURL = import.meta.env.VITE_API_URL || "";

  if (!key || !cluster || !baseURL) {
    return null;
  }

  return {
    key,
    cluster,
    authEndpoint: `${baseURL}/api/v1/realtime/pusher/auth`,
  };
}

export function canUseRealtimePusher() {
  return !!getPusherConfig();
}

export function createRealtimePusher(token) {
  const config = getPusherConfig();
  if (!config) return null;

  return new Pusher(config.key, {
    cluster: config.cluster,
    forceTLS: true,
    channelAuthorization: {
      endpoint: config.authEndpoint,
      transport: "ajax",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}
