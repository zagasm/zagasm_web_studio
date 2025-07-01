import React, { useState, useEffect } from 'react';
import './AccountSettings.css';
import {
  User,
  Lock,
  Bell,
  Shield,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Ban, // ✅ Use this instead of Block
//   Mail,
//   Paintbrush,
  Accessibility,
  Database,
  Download,
  Link,
  Plug,
  HelpCircle,
  AlertOctagon
} from 'lucide-react';


import EditProfileForm from './EditProfile';
import PrivacySettings from './Privacy';
import PasswordSecurity from './PasswordSecurity';
import NotificationSettings from './Notification';
import DisplayContentSettings from './DisplayContentSettings';
import DataStorageSettings from './DataStorageSettings';
import ConnectedAccountsSettings from './ConnectedAccountsSettings';
import HelpCenterSettings from './HelpCenterSettings';
import ReportAndPolicies from './ReportAndPolicies';
import { useAuth } from '../../auth/AuthContext';

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
const { user, logout } = useAuth();
  const settingsSections = [
    {
      heading: 'Account',
      items: [
        { key: 'profile', icon: <User size={18} />, label: 'Edit Profile' },
        { key: 'security', icon: <Lock size={18} />, label: 'Password & Security' },
      ],
    },
    {
      heading: 'Privacy and Safety',
      items: [
        { key: 'privacy', icon: <Shield size={18} />, label: 'Privacy Settings' },

      ],
    },
    {
      heading: 'Notifications',
      items: [
        { key: 'notifications', icon: <Bell size={18} />, label: 'Push Notifications' },
      ],
    },
    {
      heading: 'Display & Content',
      items: [
        // { key: 'theme', icon: <Paintbrush size={18} />, label: 'Theme & Appearance' },
        { key: 'accessibility', icon: <Accessibility size={18} />, label: 'Accessibility' },
      ],
    },
    {
      heading: 'Data & Storage',
      items: [
        { key: 'cache', icon: <Database size={18} />, label: 'Cache & Storage' },
      ],
    },
    {
      heading: 'Integrations',
      items: [
        { key: 'connected_accounts', icon: <Link size={18} />, label: 'Connected Accounts' },
        // { key: 'third_party', icon: <Plug size={18} />, label: 'Third-party Apps' },
      ],
    },
    {
      heading: 'Help & Support',
      items: [
        { key: 'help', icon: <HelpCircle size={18} />, label: 'Help Center' },
        { key: 'report', icon: <AlertOctagon size={18} />, label: 'Report a Problem' },
      ],
    },
  ];

  const renderTab = () => {
    switch (activeTab) {
      case 'profile':
        return <EditProfileForm />;
      case 'security':
        return <PasswordSecurity />;
      case 'privacy':
        return <PrivacySettings />;
      case 'notifications':
        return <NotificationSettings></NotificationSettings>;
      case 'accessibility':
        return <DisplayContentSettings/>;
      case 'cache':
        return <DataStorageSettings/>;
      case 'connected_accounts':
        return <ConnectedAccountsSettings/>;
    //   case 'third_party':
    //     return <div className="setting-content">Third-Party App Permissions</div>;
      case 'help':
        return <HelpCenterSettings/>;
      case 'report':
        return <ReportAndPolicies/>;
      default:
        return <div className="setting-content">Select a setting</div>;
    }
  };

  useEffect(() => {
    setShowMobileSidebar(false);
  }, [activeTab]);

  return (
    <div className="p-0 m-0">
      <div className="container-flui p-0 m-0">
        <div className="ro offset-xl-2 offset-lg-1 offset-md-1 bg-none">
          <main className="col col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 main_containe p-0 m-0 ">
          
           <div className='bg-light w-100 container ' style={{height:'30px'}}>
             <button className="mobile-menu-btn d-block d-md-none" onClick={() => setShowMobileSidebar(true)}>
              <Menu size={20} /> 
            </button>
           </div>

            <div className="account-settings-container">
              <div className="settings-sidebar d-none d-md-block">
                <h2>Settings</h2>
                {settingsSections.map((section, i) => (
                  <div key={i} className="settings-section">
                    <h5 className="settings-heading">{section.heading}</h5>
                    <ul className="settings-list">
                      {section.items.map(({ key, icon, label }) => (
                        <li
                          key={key}
                          className={activeTab === key ? 'active' : ''}
                          onClick={() => setActiveTab(key)}
                        >
                          {icon} <span>{label}</span>
                          <ChevronRight className="arrow-icon" />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
               <div onClick={() => logout()}  className="logout-wrapper" style={{cursor:'pointer'}}>
              <li className="logout">
                <LogOut /> <span>Logout</span>
              </li>
            </div>
              </div>

              <div className="settings-content" >{renderTab()}</div>
            </div>
          </main>
        </div>
      </div>

      {showMobileSidebar && (
        <div className="mobile-sidebar-overlay">
          <div className="mobile-sidebar">
            <div className="mobile-sidebar-header">
              <h2>Settings</h2>
              <X className="close-icon" onClick={() => setShowMobileSidebar(false)} />
            </div>
            {settingsSections.map((section, i) => (
              <div key={i} className="settings-section">
                <h5 className="settings-heading">{section.heading}</h5>
                <ul className="settings-list">
                  {section.items.map(({ key, icon, label }) => (
                    <li
                      key={key}
                      className={activeTab === key ? 'active' : ''}
                      onClick={() => setActiveTab(key)}
                    >
                      {icon} <span>{label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div onClick={() => logout()}  className="logout-wrapper" style={{cursor:'pointer'}}>
              <li className="logout">
                <LogOut /> <span>Logout</span>
              </li>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
