import { truncate } from "../../utils/helpers";

function safeValue(v) {
  if (v === undefined || v === null || v === "") return "—";
  if (typeof v === "string" || typeof v === "number") return v;
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (Array.isArray(v)) return v.length ? v.join(", ") : "—";
  if (typeof v === "object") {
    return v?.organiser || v?.name || v?.title || "—";
  }
  return String(v);
}

export default function AboutPanel({ user }) {
  if (!user) return null;

  const isOrganiserProfileData =
    !!user?.organiser || (!!user?.userId && !!user?.allEvents);

  const organiserName =
    typeof user?.organiser === "string"
      ? user.organiser
      : user?.organiser?.organiser ||
        user?.organiser?.name ||
        user?.name ||
        "—";

  const rows = isOrganiserProfileData
    ? [
        ["Organizer Name", organiserName],
        ["Email", truncate(user?.email, 12)],
        ["KYC Status", user?.kyc_status ?? user?.kyc?.status],
        // ["Total Events", user?.organiser?.totalEventsCreated],
        // ["Followers", user?.organiser?.numberOfFollowers],
        // ["Total Views", user?.organiser?.total_views],
        // ["Successful Payments", user?.organiser?.successfulPayments],
      ]
    : [
        ["Username", user?.userName],
        ["Email", truncate(user?.email, 10)],
        ["Phone", user?.phoneNumber],
        ["Gender", user?.gender],
        ["DOB", user?.dob],
        ["Age", user?.age],
        ["About", user?.about || "—"],
      ];

  return (
    <div className="tw:hidden tw:lg:block tw:mt-3 tw:rounded-3xl tw:border tw:border-gray-100 tw:bg-white tw:p-5 tw:mb-16 tw:md:mb-0">
      <div className="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-x-8 tw:gap-y-4">
        {rows.map(([label, value]) => (
          <div key={label} className="tw:flex tw:flex-col">
            <span className="tw:text-[10px] tw:text-gray-500">{label}</span>
            <span className="tw:text-xs tw:font-medium tw:first-letter:uppercase tw:text-gray-900">
              {safeValue(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
