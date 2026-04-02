import { User2 } from "lucide-react";

function EmptyState({ status }) {
  const titleMap = {
    pending: "No pending invitations yet",
    approved: "No accepted performances yet",
    rejected: "No rejected invitations",
  };

  const descMap = {
    pending:
      "When organisers tag you as a performer or speaker, they’ll show up here.",
    approved:
      "Once you accept invitations, they’ll appear here so you can quickly jump into the events.",
    rejected: "Rejected invitations will be listed here for your own record.",
  };

  return (
    <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:rounded-2xl tw:border tw:border-dashed tw:border-gray-300 tw:bg-white tw:px-6 tw:py-10 tw:text-center tw:shadow-sm">
      <div className="tw:mb-4 tw:flex tw:h-12 tw:w-12 tw:items-center tw:justify-center tw:rounded-2xl tw:bg-lightPurple">
        <User2 className="tw:h-6 tw:w-6 tw:text-primary" />
      </div>
      <span className="tw:text-base tw:font-semibold tw:text-gray-900">
        {titleMap[status] || "Nothing here yet"}
      </span>
      <span className="tw:mt-2 tw:max-w-md tw:text-sm tw:text-gray-500">
        {descMap[status]}
      </span>
    </div>
  );
}

export default EmptyState;
