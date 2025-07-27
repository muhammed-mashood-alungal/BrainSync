export const getStatus = (start: Date | string, end: Date | string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const currentDate = new Date();

  if (startDate > currentDate) {
    return "Scheduled";
  }
  if (startDate < currentDate && endDate > currentDate) {
    return "Live";
  }
  if (endDate < currentDate) {
    return "Ended";
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Live":
      return "text-green-500";
    case "Scheduled":
      return "text-yellow-500";
    case "Ended":
      return "text-red-500";
    default:
      return "text-gray-400";
  }
};
