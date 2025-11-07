export default function StatsStrip({ user }) {
  const tiles = [
    { label: "Events Created", value: user?.events_count ?? 0, icon: "📅" },
    { label: "Followers", value: user?.followers_count ?? 0, icon: "👥" },
    { label: "Following", value: user?.followings_count ?? 0, icon: "➕" },
  ];

  return (
    <section className="tw:mt-4 tw:grid tw:grid-cols-3 tw:gap-3 md:tw:gap-5">
      {tiles.map((t) => (
        <div
          key={t.label}
          className="tw:rounded-2xl tw:border tw:border-gray-100 tw:bg-white tw:p-4 tw:text-center"
        >
          <div className="tw:text-purple-600 tw:text-2xl">{t.icon}</div>
          <div className="tw:mt-1 tw:text-2xl tw:font-semibold">{t.value}</div>
          <div className="tw:text-sm tw:text-gray-600">{t.label}</div>
        </div>
      ))}
    </section>
  );
}
