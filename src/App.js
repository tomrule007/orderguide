import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from './features/appBar/AppBar';
import AppDrawer from './features/appDrawer/AppDrawer';
import OrderGuide from './features/orderGuide/OrderGuide';
import FileLoader from './features/fileLoader/FileLoader';
import BarcodeScannerModal from './features/barcodeScannerModal/BarcodeScannerModal';
import { getOrderGuideData } from './features/orderGuide/orderGuideSlice';
import { selectFilterText } from './features/appBar/appBarSlice';

import InstructionalModal from './features/instructionModal/InstructionModal';
import MockDataLink from './features/mockDataLink/MockDataLink';

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
  const { data } = useSelector((state) => state.orderGuide);
  const filterText = useSelector(selectFilterText);
  const isLoading = useSelector((state) => state.fileLoader.isLoading);

  const classes = useStyles();
  return (
    <div className={classes.app}>
      <AppDrawer />
      <AppBar />
      <BarcodeScannerModal />
      <InstructionalModal />
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
          <div>
            <FileLoader />
            <MockDataLink />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
