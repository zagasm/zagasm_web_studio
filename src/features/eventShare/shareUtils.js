function firstPosterUrl(poster = []) {
  if (!Array.isArray(poster)) return "";
  const image = poster.find((item) => item?.type === "image" && item?.url);
  return image?.url || "";
}

function resolveChannelLink(channel) {
  return (
    channel?.link ||
    channel?.url ||
    channel?.href ||
    channel?.share_url ||
    channel?.shareUrl ||
    ""
  );
}

export function normalizeChannelName(name = "") {
  const key = String(name || "").trim().toLowerCase();

  if (!key) return "";
  if (key === "linkedin" || key === "linkedin_share") return "linkedin";
  if (key === "x" || key === "twitter" || key === "twitter_x") return "x";
  if (key === "copy" || key === "copylink") return "copy_link";

  return key.replace(/\s+/g, "_");
}

export function getChannelLabel(channel = {}) {
  const rawLabel = channel?.name || channel?.label;
  if (rawLabel) return rawLabel;

  const key = normalizeChannelName(channel?.key || channel?.channel);

  switch (key) {
    case "copy_link":
      return "Copy link";
    case "whatsapp":
      return "WhatsApp";
    case "telegram":
      return "Telegram";
    case "linkedin":
      return "LinkedIn";
    case "x":
      return "X";
    case "facebook":
      return "Facebook";
    case "email":
      return "Email";
    default:
      return key
        .split("_")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
  }
}

export function normalizeSharePayload(rawPayload = {}) {
  const payload = rawPayload?.data ?? rawPayload;
  const share = payload?.share ?? {};
  const event = payload?.event ?? {};
  const cover = payload?.cover ?? {};
  const rawChannels = Array.isArray(payload?.channels)
    ? payload.channels
    : Array.isArray(share?.channels)
      ? share.channels
      : [];

  const channels = rawChannels
    .map((channel) => {
      const channelKey = normalizeChannelName(
        channel?.key || channel?.channel || channel?.name
      );
      const link = resolveChannelLink(channel);

      if (!channelKey && !link) return null;

      return {
        ...channel,
        key: channelKey || "share",
        name: getChannelLabel(channel),
        link,
      };
    })
    .filter(Boolean);

  return {
    raw: payload,
    event,
    title: event?.title || payload?.title || "",
    text:
      share?.text ||
      payload?.share_text ||
      payload?.text ||
      event?.title ||
      "",
    url: share?.url || payload?.urlShare || payload?.url || "",
    path: share?.path || "",
    shareKey: share?.key || payload?.shareKey || event?.slug || event?.id || "",
    publicApiUrl: share?.public_api_url || "",
    trackApiUrl: share?.track_api_url || "",
    coverUrl:
      cover?.url ||
      event?.cover?.url ||
      event?.poster?.url ||
      firstPosterUrl(event?.poster) ||
      "",
    channels,
  };
}

export function normalizeEventRecord(rawEvent) {
  if (!rawEvent) return null;

  const poster =
    Array.isArray(rawEvent.poster) && rawEvent.poster.length > 0
      ? rawEvent.poster
      : rawEvent.icon_url
        ? [{ type: "image", url: rawEvent.icon_url }]
        : [];

  return {
    ...rawEvent,
    poster,
    reviews: {
      count: Number(rawEvent?.reviews?.count ?? 0) || 0,
      average_rating: Number(rawEvent?.reviews?.average_rating ?? 0) || 0,
      can_review: !!rawEvent?.reviews?.can_review,
    },
    purchase_options: {
      ticket_only: !!rawEvent?.purchase_options?.ticket_only,
      ticket_and_manual: !!rawEvent?.purchase_options?.ticket_and_manual,
      manual_only: !!rawEvent?.purchase_options?.manual_only,
    },
    manual: rawEvent?.manual
      ? {
          ...rawEvent.manual,
          available: !!rawEvent.manual.available,
          viewer_has_access: !!rawEvent.manual.viewer_has_access,
          viewer_has_purchased: !!rawEvent.manual.viewer_has_purchased,
          viewer_has_ticket: !!rawEvent.manual.viewer_has_ticket,
        }
      : {
          available: false,
          viewer_has_access: false,
          viewer_has_purchased: false,
          viewer_has_ticket: false,
        },
    status: String(rawEvent.status || "upcoming").toLowerCase(),
    hostName:
      rawEvent.hostName ||
      rawEvent.userName ||
      rawEvent.organizer_name ||
      "Event Organizer",
    organiserId:
      rawEvent.organiserId ||
      rawEvent.organizerId ||
      rawEvent.hostId ||
      rawEvent.user_id,
    hostId:
      rawEvent.hostId ||
      rawEvent.organiserId ||
      rawEvent.organizerId ||
      rawEvent.user_id,
    hostImage:
      rawEvent.hostImage ||
      rawEvent.host_image ||
      rawEvent.organizer_image ||
      rawEvent.user?.profile_url ||
      rawEvent.user?.profile_image ||
      rawEvent.user?.profileUrl ||
      rawEvent.user?.profile_image_id ||
      "",
    eventType:
      rawEvent.eventType ||
      rawEvent.eventTypeFullDetails?.name ||
      rawEvent.event_type ||
      "Event",
    hostHasActiveSubscription:
      rawEvent.hostHasActiveSubscription ||
      rawEvent.has_active_subscription ||
      rawEvent.host?.has_active_subscription ||
      rawEvent.user?.has_active_subscription ||
      rawEvent.organiser?.has_active_subscription ||
      rawEvent.organizer?.has_active_subscription ||
      rawEvent.hostSubscription?.isActive ||
      false,
    is_saved: !!rawEvent.is_saved,
    is_following_organizer: !!(
      rawEvent.is_following_organizer || rawEvent.is_following
    ),
  };
}

export function normalizeSharedEventResponse(rawResponse = {}) {
  const payload = rawResponse?.data ?? rawResponse;
  const recommendedSource = payload?.recommended?.data || payload?.recommended || [];
  const normalizedEvent = normalizeEventRecord(payload?.event);
  const normalizedShare = normalizeSharePayload(payload);

  return {
    event: normalizedEvent,
    share: normalizedShare,
    recommended: Array.isArray(recommendedSource) ? recommendedSource : [],
  };
}

export function getEventDescription(event = {}) {
  const description = String(
    event?.description || event?.summary || event?.about || ""
  ).trim();

  if (!description) {
    return "Discover event details, timing, and updates on Xilolo.";
  }

  return description.length > 160
    ? `${description.slice(0, 157).trim()}...`
    : description;
}

export function isNavigatorShareCancelled(error) {
  const name = String(error?.name || "");
  const message = String(error?.message || "").toLowerCase();

  return (
    name === "AbortError" ||
    message.includes("cancel") ||
    message.includes("aborted") ||
    message.includes("dismissed")
  );
}

export async function copyText(value) {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return true;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  return true;
}
