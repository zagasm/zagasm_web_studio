import React, { useState } from 'react';
import './NotificationSettings.css';

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    likes: true,
    comments: true,
    mentions: true,
    follows: true,
    directMessages: true,
    emailUpdates: false,
    smsUpdates: false,
    frequency: 'immediate',
  });

  const handleToggle = (e) => {
    const { name, checked } = e.target;
    setSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const handleFrequencyChange = (e) => {
    setSettings((prev) => ({ ...prev, frequency: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Notification settings saved!');
    // Call API here
  };

  return (
    <form className="notification-settings-form" onSubmit={handleSubmit}>
      <h2>Notification Settings</h2>

      <section>
        <h4>Push Notifications</h4>
        {['likes', 'comments', 'mentions', 'follows', 'directMessages'].map((key) => (
          <div className="setting-item" key={key}>
            <label style={{fontSize:'16px', fontWeight:'lighter'}}>
              <input
                type="checkbox"
                name={key}
                checked={settings[key]}
                onChange={handleToggle}
              />
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
            </label>
          </div>
        ))}
      </section>

      <section>
        <h4>Email & SMS</h4>
        <div className="setting-item">
          <label style={{fontSize:'16px', fontWeight:'lighter'}}>
            <input 
              type="checkbox"
              name="emailUpdates"
              checked={settings.emailUpdates}
              onChange={handleToggle}
              style={{fontSize:'10px', fontWeight:'100',accentColor: '#8000ff'}}
            />
            Receive updates via Email
          </label>
        </div>
        <div className="setting-item">
          <label style={{fontSize:'16px', fontWeight:'lighter'}}>
            <input
              type="checkbox"
              name="smsUpdates"
              checked={settings.smsUpdates}
              onChange={handleToggle}
            />
            Receive updates via SMS
          </label>
        </div>
      </section>

      <section>
        <h4>Notification Frequency</h4>
        <div className="setting-item">
          <select value={settings.frequency} onChange={handleFrequencyChange}>
            <option value="immediate">Immediate</option>
            <option value="hourly">Hourly Summary</option>
            <option value="daily">Daily Summary</option>
          </select>
        </div>
      </section>

      <div className="container d-flex justify-content-end">
        <button type="submit" className="save-btn">Save Settings</button>
      </div>
    </form>
  );
};

export default NotificationSettings;
