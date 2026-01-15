import React from "react";

const appLinks = [
  {
    label: "App Store",
    note: "iPhone + iPad",
    url: "https://apps.apple.com/us/app/zagasm-studios/id6755035145",
    icon: "fa-apple",
  },
  {
    label: "Play Store",
    note: "Android",
    url: "https://play.google.com/store/apps/details?id=com.zagasmstudio.app",
    icon: "fa-google-play",
  },
];

const socialLinks = [
  {
    label: "Instagram",
    handle: "@zagasmstudios_hq",
    url: "https://www.instagram.com/zagasmstudios_hq",
    icon: "fa-instagram",
  },
  {
    label: "TikTok",
    handle: "@zagasmstudios_hq",
    url: "https://www.tiktok.com/@zagasmstudios_hq?_r=1&_t=ZS-935zRi7x5VQ",
    icon: "fa-tiktok",
  },
  {
    label: "YouTube",
    handle: "Zagasm Studios",
    url: "https://www.youtube.com/@zagasmstudios",
    icon: "fa-youtube",
  },
  {
    label: "X (Twitter)",
    handle: "@zagasmstudios_hq",
    url: "https://x.com/zagasmstudios?s=21",
    icon: "fa-x-twitter",
  },
  {
    label: "Facebook",
    handle: "Zagasm Studios",
    url: "https://www.facebook.com/share/1AU5fGrEDw/?mibextid=wwXIfr",
    icon: "fa-facebook-f",
  },
];

export default function SignalDeck() {
  return (
    <div
      className="tw:relative tw:min-h-screen tw:overflow-hidden tw:px-5 tw:py-20 tw:text-[#231f20] tw:md:px-10 tw:md:py-28"
      data-tw-reset
      style={{
        background:
          "radial-gradient(circle at 10% 20%, #efe6ff 0%, transparent 45%), radial-gradient(circle at 90% 15%, #f6e0ff 0%, transparent 38%), radial-gradient(circle at 40% 100%, #e3d6ff 0%, transparent 45%), #f8f4ff",
      }}
    >
      <div
        aria-hidden
        className="tw:pointer-events-none tw:absolute tw:inset-0 tw:opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.65) 1px, transparent 1px), radial-gradient(rgba(76,32,140,0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px, 48px 48px",
        }}
      />

      <div
        aria-hidden
        className="tw:absolute tw:-left-10 tw:top-16 tw:h-60 tw:w-60 tw:rounded-full tw:bg-[#c7a8ff]/45 tw:blur-3xl tw:animate-[signal-float_12s_ease-in-out_infinite] tw:motion-reduce:animate-none"
      />
      <div
        aria-hidden
        className="tw:absolute tw:right-[-60px] tw:top-28 tw:h-72 tw:w-72 tw:rounded-full tw:bg-[#8f07e7]/30 tw:blur-3xl tw:animate-[signal-float_12s_ease-in-out_infinite] tw:[animation-delay:-4s] tw:motion-reduce:animate-none"
      />
      <div
        aria-hidden
        className="tw:absolute tw:-bottom-10 tw:left-[30%] tw:h-64 tw:w-64 tw:rounded-full tw:bg-[#5b2cc6]/25 tw:blur-3xl tw:animate-[signal-float_12s_ease-in-out_infinite] tw:[animation-delay:-8s] tw:motion-reduce:animate-none"
      />

      <div className="tw:relative tw:z-10 tw:mx-auto tw:max-w-5xl">
        <div className="tw:mb-10 tw:grid tw:gap-4 tw:text-center">
          <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-4">
            <img
              src="/img/log.png"
              alt="Zagasm Studios logo"
              className="tw:h-14"
            />
            <span className="tw:text-sm tw:font-semibold tw:uppercase tw:tracking-[0.3em]">
              Zagasm Studios
            </span>
          </div>
          <span className="tw:text-2xl tw:font-dela tw:text-[clamp(2.6rem,4vw,4rem)] tw:font-bold tw:text-[#3b165f]">
            Signal Deck
          </span>
          <span className="tw:mx-auto tw:max-w-xl tw:text-lg tw:text-[#231f20]/80">
            A glow-up portal for everything Zagasm. Tap in for the app downloads
            and follow the studio everywhere we pulse.
          </span>
        </div>

        <section
          className="tw:grid tw:gap-4 tw:md:grid-cols-2"
          aria-label="Download the app"
        >
          {appLinks.map((app, index) => (
            <a
              key={app.label}
              className="tw:group tw:grid tw:grid-cols-[auto_1fr] tw:items-center tw:gap-4 tw:rounded-2xl tw:border tw:border-black/10 tw:bg-white/90 tw:px-5 tw:py-4 tw:text-[#231f20] tw:shadow-[0_22px_50px_rgba(35,31,32,0.12)] tw:transition tw:duration-300 tw:hover:-translate-y-1 tw:hover:shadow-[0_30px_60px_rgba(35,31,32,0.18)] tw:md:grid-cols-[auto_1fr_auto] tw:opacity-0 tw:translate-y-4 tw:animate-[signal-rise_0.7s_ease_forwards]"
              href={app.url}
              target="_blank"
              rel="noreferrer"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="tw:flex tw:h-12 tw:w-12 tw:items-center tw:justify-center tw:rounded-2xl tw:bg-[#efe3ff] tw:text-xl tw:text-[#7a32d8]">
                <i className={`fa-brands ${app.icon}`} aria-hidden />
              </div>
              <div>
                <div className="tw:text-base tw:font-semibold">
                  {app.label}
                </div>
                <div className="tw:text-sm tw:text-[#231f20]/60">
                  {app.note}
                </div>
              </div>
              <span className="tw:justify-self-start tw:rounded-full tw:bg-[#8f07e7] tw:px-4 tw:py-2 tw:text-sm tw:font-semibold tw:text-white tw:md:justify-self-end">
                Download
              </span>
            </a>
          ))}
        </section>

        <section className="tw:mt-8 tw:grid tw:gap-3" aria-label="Social links">
          {socialLinks.map((social, index) => (
            <a
              key={social.label}
              className="tw:group tw:grid tw:grid-cols-[auto_1fr] tw:items-center tw:gap-4 tw:rounded-2xl tw:border tw:border-black/10 tw:bg-white/90 tw:px-5 tw:py-4 tw:text-[#231f20] tw:transition tw:duration-300 tw:hover:-translate-y-1 tw:hover:border-[#8f07e7]/40 tw:md:grid-cols-[auto_1fr_auto] tw:opacity-0 tw:translate-y-4 tw:animate-[signal-rise_0.7s_ease_forwards]"
              href={social.url}
              target="_blank"
              rel="noreferrer"
              style={{ animationDelay: `${0.2 + index * 0.08}s` }}
            >
              <div className="tw:flex tw:h-11 tw:w-11 tw:items-center tw:justify-center tw:rounded-2xl tw:bg-[#f2e9ff] tw:text-lg tw:text-[#7a32d8]">
                <i className={`fa-brands ${social.icon}`} aria-hidden />
              </div>
              <div className="tw:grid tw:gap-1">
                <div className="tw:text-base tw:font-semibold">
                  {social.label}
                </div>
                <div className="tw:text-sm tw:text-[#231f20]/60">
                  {social.handle}
                </div>
              </div>
              <span className="tw:inline-flex tw:items-center tw:justify-self-start tw:gap-2 tw:font-semibold tw:text-[#7a32d8] tw:md:justify-self-end">
                Follow
                <i className="fa-solid fa-arrow-right" aria-hidden />
              </span>
            </a>
          ))}
        </section>

        <footer className="tw:mt-10 tw:text-center tw:font-medium tw:text-[#231f20]/70">
          <span>Stay close. The next drop lands here first.</span>
        </footer>
      </div>
    </div>
  );
}
