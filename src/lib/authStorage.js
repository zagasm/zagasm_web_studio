const AUTH_STORAGE_KEYS = ["token", "userdata", "organiserdata"];
const REMEMBERED_ACCOUNTS_KEY = "remembered_accounts";
const MAX_REMEMBERED_ACCOUNTS = 5;

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function safeParse(value, fallback) {
  if (!value) return fallback;

  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

function normalizeAvatar(user = {}) {
  const rawAvatar =
    user.profileUrl ||
    user.profile_url ||
    user.avatar ||
    user.avatar_url ||
    user.profile_image ||
    user.profileImageUrl ||
    "";

  if (rawAvatar) {
    return rawAvatar;
  }

  const imageId = user.profile_image_id || user.profileImageId || "";
  if (!imageId) return "";

  if (/^https?:\/\//i.test(imageId)) {
    return imageId;
  }

  const apiBase = import.meta.env.VITE_API_URL || "";
  if (!apiBase) return imageId;

  if (apiBase.endsWith("/") && imageId.startsWith("/")) {
    return `${apiBase}${imageId.slice(1)}`;
  }

  if (!apiBase.endsWith("/") && !imageId.startsWith("/")) {
    return `${apiBase}/${imageId}`;
  }

  return `${apiBase}${imageId}`;
}

function normalizeFullName(user = {}) {
  const explicitName =
    user.full_name ||
    user.fullName ||
    [user.firstName || user.first_name, user.lastName || user.last_name]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    user.username ||
    "";

  return explicitName || normalizeEmail(user.email || user.email_address) || "Account";
}

export function buildRememberedAccount(user = {}) {
  const userId = String(user.user_id || user.id || user.userId || "").trim();
  const email = normalizeEmail(user.email || user.email_address || user.emailAddress);

  if (!userId && !email) {
    return null;
  }

  return {
    id: userId || email,
    userId,
    email,
    fullName: normalizeFullName(user),
    avatar: normalizeAvatar(user),
    lastUsedAt: new Date().toISOString(),
  };
}

export function getRememberedAccounts() {
  if (!canUseStorage()) return [];

  const value = window.localStorage.getItem(REMEMBERED_ACCOUNTS_KEY);
  const parsed = safeParse(value, []);

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed.filter((account) => {
    if (!account || typeof account !== "object") return false;
    return Boolean(account.userId || account.email);
  });
}

export function saveRememberedAccounts(accounts) {
  if (!canUseStorage()) return;

  window.localStorage.setItem(
    REMEMBERED_ACCOUNTS_KEY,
    JSON.stringify(accounts.slice(0, MAX_REMEMBERED_ACCOUNTS))
  );
}

export function rememberAccount(user) {
  const nextAccount = buildRememberedAccount(user);
  if (!nextAccount) return null;

  const existingAccounts = getRememberedAccounts();
  const deduped = existingAccounts.filter((account) => {
    const sameUserId =
      nextAccount.userId &&
      account.userId &&
      account.userId === nextAccount.userId;
    const sameEmail =
      nextAccount.email &&
      account.email &&
      normalizeEmail(account.email) === nextAccount.email;

    return !sameUserId && !sameEmail;
  });

  saveRememberedAccounts([nextAccount, ...deduped]);
  return nextAccount;
}

export function removeRememberedAccount(identifier) {
  if (!identifier) return;

  const normalizedIdentifier = String(identifier).trim().toLowerCase();
  const remainingAccounts = getRememberedAccounts().filter((account) => {
    const accountId = String(account.id || "").trim().toLowerCase();
    const accountUserId = String(account.userId || "").trim().toLowerCase();
    const accountEmail = normalizeEmail(account.email);

    return (
      accountId !== normalizedIdentifier &&
      accountUserId !== normalizedIdentifier &&
      accountEmail !== normalizedIdentifier
    );
  });

  saveRememberedAccounts(remainingAccounts);
}

export function clearActiveAuthStorage() {
  if (!canUseStorage()) return;

  AUTH_STORAGE_KEYS.forEach((key) => {
    window.localStorage.removeItem(key);
  });
}
