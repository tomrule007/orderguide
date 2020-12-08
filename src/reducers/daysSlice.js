import { createSlice } from '@reduxjs/toolkit';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const daysSlice = createSlice({
  name: 'days',
  initialState: {
    days: [],
  },
  reducers: {
    setDays: (state, action) => {
      const today = new Date(action.payload);

      state.days = [-7, -6, -5, -4, -3, -2, -1].map((daysAgo) => {
        const date = addDays(today, daysAgo);
        return {
          dateString:
            String(date.getFullYear()) +
            '_' +
            String(date.getMonth() + 1).padStart(2, '0') +
            '_' +
            String(date.getDate()).padStart(2, '0'),
          dayOfWeek: WEEKDAYS[date.getDay()],
        };
      });
    },
  },
});

export const { setDays } = daysSlice.actions;

export const selectDays = (state) => state.days.days;

export default daysSlice.reducer;

// Date Utilities
function addDays(date, days) {
  const newDate = new Date(Number(date));
  newDate.setDate(date.getDate() + days);
  return newDate;
}
