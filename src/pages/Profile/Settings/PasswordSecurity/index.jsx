import React, { useState } from 'react';
import './PasswordSecurity.css';
import { Lock, ShieldCheck } from 'lucide-react';

const PasswordSecurity = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Security settings updated!');
    // Send to backend here
  };

  return (
    <div className="security-settings">
      <h2>
        <Lock size={20} /> Password & Security
      </h2>

      <form onSubmit={handleSubmit} className="security-form">
        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {/* <div className="form-group toggle">
          <input
            type="checkbox"
            id="twoFactorEnabled"
            name="twoFactorEnabled"
            checked={formData.twoFactorEnabled}
            onChange={handleChange}
          />
          <label htmlFor="twoFactorEnabled">
            Enable Two-Factor Authentication
          </label>
        </div> */}

        <div className="form-footer d-flex justify-content-end">
          <button type="submit" className="save-btn">Save Changes</button>
        </div>
      </form>

      <div className="security-tips">
        <h4>
          <ShieldCheck size={18} /> Keep your account secure
        </h4>
        <ul>
          <li>Use a strong, unique password.</li>
          <li>Don’t reuse passwords across sites.</li>
          <li>Enable two-factor authentication.</li>
          <li>Log out from unused devices.</li>
        </ul>
      </div>
    </div>
  );
};

export default PasswordSecurity;
