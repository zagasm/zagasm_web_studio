import React, { useState } from 'react';
import './ReportAndPolicies.css';

const ReportAndPolicies = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: Replace with API integration
    console.log('Problem reported:', formData);

    setSubmitted(true);
    setTimeout(() => {
      setFormData({ subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="report-container">
      <h2>Report a Problem</h2>
      <form onSubmit={handleSubmit} className="report-form">
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Briefly describe your issue"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Details</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us more about the problem you're facing"
            required
          ></textarea>
        </div>

        <div className="w-100 d-flex justify-content-end">
          <button type="submit" className="submit-btn ">
            Submit Report
          </button>
        </div>
        {submitted && <p className="success-msg">Thank you! Your report has been submitted.</p>}
      </form>

      <div className="policy-links">
        <h4>Terms & Policies</h4>
        <ul>
          <li><a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a></li>
          <li><a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
          <li><a href="/community-guidelines" target="_blank" rel="noopener noreferrer">Community Guidelines</a></li>
        </ul>
      </div>
    </div>
  );
};

export default ReportAndPolicies;
