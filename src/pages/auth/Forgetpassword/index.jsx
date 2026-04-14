import React, { useState } from "react";
import AuthContainer from "../assets/auth_container";
import { motion } from "framer-motion";
import axios from "axios";
import "../assets/style.css";
import { CodeVerification } from "../CodeVerification";
import { showError, showSuccess } from "../../../component/ui/toast";

export function ForgetPassword() {
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationData, setVerificationData] = useState(null);

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const isButtonDisabled = !input.trim() || !isValidEmail(input) || isSubmitting;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(input)) {
      showError("Please enter a valid email address format.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new URLSearchParams();
      formData.append("input", input);
      formData.append("country_code", "");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/password/request-code`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const data = response.data;
      showSuccess(data.message || "Verification code sent successfully!");
      setVerificationData({
        code: data.code,
        input: data.input,
        expiresAt: data.expiresAt,
        isEmail: true,
      });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to send verification code. Please try again.";
      showError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (verificationData) {
    return <CodeVerification verificationData={verificationData} />;
  }

  return (
    <AuthContainer
      title={"Forgot Password?"}
      description={"Enter your email to reset your password"}
      footer={false}
      header={true}
      privacy={false}
      haveAccount={false}
    >
      <motion.form
        autoComplete="off"
        className="pr-3 pl-3"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="form-group tw:mb-3"
        >
          <div className="position-relative icon-form-control">
            <input
              type="email"
              className="tw:w-full input"
              placeholder="Enter your email"
              style={{ paddingLeft: "60px", outline: "none", marginBottom: 0 }}
              autoComplete="off"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <i
              className="feather-mail position-absolute input-icon "
              style={{ top: "1px" }}
            ></i>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className={`bt submit-button btn-block mb-5 ${
            isButtonDisabled ? "inactive_submit_button" : "active_submit_button"
          }`}
          type="submit"
          disabled={isButtonDisabled}
        >
          {isSubmitting ? (
            <>
              <span
                className="spinner-border spinner-border-sm mr-2"
                role="status"
                aria-hidden="true"
              ></span>
              Sending...
            </>
          ) : (
            "Continue"
          )}
        </motion.button>
      </motion.form>

      <style jsx>{`
        .submit-button {
          height: 50px;
          font-weight: 500;
          border-radius: 8px;
          font-size: 16px;
        }
        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </AuthContainer>
  );
}
