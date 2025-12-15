export const truncate = (text, max = 48) => {
  if (!text || typeof text !== "string") return "";
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  const safe = lastSpace > 0 ? cut.slice(0, lastSpace) : cut;
  return safe.replace(/[.,:;!?-]*$/, "") + "…";
};

export const getInitials = (name) => {
  if (!name || typeof name !== "string") return "Z";
  const parts = name.trim().split(/\s+/);
  const a = parts[0]?.[0] ?? "";
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (a + b).toUpperCase() || "Z";
};

export const hasProfileImage = (profileImage) => {
  if (!profileImage) return false;
  if (profileImage === "null") return false;
  if (profileImage === "undefined") return false;
  return true;
};

export const rankSafe = (o) => {
  const r = Number(o?.rank);
  return Number.isFinite(r) ? r : 999999;
};
