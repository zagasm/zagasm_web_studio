import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Link as LinkIcon, Share2 } from "lucide-react";
import { api, authHeaders } from "../../lib/apiClient";
import { showError, showSuccess } from "../ui/toast";

// Use your LOCAL icons (same as your sheet)
const CHANNEL_ICON = {
  whatsapp: "/images/icons/whatsapp.png",
  facebook: "/images/icons/facebook.png",
  x: "/images/icons/x.png",
  linkedIn: "/images/icons/linkedin.png",
  telegram: "/images/icons/telegram.png",
  copy_link: "/images/icons/copy-link.png", // if you don't have this, remove and fallback will show
};

function normKey(k = "") {
  const key = String(k || "").trim();
  // backend sends "linkedIn" sometimes; normalize to your local map
  if (key.toLowerCase() === "linkedin") return "linkedIn";
  return key;
}

export default function EventShareModal({
  open,
  onClose,
  eventId,
  token,
  title = "Share Event",
}) {
  const [loading, setLoading] = useState(false);
  const [channels, setChannels] = useState([]);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (!open) return;
    if (!eventId) return;

    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setChannels([]);
        setShareUrl("");

        const res = await api.get(
          `/api/v1/event/share/${eventId}`,
          authHeaders(token)
        );

        // response shape from your sample:
        // { status: true, urlShare, channels, ... }
        const list = res?.data?.channels || [];
        const urlShare = res?.data?.urlShare || "";

        if (!mounted) return;
        setChannels(list);
        setShareUrl(urlShare);
      } catch (e) {
        console.error(e);
        showError("Failed to load share channels.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [open, eventId, token]);

  const safeChannels = useMemo(() => {
    const arr = Array.isArray(channels) ? channels : [];
    // ensure Copy Link is present (in case backend ever omits it)
    const hasCopy = arr.some((c) => normKey(c?.key) === "copy_link");
    if (hasCopy) return arr;

    if (shareUrl) {
      return [
        ...arr,
        { key: "copy_link", name: "Copy Link", type: "internal", link: shareUrl },
      ];
    }

    return arr;
  }, [channels, shareUrl]);

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      showSuccess("Link copied!");
    } catch (e) {
      console.error(e);
      showError("Could not copy link.");
    }
  }

  function openChannel(ch) {
    const link = ch?.link || shareUrl;
    const key = normKey(ch?.key);

    if (!link) {
      showError("Share link not available.");
      return;
    }

    if (key === "copy_link") {
      copyToClipboard(link);
      return;
    }

    window.open(link, "_blank", "noopener,noreferrer");
  }

  return (
    <Transition show={open} as={Fragment} appear>
      <Dialog
        as="div"
        className="tw:relative tw:z-50"
        onClose={() => !loading && onClose?.()}
      >
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="tw:transition tw:duration-200"
          enterFrom="tw:opacity-0"
          enterTo="tw:opacity-100"
          leave="tw:transition tw:duration-150"
          leaveFrom="tw:opacity-100"
          leaveTo="tw:opacity-0"
        >
          <div className="tw:fixed tw:inset-0 tw:bg-black/40" />
        </Transition.Child>

        {/* Panel wrapper */}
        <div className="tw:fixed tw:inset-0 tw:overflow-y-auto tw:font-sans">
          <div className="tw:flex tw:min-h-full tw:items-end tw:md:items-center tw:justify-center tw:p-0 tw:pb-16 tw:md:pb-0 tw:md:p-4">
            <Transition.Child
              as={Fragment}
              enter="tw:transition tw:duration-200 tw:ease-out"
              enterFrom="tw:opacity-0 tw:translate-y-[20%] tw:md:translate-y-0 tw:md:scale-95"
              enterTo="tw:opacity-100 tw:translate-y-0 tw:md:scale-100"
              leave="tw:transition tw:duration-150 tw:ease-in"
              leaveFrom="tw:opacity-100 tw:translate-y-0 tw:md:scale-100"
              leaveTo="tw:opacity-0 tw:translate-y-[20%] tw:md:translate-y-0 tw:md:scale-95"
            >
              <Dialog.Panel className="tw:w-full tw:max-w-md tw:bg-white tw:shadow-xl tw:rounded-t-2xl tw:md:rounded-2xl tw:overflow-hidden tw:flex tw:flex-col tw:max-h-[80vh]">
                {/* Header */}
                <div className="tw:px-4 tw:pt-4 tw:pb-3 tw:border-b tw:border-zinc-100 tw:flex tw:items-center tw:justify-between">
                  <div className="tw:flex tw:items-center tw:gap-2">
                    <span className="tw:size-9 tw:flex tw:items-center tw:justify-center tw:rounded-xl tw:bg-primary/10">
                      <Share2 className="tw:size-5 tw:text-primary" />
                    </span>
                    <div className="tw:flex tw:flex-col">
                      <span className="tw:text-lg tw:font-semibold">
                        {title}
                      </span>
                      <span className="tw:text-[11px] tw:text-zinc-500">
                        Choose a channel
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="tw:p-2 tw:rounded-full tw:hover:bg-gray-100"
                    onClick={() => !loading && onClose?.()}
                    aria-label="Close"
                  >
                    <X className="tw:size-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="tw:flex-1 tw:overflow-y-auto tw:px-4 tw:py-4">
                  {loading ? (
                    <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-10 tw:gap-3">
                      <div className="tw:h-8 tw:w-8 tw:border-2 tw:border-primary/30 tw:border-t-primary tw:rounded-full tw:animate-spin" />
                      <p className="tw:text-sm tw:text-gray-600">
                        Loading share options…
                      </p>
                    </div>
                  ) : safeChannels.length ? (
                    <>
                      <div className="tw:grid tw:grid-cols-3 tw:gap-3 tw:pb-2">
                        {safeChannels.map((ch) => {
                          const key = normKey(ch?.key);
                          const localIcon = CHANNEL_ICON[key];

                          return (
                            <button
                              key={`${key}-${ch?.name}`}
                              type="button"
                              onClick={() => openChannel(ch)}
                              className="tw:flex tw:flex-col tw:items-center tw:gap-2 tw:p-3 tw:bg-[#F9FAFB] tw:border tw:border-gray-100 tw:rounded-xl tw:hover:bg-gray-50"
                            >
                              {localIcon ? (
                                <img
                                  src={localIcon}
                                  alt={ch?.name || key}
                                  className="tw:size-10 tw:rounded"
                                />
                              ) : (
                                <div className="tw:flex tw:items-center tw:justify-center tw:size-10 tw:rounded tw:bg-gray-100">
                                  <LinkIcon className="tw:size-5 tw:text-gray-700" />
                                </div>
                              )}

                              <span className="tw:text-xs tw:text-black">
                                {ch?.name || key}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Optional: quick copy row */}
                      {shareUrl && (
                        <div className="tw:mt-4 tw:flex tw:items-center tw:gap-2 tw:bg-zinc-50 tw:border tw:border-zinc-100 tw:rounded-xl tw:p-3">
                          <span className="tw:text-[11px] tw:text-zinc-500 tw:flex-1 tw:truncate">
                            {shareUrl}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(shareUrl)}
                            className="tw:text-xs tw:font-semibold tw:text-primary tw:px-3 tw:py-1.5 tw:bg-primary/10 tw:rounded-lg tw:hover:bg-primary/15"
                          >
                            Copy
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="tw:py-8 tw:text-center">
                      <p className="tw:text-sm tw:text-gray-600">
                        No share options available.
                      </p>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
