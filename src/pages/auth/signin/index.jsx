import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { showToast } from "../../../component/ToastAlert";
import AuthContainer from "../assets/auth_container";
import { motion } from "framer-motion";
import axios from "axios";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { SigninWithCode } from "./SignCode";

export function Signin() {
  const [loginMethod, setLoginMethod] = useState('phone');
  const [showPassword, setShowPassword] = useState(false);
  const [verificationSource, setVerificationSource] = useState("");

  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const isCredentialFilled = loginMethod === 'phone'
    ? formData.phone && isValidPhoneNumber(formData.phone)
    : formData.email && /^\w+@\w+\.\w{2,}$/.test(formData.email);
  const isPasswordFilled = formData.password.length >= 6;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
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
        damping: 10
      }
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      boxShadow: "0 4px 12px rgba(143, 7, 231, 0.3)"
    },
    tap: { scale: 0.98 }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({ ...prev, phone: value || "" }));
    if (errors.phone) setErrors(prev => ({ ...prev, phone: null }));
  };

  const validateCredential = () => {
    const newErrors = {};
    const currentPhone = formData.phone;

    if (loginMethod === 'phone') {
      if (!currentPhone) {
        newErrors.phone = "Phone number is required";
      } else if (!isValidPhoneNumber(currentPhone)) {
        newErrors.phone = "Please enter a valid phone number";
      }
    } else {
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^\w+@\w+\.\w{2,}$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateCredential()) {
      const source = loginMethod === 'phone' ? formData.phone : formData.email;
      setVerificationSource(source);
      setShowPasswordField(true);
    }
  };

  const handleVerificationCode = () => {
    const newErrors = {};

    if (loginMethod === 'phone') {
      if (!formData.phone) {
        newErrors.phone = "Phone number is required";
      } else if (!isValidPhoneNumber(formData.phone)) {
        newErrors.phone = "Please enter a valid phone number";
      }
    } else {
      if (!formData.email.trim()) {
        newErrors.email = "Email address is required";
      } else if (!/^\w+@\w+\.\w{2,}$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...newErrors }));
      return;
    }

    const source = loginMethod === 'phone' ? formData.phone : formData.email;
    setVerificationSource(source);
    setShowVerification(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setIsLoading(true);

    try {
      const payload = {
        input: loginMethod === 'phone' ? formData.phone : formData.email,
        password: formData.password
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/login`,
        payload
      );

      const data = response.data;
      console.log(data);
      if (data.token) {
        login({
          user: data.user,
          token: data.token
        });
        showToast.success(data.message || "Login successful!");
        navigate("/feed");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message ||
        err.message ||
        "The provided credentials are incorrect.";

      showToast.error(errorMessage);
      setErrors({ server: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  if (showVerification) {
    return (
      <SigninWithCode
        CodeType={loginMethod}
        CodeSource={verificationSource}
        loginMethod={loginMethod}
        formData={formData}
      />
    );
  }

  return (
    <AuthContainer
      title="Login account"
      description="Continue to explore Zagasm Studio"
      footer={true}
      header={true}
      privacy={true}
      haveAccount={true}
    >
      <style>{`
        .continue-btn {
          background-color: ${isCredentialFilled ? 'rgba(143, 7, 231, 1)' : 'rgba(230, 230, 230, 1)'};
          color: white;
          cursor: ${isCredentialFilled ? 'pointer' : 'not-allowed'};
        }
        
        .signin-btn {
          background-color: ${isPasswordFilled ? 'rgba(143, 7, 231, 1)' : 'rgba(230, 230, 230, 1)'};
          color: white;
          cursor: ${isPasswordFilled ? 'pointer' : 'not-allowed'};
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
        className=""
      >
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

        <div className="login-tabs">
          <button
            className={`login-tab ${loginMethod === 'phone' ? 'active' : ''}`}
            type="button"
            onClick={() => {
              setLoginMethod('phone');
              setShowPasswordField(false);
            }}
          >
            Phone Number
          </button>
          <button
            className={`login-tab ${loginMethod === 'email' ? 'active' : ''}`}
            type="button"
            onClick={() => {
              setLoginMethod('email');
              setShowPasswordField(false);
            }}
          >
            Email Address
          </button>
        </div>

        <motion.div variants={inputVariants} className="form-group mb-4">
          <label htmlFor={loginMethod} className="form-label">
            {loginMethod === 'phone' ? 'Phone Number' : 'Email Address'}
          </label>
          <div className="position-relative">
            {loginMethod === 'phone' ? (
              <>
                <PhoneInput
                  id="PhoneInputInput"
                  international
                  defaultCountry="NG"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className={`phone-input ${errors.phone ? 'is-invalid' : ''}`}
                  placeholder="Enter phone number"
                 
                  onBlur={() => console.log("Current phone value on blur:", formData.phone)}
                />
                {errors.phone && (
                  <div className="invalid-feedback d-block mt-1">
                    {errors.phone}
                  </div>
                )}
              </>
            ) : (
              <>
                <i className="feather-mail position-absolute" style={{
                  left: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#666"
                }}></i>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-control input ${errors.email ? 'is-invalid' : ''}`}
                  // style={{
                  //   paddingLeft: "45px",
                  //   height: "40px",
                  //   borderRadius: "8px",
                  //   border: "1px solid #ddd"
                  // }}
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <div className="invalid-feedback d-block mt-1">
                    {errors.email}
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>

        {showPasswordField && (
          <>
            <motion.div
              variants={inputVariants}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="form-group mb-3"
            >
              <label htmlFor="password" className="form-label">Password</label>
              <div className="position-relative">
                <i className="feather-lock position-absolute" style={{
                  left: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#666"
                }}></i>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  style={{
                    paddingLeft: "45px",
                    paddingRight: "45px",
                    height: "40px",
                    borderRadius: "8px",
                    border: "1px solid #ddd"
                  }}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <i
                  className={`feather-eye${showPassword ? "" : "-off"} position-absolute`}
                  style={{
                    right: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "#666"
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
                    x: isHovering ? 2 : 0
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
                border: "none"
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
                  border: "none"
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
                {loginMethod === 'email' ? (
                  <>
                    <i className="feather-mail mr-2"></i> Email sign-in code
                  </>
                ) : (
                  <>
                    <i className="feather-phone mr-2"></i> Phone number sign-in code
                  </>
                )}
              </motion.button>
            </motion.div> */}
          </>
        )}
      </motion.form>
    </AuthContainer>
  );
}