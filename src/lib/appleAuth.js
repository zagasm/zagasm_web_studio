const APPLE_SDK_SRC =
  "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";

const APPLE_CLIENT_ID = import.meta.env.VITE_APPLE_CLIENT_ID || "";
const APPLE_REDIRECT_URI = import.meta.env.VITE_APPLE_REDIRECT_URI || "";
const APPLE_SCOPE = import.meta.env.VITE_APPLE_SCOPE || "name email";

let appleSdkPromise = null;

function randomValue() {
  if (
    typeof window !== "undefined" &&
    window.crypto &&
    typeof window.crypto.randomUUID === "function"
  ) {
    return window.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function isAppleAuthConfigured() {
  return Boolean(APPLE_CLIENT_ID && getAppleRedirectUri());
}

export function getAppleClientId() {
  return APPLE_CLIENT_ID;
}

export function getAppleRedirectUri() {
  if (APPLE_REDIRECT_URI) return APPLE_REDIRECT_URI;

  if (typeof window === "undefined") return "";

  return `${window.location.origin}/auth/apple/callback`;
}

export async function loadAppleSdk() {
  if (typeof window === "undefined") {
    throw new Error("Apple Sign In is only available in the browser.");
  }

  if (window.AppleID?.auth) {
    return window.AppleID;
  }

  if (appleSdkPromise) {
    return appleSdkPromise;
  }

  appleSdkPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      `script[src="${APPLE_SDK_SRC}"]`
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.AppleID), {
        once: true,
      });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Apple Sign In SDK failed to load.")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = APPLE_SDK_SRC;
    script.async = true;
    script.onload = () => resolve(window.AppleID);
    script.onerror = () =>
      reject(new Error("Apple Sign In SDK failed to load."));
    document.head.appendChild(script);
  }).catch((error) => {
    appleSdkPromise = null;
    throw error;
  });

  return appleSdkPromise;
}

export async function signInWithApplePopup() {
  if (!isAppleAuthConfigured()) {
    throw new Error(
      "Apple Sign In is not configured. Set VITE_APPLE_CLIENT_ID and VITE_APPLE_REDIRECT_URI."
    );
  }

  const AppleID = await loadAppleSdk();

  AppleID.auth.init({
    clientId: getAppleClientId(),
    scope: APPLE_SCOPE,
    redirectURI: getAppleRedirectUri(),
    state: randomValue(),
    nonce: randomValue(),
    usePopup: true,
  });

  const response = await AppleID.auth.signIn();
  const idToken = response?.authorization?.id_token;

  if (!idToken) {
    throw new Error("Apple did not return an id_token.");
  }

  return {
    idToken,
    response,
  };
}

