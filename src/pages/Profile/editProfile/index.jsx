import React, { useState, useEffect } from 'react';
import './editProfileStyling.css';
import { Link } from 'react-router-dom';
import SideBarNav from '../../pageAssets/sideBarNav';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { FiMail } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../../auth/AuthContext';
import default_profilePicture from '../../../assets/avater_pix.avif';
import { showToast } from '../../../component/ToastAlert';

function EditProfile() {
    const { user, login, token } = useAuth();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        dob: '',
        gender: ''
    });
    const Default_user_image = user?.profileUrl ? user.profileUrl : default_profilePicture;
    const [profileImage, setProfileImage] = useState(Default_user_image);
    const [uploading, setUploading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);

    // Prefill data from user
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                dob: user.dob || '',
                gender: user.gender || ''
            });
            setPhoneNumber(user.phoneNumber || '');
            setEmailVerified(user.email_verified || false);
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePictureChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const form = new FormData();
        form.append('profile_url', file);

        try {
            setUploading(true);
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/profile/image/edit`,
                form,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            if (res.status === 200) {
                showToast.success(res.data.message || "Profile image updated successfully!");
                login({
                    user: res.data.user,
                    token: token
                });
                setProfileImage(res.data.user.profileUrl);
            }
        } catch (err) {
            console.error('Failed to upload profile picture:', err);
            showToast.error(err.response?.data?.message || "Failed to upload profile image.");
        } finally {
            setUploading(false);
        }
    };
    const getCountryCode = (phone) => phone ? phone.match(/^\+(\d{1,3})/)?.[0] : '';
    const getLocalNumber = (phone) => phone ? phone.replace(/^\+\d{1,3}/, '') : '';
    const handleUpdateProfile = async () => {
        if (!formData.firstName.trim()) return showToast.error("First name is required");
        if (!formData.lastName.trim()) return showToast.error("Last name is required");
        if (!formData.email.trim()) return showToast.error("Email is required");
        if (!phoneNumber) return showToast.error("Phone number is required");
        if (!formData.dob) return showToast.error("Date of birth is required");
        if (!formData.gender) return showToast.error("Gender is required");
        const countryCode = getCountryCode(phoneNumber);
        const localNumber = getLocalNumber(phoneNumber);
        try {
            setUpdating(true);
            const data = new FormData();
            data.append("first_name", formData.firstName);
            data.append("last_name", formData.lastName);
            data.append("email", formData.email);
            data.append("phone", localNumber);
            data.append("country_code", countryCode);
            data.append("dob", formData.dob);
            data.append("gender", formData.gender);

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/profile/edit`,
                data,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            console.log(res);
            if (res.status === 200) {
                showToast.success(res.data.message || "Profile updated successfully!");
                login({
                    user: res.data.user,
                    token: token
                });
            }
        } catch (err) {
            console.error('Failed to update profile:', err);
            showToast.error(err?.data?.message || "Failed to update profile.");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="container-flui m-0 p-0">
            <SideBarNav />
            <div className="page_wrapper overflow-hidden">
                <div className="row pt-5">
                    <div className="col-lg-10 ">
                        <div className='row'>
                            <div className="col-xl-3 col-lg-5 ">
                                <div className="edit_heading_section  " style={{boxShadow:'none'}} >
                                    <div className="editdetails_display ">
                                        <div className='profle_img_container   '>
                                            <div className='profle_img' style={{ position: 'relative' }}>
                                                <img
                                                    src={profileImage}
                                                    loading="lazy"
                                                    alt="Profile"
                                                />
                                                {uploading && (
                                                    <div className="profile-loader-overlay">
                                                        <div className="profile-spinner"></div>
                                                    </div>
                                                )}
                                                <span className='edit_update_picture d-block'>
                                                    <label htmlFor="upload_pix" className='upload_pix' >
                                                        Update Photo
                                                        <input
                                                            id='upload_pix'
                                                            type="file"
                                                            accept="image/*"
                                                            style={{ display: 'none' }}
                                                            onChange={handlePictureChange}
                                                        />
                                                    </label>
                                                </span>
                                            </div>
                                           
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-9 col-lg-7">
                                <div className="edit_form_container">
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label>First name</label>
                                                <input
                                                    type="text"
                                                    className='form-control'
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label>Last name</label>
                                                <input
                                                    type="text"
                                                    className='form-control'
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                         <div className="col-lg-12">
                                            <div className="form-group">
                                                <label>About Me</label>
                                                <textarea
                                                    className='form-control'
                                                    name="aboutMe"
                                                    value={formData.aboutMe}
                                                    onChange={handleChange}
                                                    rows={3}
                                                    placeholder='Write a description about yourself...'
                                                ></textarea>
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="form-group email-input-group">
                                                <label>Email</label>
                                                <div className="input-with-icon">
                                                    <FiMail className="input-icon" />
                                                    <input
                                                        type="email"
                                                        className='form-control'
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        placeholder='Enter your email here'
                                                        readOnly={emailVerified} // Email not editable if verified
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="form-group">
                                                <label>Phone number</label>
                                                <PhoneInput
                                                    international
                                                    defaultCountry="NG"
                                                    value={phoneNumber}
                                                    onChange={setPhoneNumber}
                                                    className="phone-input"
                                                />
                                            </div>
                                        </div>
                                       
                                        {/* <div className="col-lg-6">
                                            <div className="form-group">
                                                <label>Date of Birth</label>
                                                <input
                                                    type="date"
                                                    className='form-control'
                                                    name="dob"
                                                    value={formData.dob}
                                                    onChange={handleChange} disabled
                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label>Gender</label>
                                                <select
                                                    className="form-control"
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={handleChange}
                                                    disabled
                                                >
                                                    <option value="">Select gender</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                        </div> */}

                                        <div className="col-lg-12 d-flex justify-content-end">
                                            <button
                                                className="profile_update_btn"
                                                onClick={handleUpdateProfile}
                                                disabled={updating}
                                            >
                                                {updating ? "Updating..." : "Update"}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="password_tab">
                                        <Link to={'/profile/edit-password'} className='d-flex justify-content-between'>
                                            <div>
                                                <i className='fa fa-lock mr-3'></i>
                                                <span>Set Password</span>
                                            </div>
                                            <div className='arrow_icon'>
                                                <i className='fa fa-angle-right'></i>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .profile-loader-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                }
                .profile-spinner {
                    width: 30px;
                    height: 30px;
                    border: 3px solid #ccc;
                    border-top-color: #333;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
}

export default EditProfile;
