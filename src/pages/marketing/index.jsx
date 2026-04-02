import React, { useEffect } from "react";
import "./marketing.css";
// import googleLogo from "../../../assets/google-logo.png";

function Marketing() {
  // Floating emojis animation
  useEffect(() => {
    const hero = document.querySelector(".hero");
    const emojis = ["🎥", "🎙️", "✨", "🔥", "🎶", "📡", "💜"];

    for (let i = 0; i < 12; i++) {
      const span = document.createElement("span");
      span.className = "floating-emoji";
      span.innerText = emojis[Math.floor(Math.random() * emojis.length)];
      span.style.left = Math.random() * 100 + "vw";
      span.style.animationDuration = 5 + Math.random() * 5 + "s";
      hero.appendChild(span);
    }
  }, []);

  return (
    <div className="marketing-container">
      {/* Hero Section */}
      <section className="hero fade-in">
        <div className="hero-content">
          <h1>Zagasm Studios — Go Live. Sell Out. Grow.</h1>
          <p className="subheadline text-light">
            Host stunning live streams and ticketed events. Build your audience.
            Monetize your craft.
          </p>
          <span href="#download" style={{ cursor: "pointer" }} className="cta">
            Get Started — It’s Free
          </span>
          <div className="trust">
            <span>📱 Web, iOS & Android</span>
            <span>🎤 Built for Creators & Brands</span>
          </div>
        </div>
      </section>

      {/* Section 1 */}
      <section className="section slide-up">
        <h2>Why Creators Choose Zagasm Studios</h2>
        <ul>
          <li>
            All-in-One Platform: Go live, sell tickets, and engage fans — from a
            single dashboard.
          </li>
          <li>
            Seamless Ticketing: Create free or paid events, with smooth checkout
            and instant confirmations.
          </li>
          <li>
            Fan Community: Chat, reactions, and replays keep your audience
            active before, during, and after events.
          </li>
          <li>
            Powerful Analytics: Track attendance, watch time, revenue, and top
            fans in real time.
          </li>
        </ul>
        <span href="#download" className="cta">
          Create Your First Event
        </span>
      </section>

      {/* Section 2 */}
      <section className="section alt slide-up">
        <h2>Go Live in 3 Simple Steps</h2>
        <ol>
          <li>Sign Up: Create your studio profile and connect payouts.</li>
          <li>
            Set Up: Add your stream or venue details, pricing, and schedule.
          </li>
          <li>Go Live: Share your link, sell tickets, and engage your fans.</li>
        </ol>
        <span href="#download" className="cta">
          Launch Your Stream
        </span>
      </section>

      {/* Section 3 */}
      <section className="section slide-up">
        <h2>Built for Live Moments That Matter</h2>
        <p>
          Whether it’s a concert, masterclass, podcast, watch party, or worship
          night, Zagasm Studios gives you broadcast-grade tools without the
          broadcast-grade headache.
        </p>
        <p>
          Keep audiences captivated with crisp streams, interactive chat, and
          fan rewards — all branded as you.
        </p>
        <p>
          Turn every live session into momentum: sell tickets, merch, and
          memberships while you perform.
        </p>
        <span href="#download" className="cta">
          Start Creating
        </span>
      </section>

      {/* Section 4 */}
      <section className="section alt slide-up">
        <h2>Showcase Your Best Moments</h2>
        <p>
          Highlight top replays, clips, and fan-favorite sessions right on your
          profile. Feature a “Show of the Week” and celebrate your community.
        </p>
        <p>
          Elevate engagement with polls, shoutouts, and stage invites for VIP
          supporters.
        </p>
        <p>
          Your brand, your rules — custom banners, colors, and event covers that
          feel like you.
        </p>
        <span href="#download" className="cta">
          Build Your Studio
        </span>
      </section>

      {/* Section 5 */}
      <section className="section slide-up">
        <h2>What Makes Zagasm Studios Different?</h2>
        <ul>
          <li>
            Creator-First Monetization: Paid tickets, tips, memberships, and
            sponsor slots.
          </li>
          <li>
            Studio-Grade Tools: RTMP ingest, multi-scene layouts, backstage
            guest links, and rehearsal mode.
          </li>
          <li>
            Smart Distribution: Share to socials with deep links and QR codes
            that convert.
          </li>
          <li>
            Audience Intelligence: Understand what your fans love and how to
            grow faster.
          </li>
          <li>
            Reliable Performance: Low-latency streaming and global delivery for
            smooth experiences.
          </li>
        </ul>
        <span href="#download" className="cta">
          Try It Free
        </span>
      </section>

      {/* Section 6 */}
      <section className="section alt slide-up">
        <h2>What Creators Are Saying</h2>
        <blockquote>
          “Our live show sold out online. Ticketing and streaming were
          unbelievably smooth.” – @StageCraft
        </blockquote>
        <p>
          From indie artists to churches and brands, creators use Zagasm Studios
          to host, monetize, and grow.
        </p>
        <p>
          Share your wins on socials and bring your audience home to your studio
          hub.
        </p>
        <span href="#download" className="cta">
          Join the Creator Community
        </span>
      </section>

      {/* Section 7 */}
      <section id="download" className="section download slide-up">
        <h2>Ready to Go Live?</h2>
        <p>
          Create your studio, publish your first event, and start earning — all
          in minutes.
        </p>

        <div className="row">
          <div className="col-lg-6 col-12 offset-xl-3">
            <div className="text-center mt-3 border-botto pb-3 mb-3">
              <div className="row">
                <div className="col-6">
                  <button type="button" className="btn-sm api_btn btn-block">
                    <i className="fab fa-google-play mr-2"></i>
                    Android
                  </button>
                </div>
                <div className="col-6">
                  <button
                    type="button"
                    className="api_btn dark_apple_api_btn btn-block"
                  >
                    <i className="fab fa-apple mr-2"></i> Apple
                  </button>
                </div>
              </div>
              {/* If you want a web CTA too, add it here:
              <div className="mt-3">
                <a href="/studio" className="cta small">Open Studio on Web</a>
              </div>
              */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Marketing;
