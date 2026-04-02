function MentionShimmerCard() {
  return (
    <div className="tw:animate-pulse tw:rounded-2xl tw:bg-white tw:p-4 tw:shadow-sm tw:ring-1 tw:ring-black/5">
      <div className="tw:flex tw:items-start tw:justify-between tw:gap-3">
        <div className="tw:flex-1 tw:space-y-2">
          <div className="tw:h-3 tw:w-20 tw:rounded-full tw:bg-gray-200" />
          <div className="tw:h-4 tw:w-40 tw:rounded-full tw:bg-gray-200" />
        </div>
        <div className="tw:h-6 tw:w-16 tw:rounded-full tw:bg-gray-200" />
      </div>

      <div className="tw:mt-4 tw:grid tw:gap-4 tw:md:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)]">
        <div className="tw:space-y-2">
          <div className="tw:h-3 tw:w-32 tw:rounded-full tw:bg-gray-200" />
          <div className="tw:h-3 tw:w-28 tw:rounded-full tw:bg-gray-200" />
          <div className="tw:h-3 tw:w-24 tw:rounded-full tw:bg-gray-200" />
        </div>
        <div className="tw:rounded-xl tw:bg-gray-100 tw:p-3 tw:space-y-2">
          <div className="tw:h-3 tw:w-24 tw:rounded-full tw:bg-gray-200" />
          <div className="tw:h-3 tw:w-32 tw:rounded-full tw:bg-gray-200" />
          <div className="tw:h-3 tw:w-20 tw:rounded-full tw:bg-gray-200" />
        </div>
      </div>

      <div className="tw:mt-4 tw:flex tw:items-center tw:justify-between tw:gap-3">
        <div className="tw:h-3 tw:w-24 tw:rounded-full tw:bg-gray-200" />
        <div className="tw:flex tw:gap-2">
          <div className="tw:h-9 tw:w-20 tw:rounded-full tw:bg-gray-200" />
          <div className="tw:h-9 tw:w-20 tw:rounded-full tw:bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
export default MentionShimmerCard;
