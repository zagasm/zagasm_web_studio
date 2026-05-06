// src/lib/analytics.js

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "G-QCPBRK3240";

export function initGA() {
  if (!GA_MEASUREMENT_ID) return;

  const script1 = document.createElement("script");
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  window.dataLayer = window.dataLayer || [];

  window.gtag = function () {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID);
}

export function trackPageView(path) {
  if (!window.gtag || !GA_MEASUREMENT_ID) return;

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: path,
  });
}

export function trackEvent(eventName, params = {}) {
  if (!window.gtag) return;

  window.gtag("event", eventName, params);
}