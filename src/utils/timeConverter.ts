export function convertToMilliseconds(time_published: string): number {
    // Extract date and time components from the string
    const year = parseInt(time_published.substr(0, 4));
    const month = parseInt(time_published.substr(4, 2)) - 1; // Months are zero-based in JavaScript Date
    const day = parseInt(time_published.substr(6, 2));
    const hours = parseInt(time_published.substr(9, 2));
    const minutes = parseInt(time_published.substr(11, 2));
    const seconds = parseInt(time_published.substr(13, 2));

    // Create a new Date object with the extracted components
    const date = new Date(year, month, day, hours, minutes, seconds);

    // Return the timestamp in milliseconds
    return date.getTime();
}
