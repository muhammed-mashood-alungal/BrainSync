export const formatTime = (time: Date | string) => {
  return new Date(time).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const  formatToLocaleString=(time : Date | string)=>{
   return new Date(time).toLocaleDateString()
}

export const formatDate = (date: unknown) => {
  return new Date(date as Date).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
};

// "yyyy-mm-dd" in local time (not UTC), the value format used by date fields
export const toDateValue = (date: Date) => {
  const pad = (num: number) => String(num).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
};

// Parses a "yyyy-mm-dd" value as a local date (new Date("yyyy-mm-dd") is UTC)
export const parseDateValue = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

// Seconds to a short label: "2h 15m", "45m", "30s"
export const formatDuration = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours) return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
  if (minutes) return `${minutes}m`;
  return `${Math.floor(totalSeconds)}s`;
};
