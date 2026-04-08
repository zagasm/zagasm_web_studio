import { api, authHeaders } from "../lib/apiClient";

export async function getEventSharePayload(eventId, token) {
  const response = await api.get(
    `/api/v1/event/share/${encodeURIComponent(eventId)}`,
    authHeaders(token)
  );

  return response?.data?.data ?? response?.data ?? {};
}

export async function trackEventShare(shareKey, payload = {}, token) {
  const response = await api.post(
    `/api/v1/event/share/${encodeURIComponent(shareKey)}/track`,
    payload,
    authHeaders(token)
  );

  return response?.data?.data ?? response?.data ?? {};
}

export async function getSharedEventByKey(shareKey) {
  const response = await api.get(
    `/api/v1/events/shared/${encodeURIComponent(shareKey)}`
  );

  return response?.data?.data ?? response?.data ?? {};
}
