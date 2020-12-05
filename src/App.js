import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from './components/appBar/AppBar';
import AppDrawer from './components/appDrawer/AppDrawer';
import OrderGuide from './components/ProductTable/ProductTable';
import FileLoader from './components/fileLoader/FileLoader';
import { getOrderGuideData } from './components/ProductTable/orderGuideSlice';
import { selectFilterText } from './components/appBar/appBarSlice';

import InstructionalModal from './components/instructionModal/InstructionModal';
import MockDataLink from './components/mockDataLink/MockDataLink';

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
  body: {
    flex: '1 1 auto',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
});

function App() {
  const dispatch = useDispatch();
  useEffect(() => dispatch(getOrderGuideData()), [dispatch]);
  const { data } = useSelector((state) => state.orderGuide);
  const filterText = useSelector(selectFilterText);
  const isLoading = useSelector((state) => state.fileLoader.isLoading);

  const classes = useStyles();
  return (
    <div className={classes.app}>
      <AppDrawer />
      <AppBar />
      <InstructionalModal />
      {isLoading ? (
        <div className={classes.center}>
          <CircularProgress size="5rem" />
        </div>
      ) : data.length ? (
        <div className={classes.body}>
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
