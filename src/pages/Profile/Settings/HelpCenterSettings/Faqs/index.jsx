import React, { useState } from 'react';
import './HelpCenter.css';
import SideBarNav from '../../../../pageAssets/sideBarNav';
import { main } from '@popperjs/core';

const Faqs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How do I change my password?",
      answer: "Go to 'Password & Security' settings and click 'Change Password'."
    },
    {
      question: "How do I report a bug or issue?",
      answer: "Use the 'Report a Problem' option in the Help & Support section."
    },
    {
      question: "Can I recover a deleted post?",
      answer: "Deleted posts are permanently removed and cannot be recovered."
    },
    {
      question: "Where can I find the Privacy Policy?",
      answer: "You can find it at the bottom of the website or under the Help Center section."
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(prevIndex => (prevIndex === index ? null : index));
  };

  return (
    <div className="p-0 m-0">
      <div className="container-flui p-0 m-0">
        <div className="ro offset-xl-2 offset-lg-1 offset-md-1 bg-none">
          <main className="col col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 main_containe p-0 m-0 ">
            <div className="help-center">
              <h2>Help Center</h2>

              <section className="faq-section">
                <h4>FAQs</h4>
                {faqs.map((item, index) => (
                  <div key={index} className={`faq-item ${activeIndex === index ? 'active' : ''}`}>
                    <div className="faq-question" onClick={() => toggleAccordion(index)}>
                      {item.question}
                    </div>
                    {activeIndex === index && <div className="faq-answer">{item.answer}</div>}
                  </div>
                ))}
              </section>

              <section className="tutorial-section">
                <h4>Tutorials</h4>
                <ul>
                  <li><a href="#!">How to setup your account</a></li>
                  <li><a href="#!">Posting and sharing tips</a></li>
                  <li><a href="#!">Using privacy controls</a></li>
                </ul>
              </section>

              <section className="support-section">
                <h4>Need More Help?</h4>
                <p>Contact us at <a href="mailto:support@zagasm.com">support@zagasm.com</a> or visit our <a href="#!">Support Page</a>.</p>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>

  );
};

export default Faqs;
