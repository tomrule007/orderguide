import React, { useMemo, useState } from 'react';

import Alert from '@material-ui/lab/Alert';
import Calendar from 'rc-year-calendar';
import { Snackbar } from '@material-ui/core';
import { compose } from 'ramda';
import { dateToSalesId } from 'utilities/date';
// import { navigate } from '@reach/router';
import { salesIdToDate } from 'utilities/date';
import { selectSalesDataFiles } from 'reducers/fileStoreSlice';
import { useSelector } from 'react-redux';
import { useTheme } from '@material-ui/core/styles';

export default function SalesYearDataCalendar({ navigate }) {
  const primaryColor = useTheme().palette.primary.main;
  const [noDataAlert, setNoDataAlert] = useState({
    visible: false,
    date: null,
  });
  const salesDataFiles = useSelector(selectSalesDataFiles);
  const dateToCalendarData = useMemo(
    () => (d) => ({
      startDate: d,
      endDate: d,
      color: primaryColor,
    }),
    [primaryColor]
  );

  const calendarSalesDateData = useMemo(
    () =>
      Object.keys(salesDataFiles).map(
        compose(dateToCalendarData, salesIdToDate)
      ),
    [salesDataFiles, dateToCalendarData]
  );

  const showNoDataAlert = (date) => {
    setNoDataAlert({ visible: true, date });
  };
  const handleNoDataAlertClose = () =>
    setNoDataAlert({ visible: false, date: null });

  const handleCalendarOnClick = (e) =>
    e.events.length
      ? navigate(`${dateToSalesId(e.date)}`)
      : showNoDataAlert(e.date);

  return (
    <>
      <Calendar
        dataSource={calendarSalesDateData}
        // eslint-disable-next-line react/style-prop-object
        style="background"
        onDayClick={handleCalendarOnClick}
      />
      <Snackbar
        open={noDataAlert.visible}
        autoHideDuration={2000}
        onClose={handleNoDataAlertClose}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={handleNoDataAlertClose}
          severity="warning"
        >
          {`No Sales Data for this date`}
        </Alert>
      </Snackbar>
    </>
  );
}
