import React, { useRef, useState, useEffect, useCallback } from "react";
import PostSignupFormModal from "./ModalContainer";
import PhoneEmailPostSignup from "./PhoneEmailPostSignup";
import "./postSignupStyle.css";
import axios from "axios";
import { useAuth } from "../../../../pages/auth/AuthContext";
// import { useModal } from "../..";
import { showSuccess, showError } from "../../../ui/toast";
import qs from "qs";
import { useModal } from "..";

const DEFAULT_TIMER = 600; // seconds

const SignUpCodecomponent = ({ Otpcode, token, userupdate, type }) => {
  const inputRefs = useRef([]);
  const [code, setCode] = useState(["", "", "", "", ""]);
  const [newotpcode, setnewotpcode] = useState(Otpcode);
  const [switchToForm, setSwitchToForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [timer, setTimer] = useState(DEFAULT_TIMER);
  const [canResend, setCanResend] = useState(false);
  const { login } = useAuth();
  const { closeModal } = useModal();

  const startTimer = useCallback(() => {
    setTimer(DEFAULT_TIMER);
    setCanResend(false);
  }, []);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prevTimer) => Math.max(prevTimer - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    const contact = type.includes("email")
      ? userupdate?.email
      : userupdate?.phone;
    if (!contact) {
      const message = "No contact information available to resend the code.";
      setErrorMessage(message);
      showError(message);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/code/regenerate`,
        qs.stringify({ input: contact }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const payload = response.data?.data || response.data || {};
      const newCode = payload.code || response.data.code || "";
      setnewotpcode(newCode);
      const successMsg =
        payload.message ||
        response.data.message ||
        "Verification code resent successfully!";
      setSuccessMessage(successMsg);
      showSuccess(successMsg);
      startTimer();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to resend verification code. Please try again.";
      setErrorMessage(message);
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 4) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFinish = async () => {
    const verificationCode = code.join("");
    const verificationType =
      type === "email" || type === "email_verification"
        ? "email_verification"
        : type === "phone" || type === "phone_verification"
        ? "phone_verification"
        : "password_reset";

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/code/verify`,
        qs.stringify({ code: verificationCode, type: verificationType }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = response.data;
      if (result && result.status !== false) {
        const payload = result.data || result;
        const message =
          payload?.message || result?.message || "Verification successful!";
        showSuccess(message);

        const user = userupdate || payload?.user;
        login({ token, user });
        closeModal();
      } else {
        const message =
          result?.message || "Verification failed. Please try again.";
        setErrorMessage(message);
      }
    } catch (error) {
      if (error.response?.status === 422) {
        const errorData = error.response.data;
        if (errorData.errors?.otp) {
          setErrorMessage(errorData.errors.otp.join(" "));
        } else {
          setErrorMessage(
            errorData.message || "Validation failed. Please check your input."
          );
        }
      } else {
        const message =
          error.response?.data?.message ||
          "Something went wrong. Please try again.";
        setErrorMessage(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isComplete = code.every((digit) => digit !== "");

  const skipProcess = () => {
    const user = userupdate;
    login({ token, user });
    closeModal();
  };

  if (switchToForm) {
    const altType =
      type === "email" || type === "email_verification" ? "phone" : "email";
    return (
      <PhoneEmailPostSignup
        token={token}
        userupdate={userupdate}
        type={altType}
      />
    );
  }

  return (
    <PostSignupFormModal>
      <div className="tw:max-w-md tw:w-full tw:mx-auto tw:bg-white tw:rounded-3xl tw:shadow-2xl tw:px-6 tw:py-8 tw:space-y-5">
        <div className="tw:space-y-1">
          <span className="tw:text-xl tw:font-semibold tw:text-gray-900">
            We sent a code to your {type.includes("email") ? "email" : "phone"}
          </span>
          <p className="tw:text-sm tw:text-gray-500">
            Enter the 5-digit verification code below. Your code is{" "}
            {newotpcode || "pending"}.
          </p>
        </div>

        {successMessage && (
          <div className="tw:rounded-2xl tw:bg-emerald-50 tw:border tw:border-emerald-200 tw:px-4 tw:py-3 tw:text-sm tw:text-emerald-700">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="tw:rounded-2xl tw:bg-red-50 tw:border tw:border-red-200 tw:px-4 tw:py-3 tw:text-sm tw:text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="tw:grid tw:grid-cols-5 tw:gap-3">
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="tw:h-14 tw:rounded-2xl tw:border tw:border-gray-200 tw:bg-gray-50 tw:text-center tw:text-xl tw:font-semibold tw:outline-none focus:tw:border-primary"
            />
          ))}
        </div>

        <div className="tw:flex tw:flex-col tw:gap-1 tw:text-sm tw:text-gray-500">
          <button
            type="button"
            onClick={handleResendCode}
            disabled={!canResend || isLoading}
            className={`tw:text-left tw:font-semibold tw:underline tw:transition tw:duration-150 ${
              canResend ? "tw:text-primary" : "tw:text-gray-400"
            }`}
          >
            {isLoading ? "Sending..." : "Resend Code"}
          </button>
          <span>
            Code expires in{" "}
            <strong className="tw:text-gray-900">{formatTime(timer)}</strong>
          </span>
        </div>

        <button
          type="button"
          onClick={() => setSwitchToForm(true)}
          className="tw:text-sm tw:font-semibold tw:text-gray-600 tw:underline hover:tw:text-gray-900"
        >
          Use {type.includes("email") ? "phone number" : "email"} instead
        </button>

        <div className="tw:flex tw:gap-3 tw:mt-3">
          <button
            style={{
              borderRadius: 24,
            }}
            type="button"
            onClick={skipProcess}
            className="tw:flex-1 tw:text-sm tw:font-semibold tw:text-neutral-900 tw:bg-gray-100 tw:rounded-2xl tw:py-3 hover:tw:opacity-80"
          >
            Skip for now
          </button>
          <button
            style={{
              borderRadius: 24,
            }}
            type="button"
            onClick={handleFinish}
            disabled={!isComplete || isLoading}
            className={`tw:flex-1 tw:w-full tw:rounded-2xl tw:py-3 tw:text-sm tw:font-semibold tw:transition tw:duration-200 ${
              isComplete && !isLoading
                ? "tw:bg-linear-to-r tw:from-primary tw:to-primarySecond tw:text-white"
                : "tw:bg-gray-200 tw:text-gray-500"
            }`}
          >
            {isLoading ? "Finishing…" : "Finish"}
          </button>
        </div>
      </div>
    </PostSignupFormModal>
  );
};

export default SignUpCodecomponent;
