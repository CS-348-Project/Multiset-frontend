export const timeConverter = (UNIX_timestamp: string) => {
  const date = new Date(UNIX_timestamp);

  // Extract individual components
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero-based
  const day = date.getDate();
  let hours = date.getHours();
  const minutes = date.getMinutes();

  // Determine AM or PM
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Format the date and time as needed
  const formattedDate = `${year}-${String(month).padStart(2, "0")}-${String(
    day
  ).padStart(2, "0")}`;
  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")} ${ampm}`;

  return formattedDate + " " + formattedTime;
};
