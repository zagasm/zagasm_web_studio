import React, { useState } from "react";
import "./support.css";

function Support() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "I can’t log in to my account. What should I do?",
      answer: [
        "Make sure your internet connection is stable.",
        "Update the app to the latest version from your app store.",
        "If you use social login, confirm the correct account is selected.",
        "If the problem persists, contact us at support@zagasm.com.",
      ],
    },
    {
      question: "How do I create a live event or go live?",
      answer: [
        "Tap Create Event on the Home or Profile tab.",
        "Add a title, description, date/time, and a cover image.",
        "Choose Live now (instant) or Schedule for later.",
        "If using an external encoder, copy your RTMP server and Stream Key from the event setup screen.",
      ],
    },
    {
      question: "How do viewers join or watch an event?",
      answer: [
        "Open the event page and tap Join Stream when it’s live.",
        "If the event is scheduled, tap Remind Me to get notified when it starts.",
        "For private or ticketed events, make sure you have access or a valid ticket.",
      ],
    },
    {
      question: "Why am I not seeing new or upcoming events?",
      answer: [
        "Pull down to refresh your feed or the Events tab.",
        "Check your filters (e.g., category, location, ‘live now’ only).",
        "Follow more organizers to see their events on your Home feed.",
        "Ensure you’re online and not in Data Saver mode.",
      ],
    },
    {
      question: "My stream is buffering or low quality. How can I fix it?",
      answer: [
        "Switch to a stronger Wi-Fi or stable 4G/5G network.",
        "Close other apps that might be using bandwidth.",
        "Reduce the playback quality from the player settings.",
        "Creators: stream at a stable bitrate and avoid frequent network switches.",
      ],
    },
    {
      question: "Can I upload posters or schedule events in advance?",
      answer: [
        "Yes. During Create Event, add a poster/thumbnail and set a future date/time.",
        "Use the Share button to promote your event link on social media.",
        "Tap Remind Me to notify your followers before you go live.",
      ],
    },
    {
      question: "How do I report inappropriate content or a stream?",
      answer: [
        "Tap the ⋮ (more) icon on the event or stream.",
        "Select Report and choose a reason.",
        "Optionally add details—this helps our team review faster.",
      ],
    },
    {
      question: "Can I collaborate or add co-hosts to my event?",
      answer: [
        "Yes, on the event setup screen, add co-hosts or moderators (if enabled for your account).",
        "Co-hosts can help manage chat and, if granted, share the stage.",
      ],
    },
    {
      question: "Are replays available after the live ends?",
      answer: [
        "Creators can enable Replay during event setup.",
        "If enabled, the stream is available on the event page after it ends.",
        "Some events (e.g., premium) may limit or disable replays.",
      ],
    },
    {
      question: "I bought a ticket but can’t enter the event.",
      answer: [
        "Make sure you’re logged into the same account used for purchase.",
        "From the event page, tap Access Ticket to link your purchase.",
        "If you still can’t join, contact support@zagasm.com with your payment reference.",
      ],
    },
    {
      question: "I’m not getting notifications for events I follow.",
      answer: [
        "Check that notifications are enabled in device Settings and in-app Settings > Notifications.",
        "Tap Remind Me on event pages for a start-time alert.",
        "Following organizers increases the chance you’ll see their events on your feed.",
      ],
    },
    {
      question: "How do I delete or edit my scheduled event?",
      answer: [
        "Go to Profile > My Events.",
        "Open the scheduled event and tap Edit to update details or Delete to cancel.",
        "Attendees who set reminders will be notified of major changes.",
      ],
    },
  ];

  return (
    <div className="support-container">
      <div className="support-header">
        <h1>Zagasm Studios Support</h1>
        <p>
          🎉 Welcome to the Zagasm Studios Support Center 🎉 <br />
          We’re here to make sure your laughter never stops!
        </p>
      </div>

      <section className="faq-section">
        <h2>Frequently Asked Questions (FAQ)</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openFAQ === index ? "open" : ""}`}
            >
              <button className="faq-question" onClick={() => toggleFAQ(index)}>
                {faq.question}
                <span className="arrow">{openFAQ === index ? "−" : "+"}</span>
              </button>
              {openFAQ === index && (
                <div className="faq-answer">
                  <ul>
                    {faq.answer.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="contact-section">
        <h2>Contact Us</h2>
        <p>Still need help? We’d love to hear from you 💌</p>
        <ul>
          <li>
            📧 Email: <a href="mailto:support@zagasm.com">support@zagasm.com</a>
          </li>
          <li>
            🌐 Website:{" "}
            <a
              href="https://www.studios.zagasm.com"
              target="_blank"
              rel="noreferrer"
            >
              www.studios.zagasm.com
            </a>
          </li>
          <li>
            📱 Twitter / Instagram / TikTok: <b>@zagasmapp</b>
          </li>
        </ul>
      </section>

      <section className="guidelines-section">
        <h2>Community Guidelines</h2>
        <p>To keep Zagasm fun for everyone, please avoid:</p>
        <ul>
          <li>Posting hateful or harmful content.</li>
          <li>Sharing copyrighted memes without permission.</li>
          <li>Spamming or harassing other users.</li>
        </ul>
      </section>

      <section className="feedback-section">
        <h2>Feedback</h2>
        <p>
          Your feedback helps us improve! If you have suggestions for new
          features, memes, or improvements, reach us anytime via the app under{" "}
          <b>Settings &gt; Feedback</b>.
        </p>
        <p className="footer">✨ Keep laughing, keep zagging! ✨</p>
      </section>
    </div>
  );
}

export default Support;
