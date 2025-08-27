import React, { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../component/ToastAlert";
import AuthContainer from "../assets/auth_container";
import lock_icon from "../../../assets/unlocked_icon.png";
import { motion } from "framer-motion";
import axios from "axios";

export function ChangePasswordSuccesffully({ status }) {
  const [showPassword, setShowPassword] = useState(false);


  return (
    <Fragment>
      <div className="auth-background" >
        <div className="bar_section">
          <div className="left_bar bar_container"></div>
          <div className="right_bar bar_container"></div>
        </div>
        {/* Main Content */}
        <div className="container-fluid position-relative auth_container mb-5">
          <div className="row justify-content-center align-items-center d-flex align-center  inner_form_con">
            <div className="col-xl-3 col-lg-7 col-md-6  col form_container ">
              <div className="osahan-login ">
                <div className="text-center mb-4  ">
                  <p style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                    <a href="#">
                      <img src={lock_icon} alt="password changed successfully icon" />
                    </a>
                  </p>
                  <div className='heading_section' style={{ marginBottom: '50px' }}>
                    <motion.h5 initial={{ opacity: 0, x: -70 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.9, ease: "easeOut" }} className="font-weight-bold mt-3 container_heading_text text-center" >{'Password set successfully'}</motion.h5>

                    <motion.p initial={{ opacity: 0, x: 70 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.9, ease: "easeOut" }} className="text-muted heading_content text-center"  >{'Let’s take you to login with your new password and begin exploring events.'}</motion.p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Fragment>
  );
}