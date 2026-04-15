import { api, authHeaders } from "../lib/apiClient";

export async function getUserProfileShare(id, token) {
  const response = await api.get(`/api/v1/user/share/${id}`, authHeaders(token));
  return response?.data || {};
}

export async function getOrganiserProfileShare(id, token) {
  const response = await api.get(
    `/api/v1/organiser/share/${id}`,
    authHeaders(token)
  );
  return response?.data || {};
}

export async function getSharedUserProfile(shareKey) {
  const response = await api.get(`/api/v1/users/shared/${shareKey}`);
  return response?.data || {};
}

export async function getSharedOrganiserProfile(shareKey) {
  const response = await api.get(`/api/v1/organisers/shared/${shareKey}`);
  return response?.data || {};
}

