const CDN_STORAGE_BASE_URL = "https://zagasm-studios.b-cdn.net/";

export function resolveMediaUrl(url, baseUrl = CDN_STORAGE_BASE_URL) {
  if (!url) return "";

  const trimmedUrl = String(url).trim();
  if (!trimmedUrl) return "";

  if (/^(?:https?:)?\/\//i.test(trimmedUrl) || trimmedUrl.startsWith("data:")) {
    return trimmedUrl;
  }

  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const normalizedPath = trimmedUrl.replace(/^\/+/, "");
  return `${normalizedBase}${normalizedPath}`;
}

export { CDN_STORAGE_BASE_URL };
