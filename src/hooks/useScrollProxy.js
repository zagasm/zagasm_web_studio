import { useEffect } from "react";

/**
 * Forwards wheel/touch scroll events from proxyRef (left) to targetRef (right).
 * Enabled only on large screens (you decide via prop).
 */
export default function useScrollProxy(proxyRef, targetRef, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const proxyEl = proxyRef.current;
    const targetEl = targetRef.current;
    if (!proxyEl || !targetEl) return;

    const onWheel = (e) => {
      // Forward vertical & horizontal trackpad deltas
      if (Math.abs(e.deltaY) > 0 || Math.abs(e.deltaX) > 0) {
        e.preventDefault();
        targetEl.scrollBy({
          top: e.deltaY,
          left: e.deltaX,
          behavior: "auto",
        });
      }
    };

    // simple touch forwarding
    let lastY = null;
    const onTouchStart = (e) => {
      if (e.touches && e.touches.length) lastY = e.touches[0].clientY;
    };
    const onTouchMove = (e) => {
      if (lastY == null) return;
      const y = e.touches[0].clientY;
      const dy = lastY - y;
      if (Math.abs(dy) > 0) {
        e.preventDefault();
        targetEl.scrollBy({ top: dy, behavior: "auto" });
      }
      lastY = y;
    };
    const onTouchEnd = () => (lastY = null);

    proxyEl.addEventListener("wheel", onWheel, { passive: false });
    proxyEl.addEventListener("touchstart", onTouchStart, { passive: false });
    proxyEl.addEventListener("touchmove", onTouchMove, { passive: false });
    proxyEl.addEventListener("touchend", onTouchEnd, { passive: false });

    return () => {
      proxyEl.removeEventListener("wheel", onWheel);
      proxyEl.removeEventListener("touchstart", onTouchStart);
      proxyEl.removeEventListener("touchmove", onTouchMove);
      proxyEl.removeEventListener("touchend", onTouchEnd);
    };
  }, [proxyRef, targetRef, enabled]);
}
