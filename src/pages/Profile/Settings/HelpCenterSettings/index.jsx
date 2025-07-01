import React from 'react';
import './HelpCenterSettings.css';
import { BookOpen, LifeBuoy, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const HelpCenterSettings = () => {
  return (
    <div className="help-center-settings">
      <h2>Help Center</h2>

      <div className="help-item">
        <BookOpen className="help-icon" />
        <div>
          <h4>FAQs</h4>
          <p>Find answers to the most frequently asked questions.</p>
          <Link to={'/help/faqs'} target="_blank" rel="noopener noreferrer">Go to FAQs</Link>
        </div>
      </div>

      <div className="help-item">
        <LifeBuoy className="help-icon" />
        <div>
          <h4>Tutorials</h4>
          <p>Learn how to use Zagasm features with step-by-step guides.</p>
          <Link to={''} target="_blank" rel="noopener noreferrer">View Tutorials</Link>
        </div>
      </div>

      <div className="help-item">
        <Mail className="help-icon" />
        <div>
          <h4>Email Support</h4>
          <p>Need more help? Reach out via email.</p>
          <a href="mailto:support@zagasm.com">support@zagasm.com</a>
        </div>
      </div>

      <div className="help-item">
        <Phone className="help-icon" />
        <div>
          <h4>Call Us</h4>
          <p>For urgent issues, speak directly to our support team.</p>
          <p><strong>+000 000 000 000</strong></p>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterSettings;
