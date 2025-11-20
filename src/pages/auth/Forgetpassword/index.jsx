import React, { useState } from "react";
import { showToast } from "../../../component/ToastAlert";
import AuthContainer from "../assets/auth_container";
import { motion } from "framer-motion";
import axios from "axios";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "../assets/style.css";
import { CodeVerification } from "../CodeVerification";

export function ForgetPassword() {
  const [input, setInput] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [activeTab, setActiveTab] = useState("email");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationData, setVerificationData] = useState(null);

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const isButtonDisabled =
    activeTab === "email"
      ? !input.trim() || !isValidEmail(input) || isSubmitting
      : !input.trim() || isSubmitting;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (activeTab === "email" && !isValidEmail(input)) {
      showToast.error("Please enter a valid email address format.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new URLSearchParams();
      formData.append("input", input);
      formData.append("country_code", "");
      // if (activeTab === "phone") {
      // }

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
      // console.log(data);
      showToast.success(data.message || "Verification code sent successfully!");
      setVerificationData({
        code: data.code,
        input: data.input,
        expiresAt: data.expiresAt,
        isEmail: activeTab === "email",
      });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to send verification code. Please try again.";
      showToast.error(message);
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
      description={"Enter your email or phone to reset your password"}
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
        {/* Tabbed Interface */}
        <div className="tab-container mb-4">
          <div className="tabs">
            <button
              type="button"
              className={`tab ${activeTab === "email" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("email");
                setInput("");
              }}
            >
              <i className="feather-mail mr-2"></i>
              <span className="tw:ml-2">Email</span>
            </button>
            <button
              type="button"
              className={`tab ${activeTab === "phone" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("phone");
                setInput("");
              }}
            >
              <i className="feather-phone mr-2"></i>
                            <span className="tw:ml-2">Phone</span>

            </button>
          </div>
        </div>

        {activeTab === "email" ? (
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
        ) : (
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="form-group"
          >
            <div className="position-relative tw:mb-3">
              <PhoneInput
                id="PhoneInputInput"
                international
                defaultCountry="NG"
                value={input}
                onChange={(value) => {
                  setInput(value);
                  if (value) {
                    const code = value.slice(0, value.indexOf(" "));
                    setCountryCode(code.replace("+", ""));
                  }
                }}
                className={`phone-input `}
                placeholder="Enter phone number"
                inputStyle={{
                  outline: "none",
                  height: "50px",
                  width: "100%",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  paddingLeft: "48px",
                }}
              />
            </div>
          </motion.div>
        )}

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
        .tab-container {
          border-bottom: 1px solid #e0e0e0;
        }
        .tabs {
          display: flex;
          gap: 0;
        }
        .tab {
          flex: 1;
          padding: 12px 0;
          border: none;
          background: none;
          cursor: pointer;
          font-weight: 500;
          color: #666;
          border-bottom: 2px solid transparent;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tab.active {
          color: #8f07e7;
          border-bottom: 2px solid #8f07e7;
        }
        .tab:hover:not(.active) {
          color: #333;
          border-bottom: 2px solid #ddd;
        }

        :global(.custom-phone-input) {
          padding-left: 60px !important;
          height: 50px;
          width: 100%;
          border: 2px solid red;
          border-radius: 4px;
          font-size: 16px;
        }
        :global(.custom-phone-input .PhoneInputInput) {
          height: 100%;
          border: none !important;
          outline: none !important;
          background: transparent;
        }
        :global(.custom-phone-input .PhoneInputCountry) {
          padding-left: 10px;
          padding-right: 8px;
        }
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
