import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import googleLogo from "../../../assets/google-logo.png";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleAuthSection({
  label = "Or continue with",
  text = "continue_with",
  onSuccess,
  onError,
}) {
  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <div className="tw:w-full">
      <p className="small text-muted mb-3">{label}</p>
      <div className="tw:flex tw:justify-center">
        <div className="tw:relative tw:w-full tw:max-w-[420px] tw:overflow-hidden google-auth-shell">
          <div className="tw:pointer-events-none tw:flex tw:w-full tw:items-center tw:justify-center tw:gap-2 tw:rounded-full tw:border tw:border-gray-300 tw:bg-white tw:px-4 tw:py-3 tw:text-sm tw:font-medium tw:text-gray-900">
            <img
              src={googleLogo}
              alt="Google Logo"
              className="tw:h-4 tw:w-4 tw:shrink-0"
            />
            <span>
              {text === "signup_with"
                ? "Sign up with Google"
                : "Continue with Google"}
            </span>
          </div>
          <GoogleLogin
            onSuccess={onSuccess}
            onError={onError}
            text={text}
            theme="outline"
            shape="pill"
            size="large"
            width="400"
          />
        </div>
      </div>
      <style>{`
        .google-auth-shell > div:last-child,
        .google-auth-shell > div:last-child > div,
        .google-auth-shell iframe {
          width: 100% !important;
          max-width: 100% !important;
        }
        .google-auth-shell > div:last-child {
          position: absolute !important;
          inset: 0 !important;
          opacity: 0 !important;
        }
      `}</style>
    </div>
  );
}
