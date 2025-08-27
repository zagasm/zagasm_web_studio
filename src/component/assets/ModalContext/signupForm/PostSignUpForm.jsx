import React, { useRef, useState } from "react";
import {
  FaCalendarAlt,
  FaChevronDown,
  FaMars,
  FaVenus,
  FaGenderless,
} from "react-icons/fa";
import { motion } from "framer-motion";
import PostSignupFormModal from "./ModalContainer";
import SignUpCodecomponent from "./SignUpCodecomponent";
import "./postSignupStyle.css";
import { useAuth } from "../../../../pages/auth/AuthContext";
import axios from "axios";
import qs from 'qs';
import { showToast } from "../../../ToastAlert";

const PostSignupForm = () => {
  const { user, login, token } = useAuth();
  // Conditionally render the page only if required
  if (user.gender != null || user.dob != null) return null;

  if (!user) {
    return null;
  }
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [tosendUserdata, settosendUserdata] = useState();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const dateInputRef = useRef(null);

  const handleWrapperClick = () => {
    dateInputRef.current?.showPicker?.() || dateInputRef.current?.focus();
  };
  const isFormValid = dob && gender;
  const isAtLeast15 = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 15;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isFormValid) {
      setError("Please fill in all fields");
      return;
    }

    if (!isAtLeast15(dob)) {
      setError("You must be at least 15 years old");
      return;
    }

    setIsLoading(true);
    try {
      // Verify endpoint exists
      const endpoint = `${import.meta.env.VITE_API_URL}/api/v1/gender/dob`;
      console.log("Attempting to reach:", endpoint);
      const response = await axios.post(  // Changed from PATCH to POST
        endpoint,
        {
          gender: gender,
          dob: dob,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${token}`,
          },
          validateStatus: (status) => status < 500 // Accept 4xx as responses
        }
      );
      console.log('update data:', response);
      if (response.status === 200 || response.status === 201) {
        showToast.success(response.data.message || "Date of Birth and Gender updated successfully!");
        // conso
        settosendUserdata(response.data.user);
        setFormSubmitted(true);
      } else if (response.status === 422) {
        const token = token;
        const user = user;
        login({ token, user });
      } else {
        throw new Error(response.data?.message || "Update failed");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to update profile. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (formSubmitted) {
    return <SignUpCodecomponent token={token} userupdate={tosendUserdata} type="phone" />;
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
          Complete your Profile
        </motion.h2>
        <p>Just a few more details to complete your profile</p>

        {error && (
          <div className="alert alert-danger mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Date of Birth Field */}
          <div className="form-group">
            <label>Date of Birth</label>
            <motion.div
              className="dob-wrapper"
              onClick={handleWrapperClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaCalendarAlt className="left-icon" />
              <input
                type="date"
                ref={dateInputRef}
                value={dob}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDob(e.target.value)}
                className="dob-input border-0"
                required
              />
              <FaChevronDown className="right-icon" />
            </motion.div>
          </div>

          {/* Gender Selection */}
          <div className="form-group">
            <label>Gender</label>
            <div className="gender-buttons">
              {["male", "female", "others"].map((g) => (
                <motion.button
                  key={g}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  className={`gender-btn ${gender === g ? "selected" : ""}`}
                  onClick={() => setGender(g)}
                >
                  {g === "male" ? <FaMars size={20} /> :
                    g === "female" ? <FaVenus size={20} /> :
                      <FaGenderless size={20} />}
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={!isFormValid || isLoading}
            whileHover={isFormValid ? { scale: 1.02 } : {}}
            className="submit-btn"
            style={{
              backgroundColor: isFormValid ? "#8f07e7" : "#e6e6e6",
              color: isFormValid ? "#fff" : "#999",
              cursor: isFormValid ? "pointer" : "not-allowed",
              marginTop: "20px",
              padding: "10px 20px",
              border: "none",
              borderRadius: "6px",
              width: "100%",
            }}
          >
            {isLoading ? (
              <div className="d-flex justify-content-center">
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              "Complete Profile"
            )}
          </motion.button>
        </form>
      </motion.div>
    </PostSignupFormModal>
  );
};

export default PostSignupForm;