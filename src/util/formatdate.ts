const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ] as const;
  
  const getOrdinalSuffix = (day: number): string => {
    if (day >= 11 && day <= 13) return "th";
  
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };
  
export const formatDate = (date: Date): string => {
    const day = date.getUTCDate();
    const month = MONTHS[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
  };