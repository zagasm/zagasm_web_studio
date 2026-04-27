const BASIC_EMAIL_REGEX =
  /^[A-Z0-9](?:[A-Z0-9._%+-]{0,62}[A-Z0-9])?@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i;

const DISALLOWED_EMAIL_PREFIXES = ["http://", "https://", "mailto:", "www."];

export function normalizeEmailInput(email) {
  return typeof email === "string" ? email.trim() : "";
}

export function isValidEmailAddress(email) {
  const normalizedEmail = normalizeEmailInput(email);

  if (!normalizedEmail) return false;

  const lowercasedEmail = normalizedEmail.toLowerCase();
  if (
    DISALLOWED_EMAIL_PREFIXES.some((prefix) =>
      lowercasedEmail.startsWith(prefix)
    )
  ) {
    return false;
  }

  if (
    normalizedEmail.includes("/") ||
    normalizedEmail.includes("\\") ||
    normalizedEmail.includes("..")
  ) {
    return false;
  }

  const [localPart = ""] = normalizedEmail.split("@");
  if (localPart.toLowerCase().startsWith("www.")) {
    return false;
  }

  return BASIC_EMAIL_REGEX.test(normalizedEmail);
}
