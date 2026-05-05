export function getWebDeviceName() {
  if (typeof navigator === "undefined") {
    return "React Web";
  }

  const uaData = navigator.userAgentData;
  const browser =
    uaData?.brands?.find((brand) => !/chromium|not/i.test(brand.brand))?.brand ||
    (navigator.userAgent.includes("Firefox")
      ? "Firefox"
      : navigator.userAgent.includes("Safari") &&
          !navigator.userAgent.includes("Chrome")
        ? "Safari"
        : navigator.userAgent.includes("Edg")
          ? "Edge"
          : navigator.userAgent.includes("Chrome")
            ? "Chrome"
            : "Browser");

  return `React Web - ${browser}`;
}
