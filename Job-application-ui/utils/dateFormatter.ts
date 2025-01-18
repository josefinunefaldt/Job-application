export const formatInterviewDate = (date: string | undefined) => {
  if (date) {
    const formattedDate = new Date(date).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    return formattedDate;
  }
  return "N/A";
};
