// Tailwind pref: tw:
export const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

export const randomAvatar = (seed = "x") => {
  const s = String(seed);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  const idx = h % 70;
  const gender = idx % 2 === 0 ? "men" : "women";
  return `https://randomuser.me/api/portraits/${gender}/${Math.max(
    0,
    Math.min(idx, 69)
  )}.jpg`;
};

export const formatEventDateTime = (dateStr, timeStr) => {
  if (!dateStr) return "";
  try {
    const d = new Date(`${dateStr} ${timeStr || ""}`);
    const dd = d.toLocaleDateString(undefined, {
      weekday: "short",
      day: "2-digit",
      month: "long",
    });
    const tt = d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${dd} · ${tt}`;
  } catch {
    return [dateStr, timeStr].filter(Boolean).join(" · ");
  }
};
