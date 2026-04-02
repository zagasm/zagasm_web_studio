import { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function HlsVideoPlayer({
  src = "https://studios1.b-cdn.net/live/cdfab424-1a7f-468c-9567-5fbadcb06621_mjc92q4r_b170f95c_abr/playlist.m3u8",
  autoPlay = true,
  muted = true,
  controls = true,
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let hls;

    // Safari/iOS (native HLS)
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      if (autoPlay) video.play().catch(() => {});
      return;
    }

    // Chrome/Firefox/Edge (hls.js)
    if (Hls.isSupported()) {
      hls = new Hls({
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 20,
        maxLiveSyncPlaybackRate: 1.5,
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay) video.play().catch(() => {});
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        // Optional: handle recovery
        console.error("HLS error:", data);
        if (data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
          else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
          else hls.destroy();
        }
      });
    } else {
      console.error("HLS not supported in this browser.");
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [src, autoPlay]);

  return (
    <video
      ref={videoRef}
      controls={controls}
      autoPlay={autoPlay}
      muted={muted}
      playsInline
      preload="auto"
      style={{
        width: "100%",
        maxWidth: 900,
        background: "#000",
        borderRadius: 12,
      }}
    />
  );
}
