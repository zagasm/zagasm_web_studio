import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../component/ToastAlert";
import AuthContainer from "../assets/auth_container";
import { motion } from "framer-motion";
import authCodeImg from "../../../assets/authCode.png";
import axios from "axios";
import '../signin/signInStyle.css';
import { ChangePassword } from "../ChangePassword";
import { showSuccess, showError } from "../../../component/ui/toast";

export function CodeVerification({ verificationData }) {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [forgetPasswordAccess, setforgetPasswordAccess] = useState(false);
  const [code, setCode] = useState(['', '', '', '', '']);
  const [isCodeComplete, setIsCodeComplete] = useState(false);
  const [isEditingInput, setIsEditingInput] = useState(false);
  const [editedInput, setEditedInput] = useState(verificationData?.input || '');
  const [ResetPasswordVerificationData,setResetPasswordVerificationData]  = useState();
  const [inputError, setInputError] = useState('');
  const inputsRef = useRef([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Destructure verificationData with defaults
  const {
    input = '',
    isEmail = true,
    code: initialCode = 0,
    expiresAt = ''
  } = verificationData || {};

  // Mask the input (email or phone)
  const maskInput = (value) => {
    if (!value) return '';
    
    if (isEmail) {
      const [localPart, domain] = value.split('@');
      if (!localPart || !domain) return value;
      const firstChar = localPart[0];
      const maskedLocal = firstChar + '*****';
      return `${maskedLocal}@${domain}`;
    } else {
      // Mask phone number (show last 4 digits)
      if (value.length <= 4) return value;
      return `*******${value.slice(-4)}`;
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      boxShadow: "0 4px 12px rgba(143, 7, 231, 0.3)"
    },
    tap: { scale: 0.98 }
  };

  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
    if (input) {
      setEditedInput(input);
    }
  }, [input]);

  useEffect(() => {
    if (isEditingInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditingInput]);

  useEffect(() => {
    const complete = code.every(digit => digit !== '');
    setIsCodeComplete(complete);
  }, [code]);

  const validateInput = (value) => {
    if (!value.trim()) {
      setInputError(`${isEmail ? 'Email' : 'Phone number'} is required`);
      return false;
    }

    if (isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test.test(value)) {
      setInputError('Please enter a valid email address');
      return false;
    }

    setInputError('');
    return true;
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value) || value === '') {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value !== '' && index < 4) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').slice(0, 5);
    if (/^\d+$/.test(pasteData)) {
      const newCode = [...code];
      for (let i = 0; i < pasteData.length; i++) {
        if (i < 5) {
          newCode[i] = pasteData[i];
        }
      }
      setCode(newCode);
    }
  };

  const handleEditInputClick = () => {
    setIsEditingInput(true);
  };

  const handleInputChange = (e) => {
    setEditedInput(e.target.value);
    if (inputError) setInputError('');
  };

  const handleInputBlur = () => {
    if (!validateInput(editedInput)) {
      setEditedInput(input);
    }
    setIsEditingInput(false);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (validateInput(editedInput)) {
        setIsEditingInput(false);
      } else {
        setEditedInput(input);
      }
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateInput(editedInput)) return;
    const verificationCode = code.join('');
    if (verificationCode.length !== 5) {
      setErrors({ server: "Please enter a complete 5-digit code" });
      return;
    }
    setIsLoading(true);
    setErrors({});
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/password/verify-code`, {
        code: verificationCode,
        input: editedInput,
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });
       console.log(response);
      const data = response.data;
      if (data.reset_token != null || data.reset_token != undefined) {
        showSuccess(data.message || "Verification successful!");
        setResetPasswordVerificationData({
            input: data.input,
            message:data.message,
            reset_token:data.reset_token
        });
        setforgetPasswordAccess(true);
      }else{
          throw new Error(data.message || "Verification failed");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "An error occurred during verification";
      showError(errorMessage);
      setErrors({ server: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

   if(forgetPasswordAccess){
         return <ChangePassword ResetPasswordVerificationData={ResetPasswordVerificationData} />
   }
  return (
    <AuthContainer 
      footer={false} 
      header={false}
      privacy={false}
      haveAccount={true}
    >
      <style>{`
        .submit-btn {
          background-color: ${isCodeComplete ? 'rgba(143, 7, 231, 1)' : 'rgba(169, 169, 169, 0.7)'};
          color: white;
          cursor: ${isCodeComplete ? 'pointer' : 'not-allowed'};
          height: 50px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          border: none;
          width: 100%;
          transition: background-color 0.3s;
        }
      `}</style>
      <motion.form 
        autoComplete="off" 
        className="pr-3 pl-3 shadow-s signIncodeForm" 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible" 
        onSubmit={handleSubmit}
      >
        <div style={{ display: 'flex', justifyContent: 'center', margin: '30px' }}>
          <img src={authCodeImg} alt="Verification Code" className="verification-image" />
        </div>
        <div className='text-center' style={{ marginBottom: '30px' }}>
          <motion.h5 
            initial={{ opacity: 0, x: -70 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.9, ease: "easeOut" }} 
            className="font-weight-bold mt-3 container_heading_text text-center"
          >
            5-Digit OTP Verification
          </motion.h5>
          <motion.p 
            initial={{ opacity: 0, x: 70 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.9, ease: "easeOut" }} 
            className="text-muted heading_content mb-2 text-center"
          >
            We have sent the OTP verification code to your {isEmail ? 'Email' : 'Phone'} <span style={{ color: 'rgba(143, 7, 231, 1)' }}>{maskInput(editedInput)}</span>
          </motion.p>
        </div>
        <p>Code: {verificationData.code}</p>
        {errors.server && (
          <motion.div 
            className="alert alert-danger mb-4" 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }}
          >
            {errors.server}
          </motion.div>
        )}
        
        <motion.div variants={inputVariants} className="form-group">
          <div className="code-input-container">
            {[0, 1, 2, 3, 4].map((index) => (
              <input 
                key={index} 
                type="text" 
                maxLength="1" 
                value={code[index]} 
                onChange={(e) => handleChange(e, index)} 
                onKeyDown={(e) => handleKeyDown(e, index)} 
                onPaste={handlePaste} 
                ref={(el) => (inputsRef.current[index] = el)} 
                className="code-input" 
                inputMode="numeric" 
                pattern="[0-9]*" 
              />
            ))}
          </div>
        </motion.div>
        
        {/* <motion.div variants={inputVariants} className="form-group">
          {isEditingInput ? (
            <>
              <input 
                type={isEmail ? "email" : "tel"} 
                value={editedInput} 
                onChange={handleInputChange} 
                onBlur={handleInputBlur} 
                onKeyDown={handleInputKeyDown} 
                ref={inputRef} 
                className="form-control edit-source-input" 
              />
              {inputError && <div className="invalid-feedback d-block">{inputError}</div>}
            </>
          ) : (
            <span className="edit_code_display" onClick={handleEditInputClick}>
              {maskInput(editedInput) || `No ${isEmail ? 'email' : 'phone'} provided`} <i className="feather-edit ml-2"></i>
            </span>
          )}
        </motion.div> */}
        
        {/* <motion.div variants={inputVariants} className="text-center mt-3">
          <button 
            type="button" 
            className="resend-btn" 
            onClick={handleResendCode} 
            disabled={isLoading}
          >
            Resend
          </button>
        </motion.div> */}
        
        <motion.div variants={inputVariants} className="mt-4">
          <motion.button 
            className="submit-btn" 
            type="submit" 
            disabled={!isCodeComplete || isLoading} 
            variants={buttonVariants} 
            whileHover={isCodeComplete ? "hover" : {}} 
            whileTap={isCodeComplete ? "tap" : {}}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </motion.button>
        </motion.div>
      </motion.form>
    </AuthContainer>
  );
}