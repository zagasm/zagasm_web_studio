export default function AboutPanel({ user }) {
  const rows = [
    ["Username", `@${user?.userName}`],
    ["Email", user?.email],
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
            <dt className="tw:text-sm tw:text-gray-500">{label}</dt>
            <dd className="tw:text-base tw:font-medium tw:first-letter:uppercase tw:text-gray-900">
              {value || "—"}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
