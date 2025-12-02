import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { showToast } from "../../../component/ToastAlert";
import AuthContainer from "../assets/auth_container";
import { motion } from "framer-motion";
import axios from "axios";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { isValidPhoneNumber, getCountryCallingCode } from "react-phone-number-input";
import { showError, showSuccess } from "../../../component/ui/toast";

export function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
    class: ""
  });
  const [countryCode, setCountryCode] = useState("+234");
  const [phoneError, setPhoneError] = useState("");
  const [useEmail, setUseEmail] = useState(false); // toggle state

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    country_code: "+234"
  });

  useEffect(() => {
    if (formData.password) {
      checkPasswordStrength(formData.password);
    } else {
      setPasswordStrength({ score: 0, label: "", class: "" });
    }
  }, [formData.password]);

  const checkPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    let label, strengthClass;
    if (score >= 5) {
      label = "Strong";
      strengthClass = "strong";
    } else if (score >= 3) {
      label = "Medium";
      strengthClass = "medium";
    } else if (score > 0) {
      label = "Weak";
      strengthClass = "weak";
    } else {
      label = "";
      strengthClass = "";
    }

    setPasswordStrength({ score, label, class: strengthClass });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      phone: value || ""
    }));

    if (value) {
      try {
        const code = `+${getCountryCallingCode(value)}`;
        setCountryCode(code);
        setFormData((prev) => ({
          ...prev,
          country_code: code
        }));
      } catch (e) {
        console.error("Could not get country code", e);
      }
    }

    if (value && !isValidPhoneNumber(value)) {
      setPhoneError("Invalid phone number");
    } else {
      setPhoneError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.first_name || !formData.last_name || !formData.password) {
      showError("Please fill in all fields");
      return;
    }

    if (useEmail) {
      if (!formData.email) {
        showError("Please enter a valid email");
        return;
      }
    } else {
      if (!formData.phone || !isValidPhoneNumber(formData.phone)) {
        showError("Please enter a valid phone number");
        return;
      }
    }

    setIsLoading(true);
    try {
      let payload;
      if (useEmail) {
        payload = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password
        };
      } else {
        const phoneWithoutCountryCode = formData.phone.replace(
          new RegExp(`^\\${formData.country_code}`),
          ""
        );
        payload = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: phoneWithoutCountryCode,
          password: formData.password,
          country_code_one: formData.country_code
        };
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/users`,
        payload
      );

      if (response.data && response.data.token) {
        login({
          token: response.data.token,
          user: response.data.user
        });
        showSuccess(
          response.data.message || "Account created successfully!"
        );
        navigate("/feed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      const errorMessage =
        err.response?.data?.message || "Registration failed";
      showError(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    if (useEmail) {
      return (
        formData.first_name.trim() !== "" &&
        formData.last_name.trim() !== "" &&
        formData.email.trim() !== "" &&
        formData.password.trim() !== ""
      );
    }
    return (
      formData.first_name.trim() !== "" &&
      formData.last_name.trim() !== "" &&
      formData.phone.trim() !== "" &&
      isValidPhoneNumber(formData.phone) &&
      formData.password.trim() !== ""
    );
  };

  return (
    <AuthContainer
      title={"Create Your Account"}
      description={"Begin to explore amazing events"}
      footer={true}
      header={true}
      privacy={true}
      haveAccount={false}
    >
      <form autoComplete="off" className="" onSubmit={handleSubmit}>
        {error && (
          <div className="text-danger mb-3 alert alert-danger">{error}</div>
        )}

        <div className="row p-0 m-0">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="col-md-6 col-6 p-0 m-0"
          >
            <div className="form-group m-2">
              <label htmlFor="fName">First name</label>
              <div className="position-relative">
                <input
                  id="fName"
                  type="text"
                  name="first_name"
                  className="tw:w-full input"
                  style={{ paddingLeft: "50px" }}
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
                <i className="input-icon feather-user position-absolute"></i>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="col-md-6 col-6 p-0 m-0"
          >
            <div className="form-group m-2">
              <label htmlFor="lName">Last name</label>
              <div className="position-relative">
                <input
                  id="lName"
                  type="text"
                  name="last_name"
                  className="tw:w-full input"
                  style={{ paddingLeft: "50px" }}
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
                <i className="input-icon feather-user position-absolute"></i>
              </div>
            </div>
          </motion.div>
        </div>

        {!useEmail ? (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="form-group phone-input-section m-2"
            style={{ background: "white" }}
          >
            <label htmlFor="PhoneNumber">Phone Number</label>
            <div
              className="phone-input-container"
              style={{ background: "white" }}
            >
              <PhoneInput
                id="PhoneNumber"
                international
                defaultCountry="NG"
                value={formData.phone}
                onChange={handlePhoneChange}
                className={`phone-input ${phoneError ? "is-invalid" : ""}`}
                placeholder="Enter phone number"
                style={{ background: "white" }}
              />
              {phoneError && (
                <div className="phone-error-message">{phoneError}</div>
              )}
            </div>
            <input
              style={{ background: "white" }}
              type="hidden"
              name="country_code"
              value={formData.country_code}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="form-group m-2"
          >
            <label htmlFor="email">Email Address</label>
            <div className="position-relative">
              <input
                id="email"
                type="email"
                name="email"
                className="tw:w-full input"
                style={{ paddingLeft: "50px" }}
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required={useEmail}
              />
              <i className="input-icon feather-mail position-absolute"></i>
            </div>
          </motion.div>
        )}

        {/* switch button */}
        <div className="form-group m-2 pb-4">
          <div className="text-center  w-100 ">
            <button
              type="button"
              className="btn btn-link p-0 float-right"
              onClick={() => setUseEmail(!useEmail)}
              style={{ fontSize: "14px",color:'rgba(143, 7, 231, 1)',textDecoration:'none' }}
            >
              {useEmail
                ? "Use Phone Number Instead"
                : "Use Email Instead"}
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="form-group m-2"
        >
          <label>Password</label>
          <div className="position-relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="tw:w-full input"
              style={{ paddingLeft: "40px", paddingRight: "40px" }}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="8"
            />
            <i
              className={`input-password-icon feather-eye${showPassword ? "" : "-off"
                } position-absolute`}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
            <i className="input-icon feather-lock position-absolute"></i>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-4 mr-2 ml-2"
        >
          <button
            className={`${isFormValid() ? "active_submit_button" : "inactive_submit_button"
              }`}
            type="submit"
            disabled={!isFormValid() || isLoading}
          >
            {isLoading ? "Creating Account..." : "Complete Registration"}
          </button>
        </motion.div>
      </form>
    </AuthContainer>
  );
}
