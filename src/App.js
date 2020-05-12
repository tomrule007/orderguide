import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from './features/appBar/AppBar';
import AppDrawer from './features/appDrawer/AppDrawer';
import OrderGuide from './features/orderGuide/OrderGuide';
import FileLoader from './features/fileLoader/FileLoader';
import BarcodeScanner from './features/barcodeScanner/BarcodeScanner';
import { getOrderGuideData } from './features/orderGuide/orderGuideSlice';
import ScannerVideo from './features/scanner/ScannerVideo';

const useStyles = makeStyles({
  app: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '1 1 auto',
  },
});

function App() {
  const dispatch = useDispatch();
  useEffect(() => dispatch(getOrderGuideData()), []);
  const { data, filterText } = useSelector((state) => state.orderGuide);
  const isLoading = useSelector((state) => state.fileLoader.isLoading);

  const classes = useStyles();
  return (
    <div className={classes.app}>
      <AppDrawer />
      <AppBar />
      {/* <BarcodeScanner /> */}
      <ScannerVideo />
      {isLoading ? (
        <div className={classes.center}>
          <CircularProgress size="5rem" />
        </div>
      ) : data.length ? (
        <div>
          <OrderGuide data={data} filterText={filterText} />
        </div>
      ) : (
        <div className={classes.center}>
          <FileLoader />
        </div>
      )}
    </div>
  );
}

export default App;
