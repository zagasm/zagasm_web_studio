import React from "react";
import { Link } from "react-router-dom";

/** Small, reusable download badge (Mac / Windows) */
function DownloadBadge({ platform = "Mac", href = "#", icon = "mac" }) {
  return (
    <a
      href={href}
      className="tw:inline-flex tw:items-center tw:gap-3 tw:bg-linear-to-br tw:from-primary tw:to-primarySecond tw:text-white tw:px-4 tw:md:px-8 tw:py-5 tw:rounded-xl tw:shadow-sm tw:ring-1 tw:ring-black/10 hover:tw:translate-y-[-1px] tw:transition tw:select-none"
    >
      <span className="tw:inline-flex tw:h-9 tw:w-12 tw:items-center tw:justify-center tw:bg-white/10 tw:rounded-lg">
        {icon === "mac" ? (
          /* Apple-ish glyph */
          <svg
            viewBox="0 0 24 24"
            className="tw:size-14 text-white"
            aria-hidden="true"
          >
            <path
              d="M18.7 15.2c-.3.7-.5 1-1 1.7-.6.9-1.4 1.9-2.4 1.9-.9 0-1.2-.6-2.3-.6s-1.4.6-2.3.6c-1 0-1.8-1-2.4-1.9-1.6-2.2-1.8-4.8-.8-6.2.7-1 1.8-1.6 2.8-1.6 1.1 0 1.8.6 2.7.6.9 0 1.5-.6 2.7-.6 1 .1 2 .6 2.7 1.6-.1.1-1.5.9-1.5 2.5 0 1.9 1.8 2.6 1.8 2.6z"
              fill="currentColor"
            />
            <path
              d="M13.9 4.1c.6-.7 1.6-1.2 2.5-1.2.1 1-.3 2-1 2.8-.7.8-1.6 1.3-2.5 1.2-.1-1 .3-2 1-2.8z"
              fill="currentColor"
            />
          </svg>
        ) : (
          /* Windows-ish glyph */
          <svg
            viewBox="0 0 24 24"
            className="tw:size-14 text-white"
            aria-hidden="true"
          >
            <path
              d="M3 5l8-1.5v8.1H3V5zm9 0l9-1.9v10h-9V5zM3 13.4h8V21L3 19.5v-6.1zm9 0h9V22.9L12 21v-7.6z"
              fill="currentColor"
            />
          </svg>
        )}
      </span>
      <span className="tw:text-left">
        <span className="tw:block tw:text-sm text-white">Download on</span>
        <span className="tw:block tw:text-2xl text-white tw:font-semibold">
          {platform}
        </span>
      </span>
    </a>
  );
}

/** Row of stacked “creator” avatars + copy */
const AVATARS = [
  { src: "https://i.pravatar.cc/64?img=5", alt: "Ada Lovelace" },
  { src: "https://i.pravatar.cc/64?img=12", alt: "Timileyin Oba" },
  { src: "https://i.pravatar.cc/64?img=28", alt: "Sofia Malik" },
  { src: "https://i.pravatar.cc/64?img=36", alt: "Kenji Yamada" },
  { src: "https://i.pravatar.cc/64?img=47", alt: "Elena Petrova" },
];

function Avatar({ src, alt }) {
  const [error, setError] = React.useState(false);

  if (error) {
    // Fallback: your old gradient dot
    return (
      <span
        className="tw:inline-block tw:h-8 tw:w-8 tw:rounded-full tw:ring-2 tw:ring-white tw:bg-linear-to-br tw:from-primary/20 tw:to-primary tw:shadow"
        aria-hidden="true"
        title={alt}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      title={alt}
      className="tw:inline-block tw:h-8 tw:w-8 tw:rounded-full tw:ring-2 tw:ring-white tw:shadow"
      style={{ objectFit: "cover" }}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}

function CreatorsStripe() {
  return (
    <div className="tw:flex tw:items-center tw:gap-3 tw:max-w-sm tw:mx-auto">
      {/* Stacked avatars */}
      <div className="tw:flex tw:-space-x-3">
        {AVATARS.map((u, i) => (
          <Avatar key={i} src={u.src} alt={u.alt} />
        ))}
      </div>
      <span className="tw:text-sm tw:text-gray-700">
        + 1436 Creators and maybe you ✌️
      </span>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="tw:relative tw:font-sans tw:min-h-screen tw:bg-white tw:text-gray-900 tw:overflow-hidden">
      {/* Top nav */}
      <div className="tw:relative tw:z-10 tw:max-w-7xl tw:mx-auto tw:px-4 md:tw:px-6 lg:tw:px-8 tw:py-5 tw:flex tw:items-center tw:justify-between">
        <Link to="/" className="tw:inline-flex tw:items-center tw:gap-3">
          <img
            src="/images/logo.png"
            alt="Zagasm Studio"
            className="tw:w-[150px]"
          />
        </Link>

        <Link
          to="/auth/signin"
          className="tw:inline-flex tw:items-center tw:gap-2 tw:bg-primary tw:hover:bg-primary/80 text-white tw:px-8 tw:py-3 tw:rounded-full tw:font-medium tw:shadow-sm hover:tw:shadow tw:transition-all tw:duration-300"
        >
          Get Started
        </Link>
      </div>

      {/* Soft gradient background */}
      <div
        aria-hidden="true"
        className="tw:absolute tw:inset-0 tw:bg-[radial-gradient(600px_300px_at_70%_0%,theme(colors.lightPurple/.65),transparent_60%)] tw:opacity-80"
      />
      <div
        aria-hidden="true"
        className="tw:absolute tw:inset-0 tw:bg-[radial-gradient(10000px_300px_at_70%_0%,theme(colors.lightPurple/.65),transparent_60%)] tw:opacity-80"
      />
      {/* Glow in bottom-left for depth */}
      <div
        aria-hidden="true"
        className="tw:pointer-events-none tw:absolute tw:-left-24 tw:-bottom-40 tw:h-112 tw:w-md tw:rounded-full tw:bg-primary/10 tw:blur-3xl"
      />

      {/* HERO */}
      <main className="tw:relative tw:z-10">
        <section className="tw:max-w-7xl tw:mx-auto tw:px-4 md:tw:px-6 lg:tw:px-8 tw:pt-4 md:tw:pt-8 lg:tw:pt-10 tw:pb-16 md:tw:pb-24">
          {/* FLEX CONTAINER (replaces grid) */}
          <div className="tw:flex tw:flex-col lg:tw:flex-row tw:items-center tw:gap-8 lg:tw:gap-10">
            {/* Left: copy (unchanged content) */}
            <div className="tw:max-w-7xl tw:mx-auto tw:flex-1 tw:w-full">
              {/* Download badges */}
              <div className="tw:flex flex-row tw:items-center tw:justify-center tw:gap-6 md:tw:gap-8">
                <DownloadBadge platform="Mac" icon="mac" />
                <DownloadBadge platform="Windows" icon="windows" />
              </div>

              {/* Creators stripe */}
              <div className="tw:mt-6 tw:flex tw:items-center tw:justify-center">
                <CreatorsStripe />
              </div>

              {/* Headline */}
              <div className=" tw:flex tw:flex-col tw:items-center tw:justify-center">
                <span className="tw:font-sans tw:mt-6 md:tw:mt-8 tw:leading-tight tw:tracking-tight tw:font-bold tw:text-4xl sm:tw:text-5xl lg:tw:text-6xl xl:tw:text-7xl tw:max-w-3xl tw:mx-auto text-center">
                  Turn Moments Into Global
                  <br className="tw:hidden tw:md:block" /> Experiences with
                  <br />
                  <span className="tw:text-primary tw:text-[4rem] sm:tw:text-[4.5rem] lg:tw:text-[4rem] xl:tw:text-[4.5rem] tw:leading-none tw:block tw:mt-1 tw:font-cursive tw:tracking-wide">
                    Zagasm Studio
                  </span>
                </span>

                {/* Subcopy */}
                <p className="tw:mt-8 tw:text-base sm:tw:text-lg tw:text-gray-700 tw:max-w-2xl tw:text-center">
                  Stream electrifying live events from anywhere — concerts,
                  shows, and exclusive sessions by your favorite artists.
                </p>

                {/* CTA group */}
                <div className="tw:mt-5 tw:flex tw:flex-wrap tw:items-center tw:gap-3">
                  <Link
                    to="/auth/signin"
                    className="tw:inline-flex tw:items-center tw:justify-center tw:rounded-full tw:bg-primary text-white tw:px-8 tw:md:px-10 tw:py-4 tw:md:py-4 tw:font-medium tw:shadow-sm hover:tw:shadow tw:transition"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/auth/signin"
                    className="tw:inline-flex tw:items-center tw:justify-center tw:rounded-full tw:px-8 tw:md:px-10 tw:py-4 tw:font-medium tw:bg-lightPurple tw:text-primary tw:ring-1 tw:ring-primary/10 hover:tw:ring-primary/20 tw:transition"
                  >
                    How it works
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: artwork (kept your updates; wrapped for responsive flex) */}
            <div className="tw:relative tw:flex-1 tw:w-full tw:flex tw:justify-center lg:tw:justify-end">
              <div
                style={{ width: 1000 }}
                className="tw:max-w-full sm:tw:max-w-3xl lg:tw:max-w-6xl tw:mx-auto lg:tw:mx-0 lg:tw:ml-64"
              >
                <img
                  src="/images/landingHero.png"
                  alt="Zagasm Studio preview"
                  className="tw:w-100 tw:ml-12 tw:md:ml-44 tw:lg:w-200"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
