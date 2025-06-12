import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { showToast } from "../../../component/ToastAlert";
import AuthContainer from "../assets/auth_container";
import { motion } from "framer-motion";
import googleLogo from "../../../assets/google-logo.png";
import $ from "jquery";

export function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const { GeSignupData } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    birth_month: "",
    birth_day: "",
    birth_year: "",
    gender: "",
    privacy_agree: false,
    reset_key: "",
    user_logged_in: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleContinue = (e) => {
    e.preventDefault();
    // Basic validation for step 1
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.password || !formData.confirmPassword) {
      showToast.error("Please fill in all fields");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      showToast.error("Passwords do not match");
      return;
    }
    if (!formData.privacy_agree) {
      showToast.error("You must agree to the privacy policy");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation for step 2
    if (!formData.birth_month || !formData.birth_day || !formData.birth_year || !formData.gender) {
      showToast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    // Prepare the data in x-www-form-urlencoded format
    const formDataEncoded = new URLSearchParams();
    formDataEncoded.append("first_name", formData.first_name);
    formDataEncoded.append("last_name", formData.last_name);
    formDataEncoded.append("username", formData.username);
    formDataEncoded.append("email", formData.email);
    formDataEncoded.append("password", formData.password);
    formDataEncoded.append("birth_month", formData.birth_month);
    formDataEncoded.append("birth_day", formData.birth_day);
    formDataEncoded.append("birth_year", formData.birth_year);
    formDataEncoded.append("gender", formData.gender);
    formDataEncoded.append("privacy_agree", formData.privacy_agree ? "1" : "0");
    formDataEncoded.append("reset_key", formData.reset_key);
    formDataEncoded.append("reset_key", formData.reset_key);
    formDataEncoded.append("reset_key", formData.reset_key);
    formDataEncoded.append("user_logged_in", formData.user_logged_in ? "1" : "0");

    $.ajax({
      url: "https://zagasm.com/includes/ajax/users/connect.php",
      type: "POST",
      data: formDataEncoded.toString(),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      processData: false,
      timeout: 30000,
      beforeSend: function() {
        setIsLoading(true);
      },
      success: function(response) {
        try {
          const responseData = typeof response === 'string' ? JSON.parse(response) : response;
          
          if (responseData.status === "OK") {
            showToast.success(responseData.api_message);
            GeSignupData(responseData.userdata);
            setTimeout(() => {
              navigate("/auth/onboarding");
            }, 2000);
          } else {
            showToast.error(responseData.api_message || "Registration failed");
          }
        } catch (e) {
          console.error("Error parsing response:", e);
          showToast.error("Invalid server response");
        }
      },
      error: function(xhr, status, error) {
        let errorMessage = "An unknown error occurred";
        if (xhr.responseJSON && xhr.responseJSON.api_message) {
          errorMessage = xhr.responseJSON.api_message;
        } else if (xhr.responseText) {
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            errorMessage = errorResponse.api_message || errorMessage;
          } catch (e) {
            errorMessage = xhr.responseText || errorMessage;
          }
        }
        showToast.error(errorMessage);
        console.error("AJAX Error:", status, error);
      },
      complete: function() {
        setIsLoading(false);
      }
    });
  };

  return (
    <>
      <AuthContainer
        title={step === 1 ? "Basic information" : "Personal Details"}
        description={step === 1 ? "Let's get started with your basic details" : "Just a few more details to complete your profile"}
      >
        <form autoComplete="off" className="pr-3 pl-3" onSubmit={handleSubmit}>
          {step === 1 ? (
            <>
              <div className="row p-0 m-0">
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="form-group col-md-6 p-0 m-0"
                >
                  <div className="position-relative icon-form-control">
                    <input
                      type="text"
                      name="first_name"
                      className="form-control input"
                      style={{ paddingLeft: "60px", outline: "none" }}
                      placeholder="First Name"
                      autoComplete="off"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                    />
                    <i className="feather-user position-absolute input-icon"></i>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="form-group col-md-6 p-0 m-0"
                >
                  <div className="position-relative icon-form-control">
                    <input
                      type="text"
                      name="last_name"
                      className="form-control input"
                      style={{ paddingLeft: "60px", outline: "none" }}
                      placeholder="Last Name"
                      autoComplete="off"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                    />
                    <i className="feather-user position-absolute input-icon"></i>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="form-group"
              >
                <div className="position-relative icon-form-control">
                  <input
                    type="text"
                    name="username"
                    className="form-control input"
                    style={{ paddingLeft: "60px", outline: "none" }}
                    placeholder="Username"
                    autoComplete="off"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                  <i className="feather-at-sign position-absolute input-icon"></i>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="form-group"
              >
                <div className="position-relative icon-form-control">
                  <input
                    type="email"
                    name="email"
                    className="form-control input"
                    style={{ paddingLeft: "60px", outline: "none" }}
                    placeholder="Email Address"
                    autoComplete="off"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <i className="feather-mail position-absolute input-icon"></i>
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
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-control input"
                    style={{
                      paddingLeft: "60px",
                      fontSize: "16px",
                      color: "#000",
                      paddingRight: '40px',
                    }}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
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
                    type={showConfirmPassword ? "text" : "password"}
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
                    required
                    minLength="6"
                  />
                  <i
                    className={`position-absolute input-icon ${showConfirmPassword ? "feather-eye" : "feather-eye-off"}`}
                    style={{
                      right: "15px",
                      top: "50%",
                      cursor: "pointer",
                      transform: "translateY(-50%)",
                      color: '#666',
                      userSelect: 'none',
                      fontSize: '20px'
                    }}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  ></i>
                </div>
              </motion.div>

              <div className="form-group form-check">
                <input
                  type="checkbox"
                  name="privacy_agree"
                  className="form-check-input"
                  checked={formData.privacy_agree}
                  onChange={handleChange}
                  id="privacyAgree"
                  required
                />
                <label className="form-check-label" htmlFor="privacyAgree">
                  I agree to the privacy policy and terms of service
                </label>
              </div>

              {error && <div className="text-danger mb-3">{error}</div>}

              <motion.button
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="btn submit_button btn-block"
                type="button"
                style={{ color: 'white' }}
                onClick={handleContinue}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                    Loading...
                  </>
                ) : (
                  <>
                    Continue <span className="fas fa-arrow-right mr-3"></span>
                  </>
                )}
              </motion.button>
            </>
          ) : (
            <>
              <div className="row">
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="form-group col-md-4"
                >
                  <div className="position-relative icon-form-control">
                    <select
                      name="birth_month"
                      className="form-control input"
                      style={{ paddingLeft: "60px", outline: "none", appearance: 'none' }}
                      value={formData.birth_month}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Month</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={String(i + 1).padStart(2, '0')}>
                          {new Date(0, i).toLocaleString('default', { month: 'long' })}
                        </option>
                      ))}
                    </select>
                    <i className="feather-calendar position-absolute input-icon"></i>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="form-group col-md-4"
                >
                  <div className="position-relative icon-form-control">
                    <select
                      name="birth_day"
                      className="form-control input"
                      style={{ paddingLeft: "60px", outline: "none", appearance: 'none' }}
                      value={formData.birth_day}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Day</option>
                      {Array.from({ length: 31 }, (_, i) => (
                        <option key={i} value={String(i + 1).padStart(2, '0')}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <i className="feather-calendar position-absolute input-icon"></i>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="form-group col-md-4"
                >
                  <div className="position-relative icon-form-control">
                    <select
                      name="birth_year"
                      className="form-control input"
                      style={{ paddingLeft: "60px", outline: "none", appearance: 'none' }}
                      value={formData.birth_year}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Year</option>
                      {Array.from({ length: 100 }, (_, i) => (
                        <option key={i} value={new Date().getFullYear() - i}>
                          {new Date().getFullYear() - i}
                        </option>
                      ))}
                    </select>
                    <i className="feather-calendar position-absolute input-icon"></i>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="form-group"
              >
                <div className="position-relative icon-form-control">
                  <select
                    name="gender"
                    className="form-control input"
                    style={{ paddingLeft: "60px", outline: "none", appearance: 'none' }}
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                  <i className="feather-users position-absolute input-icon"></i>
                </div>
              </motion.div>

              {error && <div className="text-danger mb-3">{error}</div>}

              <motion.button
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="btn submit_button btn-block"
                type="submit"
                style={{ color: 'white' }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account <span className="fas fa-check ml-2"></span>
                  </>
                )}
              </motion.button>

              {step === 2 && (
                <p className="text-center mt-2" style={{ cursor: 'pointer' }} onClick={handleBack}>
                  <span className="fas fa-arrow-left ml-2"></span> Back
                </p>
              )}
            </>
          )}

          <div className="text-center mt-3 border-botto pb-3 mb-3">
            <p className="small text-muted">Or continue with</p>
            <div className="row">
              <div className="col-6">
                <motion.button
                  initial={{ opacity: 0, y: 70 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  type="button"
                  className=" btn-sm api_btn btn-block"
                >
                  <img src={googleLogo} alt="Google Logo" className="mr-2" style={{ width: '20px', height: '20px', marginTop: '-5px' }} />
                  <span>Google</span>
                </motion.button>
              </div>
              <div className="col-6">
                <motion.button
                  initial={{ opacity: 0, y: 70 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  type="button"
                  className=" api_btn dark_apple_api_btn btn-block"
                >
                  <i className="fab fa-apple mr-2"></i> Apple
                </motion.button>
              </div>
            </div>
          </div>

          <div className="py-3 text-center auth-footer">
            <span className="text-center">
              Already have an account? <Link className="font-weight-bold" to="/auth/signin">Sign in</Link>
            </span>
          </div>
        </form>
      </AuthContainer>
    </>
  );
}