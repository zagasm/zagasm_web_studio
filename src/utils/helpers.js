export function truncate(text, max = 120, opts = {}) {
  const {
    indicator = "…",
    position = "end", // "end" | "middle" | "start"
    wordSafe = true, // avoid cutting inside words (for "end" only)
  } = opts;

  if (typeof text !== "string") return "";
  if (text.length <= max) return text;

  if (position === "start") {
    return indicator + text.slice(text.length - max).trimStart();
  }

  if (position === "middle") {
    if (max < 5) return text.slice(0, max) + indicator; // guard
    const half = Math.floor(max / 2);
    const left = text.slice(0, half).trimEnd();
    const right = text.slice(text.length - (max - half)).trimStart();
    return left + indicator + right;
  }

  // position === "end"
  let cut = text.slice(0, max);
  if (wordSafe) {
    const lastSpace = cut.lastIndexOf(" ");
    if (lastSpace > 0) cut = cut.slice(0, lastSpace);
  }
  return cut.replace(/[.,:;!?-]*$/, "") + indicator;
}

// Flatten a Laravel-like nested error object into an array of { path, messages }
export function flattenLaravelErrors(obj, prefix = "") {
  const out = [];
  if (!obj || typeof obj !== "object") return out;

  for (const [key, val] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (Array.isArray(val)) {
      // leaf: array of strings
      out.push({ path, messages: val.map(String) });
    } else if (val && typeof val === "object") {
      // nested object: recurse
      out.push(...flattenLaravelErrors(val, path));
    } else if (typeof val === "string") {
      out.push({ path, messages: [val] });
    }
  }
  return out;
}

// Optional: pretty labels for top-level step keys
const STEP_LABELS = {
  step_1: "Basic Info",
  step_2: "Media",
  step_3: "Media ",
  step_4: "Streaming",
  step_5: "Access & Visibility",
  step_6: "Review",
};

export function prettifyPath(path) {
  // "step_3.poster" -> "Ticketing & Media • poster"
  const [head, ...rest] = path.split(".");
  const niceHead = STEP_LABELS[head] || head.replaceAll("_", " ");
  return rest.length ? `${niceHead} • ${rest.join(".")}` : niceHead;
}

// Optional: get first step number to jump user directly to the offending page
export function firstErrorStepNumber(errors) {
  const key = Object.keys(errors || {}).find((k) => /^step_\d+$/.test(k));
  if (!key) return null;
  const n = Number(key.split("_")[1]);
  return Number.isFinite(n) ? n : null;
}
