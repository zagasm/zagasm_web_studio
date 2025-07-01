import React, { useState } from 'react';
import './DataStorageSettings.css';

const DataStorageSettings = () => {
  const [settings, setSettings] = useState({
    lowDataMode: false,
    autoPlayMedia: true,
  });

  const handleToggle = (e) => {
    const { name, checked } = e.target;
    setSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const clearCache = () => {
    alert('Cache cleared successfully!');
    // Add real cache clearing logic here if needed
  };

  const downloadData = () => {
    alert('Preparing your data for download...');
    // Trigger data export/download functionality here
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Data usage settings saved!');
    // API call to save preferences
  };

  return (
    <form className="data-storage-settings-form" onSubmit={handleSubmit}>
      <h2>Data & Storage Settings</h2>

      {/* Cache Management */}
      <section>
        <h4>Cache Management</h4>
        <div className="setting-item">
          <p>Clear cached images and files to free up storage on your device.</p>
          <button type="button" className="action-btn" onClick={clearCache}>
            Clear Cache
          </button>
        </div>
      </section>

      {/* Data Usage */}
      <section>
        <h4>Data Usage</h4>
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              name="lowDataMode"
              checked={settings.lowDataMode}
              onChange={handleToggle}
            />
            Enable Low Data Mode
          </label>
          <p>Reduce media quality and delay downloads to save data.</p>
        </div>
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              name="autoPlayMedia"
              checked={settings.autoPlayMedia}
              onChange={handleToggle}
            />
            Auto-play Media
          </label>
          <p>Toggle automatic playback of videos and animations.</p>
        </div>
      </section>

      {/* Download My Data */}
      <section>
        <h4>Download My Data</h4>
        <div className="setting-item">
          <p>You can download your posts, messages, and other personal data.</p>
          <button type="button" className="action-btn" onClick={downloadData}>
            Download My Data
          </button>
        </div>
      </section>

      <div className="container d-flex justify-content-end">
        <button type="submit" className="save-btn">Save Preferences</button>
      </div>
    </form>
  );
};

export default DataStorageSettings;
