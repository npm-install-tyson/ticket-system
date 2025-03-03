import { formatDate } from "./formatdate";

export const formatShowtime = (
  datetime: string
): { date: string; time: string } => {
  const date = new Date(datetime);
  return {
    date: formatDate(date),
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  };
};
