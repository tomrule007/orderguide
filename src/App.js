import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Router } from '@reach/router';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from './components/appBar/AppBar';
import AppDrawer from './components/appDrawer/AppDrawer';
import { getOrderGuideData } from './components/ProductTable/orderGuideSlice';
import { getSavedProductMap } from 'reducers/productMapSlice';
import { setDays } from './reducers/filtersSlice';
import ProductPage from 'pages/ProductPage';
import LinkPage from 'pages/LinkPage';

import InstructionalModal from './components/instructionModal/InstructionModal';
import UploadDataPage from 'pages/UploadDataPage';
import OrderGuidePage from 'pages/OrderGuidePage';

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
        <ProductPage path="/" />
        <LinkPage path="links/:salesDataId" />
        <UploadDataPage path="upload" />
        <OrderGuidePage path="orderguide" />
      </Router>
    </div>
  );
}

export default App;
