import React, { useState, useEffect } from 'react';
import './PrivacySettings.css';
import { useAuth } from '../../../auth/AuthContext';

const PrivacySettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    postVisibility: 'public',
    contactPermission: 'everyone',
    dataSharing: true,
    contentFilter: false,
    blockedMuted: [],
  });

  useEffect(() => {
    if (user) {
      setSettings((prev) => ({
        ...prev,
        postVisibility: user.user_privacy_basic || 'public',
        contactPermission: user.user_privacy_chat || 'everyone',
        dataSharing: user.user_data_sharing !== 'disabled',
        contentFilter: user.user_content_filter === 'enabled',
        blockedMuted: user.blocked_muted || [],
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (e) => {
    const { name, checked } = e.target;
    setSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Privacy settings updated!');
  };

  return (
    <form className="privacy-settings-form" onSubmit={handleSubmit}>
      <h2>Privacy Settings</h2>

      <div className="setting-item">
        <label htmlFor="postVisibility">Post Visibility</label>
        <select
          name="postVisibility"
          value={settings.postVisibility}
          onChange={handleChange}
        >
          <option value="public">Public</option>
          <option value="followers">Followers Only</option>
          <option value="groups">Specific Groups</option>
        </select>
        <p>Control who can see your posts.</p>
      </div>

      <div className="setting-item">
        <label htmlFor="contactPermission">Contact Permissions</label>
        <select
          name="contactPermission"
          value={settings.contactPermission}
          onChange={handleChange}
        >
          <option value="everyone">Everyone</option>
          <option value="approved">Approved Followers</option>
          <option value="mutuals">Mutual Followers</option>
        </select>
        <p>Manage who can message or follow you.</p>
      </div>

      <div className="setting-item">
        <label>
          <input
            type="checkbox"
            name="dataSharing"
            checked={settings.dataSharing}
            onChange={handleToggle}
          />
          Allow Data Sharing with Third-Parties
        </label>
        <p>Control data shared with advertisers or third-party apps.</p>
      </div>

      <div className="setting-item">
        <label>
          <input
            type="checkbox"
            name="contentFilter"
            checked={settings.contentFilter}
            onChange={handleToggle}
          />
          Enable Content Filters
        </label>
        <p>Mute sensitive content and filter by keywords.</p>
      </div>

      <div className="setting-item">
        <label>Blocked & Muted Users</label>
        <p>{settings.blockedMuted.length > 0 ? `${settings.blockedMuted.length} users` : 'No blocked or muted users'}</p>
      </div>

      <div className="container d-flex justify-content-end">
        <button type="submit" className="save-btn">Save Settings</button>
      </div>
    </form>
  );
};

export default PrivacySettings;
