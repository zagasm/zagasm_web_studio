import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../component/ToastAlert";
import AuthContainer from "../assets/auth_container";
import { motion } from "framer-motion";
import authCodeImg from "../../../assets/authCode.png";
import axios from "axios";
import './signInStyle.css';
import { isValidPhoneNumber } from 'react-phone-number-input';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { showSuccess, showError } from "../../../component/ui/toast";

export function SigninWithCode({ CodeType, CodeSource }) {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState(['', '', '', '', '']);
  const [isCodeComplete, setIsCodeComplete] = useState(false);
  const [isEditingSource, setIsEditingSource] = useState(false);
  const [editedSource, setEditedSource] = useState(CodeSource);
  const [sourceError, setSourceError] = useState('');
  const inputsRef = useRef([]);
  const sourceInputRef = useRef(null);
  const navigate = useNavigate();

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
  }, []);

  useEffect(() => {
    if (isEditingSource && sourceInputRef.current) {
      sourceInputRef.current.focus();
    }
  }, [isEditingSource]);

  useEffect(() => {
    const complete = code.every(digit => digit !== '');
    setIsCodeComplete(complete);
    if (complete) {
      handleSubmit();
    }
  }, [code]);

  const validateSource = (source) => {
    if (!source.trim()) {
      setSourceError(CodeType === 'phone' ? "Phone number is required" : "Email address is required");
      return false;
    }

    if (CodeType === 'phone') {
      if (!isValidPhoneNumber(source)) {
        setSourceError('Please enter a valid phone number with country code');
        return false;
      }
    } else {
      if (!/^\w+@\w+\.\w{2,}$/.test(source)) {
        setSourceError('Please enter a valid email address');
        return false;
      }
    }

    setSourceError('');
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

  const handleEditSourceClick = () => {
    setIsEditingSource(true);
  };

  const handleSourceChange = (value) => {
    setEditedSource(value);
    if (sourceError) setSourceError('');
  };

  const handleSourceBlur = () => {
    if (!validateSource(editedSource)) {
      setEditedSource(CodeSource);
    }
    setIsEditingSource(false);
  };

  const handleSourceKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (validateSource(editedSource)) {
        setIsEditingSource(false);
      } else {
        setEditedSource(CodeSource);
      }
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateSource(editedSource)) return;
    const verificationCode = code.join('');
    if (verificationCode.length !== 5) {
      setErrors({ server: "Please enter a complete 5-digit code" });
      return;
    }
    setIsLoading(true);
    setErrors({});
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/verify_code.ph`, {
        code: verificationCode,
        type: CodeType,
        source: editedSource
      });
      const data = response.data;
      if (data.success) {
        showSuccess(data.message || "Verification successful!");
        navigate("/dashboard");
      } else {
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

  const handleResendCode = async () => {
    if (!validateSource(editedSource)) return;
    setIsLoading(true);
    setErrors({});
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/resend_code.php`, {
        type: CodeType,
        source: editedSource
      });
      const data = response.data;
      if (data.success) {
        showSuccess(data.message || "New code sent successfully!");
        setCode(['', '', '', '', '']);
        if (inputsRef.current[0]) inputsRef.current[0].focus();
      } else {
        throw new Error(data.message || "Failed to resend code");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to resend verification code";
      showError(errorMessage);
      setErrors({ server: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer title="Welcome Back" description="Sign in to continue your journey" footer={false} header={false}
      privacy={false}
      haveAccount={true}>
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
      <motion.form autoComplete="off" className="pr-3 pl-3 shadow-s signIncodeForm" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }} initial="hidden" animate="visible" onSubmit={handleSubmit}>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '30px' }}>
          <img src={authCodeImg} alt="Verification Code" className="verification-image" />
        </div>
        <div className='text-center' style={{ marginBottom: '30px' }}>
          <motion.h5 initial={{ opacity: 0, x: -70 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeOut" }} className="font-weight-bold mt-3" style={{ fontSize: '24px', color: '#333' }}>Verification Code</motion.h5>
          <motion.p initial={{ opacity: 0, x: 70 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: "easeOut" }} className="text-muted" style={{ fontSize: '16px' }}>We have sent the verification code to <span style={{ color: 'rgba(143, 7, 231, 1)' }}>{editedSource}</span></motion.p>
        </div>
        {errors.server && (<motion.div className="alert alert-danger mb-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>{errors.server}</motion.div>)}
        <motion.div variants={inputVariants} className="form-group">
          <div className="code-input-container">
            {[0, 1, 2, 3, 4].map((index) => (
              <input key={index} type="text" maxLength="1" value={code[index]} onChange={(e) => handleChange(e, index)} onKeyDown={(e) => handleKeyDown(e, index)} onPaste={handlePaste} ref={(el) => (inputsRef.current[index] = el)} className="code-input" inputMode="numeric" pattern="[0-9]*" />
            ))}
          </div>
        </motion.div>
        <motion.div variants={inputVariants} className="form-group">
          {isEditingSource ? (
            <>
              {CodeType === 'phone' ? (
                <PhoneInput
                  country={'ng'}
                  value={editedSource}
                  onChange={(phone) => handleSourceChange('+' + phone)}
                  inputProps={{
                    ref: sourceInputRef,
                    onBlur: handleSourceBlur,
                    onKeyDown: handleSourceKeyDown,
                    className: 'form-control edit-source-input'
                  }}
                  inputStyle={{ width: '100%', height: '38px' }}
                />
              ) : (
                <input type="email" value={editedSource} onChange={(e) => handleSourceChange(e.target.value)} onBlur={handleSourceBlur} onKeyDown={handleSourceKeyDown} ref={sourceInputRef} className="form-control edit-source-input" />
              )}
              {sourceError && (<div className="invalid-feedback d-block">{sourceError}</div>)}
            </>
          ) : (
            <span className="edit_code_display" onClick={handleEditSourceClick}>{editedSource || 'No source provided'} <i className="feather-edit ml-2"></i></span>
          )}
        </motion.div>
        <motion.div variants={inputVariants} className="text-center mt-3">
          <button type="button" className="resend-btn" onClick={handleResendCode} disabled={isLoading}>Resend</button>
        </motion.div>
        <motion.div variants={inputVariants} className="mt-4">
          <motion.button className="submit-btn" type="submit" disabled={!isCodeComplete || isLoading} variants={buttonVariants} whileHover={isCodeComplete ? "hover" : {}} whileTap={isCodeComplete ? "tap" : {}}>
            {isLoading ? (<><span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Submitting...</>) : ("Submit")}
          </motion.button>
        </motion.div>
      </motion.form>
    </AuthContainer>
  );
}
