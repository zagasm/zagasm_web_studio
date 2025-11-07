import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../component/ToastAlert";
import AuthContainer from "../assets/auth_container";
import { motion } from "framer-motion";
import axios from "axios";

export function ChangePassword({ ResetPasswordVerificationData }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Extract data from props
  const { input, reset_token } = ResetPasswordVerificationData || {};

  const isFormValid = () => {
    const { password, confirmPassword } = formData;
    return (
      password &&
      confirmPassword &&
      password.length >= 8 &&
      password === confirmPassword
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { password, confirmPassword } = formData;

    // Validation checks
    if (!password || !confirmPassword) {
      showToast.error("All fields are required.");
      return;
    }

    if (password.length < 8) {
      showToast.error("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      showToast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        input:input.trim(),
        token:reset_token.trim(),
        password:password.trim(),
         password_confirmation:confirmPassword.trim()
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/password/reset`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data;
      
      if (data.message && data.token && data.user) {
        // Success case
        showToast.success(data.message);
         login({
          user: data.user,
          token: data.token
        });
        // Redirect to dashboard or appropriate page
        setTimeout(() => {
          navigate("/feed"); // Update this to your desired post-login route
        }, 1000);
      } else {
        // Unexpected response format
        showToast.error("Password reset successful but unexpected response format.");
        navigate("/auth/signin");
      }
    } catch (err) {
      let errorMessage = "An error occurred. Please try again.";
      
      if (err.response) {
        // Handle API error responses
        if (err.response.data?.message === "Invalid or expired reset token.") {
          errorMessage = "Invalid or expired reset token. Please request a new password reset link.";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.request) {
        errorMessage = "Network error. Please check your internet connection.";
      }
      
      showToast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer 
      title="Create new password" 
      description={`Set a new password for ${input}`}
    >
      <form autoComplete="off" className="pr-3 pl-3" onSubmit={handleSubmit}>
        <div className='text-center' style={{ marginBottom: '30px' }}>
          <motion.h5
            initial={{ opacity: 0, x: -70 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="font-weight-bold mt-3 container_heading_text"
          >
            Set New Password
          </motion.h5>
          <motion.p
            initial={{ opacity: 0, x: 70 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="text-muted heading_content mb-2"
          >
            Set your new password to continue
          </motion.p>
        </div>

        {/* New Password */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="form-group"
        >
          <label>Password</label>
          <div className="position-relative">
            <i className="feather-lock position-absolute input-icon"></i>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="form-control input"
              placeholder="Enter New Password"
              value={formData.password}
              onChange={handleChange}
              style={{ paddingLeft: "60px", fontSize: "16px", paddingRight: "40px" }}
            />
            <i
              className={`position-absolute input-password-icon ${showPassword ? "feather-eye" : "feather-eye-off"}`}
              onClick={() => setShowPassword(!showPassword)}
              style={{ right: "15px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
            ></i>
          </div>
          <small className="text-muted">Minimum 8 characters</small>
        </motion.div>

        {/* Confirm Password */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="form-group"
        >
          <label>Confirm Password</label>
          <div className="position-relative">
            <i className="feather-lock position-absolute input-icon"></i>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              className="form-control input"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{ paddingLeft: "60px", fontSize: "16px", paddingRight: "40px" }}
            />
            <i
              className={`position-absolute input-password-icon ${showConfirmPassword ? "feather-eye" : "feather-eye-off"}`}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ right: "15px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
            ></i>
          </div>
        </motion.div>

        {error && (
          <div className="alert alert-danger text-center mb-3">
            {error}
          </div>
        )}

        <motion.button
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className={` btn-block ${isFormValid() ? 'active_submit_button' : 'inactive_submit_button'}`}
          type="submit"
          disabled={loading || !isFormValid()}
          style={{
            height: "50px",
            borderRadius: "8px",
            fontWeight: "500",
            fontSize: "16px",
            marginTop: "20px"
          }}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm mr-2"></span>
              Processing...
            </>
          ) : (
            "Set Password"
          )}
        </motion.button>
      </form>
    </AuthContainer>
  );
}