import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import PostSignupFormModal from "./ModalContainer";
import SignUpCodecomponent from "./SignUpCodecomponent";
import "./postSignupStyle.css";
import { useAuth } from "../../../../pages/auth/AuthContext";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import qs from 'qs';

const PhoneEmailPostSignup = ({ type, userupdate, token }) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [proceed, setProceed] = useState(false);
  const [code, setcode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { login, user } = useAuth();
  console.log(user);
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPhoneValid = (phone) => phone.length >= 8; // Adjust based on your requirements
  console.log(code);
  const isFormValid =
    (type === "email" && isValidEmail(email)) ||
    (type === "phone" && isPhoneValid(phone));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Skip if the value hasn't changed
    // if ((type === "email" && email === userupdate?.email) || 
    //     (type === "phone" && phone === userupdate?.phone)) {
    //   setProceed(true);
    //   return;
    // }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const input = type === "email" ? email : '+'+phone;
// console.log(input);
      // Using URL-encoded form data
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/code/generate`,
        qs.stringify({ input }), // This properly encodes the form data
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log('responding__', response);
      if (response.status === 200) {
        setProceed(true);
        setcode(response.data.code);
        setSuccessMessage(response.data.message || "Verification code sent successfully!");
      } else {
        setErrorMessage(response.data?.message || "Verification failed");
      }
    } catch (error) {
      
      console.error("Verification error:", error);
      let errorMsg = "An error occurred while sending verification code.";

      // Handle different error response formats
      if (error.response) {
        if (error.response.data?.errors) {
          const errors = error.response.data.errors;
          errorMsg = errors.email?.[0] || errors.phone?.[0] || errorMsg;
        } else if (error.response.data?.message) {
          errorMsg = error.response.data.message;
        }
      }

      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (proceed) {
    return <SignUpCodecomponent Otpcode={code} token={token} userupdate={userupdate} type={type} />;
  }

  function skipProcess() {
    login({ token, user: userupdate });
  }

  return (
    <PostSignupFormModal>
      <motion.div
        className="container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          Enter your {type === "email" ? "Email" : "Phone Number"}
        </motion.h2>
        <p>Enter your {type === "email" ? "email address" : "phone number"} to verify.</p>

        {/* Success Message Alert */}
        {successMessage && (
          <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible>
            {successMessage}
          </Alert>
        )}

        {/* Error Message Alert */}
        {errorMessage && (
          <Alert variant="danger" onClose={() => setErrorMessage(null)} dismissible>
            {errorMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {type === "email" ? (
            <div className="form-group mb-4">
              <label className="m-0 mb-2">Email</label>
              <div className="position-relative">
                <FaEnvelope className="position-absolute input-icon" />
                <input
                  type="email"
                  className="form-control"
                  style={{ paddingLeft: "40px" }}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          ) : (
            <div className="form-group mb-4">
              <label className="mb-2">Phone Number</label>
              <PhoneInput
                country={"ng"}
                value={phone}
                onChange={(phone) => setPhone(phone)}
                inputProps={{
                  required: true,
                }}
                inputStyle={{
                  width: "100%",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  paddingLeft: "48px",
                  height: "40px",
                }}
                containerStyle={{ width: "100%" }}
              />
            </div>
          )}

          <div className="d-flex justify-content-between mt-4">
            <motion.button
              type="button"
              onClick={skipProcess}
              className="btn btn-link text-primary p-0"
              whileHover={{ scale: 1.05 }}
            >
              Skip for now
            </motion.button>

            <motion.button
              type="submit"
              disabled={!isFormValid || isLoading}
              whileHover={isFormValid ? { scale: 1.02 } : {}}
              whileTap={isFormValid ? { scale: 0.98 } : {}}
              className="bt"
              style={{
                backgroundColor: isFormValid ? "#8f07e7" : "#e6e6e6",
                color: isFormValid ? "#fff" : "#999",
                padding: "10px 20px",
                border: "none",
                borderRadius: "6px",
                cursor: isFormValid ? "pointer" : "not-allowed",
                minWidth: "120px"
              }}
            >
              {isLoading ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : null}
              Next
            </motion.button>
          </div>
        </form>
      </motion.div>
    </PostSignupFormModal>
  );
};

export default PhoneEmailPostSignup;