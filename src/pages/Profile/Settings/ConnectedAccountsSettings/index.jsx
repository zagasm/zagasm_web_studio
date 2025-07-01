import React, { useState } from 'react';
import './ConnectedAccountsSettings.css';

const ConnectedAccountsSettings = () => {
  const [linkedAccounts, setLinkedAccounts] = useState({
    facebook: false,
    twitter: true,
    instagram: true,
    linkedin: false,
  });

  const platformDetails = {
    facebook: {
      name: 'Facebook',
      logo: 'https://cdn-icons-png.flaticon.com/512/124/124010.png',
    },
    twitter: {
      name: 'Twitter',
      logo: 'https://cdn-icons-png.flaticon.com/512/733/733579.png',
    },
    instagram: {
      name: 'Instagram',
      logo: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png',
    },
    linkedin: {
      name: 'LinkedIn',
      logo: 'https://cdn-icons-png.flaticon.com/512/174/174857.png',
    },
  };

  const toggleLink = (platform) => {
    setLinkedAccounts((prev) => ({
      ...prev,
      [platform]: !prev[platform],
    }));
  };

  return (
    <div className="connected-accounts-settings">
      <h2>Connected Accounts</h2>

      <section>
        <h4>Social Integrations</h4>
        <div className="social-integrations">
          {Object.entries(linkedAccounts).map(([platform, isLinked]) => (
            <div key={platform} className="integration-item">
              <div className="social-label">
                <img
                  src={platformDetails[platform].logo}
                  alt={platform}
                  className="social-icon"
                />
                <div>
                  <strong>{platformDetails[platform].name}</strong>
                  <p>
                    {isLinked
                      ? `Your ${platformDetails[platform].name} account is connected.`
                      : `Your ${platformDetails[platform].name} account is not connected.`}
                  </p>
                </div>
              </div>
              <button
                className={`action-btn ${isLinked ? 'unlink' : 'link'}`}
                onClick={() => toggleLink(platform)}
              >
                {isLinked ? 'Unlink' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ConnectedAccountsSettings;
