import React from "react";

export default function CommunityGuidelinesPage() {
  return (
    <div className="tw:min-h-screen tw:bg-[#f5f5f7] tw:px-4 tw:py-10 tw:text-slate-800">
      <div className="tw:mx-auto tw:max-w-6xl">
        {/* Hero / header */}
        <div className="tw:mb-6">
          <div className="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-lightPurple tw:px-3 tw:py-1 tw:text-[12px] tw:font-medium tw:text-primary">
            <span className="tw:inline-block tw:h-2 tw:w-2 tw:rounded-full tw:bg-primary" />
            <span>Zagasm Studio App · Community</span>
          </div>

          <div className="tw:mt-4 tw:flex tw:flex-col tw:gap-2">
            <span className="tw:text-3xl tw:md:text-4xl tw:font-semibold tw:text-slate-900 tw:block">
              Community Guidelines for Zagasm Studio App
            </span>

            <span className="tw:text-sm tw:md:text-base tw:text-slate-600 tw:block tw:max-w-2xl">
              These Community Guidelines explain how we keep the Zagasm Studio
              App safe, fair, and respectful for creators, collaborators, and
              viewers across the platform.
            </span>
          </div>

          <div className="tw:mt-4 tw:flex tw:flex-wrap tw:items-center tw:gap-3 tw:text-xs tw:md:text-sm tw:text-slate-600">
            <span className="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-white tw:px-3 tw:py-1 tw:shadow-sm tw:border tw:border-slate-200">
              <span className="tw:h-2 tw:w-2 tw:rounded-full tw:bg-emerald-500" />
              <span>
                Effective: <strong>November 6, 2025</strong>
              </span>
            </span>
            <span className="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-white tw:px-3 tw:py-1 tw:shadow-sm tw:border tw:border-slate-200">
              <span>Company:</span>
              <strong>Zagasm Inc.</strong>
            </span>
            <span className="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-white tw:px-3 tw:py-1 tw:shadow-sm tw:border tw:border-slate-200">
              <span>Jurisdiction:</span>
              <strong>Federal Republic of Nigeria</strong>
            </span>
          </div>

          <div className="tw:mt-2 tw:text-xs tw:md:text-sm tw:text-slate-500">
            <span className="tw:block">
              Contact:{" "}
              <a
                href="mailto:support@zagasm.com"
                className="tw:font-medium tw:text-primary tw:underline-offset-4 hover:tw:underline"
              >
                support@zagasm.com
              </a>
            </span>
            <span className="tw:block">
              Address:{" "}
              <span className="tw:font-medium">
                16192 Coastal Highway Lewes, Delaware 19958 Sussex County United
                States
              </span>
            </span>
          </div>
        </div>

        {/* Layout: sidebar + main */}
        <div className="tw:grid tw:grid-cols-1 tw:lg:grid-cols-[260px,minmax(0,1fr)] tw:gap-8 tw:mt-6">
          {/* Sidebar */}
          <aside className="tw:sticky tw:top-6 tw:h-fit tw:hidden tw:lg:block">
            <div className="tw:rounded-2xl tw:bg-white tw:p-4 tw:border tw:border-slate-200 tw:shadow-sm">
              <span className="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wide tw:text-slate-500 tw:block">
                On this page
              </span>
              <nav className="tw:mt-3 tw:space-y-1 tw:text-sm">
                {[
                  { id: "intro", label: "Overview" },
                  { id: "principles", label: "Foundational Principles" },
                  { id: "rule-1", label: "1. Adult Sexual Content" },
                  { id: "rule-2", label: "2. Illegal & Dangerous Acts" },
                  { id: "rule-3", label: "3. Harassment & Hate Speech" },
                  { id: "rule-4", label: "4. Violence & Graphic Media" },
                  { id: "rule-5", label: "5. Child Safety" },
                  { id: "rule-6", label: "6. Intellectual Property" },
                  { id: "rule-7", label: "7. Spam & Platform Integrity" },
                  { id: "rule-8", label: "8. Events & Monetization" },
                  { id: "rule-9", label: "9. Privacy & Data Stewardship" },
                  { id: "rule-10", label: "10. Enforcement & Appeals" },
                  { id: "reporting", label: "Reporting & Community Vigilance" },
                  { id: "support", label: "Supplementary Guidance" },
                  { id: "faqs", label: "FAQs" },
                  { id: "legal", label: "Legal Framework" },
                ].map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="tw:flex tw:items-center tw:justify-between tw:rounded-lg tw:px-2 tw:py-1.5 tw:text-slate-600 hover:tw:bg-slate-50 hover:tw:text-slate-900"
                  >
                    <span>{item.label}</span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main>
            <div className="tw:rounded-3xl tw:bg-white tw:p-5 tw:md:p-8 tw:border tw:border-slate-200 tw:shadow-[0_20px_60px_rgba(15,23,42,0.08)] tw:space-y-10">
              {/* Intro */}
              <div
                id="intro"
                className="tw:space-y-4 tw:text-sm tw:md:text-base tw:text-slate-700"
              >
                <span className="tw:block">
                  Welcome to the Community Guidelines for the Zagasm Studio App.
                  The Studio App is a hub for creators, filmmakers, educators,
                  brands, and teams to produce videos, host live sessions,
                  manage projects, and monetize their work. These Guidelines set
                  the rules for keeping that space supportive, inclusive, and
                  secure.
                </span>

                <span className="tw:block">
                  The Guidelines apply to everyone using the App: creators,
                  viewers, moderators, partners, and collaborators. By using the
                  Service, you agree to follow these expectations, which are
                  designed to balance freedom of expression with responsibility.
                  They are informed by global best practices and align with
                  regulations such as NDPR, GDPR, COPPA, and the DMCA where
                  applicable.
                </span>

                <span className="tw:block">
                  Our enforcement approach is proportional. Minor issues may
                  lead to guidance or content edits. Serious or repeated
                  violations can result in content removal, loss of specific
                  features (like streaming), account suspension, or permanent
                  bans. In high-risk cases, we may hold payouts and cooperate
                  with authorities as outlined in our Terms of Service.
                </span>

                <span className="tw:block">
                  These Guidelines are reviewed regularly by our Community
                  Standards Team. We update them when needed and provide
                  prominent notice for substantive changes. Your continued use
                  of the App after an update means you accept the revised
                  version.
                </span>
              </div>

              {/* Principles */}
              <div
                id="principles"
                className="tw:pt-8 tw:border-t tw:border-slate-100 tw:space-y-4 tw:text-sm tw:md:text-base tw:text-slate-700"
              >
                <span className="tw:block tw:text-xl tw:md:text-2xl tw:font-semibold tw:text-slate-900">
                  Foundational Principles of Our Community
                </span>

                <span className="tw:block">
                  Our community is built around four core principles that should
                  guide every interaction on the Zagasm Studio App:
                </span>

                <ul className="tw:list-disc tw:pl-5 tw:space-y-2">
                  <li>
                    <span>
                      <strong>Respect for all:</strong> Treat everyone with
                      dignity and acknowledge the diverse backgrounds and
                      perspectives that make the platform stronger.
                    </span>
                  </li>
                  <li>
                    <span>
                      <strong>Integrity in action:</strong> Be honest in how you
                      represent yourself, your work, and your collaborations.
                    </span>
                  </li>
                  <li>
                    <span>
                      <strong>Safety above all:</strong> Avoid behavior that
                      could cause physical, emotional, or digital harm.
                    </span>
                  </li>
                  <li>
                    <span>
                      <strong>Unleashed creativity:</strong> Express yourself
                      boldly while respecting the boundaries that keep others
                      safe and empowered.
                    </span>
                  </li>
                </ul>

                <span className="tw:block">
                  These principles are baked into our moderation processes,
                  internal training, and user education. We expect everyone on
                  the platform to reflect them in their day-to-day use.
                </span>
              </div>

              {/* Rule 1 */}
              <div
                id="rule-1"
                className="tw:pt-8 tw:border-t tw:border-slate-100"
              >
                <div className="tw:rounded-2xl tw:border tw:border-red-200 tw:bg-red-50 tw:px-4 tw:py-4 tw:md:px-5 tw:md:py-5 tw:space-y-3">
                  <span className="tw:inline-flex tw:items-center tw:gap-2 tw:text-[11px] tw:font-semibold tw:uppercase tw:tracking-wide tw:text-red-600">
                    <span className="tw:h-1.5 tw:w-1.5 tw:rounded-full tw:bg-red-500" />
                    <span>Rule 1 · Adult sexual content</span>
                  </span>

                  <span className="tw:block tw:text-base tw:md:text-lg tw:font-semibold tw:text-slate-900">
                    Absolute prohibition on adult sexual content
                  </span>

                  <span className="tw:block tw:text-sm tw:md:text-base tw:text-slate-700">
                    To keep the Studio App family-friendly and suitable for
                    professional use, we enforce a full ban on adult sexual
                    content. This protects minors, supports brand safety, and
                    aligns with global content standards.
                  </span>

                  <ul className="tw:list-disc tw:pl-5 tw:space-y-2 tw:text-sm tw:md:text-base tw:text-slate-700">
                    <li>
                      <span>
                        <strong>
                          Exclusion of pornography and explicit acts:
                        </strong>{" "}
                        Any depiction of nudity, sexual intercourse, erotic
                        focus, or intimate physical contact is not allowed. This
                        includes live streams, uploads, animations, text-only
                        content, or lingering suggestive shots with no genuine
                        educational or artistic context.
                      </span>
                    </li>
                    <li>
                      <span>
                        <strong>
                          Ban on fetishistic or adult-service content:
                        </strong>{" "}
                        Content that promotes or advertises fetishes, escort
                        services, sexual transactions, or sexual role-play
                        scenarios is forbidden. External links to such material
                        are also prohibited.
                      </span>
                    </li>
                    <li>
                      <span>
                        <strong>Non-negotiable safeguard for minors:</strong>{" "}
                        Any sexualization of minors, suggestions involving
                        minors, or characters who appear underage is an absolute
                        red line. Such content triggers immediate removal and
                        reporting to relevant child protection authorities.
                      </span>
                    </li>
                  </ul>

                  <span className="tw:block tw:text-xs tw:md:text-sm tw:text-slate-600">
                    <em>Enforcement and support:</em> Violations can lead to
                    instant content takedown, account review, and permanent
                    bans. Creators working with sensitive themes are encouraged
                    to consult moderation ahead of publishing.
                  </span>
                </div>
              </div>

              {/* Rule 2 */}
              <div
                id="rule-2"
                className="tw:pt-8 tw:border-t tw:border-slate-100"
              >
                <div className="tw:rounded-2xl tw:border tw:border-red-200 tw:bg-red-50 tw:px-4 tw:py-4 tw:md:px-5 tw:md:py-5 tw:space-y-3">
                  <span className="tw:inline-flex tw:items-center tw:gap-2 tw:text-[11px] tw:font-semibold tw:uppercase tw:tracking-wide tw:text-red-600">
                    <span className="tw:h-1.5 tw:w-1.5 tw:rounded-full tw:bg-red-500" />
                    <span>Rule 2 · Illegal and dangerous activities</span>
                  </span>

                  <span className="tw:block tw:text-base tw:md:text-lg tw:font-semibold tw:text-slate-900">
                    Strict ban on illegal and dangerous activities
                  </span>

                  <span className="tw:block tw:text-sm tw:md:text-base tw:text-slate-700">
                    The Studio App cannot be used to promote, glamorize, or
                    instruct on crime or behavior that is likely to cause harm.
                  </span>

                  <ul className="tw:list-disc tw:pl-5 tw:space-y-2 tw:text-sm tw:md:text-base tw:text-slate-700">
                    <li>
                      <span>
                        <strong>Criminal enterprises:</strong> No content
                        endorsing or explaining how to engage in activities like
                        drug production, human trafficking, scams, fraud,
                        unauthorized hacking, or counterfeiting. Step-by-step
                        “tutorial” formats are especially prohibited.
                      </span>
                    </li>
                    <li>
                      <span>
                        <strong>Harm-inducing guidance:</strong> Content that
                        teaches or glorifies self-harm, eating disorders,
                        dangerous stunts, interpersonal violence, or incitement
                        to riot is not allowed.
                      </span>
                    </li>
                    <li>
                      <span>
                        <strong>Weapons and contraband:</strong> No sales,
                        demonstrations, or instructions for illegal weapons,
                        explosives, or narcotics. Limited educational or
                        historical context must be clearly framed and non-
                        instructional.
                      </span>
                    </li>
                  </ul>

                  <span className="tw:block tw:text-xs tw:md:text-sm tw:text-slate-600">
                    <em>Rationale:</em> This policy protects users and ensures
                    we can work responsibly with law enforcement and regulators
                    when needed.
                  </span>
                </div>
              </div>

              {/* Rule 3 */}
              <div
                id="rule-3"
                className="tw:pt-8 tw:border-t tw:border-slate-100"
              >
                <div className="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:px-4 tw:py-4 tw:md:px-5 tw:md:py-5 tw:space-y-3">
                  <span className="tw:inline-flex tw:items-center tw:gap-2 tw:text-[11px] tw:font-semibold tw:uppercase tw:tracking-wide tw:text-slate-700">
                    <span className="tw:h-1.5 tw:w-1.5 tw:rounded-full tw:bg-slate-500" />
                    <span>Rule 3 · Harassment, bullying, hate speech</span>
                  </span>

                  <span className="tw:block tw:text-base tw:md:text-lg tw:font-semibold tw:text-slate-900">
                    Zero tolerance for harassment, bullying, and hate speech
                  </span>

                  <span className="tw:block tw:text-sm tw:md:text-base tw:text-slate-700">
                    Collaboration cannot thrive in a hostile environment. We act
                    against behavior that targets people instead of ideas.
                  </span>

                  <ul className="tw:list-disc tw:pl-5 tw:space-y-2 tw:text-sm tw:md:text-base tw:text-slate-700">
                    <li>
                      <span>
                        <strong>Bullying and abuse:</strong> Repeated insults,
                        threats, doxxing, coordinated harassment campaigns, or
                        subtle forms of gaslighting and exclusion are not
                        allowed.
                      </span>
                    </li>
                    <li>
                      <span>
                        <strong>Hate speech:</strong> Content that attacks or
                        degrades people based on protected characteristics such
                        as race, ethnicity, nationality, religion, gender,
                        sexual orientation, disability, or similar traits is
                        prohibited.
                      </span>
                    </li>
                    <li>
                      <span>
                        <strong>Constructive engagement:</strong> Debate should
                        be idea-focused and respectful. Tools like block and
                        mute exist to help manage friction.
                      </span>
                    </li>
                  </ul>

                  <span className="tw:block tw:text-xs tw:md:text-sm tw:text-slate-600">
                    <em>Context:</em> Moderation decisions consider context, but
                    repeat or serious offenders may lose access faster to
                    protect others.
                  </span>
                </div>
              </div>

              {/* Rule 4 */}
              <div
                id="rule-4"
                className="tw:pt-8 tw:border-t tw:border-slate-100"
              >
                <div className="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:px-4 tw:py-4 tw:md:px-5 tw:md:py-5 tw:space-y-3">
                  <span className="tw:inline-flex tw:items-center tw:gap-2 tw:text-[11px] tw:font-semibold tw:uppercase tw:tracking-wide tw:text-slate-700">
                    <span className="tw:h-1.5 tw:w-1.5 tw:rounded-full tw:bg-slate-500" />
                    <span>Rule 4 · Violence and graphic content</span>
                  </span>

                  <span className="tw:block tw:text-base tw:md:text-lg tw:font-semibold tw:text-slate-900">
                    Thoughtful restrictions on violence and graphic imagery
                  </span>

                  <span className="tw:block tw:text-sm tw:md:text-base tw:text-slate-700">
                    Storytelling may involve conflict and difficult topics, but
                    we limit graphic details to avoid trauma and
                    desensitization.
                  </span>

                  <ul className="tw:list-disc tw:pl-5 tw:space-y-2 tw:text-sm tw:md:text-base tw:text-slate-700">
                    <li>
                      <span>
                        <strong>Gratuitous gore:</strong> Detailed depictions of
                        extreme violence, dismemberment, or animal cruelty are
                        not allowed.
                      </span>
                    </li>
                    <li>
                      <span>
                        <strong>Contextual exceptions:</strong> Limited use in
                        news, education, or documentary content may be
                        permitted, with clear warnings and non-sensational
                        framing.
                      </span>
                    </li>
                    <li>
                      <span>
                        <strong>Impact review:</strong> Content likely to
                        distress general audiences is reviewed carefully before
                        any allowance.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Rule 5 */}
              <div
                id="rule-5"
                className="tw:pt-8 tw:border-t tw:border-slate-100"
              >
                <div className="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:px-4 tw:py-4 tw:md:px-5 tw:md:py-5 tw:space-y-3">
                  <span className="tw:inline-flex tw:items-center tw:gap-2 tw:text-[11px] tw:font-semibold tw:uppercase tw:tracking-wide tw:text-slate-700">
                    <span className="tw:h-1.5 tw:w-1.5 tw:rounded-full tw:bg-slate-500" />
                    <span>Rule 5 · Child safety and protection</span>
                  </span>

                  <span className="tw:block tw:text-base tw:md:text-lg tw:font-semibold tw:text-slate-900">
                    Unwavering commitment to child safety
                  </span>

                  <span className="tw:block tw:text-sm tw:md:text-base tw:text-slate-700">
                    The Studio App is built for adults, but we still treat any
                    involvement of minors with the highest caution.
                  </span>

                  <ul className="tw:list-disc tw:pl-5 tw:space-y-2 tw:text-sm tw:md:text-base tw:text-slate-700">
                    <li>
                      <span>
                        <strong>No endangerment:</strong> Content that exposes
                        minors to physical, emotional, or reputational harm is
                        not allowed.
                      </span>
                    </li>
                    <li>
                      <span>
                        <strong>Consent and law:</strong> Where minors appear in
                        content, proper parental or guardian authorization and
                        compliance with local child protection laws are
                        required.
                      </span>
                    </li>
                    <li>
                      <span>
                        <strong>Escalation:</strong> Suspected abuse or
                        exploitation is escalated to the appropriate authorities
                        and may result in immediate account action.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Rule 6 */}
              <div
                id="rule-6"
                className="tw:pt-8 tw:border-t tw:border-slate-100"
              >
                <div className="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:px-4 tw:py-4 tw:md:px-5 tw:md:py-5 tw:space-y-3">
                  <span className="tw:inline-flex tw:items-center tw:gap-2 tw:text-[11px] tw:font-semibold tw:uppercase tw:tracking-wide tw:text-slate-700">
                    <span className="tw:h-1.5 tw:w-1.5 tw:rounded-full tw:bg-slate-500" />
                    <span>Rule 6 · Intellectual property</span>
                  </span>

                  <span className="tw:block tw:text-base tw:md:text-lg tw:font-semibold tw:text-slate-900">
                    Rigorous standards for intellectual property respect
                  </span>

                  <span className="tw:block tw:text-sm tw:md:text-base tw:text-slate-700">
                    Use only content you own or are authorized to use. Respect
                    other creators in the same way you want to be respected.
                  </span>

                  <ul className="tw:list-disc tw:pl-5 tw:space-y-2 tw:text-sm tw:md:text-base tw:text-slate-700">
                    <li>
                      <span>
                        <strong>Authorized works only:</strong> Upload original
                        content or material you have clear rights to use (for
                        example, properly licensed stock media).
                      </span>
                    </li>
                    <li>
                      <span>
                        <strong>Infringement handling:</strong> We respond to
                        valid takedown notices and may act against repeat
                        infringers, up to and including account termination.
                      </span>
                    </li>
                    <li>
                      <span>
                        <strong>Good practice:</strong> Provide clear credit
                        where appropriate and use written agreements when
                        collaborating.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Rule 7 */}
              <div
                id="rule-7"
                className="tw:pt-8 tw:border-t tw:border-slate-100"
              >
                <div className="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:px-4 tw:py-4 tw:md:px-5 tw:md:py-5 tw:space-y-3">
                  <span className="tw:inline-flex tw:items-center tw:gap-2 tw:text-[11px] tw:font-semibold tw:uppercase tw:tracking-wide tw:text-slate-700">
                    <span className="tw:h-1.5 tw:w-1.5 tw:rounded-full tw:bg-slate-500" />
                    <span>Rule 7 · Platform integrity and anti-spam</span>
                  </span>

                  <span className="tw:block tw:text-base tw:md:text-lg tw:font-semibold tw:text-slate-900">
                    Safeguards for platform integrity and anti-spam measures
                  </span>

                  <span className="tw:block tw:text-sm tw:md:text-base tw:text-slate-700">
                    Trust on the platform depends on authentic behavior and
                    honest communication.
                  </span>

                  <ul className="tw:list-disc tw:pl-5 tw:space-y-2 tw:text-sm tw:md:text-base tw:text-slate-700">
                    <li>
                      <span>
                        <strong>Fraud and deception:</strong> Impersonation,
                        fake promotions, and misleading event or product claims
                        are prohibited.
                      </span>
                    </li>
                    <li>
                      <span>
                        <strong>Artificial inflation:</strong> Bot-driven views,
                        fake likes, spam comments, or mass unsolicited messaging
                        are not allowed.
                      </span>
                    </li>
                    <li>
                      <span>
                        <strong>Ad disclosure:</strong> Sponsored content and
                        brand partnerships must be clearly labeled (for example,
                        with #Ad or #Sponsored).
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Rule 8 */}
              <div
                id="rule-8"
                className="tw:pt-8 tw:border-t tw:border-slate-100"
              >
                <div className="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:px-4 tw:py-4 tw:md:px-5 tw:md:py-5 tw:space-y-3">
                  <span className="tw:inline-flex tw:items-center tw:gap-2 tw:text-[11px] tw:font-semibold tw:uppercase tw:tracking-wide tw:text-slate-700">
                    <span className="tw:h-1.5 tw:w-1.5 tw:rounded-full tw:bg-slate-500" />
                    <span>Rule 8 · Events and monetization</span>
                  </span>

                  <span className="tw:block tw:text-base tw:md:text-lg tw:font-semibold tw:text-slate-900">
                    Accountability in events and monetization practices
                  </span>

                  <span className="tw:block tw:text-sm tw:md:text-base tw:text-slate-700">
                    When you charge for access, attendees are trusting you with
                    their time and money.
                  </span>

                  <ul className="tw:list-disc tw:pl-5 tw:space-y-2 tw:text-sm tw:md:text-base tw:text-slate-700">
                    <li>
                      <span>
                        <strong>Accurate listings:</strong> Clearly describe
                        event timing, format, requirements, and refund policies.
                      </span>
                    </li>
                    <li>
                      <span>
                        <strong>Transaction integrity:</strong> Completed events
                        and transactions should not be deleted or hidden to
                        avoid accountability.
                      </span>
                    </li>
                    <li>
                      <span>
                        <strong>Fair revenue handling:</strong> No deceptive
                        pricing, hidden fees, or attempts to bypass platform
                        rules and fees.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Rule 9 */}
              <div
                id="rule-9"
                className="tw:pt-8 tw:border-t tw:border-slate-100"
              >
                <div className="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:px-4 tw:py-4 tw:md:px-5 tw:md:py-5 tw:space-y-3">
                  <span className="tw:inline-flex tw:items-center tw:gap-2 tw:text-[11px] tw:font-semibold tw:uppercase tw:tracking-wide tw:text-slate-700">
                    <span className="tw:h-1.5 tw:w-1.5 tw:rounded-full tw:bg-slate-500" />
                    <span>Rule 9 · Privacy and data stewardship</span>
                  </span>

                  <span className="tw:block tw:text-base tw:md:text-lg tw:font-semibold tw:text-slate-900">
                    Diligence in privacy and data stewardship
                  </span>

                  <span className="tw:block tw:text-sm tw:md:text-base tw:text-slate-700">
                    Privacy is a shared responsibility. Do not misuse data you
                    gain on the platform.
                  </span>

                  <ul className="tw:list-disc tw:pl-5 tw:space-y-2 tw:text-sm tw:md:text-base tw:text-slate-700">
                    <li>
                      <span>
                        <strong>Consent-driven sharing:</strong> Do not share
                        personal details about others without their clear
                        permission.
                      </span>
                    </li>
                    <li>
                      <span>
                        <strong>Alignment with laws:</strong> Handle any data
                        you collect in line with NDPR, GDPR, and other
                        applicable privacy rules, including honoring user
                        rights.
                      </span>
                    </li>
                    <li>
                      <span>
                        <strong>Secure communication:</strong> Avoid sharing
                        sensitive information in public streams; use secure
                        channels for confidential exchanges.
                      </span>
                    </li>
                  </ul>

                  <span className="tw:block tw:text-xs tw:md:text-sm tw:text-slate-600">
                    <em>Note:</em> These expectations work alongside our{" "}
                    <a
                      href="/legal/privacy"
                      className="tw:text-primary tw:underline-offset-4 hover:tw:underline"
                    >
                      Privacy Policy
                    </a>
                    .
                  </span>
                </div>
              </div>

              {/* Rule 10 */}
              <div
                id="rule-10"
                className="tw:pt-8 tw:border-t tw:border-slate-100"
              >
                <div className="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:px-4 tw:py-4 tw:md:px-5 tw:md:py-5 tw:space-y-3">
                  <span className="tw:inline-flex tw:items-center tw:gap-2 tw:text-[11px] tw:font-semibold tw:uppercase tw:tracking-wide tw:text-slate-700">
                    <span className="tw:h-1.5 tw:w-1.5 tw:rounded-full tw:bg-slate-500" />
                    <span>Rule 10 · Enforcement and due process</span>
                  </span>

                  <span className="tw:block tw:text-base tw:md:text-lg tw:font-semibold tw:text-slate-900">
                    Transparent enforcement and due process
                  </span>

                  <span className="tw:block tw:text-sm tw:md:text-base tw:text-slate-700">
                    Moderation is part of our responsibility to the community.
                    We aim to be consistent, fair, and explainable.
                  </span>

                  <ul className="tw:list-disc tw:pl-5 tw:space-y-2 tw:text-sm tw:md:text-base tw:text-slate-700">
                    <li>
                      <span>
                        <strong>Graduated responses:</strong> Actions range from
                        warnings to permanent bans depending on severity and
                        history.
                      </span>
                    </li>
                    <li>
                      <span>
                        <strong>Accountability measures:</strong> Serious
                        misconduct may affect multiple related accounts and
                        earnings.
                      </span>
                    </li>
                    <li>
                      <span>
                        <strong>Appeals:</strong> You can contest moderation
                        decisions by emailing{" "}
                        <a
                          href="mailto:support@zagasm.com"
                          className="tw:text-primary tw:underline-offset-4 hover:tw:underline"
                        >
                          support@zagasm.com
                        </a>{" "}
                        with context and evidence.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Reporting callout */}
              <div
                id="reporting"
                className="tw:pt-8 tw:border-t tw:border-slate-100"
              >
                <div className="tw:rounded-2xl tw:border-l-4 tw:border-emerald-500 tw:bg-emerald-50 tw:px-4 tw:py-4 tw:md:px-5 tw:md:py-5 tw:space-y-3">
                  <span className="tw:block tw:text-sm tw:md:text-base tw:font-semibold tw:text-emerald-800">
                    Empowering reports and community vigilance
                  </span>
                  <span className="tw:block tw:text-sm tw:md:text-base tw:text-slate-700">
                    If you see content or behavior that breaks these Guidelines,
                    please report it. Use the in-app report controls or email{" "}
                    <a
                      href="mailto:abuse@zagasm.com"
                      className="tw:text-primary tw:underline-offset-4 hover:tw:underline"
                    >
                      abuse@zagasm.com
                    </a>{" "}
                    with links, timestamps, and any supporting evidence you can
                    safely share.
                  </span>
                  <span className="tw:block tw:text-xs tw:md:text-sm tw:text-slate-600">
                    We protect good-faith reporters from retaliation and act
                    against false or malicious reports that aim to abuse the
                    system.
                  </span>
                </div>
              </div>

              {/* Supplementary guidance */}
              <div
                id="support"
                className="tw:pt-8 tw:border-t tw:border-slate-100 tw:space-y-4 tw:text-sm tw:md:text-base tw:text-slate-700"
              >
                <span className="tw:block tw:text-xl tw:md:text-2xl tw:font-semibold tw:text-slate-900">
                  Supplementary guidance and ecosystem support
                </span>

                <span className="tw:block">
                  We provide tools and resources to help you understand and
                  follow these Guidelines.
                </span>

                <ul className="tw:list-disc tw:pl-5 tw:space-y-2">
                  <li>
                    <span>
                      <strong>Educational initiatives:</strong> Creator learning
                      materials on ethics, bias, and IP.
                    </span>
                  </li>
                  <li>
                    <span>
                      <strong>Technical aids:</strong> Optional AI-powered
                      checks, such as pre-moderation hints and accessibility
                      suggestions.
                    </span>
                  </li>
                  <li>
                    <span>
                      <strong>Localized nuance:</strong> We consider local
                      norms, laws, and sensitivities while maintaining core
                      protections.
                    </span>
                  </li>
                  <li>
                    <span>
                      <strong>Community feedback:</strong> Dedicated spaces to
                      discuss policies and propose improvements.
                    </span>
                  </li>
                </ul>
              </div>

              {/* FAQs */}
              <div
                id="faqs"
                className="tw:pt-8 tw:border-t tw:border-slate-100 tw:text-sm tw:md:text-base tw:text-slate-700"
              >
                <span className="tw:block tw:text-xl tw:md:text-2xl tw:font-semibold tw:text-slate-900 tw:mb-4">
                  Comprehensive frequently asked questions
                </span>

                <dl className="tw:space-y-4">
                  <div>
                    <dt className="tw:font-semibold tw:text-slate-900">
                      <span>
                        What qualifies as borderline content, and how can I get
                        clarity?
                      </span>
                    </dt>
                    <dd className="tw:mt-1 tw:ml-4 tw:text-slate-700">
                      <span>
                        When in doubt, err on the side of caution. You can reach
                        out to support with draft content or questions. We
                        consider intent, audience, and cultural context when
                        responding.
                      </span>
                    </dd>
                  </div>

                  <div>
                    <dt className="tw:font-semibold tw:text-slate-900">
                      <span>If I am banned, is there a path back?</span>
                    </dt>
                    <dd className="tw:mt-1 tw:ml-4 tw:text-slate-700">
                      <span>
                        Some bans may be appealable. Demonstrating learning,
                        clear changes in behavior, and concrete safeguards can
                        help your case, but reinstatement is not guaranteed.
                      </span>
                    </dd>
                  </div>

                  <div>
                    <dt className="tw:font-semibold tw:text-slate-900">
                      <span>How do these rules apply to collaborations?</span>
                    </dt>
                    <dd className="tw:mt-1 tw:ml-4 tw:text-slate-700">
                      <span>
                        Collaborations share responsibility. Content published
                        under a shared project must comply overall, and all
                        participants should align on standards before going
                        live.
                      </span>
                    </dd>
                  </div>

                  <div>
                    <dt className="tw:font-semibold tw:text-slate-900">
                      <span>
                        Is satire or irony treated differently under these
                        Guidelines?
                      </span>
                    </dt>
                    <dd className="tw:mt-1 tw:ml-4 tw:text-slate-700">
                      <span>
                        Satire is not exempt. We look at impact more than
                        claimed intent. Clear context and avoidance of targeted
                        harm are key.
                      </span>
                    </dd>
                  </div>

                  <div>
                    <dt className="tw:font-semibold tw:text-slate-900">
                      <span>Do you use AI for enforcement?</span>
                    </dt>
                    <dd className="tw:mt-1 tw:ml-4 tw:text-slate-700">
                      <span>
                        Automated systems help surface potential issues, but
                        trained humans make final decisions in complex or
                        impactful cases.
                      </span>
                    </dd>
                  </div>

                  <div>
                    <dt className="tw:font-semibold tw:text-slate-900">
                      <span>
                        Can I request more specific rules for niche situations?
                      </span>
                    </dt>
                    <dd className="tw:mt-1 tw:ml-4 tw:text-slate-700">
                      <span>
                        Yes. You can suggest additions or clarifications through
                        our support and community channels. We iterate based on
                        real-world use.
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Legal / closing */}
              <div
                id="legal"
                className="tw:pt-8 tw:border-t tw:border-slate-100 tw:space-y-4 tw:text-sm tw:md:text-base tw:text-slate-700"
              >
                <span className="tw:block tw:text-xl tw:md:text-2xl tw:font-semibold tw:text-slate-900">
                  Legal framework and concluding remarks
                </span>

                <span className="tw:block">
                  These Community Guidelines are governed by the laws of the
                  Federal Republic of Nigeria and apply alongside our Terms of
                  Service and Privacy Policy. Disputes arising from their
                  interpretation or enforcement may be handled through courts or
                  arbitration in Lagos, depending on what applies.
                </span>

                <span className="tw:block">
                  By using the Zagasm Studio App, you help shape the culture of
                  the platform. Following these Guidelines keeps the community
                  safe, productive, and inspiring for everyone.
                </span>
              </div>

              {/* Footer */}
              <div className="tw:mt-4 tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-3 tw:border-t tw:border-slate-100 tw:pt-4">
                <span className="tw:text-xs tw:md:text-sm tw:text-slate-500">
                  Last updated: <strong>November 6, 2025</strong>
                </span>
                <span className="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-slate-50 tw:px-3 tw:py-1 tw:text-[11px] tw:font-medium tw:text-slate-600 tw:border tw:border-slate-200">
                  <span className="tw:h-1.5 tw:w-1.5 tw:rounded-full tw:bg-primary" />
                  <span>Zagasm Studio · Community Guidelines</span>
                </span>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
