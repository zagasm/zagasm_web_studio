import React, { Fragment, useState, useEffect } from 'react';
import zagasmLogo from "../../../assets/zagasm_logo.png";
import './style.css';
import { motion } from "framer-motion";

import { Link } from 'react-router-dom';
import googleLogo from "../../../assets/google-logo.png";
function AuthContainer({ title, description, type, children, footer, header, haveAccount, privacy }) {
    // const images = [slider1, slider2, slider3];
    // const [currentImage, setCurrentImage] = useState(0);
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setCurrentImage((prev) => (prev + 1) % images.length);
    //     }, 4000); // Change image every 4 seconds
    //     return () => clearInterval(interval);
    // }, []);
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
                        <div className="col-xl-4 col-lg-7 col-md-6  col form_container ">
                            <div className="osahan-login ">
                                <div className="text-center mb-4 pr-4 pl-4">
                                    <p style={{ display: 'flex', justifyContent: 'center', marginBottom: '50px' }}>
                                        <a href="#">
                                            <img src={zagasmLogo} className='zagasm_logo' alt="Zagasm Logo" />
                                        </a>
                                    </p>
                                    {header && <div className='heading_section' style={{ marginBottom: '50px' }}>
                                        <motion.h5 initial={{ opacity: 0, x: -70 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.9, ease: "easeOut" }} className="font-weight-bold mt-3 container_heading_text" >{title}</motion.h5>

                                        <motion.p initial={{ opacity: 0, x: 70 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.9, ease: "easeOut" }} className="text-muted heading_content"  >{description}</motion.p>
                                    </div>}
                                </div>
                                {children}
                                {footer && <> <div style={{ maxWidth: '100%' }} className="text-center mt-4">
                                    <p className="small text-muted mb-3">Or continue with</p>
                                    <div className="row">
                                        <div className="col-lg-11 mb-2 m-auto" >
                                            <motion.button
                                                initial={{ opacity: 0, y: 70 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.9, ease: "easeOut" }}
                                                type="button"
                                                className=" btn-sm api_btn btn-block"
                                            >
                                                <img src={googleLogo} alt="Google Logo" className="" style={{ width: '20px', height: '20px', marginTop: '-5px' }} />
                                                <span>Google</span>
                                            </motion.button>
                                        </div>
                                        <div className="col-lg-11 m-auto">
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



                                </>}
                                {haveAccount ? <div className="text-center footer_text mt-4 ">
                                    Don't have an account?{" "}
                                    <Link to="/auth/signup" className="">
                                        Sign up
                                    </Link>
                                </div> :
                                    <div className="text-center mt-4 footer_text ">
                                        Have an account? {' '}
                                        <Link to="/auth/signin" className="">
                                            Sign In
                                        </Link>
                                    </div>}
                                {privacy && <div className="text-center mt-3 footer_text">
                                    By continuing, you agree to our {' '}
                                    <Link to="/auth/signup" className="">
                                        Terms 
                                    </Link>
                                    <span> and </span>
                                    <Link to="/auth/signup">Privacy Policy</Link>
                                </div>}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Fragment>
    );
}
export default AuthContainer;
