import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import AuthContainer from "../assets/auth_container";
import { motion } from "framer-motion";

export function CodeVerification() {
  const CODE_LENGTH = 6;
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const inputsRef = useRef([]);

  const handleChange = (e, idx) => {
    const val = e.target.value;

    if (/^\d?$/.test(val)) {
      const newCode = [...code];
      newCode[idx] = val;
      setCode(newCode);

      // Move to next input
      if (val && idx < CODE_LENGTH - 1) {
        inputsRef.current[idx + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      if (!code[idx] && idx > 0) {
        inputsRef.current[idx - 1].focus();
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      inputsRef.current[idx - 1].focus();
    } else if (e.key === "ArrowRight" && idx < CODE_LENGTH - 1) {
      inputsRef.current[idx + 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const joinedCode = code.join("");
    if (joinedCode.length < CODE_LENGTH) {
      alert("Please enter the full 6-digit code.");
      return;
    }
    console.log("Code entered:", joinedCode);
    // Submit the code to your backend here
  };

  return (
    <AuthContainer title={"Verification code"} description={"We've sent a 6-digit code to"}>
      <p className="text-center" style={{ color: '#8000FF', fontSize: '15px', marginTop: '-20px', fontFamily: 'Inter' }}>
        to**********************@gmail.com
      </p>
      <form autoComplete="off" className="pr-3 pl-3" onSubmit={handleSubmit}>
        <div className="code_container row m-4 justify-content-center">
          {code.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              ref={(el) => (inputsRef.current[idx] = el)}
              className="code col card m-1 text-center"
              style={{
                width: "50px",
                height: "50px",
                fontSize: "24px",
                textAlign: "center",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            />
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="btn submit_button btn-block"
          type="submit"
          style={{ color: 'white' }}
        >
          <span className="fas fa-sign-in-alt mr-3"></span> Verify code
        </motion.button>

        <div className="text-center mt-3 border-botto pb-1 mb-1">
          <p className="small text-muted">
            Don't receive the code? <Link className="font-weight-bold" to="/auth/signup">Create account</Link>
          </p>
        </div>

        <div className="py-3 text-center auth-footer">
          <span className="text-info" style={{ fontSize: '13px' }}>
            <i class="fa fa-exclamation-circle"></i> Check your spam folder if you don't see the email
          </span>
        </div>
      </form>
    </AuthContainer>
  );
}
