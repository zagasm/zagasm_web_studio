import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { showToast } from "../../../component/ToastAlert";
import AuthContainer from "../assets/auth_container";
import { motion } from "framer-motion";
import googleLogo from "../../../assets/google-logo.png";
export function ForgetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15, // delay between children animation
      },
    },
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };
  return (
    <>
      <AuthContainer title={"Forget password?"} description={"Don't worry enter your email address and we'll send you a reset link. "}>
        <form autoComplete="off"
          className="pr-3 pl-3"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <motion.div initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }} className="form-group "  >
            <div className="position-relative icon-form-control"  >
              <input
                type="email"
                className="form-control input "
                style={{ paddingLeft: "60px", outline: "none", }}
                placeholder="Email Address"
                autoComplete="off"
              />
              <i className="feather-mail position-absolute input-icon" ></i>
            </div>
          </motion.div>


          <motion.button initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }} className="btn submit_button btn-block mb-5" type="submit" style={{ color: 'white' }}
          > Send Reset Link
          </motion.button>



         

          <div className="py-3 text-center auth-footer">
            <span className="text-center">
              <span className="fas fa-arrow-left ml-2" ></span> <Link  className="font-weight-bold" to="/auth/signin">Back to login</Link>
            </span>
          </div>
        </form>
      </AuthContainer>
    </>
  );
}
