import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import PostSignupFormModal from "./ModalContainer";
import SignUpCodecomponent from "./SignUpCodecomponent";
import "./postSignupStyle.css";
import { useAuth } from "../../../../pages/auth/AuthContext";
import axios from "axios";
import qs from "qs";
import { useModal } from "..";
import { showSuccess } from "../../../ui/toast";

const PhoneEmailPostSignup = ({ type, userupdate, token }) => {
  const [phone, setPhone] = useState("");
  const [proceed, setProceed] = useState(false);
  const [code, setcode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { login } = useAuth();
  const { closeModal } = useModal();
  // console.log(user);
  const email = userupdate?.email || "";
  const isPhoneValid = (phone) => phone.length >= 8; // Adjust based on your requirements
  // console.log(code);
  const isFormValid =
    (type === "email" && !!email) || (type === "phone" && isPhoneValid(phone));

  useEffect(() => {
    if (userupdate?.phone) {
      setPhone(userupdate.phone);
    }
  }, [userupdate]);

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
      const normalizedPhone =
        phone && phone.startsWith("+")
          ? phone
          : `+${phone}`.replace(/^\++/, "+");
      const input = type === "email" ? email : normalizedPhone;
      // console.log(input);
      // Using URL-encoded form data
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/code/generate`,
        qs.stringify({ input }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log('responding__', response);
      if (response.status === 200) {
        setProceed(true);
        const payload = response.data?.data || response.data || {};
        setcode(payload.code || response.data.code || null);
        setSuccessMessage(
          payload.message ||
            response.data.message ||
            "Verification code sent successfully!"
        );
        showSuccess("Verification code sent successfully!");
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
    return (
      <SignUpCodecomponent
        Otpcode={code}
        token={token}
        userupdate={userupdate}
        type={type}
      />
    );
  }

  function skipProcess() {
    login({ token, user: userupdate });
    closeModal();
  }

  return (
    <PostSignupFormModal>
      <motion.div
        className="tw:max-w-md tw:w-full tw:bg-white tw:rounded-3xl tw:shadow-2xl tw:px-6 tw:py-8 tw:space-y-5 tw:mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="tw:space-y-1">
          <motion.span
            className="tw:text-xl tw:font-semibold tw:text-gray-900"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Enter your {type === "email" ? "email" : "phone number"}
          </motion.span>
          <p className="tw:text-sm tw:text-gray-500">
            We’ll send you a code to confirm your contact details.
          </p>
        </div>

        {successMessage && (
          <div className="tw:rounded-2xl tw:bg-emerald-50 tw:border tw:border-emerald-200 tw:px-4 tw:py-3 tw:text-sm tw:text-emerald-700">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="tw:rounded-2xl tw:bg-red-50 tw:border tw:border-red-200 tw:px-4 tw:py-3 tw:text-sm tw:text-red-700">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="tw:space-y-4">
          {type === "email" ? (
            <div className="tw:space-y-2">
              <label className="tw:text-sm tw:font-medium tw:text-gray-600">
                Email
              </label>
              <div className="tw:relative">
                <FaEnvelope className="tw:absolute tw:left-3 tw:top-1/2 tw:-translate-y-1/2 tw:text-gray-400" />
                <input
                  type="email"
                  className="tw:w-full tw:rounded-2xl tw:border tw:border-gray-200 tw:bg-gray-50 tw:px-12 tw:py-3 tw:text-sm tw:text-gray-900 focus:tw:border-primary focus:tw:outline-none"
                  value={email}
                  readOnly
                />
              </div>
            </div>
          ) : (
            <div className="tw:space-y-2">
              <label className="tw:text-sm tw:font-medium tw:text-gray-600">
                Phone number
              </label>
              <PhoneInput
                country={"ng"}
                value={phone}
                onChange={(phone) => setPhone(phone)}
                inputProps={{
                  required: true,
                }}
                inputClass="tw:w-full tw:rounded-2xl tw:border tw:border-gray-200 tw:px-4 tw:py-3 tw:text-sm"
                buttonClass="tw:bg-transparent tw:p-0"
                containerStyle={{ width: "100%" }}
              />
            </div>
          )}

          <div className="tw:flex tw:items-center tw:justify-between tw:gap-3 tw:mt-4">
            <motion.button
              type="button"
              onClick={skipProcess}
              className="tw:text-sm tw:font-semibold tw:text-primary tw:underline tw:transition tw:duration-200 hover:tw:opacity-90"
              whileHover={{ scale: 1.03 }}
            >
              Skip for now
            </motion.button>

            <motion.button
              style={{
                borderRadius: 20,
              }}
              type="submit"
              disabled={!isFormValid || isLoading}
              whileHover={isFormValid ? { scale: 1.02 } : {}}
              whileTap={isFormValid ? { scale: 0.98 } : {}}
              className={`tw:rounded-2xl tw:py-2.5 tw:px-5 tw:text-sm tw:font-semibold tw:transition tw:duration-200 ${
                isFormValid
                  ? "tw:bg-linear-to-r tw:from-primary tw:to-primarySecond tw:text-white"
                  : "tw:bg-gray-200 tw:text-gray-500"
              }`}
            >
              {isLoading && (
                <span className="tw:inline-flex tw:h-4 tw:w-4 tw:border-2 tw:border-white tw:border-t-transparent tw:animate-spin tw:mr-2" />
              )}
              Next
            </motion.button>
          </div>
        </form>
      </motion.div>
    </PostSignupFormModal>
  );
};

export default PhoneEmailPostSignup;
