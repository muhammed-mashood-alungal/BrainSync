import React from "react";

interface EmptyListProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  actionButton?: React.ReactNode;
}

const EmptyList: React.FC<EmptyListProps> = ({
  title = "No items found",
  message = "There are no items to display at the moment.",
  icon,
  actionButton,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <div className="text-gray-500 mb-4">
        {icon || (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        )}
      </div>

      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>

      <p className="text-gray-400 mb-6 max-w-md">{message}</p>

      {actionButton && <div>{actionButton}</div>}
    </div>
  );
};

export default EmptyList;
