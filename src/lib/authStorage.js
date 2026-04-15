const AUTH_STORAGE_KEYS = ["token", "userdata", "organiserdata"];
const REMEMBERED_ACCOUNTS_KEY = "remembered_accounts";
const MAX_REMEMBERED_ACCOUNTS = 2;
const QUICK_LOGIN_DURATION_MS = 24 * 60 * 60 * 1000;

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

function getTimestamp(value) {
  const timestamp = new Date(value || "").getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function hasValidQuickLogin(account = {}) {
  if (!account?.quickLoginToken || !account?.quickLoginExpiresAt) {
    return false;
  }

  return getTimestamp(account.quickLoginExpiresAt) > Date.now();
}

function sanitizeRememberedAccount(account = {}) {
  const sanitized = { ...account };

  if (!hasValidQuickLogin(account)) {
    delete sanitized.quickLoginToken;
    delete sanitized.quickLoginExpiresAt;
  }

  return sanitized;
}

export function getRememberedAccounts() {
  if (!canUseStorage()) return [];

  const value = window.localStorage.getItem(REMEMBERED_ACCOUNTS_KEY);
  const parsed = safeParse(value, []);

  if (!Array.isArray(parsed)) {
    return [];
  }

  const sanitized = parsed
    .filter((account) => {
      if (!account || typeof account !== "object") return false;
      return Boolean(account.userId || account.email);
    })
    .map(sanitizeRememberedAccount)
    .sort(
      (left, right) => getTimestamp(right.lastUsedAt) - getTimestamp(left.lastUsedAt)
    );

  if (JSON.stringify(sanitized) !== JSON.stringify(parsed)) {
    saveRememberedAccounts(sanitized);
  }

  return sanitized;
}

export function saveRememberedAccounts(accounts) {
  if (!canUseStorage()) return;

  window.localStorage.setItem(
    REMEMBERED_ACCOUNTS_KEY,
    JSON.stringify(accounts.slice(0, MAX_REMEMBERED_ACCOUNTS))
  );
}

export function rememberAccount(user, token) {
  const nextAccount = buildRememberedAccount(user);
  if (!nextAccount) return null;

  const existingAccounts = getRememberedAccounts();
  const existingMatch = existingAccounts.find((account) => {
    const sameUserId =
      nextAccount.userId &&
      account.userId &&
      account.userId === nextAccount.userId;
    const sameEmail =
      nextAccount.email &&
      account.email &&
      normalizeEmail(account.email) === nextAccount.email;

    return sameUserId || sameEmail;
  });
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

  if (token) {
    nextAccount.quickLoginToken = token;
    nextAccount.quickLoginExpiresAt = new Date(
      Date.now() + QUICK_LOGIN_DURATION_MS
    ).toISOString();
  } else if (existingMatch && hasValidQuickLogin(existingMatch)) {
    nextAccount.quickLoginToken = existingMatch.quickLoginToken;
    nextAccount.quickLoginExpiresAt = existingMatch.quickLoginExpiresAt;
  }

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

export function clearRememberedAccountQuickLogin(identifier) {
  if (!identifier) return;

  const normalizedIdentifier = String(identifier).trim().toLowerCase();
  const nextAccounts = getRememberedAccounts().map((account) => {
    const accountId = String(account.id || "").trim().toLowerCase();
    const accountUserId = String(account.userId || "").trim().toLowerCase();
    const accountEmail = normalizeEmail(account.email);
    const matches =
      accountId === normalizedIdentifier ||
      accountUserId === normalizedIdentifier ||
      accountEmail === normalizedIdentifier;

    if (!matches) return account;

    const sanitized = { ...account };
    delete sanitized.quickLoginToken;
    delete sanitized.quickLoginExpiresAt;
    return sanitized;
  });

  saveRememberedAccounts(nextAccounts);
}
