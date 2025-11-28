export default function ProfileImageCard({
  profileImage,
  uploading,
  onPictureChange,
}) {
  return (
    <div className="tw:bg-white tw:rounded-3xl tw:px-2 tw:md:px-6 tw:py-8 tw:border tw:border-gray-100 tw:shadow-sm">
      <span className="tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-6">
        Change Profile Image
      </span>

      <div className="tw:flex tw:flex-col tw:items-center tw:justify-center">
        <div className="tw:relative tw:w-28 tw:h-28 tw:md:w-32 tw:md:h-32 tw:rounded-full tw:overflow-hidden tw:bg-gray-100">
          <img
            src={profileImage}
            alt="Profile"
            className="tw:w-full tw:h-full tw:object-cover"
          />
          {uploading && (
            <div className="profile-loader-overlay">
              <div className="profile-spinner" />
            </div>
          )}
        </div>

        <label
          htmlFor="upload_pix"
          className="tw:mt-5 tw:inline-flex tw:items-center tw:justify-center tw:px-4 tw:py-2.5 tw:rounded-full tw:bg-black tw:text-xs tw:font-medium tw:text-white tw:cursor-pointer hover:tw:bg-gray-900 tw:transition"
        >
          Upload new photo
          <input
            id="upload_pix"
            type="file"
            accept="image/*"
            className="tw:hidden"
            onChange={onPictureChange}
          />
        </label>
      </div>
    </div>
  );
}
