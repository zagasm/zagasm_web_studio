import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { showToast } from "../../../component/ToastAlert";
import AuthContainer from "../assets/auth_container";
import { motion } from "framer-motion";
import googleLogo from "../../../assets/google-logo.png";
export function ChangePassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",

  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation for step 2
    if (!formData.dob || !formData.gender) {
      showToast.error("Please fill in all fields");
      return;
    }
    // Here you would typically submit all the form data to your backend
    console.log("Form submitted:", formData);
    // Then navigate to the next page or show success message
  };

  return (
    <>
      <AuthContainer
        title={"Create new password"}
        description={"Set a new password for"}
      >
        <p className="text-center" style={{ color: '#8000FF', fontSize: '15px', marginTop: '-20px', fontFamily: 'Inter' }}>
          to**********************@gmail.com
        </p>
        <form autoComplete="off" className="pr-3 pl-3">


          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="form-group"
          >
            <div className="position-relative icon-form-control" style={{ maxWidth: '100%' }}>
              <i className="feather-lock position-absolute input-icon" style={{ top: '50%', transform: 'translateY(-50%)' }}></i>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control input"
                style={{
                  paddingLeft: "60px",
                  fontSize: "16px",
                  color: "#000",
                  paddingRight: '40px',
                  outline: 'none'
                }}
                placeholder="Enter New Password"
                value={formData.password}
                onChange={handleChange}
              />
              <i
                className={`position-absolute input-icon ${showPassword ? "feather-eye" : "feather-eye-off"}`}
                style={{
                  right: "15px",
                  top: "50%",
                  cursor: "pointer",
                  transform: "translateY(-50%)",
                  color: '#666',
                  userSelect: 'none',
                  fontSize: '20px'
                }}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              ></i>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="form-group"
          >
            <div className="position-relative icon-form-control" style={{ maxWidth: '100%' }}>
              <i className="feather-lock position-absolute input-icon" style={{ top: '50%', transform: 'translateY(-50%)' }}></i>
              <input
                type={confirmPassword ? "text" : "password"}
                name="confirmPassword"
                className="form-control input"
                style={{
                  paddingLeft: "60px",
                  fontSize: "16px",
                  color: "#000",
                  paddingRight: '40px',
                }}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <i
                className={`position-absolute input-icon ${confirmPassword ? "feather-eye" : "feather-eye-off"}`}
                style={{
                  right: "15px",
                  top: "50%",
                  cursor: "pointer",
                  transform: "translateY(-50%)",
                  color: '#666',
                  userSelect: 'none',
                  fontSize: '20px'
                }}
                onClick={() => setConfirmPassword(!confirmPassword)}
                aria-label={confirmPassword ? "Hide password" : "Show password"}
              ></i>
            </div>
          </motion.div>

          {error && <div className="text-danger mb-3">{error}</div>}

          <motion.button
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="btn submit_button btn-block"
            type="button"
            style={{ color: 'white' }}
          >
            Continue <span className="fas fa-arrow-right mr-3" style={{ paddingBottom: '-900px' }}></span>
          </motion.button>

          <div className="py-3 text-center auth-footer mt-3">
            <span className="text-info" style={{ fontSize: '13px' }}>
              <i class="fas fa-shield-alt"></i> Your new password will be encrypted and stored securely
            </span>
          </div>
        </form>
      </AuthContainer>
    </>
  );
}