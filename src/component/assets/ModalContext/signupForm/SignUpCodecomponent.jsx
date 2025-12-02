import React, { useRef, useState, useEffect } from "react";
import PostSignupFormModal from "./ModalContainer";
import PhoneEmailPostSignup from "./PhoneEmailPostSignup";
import "./postSignupStyle.css";
import axios from "axios";
import { useAuth } from "../../../../pages/auth/AuthContext";
import Alert from 'react-bootstrap/Alert';
import { showToast } from "../../../ToastAlert";
import { showSuccess, showError } from "../../../ui/toast";

const SignUpCodecomponent = ({ Otpcode, token, userupdate, type }) => {
    const inputRefs = useRef([]);
    const [code, setCode] = useState(["", "", "", "", ""]);
    const [newotpcode, setnewotpcode] = useState(Otpcode);
    const [switchToForm, setSwitchToForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [timer, setTimer] = useState(600); // 10 minutes in seconds
    const [canResend, setCanResend] = useState(false);
    const { login } = useAuth();

    useEffect(() => {
        // Start countdown timer
        const interval = setInterval(() => {
            setTimer(prevTimer => {
                if (prevTimer <= 1) {
                    clearInterval(interval);
                    setCanResend(true);
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleResendCode = async () => {
        if (!canResend) return;

        setIsLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);
        try {
            const contact = type.includes("email") ? userupdate.email : userupdate.phone;

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/code/regenerate`,
                {
                    input: contact,
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // const result = response.data;
               console.log(response);
            // if (result) {
            //     setnewotpcode(result.code);
            //     setSuccessMessage(result.message || "Verification code resent successfully!");
            //     showToast.success(result.message || "Verification code resent successfully!");
            //     setTimer(600); // Reset timer to 10 minutes
            //     setCanResend(false);

            //     // Restart the timer
            //     const interval = setInterval(() => {
            //         setTimer(prevTimer => {
            //             if (prevTimer <= 1) {
            //                 clearInterval(interval);
            //                 setCanResend(true);
            //                 return 0;
            //             }
            //             return prevTimer - 1;
            //         });
            //     }, 1000);
            // } else {
            //     setErrorMessage("Failed to resend verification code.");
            // }
        } catch (error) {
            console.log(error)
            // const message = error.response?.data?.message || "Failed to resend verification code. Please try again.";
            // setErrorMessage(message);
            // showError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        if (value && index < 4) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleFinish = async () => {
        const verificationCode = code.join("");
        const verificationType =
            type === "email" || type === "email_verification"
                ? "email_verification"
                : type === "phone" || type === "phone_verification"
                    ? "phone_verification"
                    : "password_reset";

        setIsLoading(true);
        setErrorMessage(null);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/code/verify`,
                {
                    code: verificationCode,
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const result = response.data;
            // console.log(result);
            if (result) {
                showSuccess(response.message || "Verification successful!");

                // setSuccessMessage(result.message || "Verification successful!");
                const user = userupdate;
                login({ token, user });
            } else {
                setErrorMessage(result.message || "Verification failed. Please try again.");
            }
        } catch (error) {
            if (error.response?.status === 422) {
                const errorData = error.response.data;
                if (errorData.errors?.otp) {
                    setErrorMessage(errorData.errors.otp.join(' '));
                } else {
                    setErrorMessage(errorData.message || "Validation failed. Please check your input.");
                }
            } else {
                const message = error.response?.data?.message || "Something went wrong. Please try again.";
                setErrorMessage(message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const isComplete = code.every((digit) => digit !== "");

    const user = userupdate;
    function skipProcess() {
        login({ token, user });
        console.log('checking');
    }

    if (switchToForm) {
        const altType = type === "email" || type === "email_verification" ? "phone" : "email";
        return (
            <PhoneEmailPostSignup
                token={token}
                userupdate={userupdate}
                type={altType}
            />
        );
    }

    return (
        <PostSignupFormModal>
            <div className="container overflow-hidden">
                <h2>We sent a code to your {type.includes("email") ? "email" : "phone"}</h2>
                <p>Enter the 5-digit verification code <br /> Your code is {newotpcode && newotpcode}</p>

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

                <div className="code-inputs">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            value={digit}
                            ref={(el) => (inputRefs.current[index] = el)}
                            onChange={(e) => handleChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="code-box"
                        />
                    ))}
                </div>
                <div className="resend_code_container">
                    <span
                        className={`resend_code ${canResend ? 'active' : ''}`}
                        onClick={handleResendCode}
                        disabled={!canResend || isLoading}
                    >
                        {isLoading ? 'Sending...' : 'Resend Code'}
                    </span>
                    <div>Code expires in <span className="code_timer">{formatTime(timer)}</span></div>
                </div>
                <div className="instead_button">
                    <button onClick={() => setSwitchToForm(true)}>
                        Use {type.includes("email") ? "phone number" : "email"} instead
                    </button>
                </div>

                <div className="d-flex">
                    <button
                        onClick={skipProcess}
                        className="skip-btn"
                        style={{
                            background: "none",
                            border: "none",
                            color: "rgba(143, 7, 231, 1)",
                            marginTop: "15px",
                            fontSize: "16px",
                            textDecoration: "underline",
                            width: "100%",
                        }}
                    >
                        Skip for now
                    </button>
                    <button
                        className="submit-btn mt-3"
                        onClick={handleFinish}
                        disabled={!isComplete || isLoading}
                        style={{
                            backgroundColor: isComplete ? "rgba(143, 7, 231, 1)" : "#e6e6e6",
                            color: isComplete ? "#fff" : "#999",
                            marginTop: "20px",
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: "6px",
                            width: "100%",
                            cursor: isComplete && !isLoading ? "pointer" : "not-allowed",
                        }}
                    >
                        {isLoading ? (
                            <div className="loader">
                                <div className="loader-spinner"></div>
                            </div>
                        ) : (
                            "Finish"
                        )}
                    </button>
                </div>
            </div>
        </PostSignupFormModal>
    );
};

export default SignUpCodecomponent;