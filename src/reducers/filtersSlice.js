import { createSlice } from '@reduxjs/toolkit';
import { addDays, WEEKDAYS } from 'utilities/date';

const STORES = [
  '1 RALEIGH HILLS',
  '2 SELLWOOD',
  '3 ORENCO STATION',
  '4 CONCORDIA',
  '5 SEVEN CORNERS',
  '6 ARBOR LODGE',
  '7 MOUNTAIN PARK',
  '8 CEDAR HILLS CROSSING',
  '9 HAPPY VALLEY',
  '10 HAWTHORNE',
  '11 PROGRESS RIDGE',
  '12 FISHERS LANDING',
  '13 WILLIAMS',
  '14 NYBERG RIVERS',
  '15 GRANT PARK',
  '16 SLABTOWN',
  '17 WOODSTOCK',
  '18 UNIVERSITY PARK',
  '1201 WESTSIDE NLCM',
  '1202 CAPITOLA NLCM',
  '1203 PACIFIC NLCM',
  '1204 HALF MOON BAY NLCM',
  '1205 EVERGREEN NSM',
  '1209 APTOS NLCM',
];
export const filtersSlice = createSlice({
  name: 'filters',
  initialState: {
    days: [],
    store: {
      selected: 5,
      list: STORES,
    },
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
    setStore: (state, action) => {
      state.store.selected = action.payload;
    },
  },
});

export const { setDays, setStore } = filtersSlice.actions;

export const selectDays = (state) => state.filters.days;
export const selectFilters = (state) => state.filters;

export default filtersSlice.reducer;
