import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { showToast } from "../../../component/ToastAlert";
import AuthContainer from "../assets/auth_container";
import { motion } from "framer-motion";
import googleLogo from "../../../assets/google-logo.png";
import $ from "jquery";

export function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Assuming you have a login method in your AuthContext

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  setIsLoading(true);

  $.ajax({
    url: 'http://localhost/pokivillage.wennewstandard.info/auth/signin_auth',
    type: 'POST',
    data: {
      email: formData.email,
      password: formData.password
    },
    dataType: 'json',
    crossDomain: true,
    xhrFields: {
      withCredentials: true // For cookies/session
    },
    beforeSend: function(xhr) {
      // You might need to set auth headers here
      // xhr.setRequestHeader('Authorization', 'Bearer token');
    },
    success: function(response) {
      if (response.status === "OK") {
        login(response.userdata);
        showToast.success("Login successful!");
        navigate("/dashboard");
      } else {
        throw new Error(response.api_message || "Login failed");
      }
    },
    error: function(xhr) {
      let errorMessage = "Login failed";
      try {
        const response = xhr.responseJSON || JSON.parse(xhr.responseText);
        errorMessage = response.api_message || errorMessage;
        
        // Handle 401 specifically
        if (xhr.status === 401) {
          errorMessage = "Invalid email or password";
        }
      } catch (e) {
        errorMessage = xhr.statusText || errorMessage;
      }
      
      showToast.error(errorMessage);
      setErrors({ server: errorMessage });
    },
    complete: function() {
      setIsLoading(false);
    }
  });
};

  return (
    <>
      <AuthContainer title={"Welcome Back"} description={"Sign in to continue your journey"}>
        <motion.form 
          autoComplete="off"
          className="pr-3 pl-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit}
        >
          {errors.server && (
            <motion.div 
              className="alert alert-danger"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {errors.server}
            </motion.div>
          )}

          <motion.div 
            variants={inputVariants}
            className="form-group"
          >
            <div className="position-relative icon-form-control">
              <input
                type="email"
                name="email"
                className={`form-control input ${errors.email ? 'is-invalid' : ''}`}
                style={{ paddingLeft: "60px", outline: "none" }}
                placeholder="Email Address"
                autoComplete="off"
                value={formData.email}
                onChange={handleChange}
              />
              <i className="feather-mail position-absolute input-icon"></i>
              {errors.email && (
                <div className="invalid-feedback d-block">
                  {errors.email}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div 
            variants={inputVariants}
            className="form-group"
          >
            <div className="position-relative icon-form-control" style={{ maxWidth: '100%' }}>
              <i className="feather-lock position-absolute input-icon" style={{ top: '50%', transform: 'translateY(-50%)' }}></i>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={`form-control input ${errors.password ? 'is-invalid' : ''}`}
                style={{
                  paddingLeft: "60px",
                  fontSize: "16px",
                  color: "#000",
                  paddingRight: '40px',
                }}
                placeholder="Password"
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
              {errors.password && (
                <div className="invalid-feedback d-block">
                  {errors.password}
                </div>
              )}
            </div>
          </motion.div>

          <div className="py-3 d-flex align-item-center">
            <b className="ml-auto">
              <Link style={{ color: '#8000FF' }} to="/auth/forget-password">Forgot password?</Link>
            </b>
          </div>

          <motion.button 
            variants={inputVariants}
            className="btn submit_button btn-block" 
            type="submit" 
            style={{ color: 'white' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                Signing in...
              </>
            ) : (
              <>
                <span className="fas fa-sign-in-alt mr-3"></span> Sign in
              </>
            )}
          </motion.button>

          <div className="text-center mt-3 border-botto pb-3 mb-3">
            <p className="small text-muted">Or continue with</p>
            <div className="row">
              <div className="col-6">
                <motion.button 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: "easeOut" }} 
                  type="button" 
                  className="btn-sm api_btn btn-block"
                >
                  <img src={googleLogo} alt="Google Logo" className="mr-2" style={{ width: '20px', height: '20px', marginTop: '-5px' }} />
                  <span>Google</span>
                </motion.button>
              </div>
              <div className="col-6">
                <motion.button 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: "easeOut" }} 
                  type="button" 
                  className="api_btn dark_apple_api_btn btn-block"
                >
                  <i className="fab fa-apple mr-2"></i> Apple
                </motion.button>
              </div>
            </div>
          </div>

          <div className="py-3 text-center auth-footer">
            <span className="text-center">
              Don't have an account? <Link className="font-weight-bold" to="/auth/signup">Create account</Link>
            </span>
          </div>
        </motion.form>
      </AuthContainer>
    </>
  );
}