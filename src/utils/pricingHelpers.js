export function normalizeFeatures(features) {
  if (!Array.isArray(features)) return [];
  return features
    .flatMap((f) => (typeof f === "string" ? f.split("\n") : []))
    .map((line) => line.replace(/^\d+\.\s*/, "").trim())
    .filter(Boolean);
}

export function currencySymbol(code) {
  switch (code) {
    case "NGN":
      return "₦";
    case "USD":
      return "$";
    case "GBP":
      return "£";
    case "EUR":
      return "€";
    default:
      return "";
  }
}

export function formatMoney(amount) {
  if (typeof amount !== "number" || isNaN(amount)) return "0";
  try {
    return amount.toLocaleString("en-NG", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  } catch {
    return String(Math.round(amount));
  }
}
