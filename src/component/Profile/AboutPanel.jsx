import { truncate } from "../../utils/helpers";

export default function AboutPanel({ user }) {
  if (!user) return null;

  const isOrganiserProfileData =
    !!user?.organiser || (!!user?.userId && !!user?.allEvents);

  const rows = isOrganiserProfileData
    ? [
        ["Organizer Name", user?.organiser],
        ["Email", truncate(user?.email, 10)],
        ["Phone", user?.phone],
        ["Status", user?.status],
        ["KYC Status", user?.kyc_status],
        ["Total Events", user?.totalEventsCreated],
        ["Followers", user?.numberOfFollowers],
        ["Total Views", user?.total_views],
        ["Successful Payments", user?.successfulPayments],
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
    <div className="tw:mt-3 tw:rounded-3xl tw:border tw:border-gray-100 tw:bg-white tw:p-5 tw:mb-16 tw:md:mb-0">
      <dl className="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-x-8 tw:gap-y-4">
        {rows.map(([label, value]) => (
          <div key={label} className="tw:flex tw:flex-col">
            <dt className="tw:text-[10px] tw:text-gray-500">{label}</dt>
            <dd className="tw:text-xs tw:font-medium tw:first-letter:uppercase tw:text-gray-900">
              {value !== undefined && value !== null && value !== ""
                ? value
                : "—"}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
