export function getDayOfWeek(dateString: string) {
  // Create a Date object from the string
  const date = new Date(dateString);

  // Array of day names
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Get the day index (0-6) and return the corresponding day name
  const dayIndex = date.getDay();
  return days[dayIndex];
}
