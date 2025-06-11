function getDate() {
  const today = new Date();

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const weekOfDay = today.getDay(); // Get the day of the week (0 - 6)
  const day = today.getDate(); // Get the day of the month
  const month = today.getMonth(); // Get the month (0 - 11)
  const year = today.getFullYear(); // Get the full year

  const formattedDate = `"${month + 1}/${day}/${year} | ${
    daysOfWeek[weekOfDay]}"`;

  return {
    date: formattedDate,
    day: daysOfWeek[weekOfDay].slice(0, 3).toLocaleLowerCase(),
    dayArray: daysOfWeek,
  };
}

export default getDate;
