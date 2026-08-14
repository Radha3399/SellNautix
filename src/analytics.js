export const measurementId = "G-0DL4BELDR9";

export function trackEvent(name, parameters = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, parameters);
}

export function trackPageView({ title }) {
  trackEvent("page_view", {
    page_location: window.location.href,
    page_path: `${window.location.pathname}${window.location.search}`,
    page_title: title
  });
}
