import { useCallback, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getEventSharePayload, trackEventShare } from "../../../api/eventShareApi";
import { showError, showSuccess } from "../../../component/ui/toast";
import { useAuth } from "../../../pages/auth/AuthContext";
import {
  copyText,
  isNavigatorShareCancelled,
  normalizeSharePayload,
} from "../shareUtils";

const SHARE_CACHE_PREFIX = "xilolo:event-share-payload:";

function getCacheKey(eventId) {
  return eventId ? `${SHARE_CACHE_PREFIX}${eventId}` : "";
}

function readCachedPayload(eventId) {
  if (typeof window === "undefined") return null;

  const key = getCacheKey(eventId);
  if (!key) return null;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const normalized = normalizeSharePayload(parsed);
    return normalized?.url ? normalized : null;
  } catch (_error) {
    return null;
  }
}

function writeCachedPayload(eventId, payload) {
  if (typeof window === "undefined") return;

  const key = getCacheKey(eventId);
  const normalized = normalizeSharePayload(payload);
  if (!key || !normalized?.url) return;

  try {
    window.localStorage.setItem(key, JSON.stringify(normalized));
  } catch (_error) {
    // Ignore storage failures and continue with in-memory state.
  }
}

export function useEventShareFlow() {
  const { token } = useAuth();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [sharePayload, setSharePayload] = useState(null);
  const [lastShareContext, setLastShareContext] = useState(null);
  const [shareInProgress, setShareInProgress] = useState(false);

  const sharePayloadMutation = useMutation({
    mutationFn: async ({ eventId }) => {
      const payload = await getEventSharePayload(eventId, token);
      const normalized = normalizeSharePayload(payload);
      writeCachedPayload(eventId, normalized);
      return normalized;
    },
  });

  const trackShareMutation = useMutation({
    mutationFn: async ({ shareKey, channel }) => {
      if (!shareKey || !token) return null;
      return trackEventShare(shareKey, { channel }, token);
    },
  });

  const resetShareState = useCallback(() => {
    setShareModalOpen(false);
    setSharePayload(null);
    setLastShareContext(null);
    setShareInProgress(false);
    sharePayloadMutation.reset();
  }, [sharePayloadMutation]);

  const trackIntent = useCallback(
    async (payload, channel) => {
      if (!payload?.shareKey || !token) return;

      try {
        await trackShareMutation.mutateAsync({
          shareKey: payload.shareKey,
          channel,
        });
      } catch (error) {
        if (!import.meta.env.PROD) {
          console.warn("Event share tracking failed", error);
        }
      }
    },
    [token, trackShareMutation]
  );

  const resolveSharePayload = useCallback(
    async ({ eventId, initialPayload }) => {
      const normalizedInitial = normalizeSharePayload(initialPayload);

      if (normalizedInitial?.url && normalizedInitial?.shareKey) {
        writeCachedPayload(eventId, normalizedInitial);
        return normalizedInitial;
      }

      const cachedPayload = readCachedPayload(eventId);
      if (cachedPayload?.url) {
        return cachedPayload;
      }

      if (eventId && token) {
        return sharePayloadMutation.mutateAsync({ eventId });
      }

      if (normalizedInitial?.url) {
        writeCachedPayload(eventId, normalizedInitial);
        return normalizedInitial;
      }

      throw new Error("Share details are unavailable for this event right now.");
    },
    [sharePayloadMutation, token]
  );

  const prefetchShare = useCallback(
    async ({ eventId, initialPayload } = {}) => {
      const normalizedInitial = normalizeSharePayload(initialPayload);

      if (normalizedInitial?.url) {
        writeCachedPayload(eventId, normalizedInitial);
        setSharePayload(normalizedInitial);
        return normalizedInitial;
      }

      const cachedPayload = readCachedPayload(eventId);
      if (cachedPayload?.url) {
        setSharePayload(cachedPayload);
        return cachedPayload;
      }

      if (!eventId || !token) return null;

      try {
        const payload = await sharePayloadMutation.mutateAsync({ eventId });
        setSharePayload(payload);
        return payload;
      } catch (_error) {
        return null;
      }
    },
    [sharePayloadMutation, token]
  );

  const startShare = useCallback(
    async ({ eventId, initialPayload }) => {
      const context = { eventId, initialPayload };
      setShareModalOpen(false);
      setSharePayload(null);
      setLastShareContext(context);
      sharePayloadMutation.reset();
      setShareInProgress(true);

      try {
        const payload = await resolveSharePayload(context);
        setSharePayload(payload);

        if (navigator?.share && payload?.url) {
          try {
            await navigator.share({
              title: payload.title || "Share event",
              text: payload.text || payload.title || "",
              url: payload.url,
            });
            await trackIntent(payload, "native_share");
            return;
          } catch (error) {
            if (!isNavigatorShareCancelled(error)) {
              if (!import.meta.env.PROD) {
                console.warn("navigator.share failed", error);
              }
              showError("Unable to open the browser share dialog right now.");
            }
            return;
          }
        }

        setShareModalOpen(true);
      } catch (error) {
        setSharePayload(null);
        if (!navigator?.share) {
          setShareModalOpen(true);
        }
        showError(
          error?.response?.data?.message ||
            error?.message ||
            "Unable to prepare this share right now."
        );
      } finally {
        setShareInProgress(false);
      }
    },
    [resolveSharePayload, sharePayloadMutation, trackIntent]
  );

  const retryShare = useCallback(async () => {
    if (!lastShareContext) return;
    await startShare(lastShareContext);
  }, [lastShareContext, startShare]);

  const handleCopyLink = useCallback(async () => {
    if (!sharePayload?.url) {
      showError("Share link is not available.");
      return;
    }

    try {
      await copyText(sharePayload.url);
      showSuccess("Share link copied.");
      await trackIntent(sharePayload, "copy_link");
    } catch (error) {
      showError("Unable to copy the share link.");
    }
  }, [sharePayload, trackIntent]);

  const handleChannelShare = useCallback(
    async (channel) => {
      const link = channel?.link;
      const key = channel?.key || "share";

      if (!link) {
        showError("That share option is unavailable right now.");
        return;
      }

      await trackIntent(sharePayload, key);
      window.open(link, "_blank", "noopener,noreferrer");
    },
    [sharePayload, trackIntent]
  );

  return useMemo(
    () => ({
      shareModalOpen,
      sharePayload,
      sharePayloadError: sharePayloadMutation.error,
      sharePayloadLoading: sharePayloadMutation.isPending,
      shareInProgress,
      closeShareModal: () => setShareModalOpen(false),
      resetShareState,
      prefetchShare,
      startShare,
      retryShare,
      handleCopyLink,
      handleChannelShare,
    }),
    [
      handleChannelShare,
      handleCopyLink,
      prefetchShare,
      resetShareState,
      retryShare,
      shareModalOpen,
      sharePayload,
      sharePayloadMutation.error,
      sharePayloadMutation.isPending,
      shareInProgress,
      startShare,
    ]
  );
}
