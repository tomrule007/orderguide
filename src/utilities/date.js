export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// TODO: convert to a more pure functional solution (monad?)
const safeDate = (fromDate) => {
  const date = new Date(fromDate);

  if (isNaN(date)) throw Error(`Invalid date Input: ${fromDate}`);

  return date;
};

export const addDays = (date, days) => {
  const newDate = new Date(Number(date));
  newDate.setDate(date.getDate() + days);
  return newDate;
};

/**
 * Find date of most recent occurrence of provided weekday from provided date.
 *
 * @param {Number} weekDay  0 = Sunday, ..., 6 = Saturday
 * @param {*} fromDate  Date object or valid date constructor argument
 * @returns {Date}  most recent occurrence of that weekDay
 */
export const getRecentDay = (weekDay, fromDate) => {
  if (weekDay < 0 || weekDay > 6)
    throw Error(
      `Invalid weekDay:  *| ${weekDay} |* Input must be number between 0 to 6 (sun to sat)`
    );

  const date = safeDate(fromDate);
  const fromDay = date.getDay();
  const daysToWeekday = weekDay - fromDay;

  return daysToWeekday <= 0
    ? addDays(date, daysToWeekday)
    : addDays(date, -7 + daysToWeekday);
};

export const salesIdToDate = (salesId) => {
  const [year, month, day] = salesId.split('_').map(Number);

  return new Date(year, month - 1, day);
};

export const dateWithDayString = (date) =>
  date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
