import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../component/ToastAlert";
import AuthContainer from "../assets/auth_container";
import { motion } from "framer-motion";
import axios from "axios";
export function ChangePassword({ resetcode, email }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

    if (!password || !confirmPassword) {
      showToast.error("All fields are required.");
      setError("All fields are required.");
      return;
    }

    if (password.length < 8) {
      showToast.error("Password must be at least 8 characters.");
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      showToast.error("Passwords do not match.");
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const formPayload = new FormData();
      formPayload.append("email", email);
      formPayload.append("reset_key", resetcode);
      formPayload.append("password", password);
      formPayload.append("confirm", confirmPassword);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/reset_password.php`,
        formPayload,
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      // console.log("Response Data:", response.data);
      if (data.status === "success") {
        showToast.success(data.message || "Password changed successfully!");
        setTimeout(() => {
          navigate("/auth/signin");
        }, 1000);
      } else {
        showToast.error(data.message || "An error occurred. Try again.");
        setError(data.message || "An error occurred. Try again.");
      }
    } catch (err) {

      if (err.response) {
        // Backend responded with an error
        const status = err.response.status;
        const message =
          err.response.data?.message || "An error occurred. Please try again.";

        if (status === 401) {
          showToast.error(message || "Invalid Password .");
        } else {
          showToast.error(message);
        }
      } else {
        // No response received
        showToast.error("Network error. Please check your internet connection.");
      }

      setIsVerifying(false);

          setTimeout(() => {
          navigate("/auth/signin");
        }, 2000);
    }
    finally {
      setLoading(false);
    }
  };

  const maskEmail = (email) => {
    const [user, domain] = email.split("@");
    if (user.length <= 2) return email;
    return `${user.slice(0, 2)}${"*".repeat(user.length - 2)}@${domain}`;
  };
  // {showToast.error(error)}
  return (
    <AuthContainer title="Create new password" description="Set a new password for">
      <p className="text-center" style={{ color: "#8000FF", fontSize: "15px", marginTop: "-20px", fontFamily: "Inter" }}>
        {maskEmail(email)}
      </p>
      <form autoComplete="off" className="pr-3 pl-3" onSubmit={handleSubmit}>
        {/* New Password */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="form-group"
        >
          <div className="position-relative icon-form-control">
            <i className="feather-lock position-absolute input-icon" style={{ top: "50%", transform: "translateY(-50%)" }}></i>
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
              className={`position-absolute input-icon ${showPassword ? "feather-eye" : "feather-eye-off"}`}
              style={{ right: "15px", top: "50%", cursor: "pointer", transform: "translateY(-50%)", fontSize: "20px" }}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>
        </motion.div>

        {/* Confirm Password */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="form-group"
        >
          <div className="position-relative icon-form-control">
            <i className="feather-lock position-absolute input-icon" style={{ top: "50%", transform: "translateY(-50%)" }}></i>
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
              className={`position-absolute input-icon ${showConfirmPassword ? "feather-eye" : "feather-eye-off"}`}
              style={{ right: "15px", top: "50%", cursor: "pointer", transform: "translateY(-50%)", fontSize: "20px" }}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            ></i>
          </div>
        </motion.div>

        {error && <div className="text-danger mb-3 text-center alert alert-danger">{error}</div>}

        <motion.button
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="btn submit_button btn-block"
          type="submit"
          style={{ color: "white" }}
          disabled={loading}
        >
          {loading ? <span className="spinner-border spinner-border-sm mr-2"></span> : "Continue "}
          {!loading && <span className="fas fa-arrow-right ml-2"></span>}
        </motion.button>

        <div className="py-3 text-center auth-footer mt-3">
          <span className="text-info" style={{ fontSize: "13px" }}>
            <i className="fas fa-shield-alt"></i> Your new password will be encrypted and stored securely
          </span>
        </div>
      </form>
    </AuthContainer>
  );
}
