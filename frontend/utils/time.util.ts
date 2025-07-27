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
