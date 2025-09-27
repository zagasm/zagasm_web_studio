import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SideBarNav from '../../pageAssets/SideBarNav';
import { FiMail, FiEye, FiEyeOff } from 'react-icons/fi';
import './editPasswordStyling.css';

function EditPassword() {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [errors, setErrors] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'newPassword' || name === 'confirmPassword') {
            validatePasswords();
        }
    };

    const validatePasswords = () => {
        const newErrors = { ...errors };

        if (formData.newPassword.length > 0 && formData.newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters';
        } else {
            newErrors.newPassword = '';
        }

        if (formData.confirmPassword && formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        } else {
            newErrors.confirmPassword = '';
        }

        setErrors(newErrors);
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const isFormValid = () => {
        return (
            formData.currentPassword &&
            formData.newPassword &&
            formData.confirmPassword &&
            formData.newPassword === formData.confirmPassword &&
            formData.newPassword.length >= 8 &&
            !errors.newPassword &&
            !errors.confirmPassword
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid()) return;

        setIsLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Password change submitted', formData);
            // Add your actual password change logic here

            // Reset form after successful submission
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            console.error('Error changing password:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container-flui m-0 p-0">
            <SideBarNav />
            <div className="page_wrapper overflow-hidden">

                <div className="row pt-2">
                    <div className="col-lg-10 offset-lg-1">
                        <div>
                            <div className="edit_password_container">
                                <Link to={'/profile/edit-profile'} className='fa fa-angle-left mb-5'></Link>
                                <h3 className="mb-4 text-left">Set Password</h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="form-group password-input-group">
                                                <label htmlFor="currentPassword">Current Password</label>
                                                <div className="input-with-icon">
                                                    <input
                                                        type={showPassword.current ? "text" : "password"}
                                                        className='form-control'
                                                        placeholder='Enter current password'
                                                        name="currentPassword"
                                                        value={formData.currentPassword}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        className="password-toggle"
                                                        onClick={() => togglePasswordVisibility('current')}
                                                    >
                                                        {showPassword.current ? <FiEyeOff /> : <FiEye />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-group password-input-group">
                                                <label htmlFor="newPassword">New Password</label>
                                                <div className="input-with-icon">
                                                    <input
                                                        type={showPassword.new ? "text" : "password"}
                                                        className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                                                        placeholder='Enter new password (min 8 characters)'
                                                        name="newPassword"
                                                        value={formData.newPassword}
                                                        onChange={handleChange}
                                                        required
                                                        minLength="8"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="password-toggle"
                                                        onClick={() => togglePasswordVisibility('new')}
                                                    >
                                                        {showPassword.new ? <FiEyeOff /> : <FiEye />}
                                                    </button>
                                                </div>
                                                {errors.newPassword && (
                                                    <div className="invalid-feedback">{errors.newPassword}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-group password-input-group">
                                                <label htmlFor="confirmPassword">Confirm New Password</label>
                                                <div className="input-with-icon">
                                                    <input
                                                        type={showPassword.confirm ? "text" : "password"}
                                                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                                        placeholder='Confirm new password'
                                                        name="confirmPassword"
                                                        value={formData.confirmPassword}
                                                        onChange={handleChange}
                                                        required
                                                        minLength="8"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="password-toggle"
                                                        onClick={() => togglePasswordVisibility('confirm')}
                                                    >
                                                        {showPassword.confirm ? <FiEyeOff /> : <FiEye />}
                                                    </button>
                                                </div>
                                                {errors.confirmPassword && (
                                                    <div className="invalid-feedback">{errors.confirmPassword}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-4">
                                        <div className="col-12">
                                            <button
                                                type="submit"
                                                className=" submit-btn"
                                                disabled={!isFormValid() || isLoading}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <span className="button-loader"></span>
                                                        <span style={{ marginLeft: '8px' }}>Updating...</span>
                                                    </>
                                                ) : (
                                                    'Update Password'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditPassword;