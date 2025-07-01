import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { FaCamera } from 'react-icons/fa';
import './editProfile.css';
import { useAuth } from '../../../auth/AuthContext';

const EditProfileForm = () => {
  const { user } = useAuth();

  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
  });

  // Populate user data on load
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.user_firstname || '',
        lastName: user.user_lastname || '',
        username: user.user_name || '',
        email: user.user_email || '',
        phone: user.user_phone || '',
      });

      if (user.user_picture) {
        setProfileImage(user.user_picture);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can send `formData` and image file to your API
    alert('Profile Updated!');
  };

  return (
    <form className="edit-profile-form" onSubmit={handleSubmit}>
      <h2 className="text-left">Edit Profile</h2>

      <div className="profile-image-section">
        <div className="image-wrapper">
          <img
            src={profileImage || 'https://zagasm.com/content/themes/default/images/blank_profile.png'}
            alt="Profile"
            className="profile-preview"
          />
          <label htmlFor="profile-upload" className="upload-icon">
            <FaCamera />
            <input
              type="file"
              id="profile-upload"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>First Name</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Last Name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Phone Number</label>
        <PhoneInput
          country={'us'}
          value={formData.phone}
          onChange={(phone) => setFormData((prev) => ({ ...prev, phone }))}
          inputProps={{
            name: 'phone',
            required: true,
          }}
          enableSearch
          inputClass="phone-input-custom"
        />
      </div>

      <div className="container d-flex justify-content-end">
        <button type="submit" className="save-btn">
          Update profile
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;
