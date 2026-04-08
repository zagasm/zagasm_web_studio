import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import AuthContainer from "../assets/auth_container";
import { motion } from "framer-motion";
import axios from "axios";
import { SigninWithCode } from "./SignCode";
import { showError, showSuccess } from "../../../component/ui/toast";
import {
  getRememberedAccounts,
  removeRememberedAccount,
} from "../../../lib/authStorage";
import defaultAvatar from "../../../assets/avater_pix.avif";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REMEMBERED_ACCOUNT_INVALID_PATTERNS = [
  "account not found",
  "user not found",
  "no account",
  "deleted account",
  "account deleted",
  "no longer exists",
  "deactivated",
  "disabled account",
];

export function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const [verificationSource, setVerificationSource] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [rememberedAccounts, setRememberedAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    setRememberedAccounts(getRememberedAccounts());
  }, []);

  const isCredentialFilled = useMemo(() => {
    return formData.email && EMAIL_REGEX.test(formData.email);
  }, [formData.email]);

  const isPasswordFilled = formData.password.length >= 6;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      boxShadow: "0 4px 12px rgba(143, 7, 231, 0.3)",
    },
    tap: { scale: 0.98 },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    if (errors.server) setErrors((prev) => ({ ...prev, server: null }));
  };

  const validateCredential = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateCredential()) {
      setVerificationSource(formData.email);
      setShowPasswordField(true);
      setSelectedAccount(null);
    }
  };

  const resetToManualLogin = () => {
    setSelectedAccount(null);
    setShowPasswordField(false);
    setShowPassword(false);
    setFormData({ email: "", password: "" });
    setErrors({});
  };

  const handleSelectAccount = (account) => {
    setSelectedAccount(account);
    setVerificationSource(account.email || "");
    setShowPasswordField(true);
    setShowPassword(false);
    setErrors({});
    setFormData({
      email: account.email || "",
      password: "",
    });
  };

  const handleRemoveRememberedAccount = (event, account) => {
    event.preventDefault();
    event.stopPropagation();

    const identifier = account.userId || account.email || account.id;
    removeRememberedAccount(identifier);

    const nextAccounts = getRememberedAccounts();
    setRememberedAccounts(nextAccounts);

    if (
      selectedAccount &&
      (selectedAccount.userId === account.userId ||
        selectedAccount.email === account.email)
    ) {
      resetToManualLogin();
    }
  };

  const handleInvalidRememberedAccount = (message) => {
    if (!selectedAccount) return;

    const normalizedMessage = String(message || "").toLowerCase();
    const shouldRemove = REMEMBERED_ACCOUNT_INVALID_PATTERNS.some((pattern) =>
      normalizedMessage.includes(pattern)
    );

    if (!shouldRemove) return;

    removeRememberedAccount(
      selectedAccount.userId || selectedAccount.email || selectedAccount.id
    );
    setRememberedAccounts(getRememberedAccounts());
    resetToManualLogin();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setIsLoading(true);

    try {
      const payload = {
        input: formData.email,
        password: formData.password,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/login`,
        payload
      );

      const data = response.data;
      if (data.token) {
        login({
          user: data.user,
          token: data.token,
        });
        showSuccess(data.message || "Login successful!");
        navigate("/feed");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "The provided credentials are incorrect.";

      handleInvalidRememberedAccount(errorMessage);
      showError(errorMessage);
      setErrors({ server: errorMessage });
    } finally {
      setIsLoading(false);
      setFormData((prev) => ({ ...prev, password: "" }));
    }
  };

  if (showVerification) {
    return (
      <SigninWithCode
        CodeType="email"
        CodeSource={verificationSource}
        loginMethod="email"
        formData={formData}
      />
    );
  }

  return (
    <AuthContainer
      title="Login account"
      description="Continue to explore Xilolo"
      footer={true}
      header={true}
      privacy={true}
      haveAccount={true}
    >
      <style>{`
        .continue-btn {
          background-color: ${isCredentialFilled ? "rgba(143, 7, 231, 1)" : "rgba(230, 230, 230, 1)"};
          color: white;
          cursor: ${isCredentialFilled ? "pointer" : "not-allowed"};
        }

        .signin-btn {
          background-color: ${isPasswordFilled ? "rgba(143, 7, 231, 1)" : "rgba(230, 230, 230, 1)"};
          color: white;
          cursor: ${isPasswordFilled ? "pointer" : "not-allowed"};
        }

        .verification-btn {
          background-color: transparent;
          border: 1px solid rgba(143, 7, 231, 1);
          color: rgba(143, 7, 231, 1);
        }
      `}</style>

      <motion.form
        onSubmit={handleSubmit}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {rememberedAccounts.length > 0 && !selectedAccount && !showPasswordField && (
          <motion.div variants={inputVariants} className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label mb-0">Remembered accounts</label>
              {/* <button
                type="button"
                className="btn btn-link p-0 text-decoration-none"
                onClick={resetToManualLogin}
              >
                Use another accountt
              </button> */}
            </div>

            <div className="d-grid gap-2">
              {rememberedAccounts.map((account) => (
                <div
                  key={account.id || account.userId || account.email}
                  className="btn btn-light border text-start d-flex align-items-center justify-content-between py-3 px-3"
                  onClick={() => handleSelectAccount(account)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleSelectAccount(account);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <span className="d-flex align-items-center">
                    <img
                      src={account.avatar || defaultAvatar}
                      alt={account.fullName}
                      onError={(event) => {
                        event.currentTarget.src = defaultAvatar;
                      }}
                      className="me-3"
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <span className="d-flex flex-column">
                      <span className="fw-semibold text-dark">
                        {account.fullName}
                      </span>
                      <span className="text-muted small">{account.email}</span>
                    </span>
                  </span>

                  <button
                    type="button"
                    className="btn btn-sm btn-link text-danger text-decoration-none"
                    onClick={(event) =>
                      handleRemoveRememberedAccount(event, account)
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {errors.server && (
          <motion.div
            className="alert alert-danger mb-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring" }}
          >
            {errors.server}
          </motion.div>
        )}

        {!selectedAccount && (
          <motion.div variants={inputVariants} className="form-group mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              {rememberedAccounts.length > 0 && showPasswordField && (
                <button
                  type="button"
                  className="btn btn-link p-0 text-decoration-none"
                  onClick={resetToManualLogin}
                >
                  Choose remembered account
                </button>
              )}
            </div>
            <div className="position-relative">
              <i
                className="feather-mail position-absolute"
                style={{
                  left: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#666",
                }}
              ></i>
              <input
                type="email"
                id="email"
                name="email"
                className={`tw:w-full tw:pl-8 tw:pr-6 tw:py-4 tw:rounded-lg tw:border tw:border-gray-200 ${errors.email ? "is-invalid" : ""
                  }`}
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                autoComplete="username"
              />
              {errors.email && (
                <div className="invalid-feedback d-block mt-1">
                  {errors.email}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {selectedAccount && (
          <motion.div variants={inputVariants} className="mb-4">
            <div className="border rounded-3 p-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <img
                  src={selectedAccount.avatar || defaultAvatar}
                  alt={selectedAccount.fullName}
                  onError={(event) => {
                    event.currentTarget.src = defaultAvatar;
                  }}
                  className="me-3"
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <div>
                  <div className="fw-semibold text-dark">
                    {selectedAccount.fullName}
                  </div>
                  <div className="text-muted small">{selectedAccount.email}</div>
                </div>
              </div>
              <button
                style={{
                  color: 'purple'
                }}
                type="button"
                className="btn btn-link p-0 text-decoration-none text-primary"
                onClick={resetToManualLogin}
              >
                Use another account
              </button>
            </div>
          </motion.div>
        )}

        {showPasswordField && (
          <>
            <motion.div
              variants={inputVariants}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="form-group mb-3"
            >
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="position-relative">
                <i
                  className="feather-lock position-absolute"
                  style={{
                    left: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#666",
                  }}
                ></i>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className={`tw:w-full tw:pl-2 tw:pr-6 tw:py-4 tw:rounded-lg tw:border tw:border-gray-200 ${errors.password ? "is-invalid" : ""
                    }`}
                  style={{
                    paddingLeft: "45px",
                    paddingRight: "45px",
                    height: "40px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete={
                    selectedAccount ? "current-password" : "current-password"
                  }
                />
                <i
                  className={`feather-eye${showPassword ? "" : "-off"
                    } position-absolute`}
                  style={{
                    right: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "#666",
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                />
                {errors.password && (
                  <div className="invalid-feedback d-block mt-1">
                    {errors.password}
                  </div>
                )}
              </div>
            </motion.div>
            <div className="d-flex justify-content-end mb-3">
              <Link
                to="/auth/forget-password"
                className="text-decoration-none"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <motion.span
                  animate={{
                    x: isHovering ? 2 : 0,
                  }}
                  transition={{ type: "spring" }}
                >
                  Forgot password?
                </motion.span>
              </Link>
            </div>
          </>
        )}

        {!showPasswordField ? (
          <motion.div variants={inputVariants}>
            <motion.button
              type="button"
              className="bt w-100 continue-btn"
              style={{
                height: "40px",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "500",
                border: "none",
              }}
              disabled={!isCredentialFilled || isLoading}
              variants={buttonVariants}
              whileHover={isCredentialFilled ? "hover" : {}}
              whileTap={isCredentialFilled ? "tap" : {}}
              onClick={handleContinue}
            >
              Continue
            </motion.button>
          </motion.div>
        ) : (
          <>
            <motion.div variants={inputVariants}>
              <motion.button
                type="submit"
                className="bt w-100 signin-btn mb-3"
                style={{
                  height: "40px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "500",
                  border: "none",
                }}
                disabled={!isPasswordFilled || isLoading}
                variants={buttonVariants}
                whileHover={isPasswordFilled ? "hover" : {}}
                whileTap={isPasswordFilled ? "tap" : {}}
              >
                {isLoading ? (
                  <div className="d-flex justify-content-center align-items-center">
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </motion.button>
            </motion.div>
            {/* <motion.div variants={inputVariants}>
              <motion.button
                type="button"
                className="bt w-100 verification-btn"
                style={{
                  height: "40px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "500",
                  Width: '40px',
                  margin: 'auto'
                }}
                onClick={handleVerificationCode}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <i className="feather-mail mr-2"></i> Email sign-in code
              </motion.button>
            </motion.div> */}
          </>
        )}
      </motion.form>
    </AuthContainer>
  );
}
