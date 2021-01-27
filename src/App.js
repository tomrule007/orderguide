import React, { useEffect } from 'react';
import { Redirect, Router } from '@reach/router';

import AppBar from './components/appBar/AppBar';
import AppDrawer from './components/appDrawer/AppDrawer';
import DailySalesPage from 'pages/DailySalesPage';
import InstructionalModal from './components/instructionModal/InstructionModal';
import LinkPage from 'pages/LinkPage';
import MissingDataPage from 'pages/MissingDataPage';
import OrderGuidePage from 'pages/OrderGuidePage';
import SalesDashboardPage from 'pages/SalesDashboardPage';
import SalesDatePickerPage from 'pages/SalesDatePickerPage';
import SalesYearDataCalendar from 'components/SalesYearDataCalendar/SalesYearDataCalendar';
import UploadDataPage from 'pages/UploadDataPage';
import { getOrderGuideData } from './components/ProductTable/orderGuideSlice';
import { getSavedProductMap } from 'reducers/productMapSlice';
import { makeStyles } from '@material-ui/core/styles';
import { setDays } from './reducers/filtersSlice';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles({
  app: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  body: {
    flex: '1 1 auto',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
});

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrderGuideData());
    dispatch(setDays(Date.now()));
    dispatch(getSavedProductMap());
  }, [dispatch]);

  const classes = useStyles();
  return (
    <div className={classes.app}>
      <AppDrawer />
      <AppBar />
      <InstructionalModal />
      <Router className={classes.body}>
        <MissingDataPage path="/missingData" />
        <Redirect from="/" to="orderguide" noThrow />
        <SalesDashboardPage path="/salesDashboard" />
        <LinkPage path="/salesDashboard/links/:salesDataId" />
        <UploadDataPage path="upload" />
        <OrderGuidePage path="orderguide" />
        <SalesDatePickerPage path="dailysales">
          <SalesYearDataCalendar default />
          <DailySalesPage path=":salesDataId" />
        </SalesDatePickerPage>
      </Router>
    </div>
  );
}

export default App;
