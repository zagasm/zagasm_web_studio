import React, { useState } from 'react';
import './DisplayContentSettings.css';

const DisplayContentSettings = () => {
  const [settings, setSettings] = useState({
    feedType: 'algorithmic',
    showSuggestedPosts: true,
    textSize: 'medium',
    highContrast: false,
    screenReader: false,
    language: 'en',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Display and content settings saved!');
    // Call API here
  };

  return (
    <form className="display-settings-form" onSubmit={handleSubmit}>
      <h2>Display & Content Settings</h2>

      {/* Feed Preferences */}
      <section>
        <h4>Feed Preferences</h4>
        <div className="setting-item">
          <label style={{fontWeight:'lighter'}}>Feed Type:</label>
          <select name="feedType" value={settings.feedType} onChange={handleChange}>
            <option value="algorithmic">Algorithmic Feed</option>
            <option value="chronological">Chronological Feed</option>
          </select>
        </div>
        <div className="setting-item">
          <label style={{fontWeight:'lighter'}}>
            <input
              type="checkbox"
              name="showSuggestedPosts"
              checked={settings.showSuggestedPosts}
              onChange={handleChange}
            />
            Show Suggested Posts
          </label>
        </div>
      </section>

     

      {/* Language */}
      <section>
        <h4>Language</h4>
        <div className="setting-item">
          <label style={{fontWeight:'lighter'}}>Preferred Language:</label>
          <select name="language" value={settings.language} onChange={handleChange}>
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="de">German</option>
            <option value="ar">Arabic</option>
          </select>
        </div>
      </section>

      <div className="container d-flex justify-content-end">
        <button type="submit" className="save-btn">Save Settings</button>
      </div>
    </form>
  );
};

export default DisplayContentSettings;
