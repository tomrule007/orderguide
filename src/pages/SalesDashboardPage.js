import React, { useEffect, useState } from 'react';
import {
  getOrderGuide,
  selectOrderGuideMetadata,
} from 'reducers/fileStoreSlice';

import CircularProgress from '@material-ui/core/CircularProgress';
import FileLoader from 'components/fileLoader/FileLoader';
import MockDataLink from 'components/mockDataLink/MockDataLink';
import ProductTable from 'components/ProductTable/ProductTable';
import { makeStyles } from '@material-ui/core/styles';
import { selectDays } from 'reducers/filtersSlice';
import { selectFilterText } from 'components/appBar/appBarSlice';
import { selectProductMap } from 'reducers/productMapSlice';
import { useSelector } from 'react-redux';

const useStyles = makeStyles({
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
// Todo: Fix half done refactor.
//       -> Product table should only get data passed in via props
//       -> Remove unused data processing code
const SalesDashboardPage = () => {
  const classes = useStyles();
  const filterText = useSelector(selectFilterText);
  const days = useSelector(selectDays);
  const productMap = useSelector(selectProductMap);
  // TODO: copied code from OrderGuidePage (could possibly be extracted to custom hook)
  const orderGuideMetadata = useSelector(selectOrderGuideMetadata);
  const [state, setState] = useState({ loading: true, orderGuide: null });
  const { loading, orderGuide } = state;

  useEffect(() => {
    if (!loading) setState({ ...state, loading: true });
    getOrderGuide().then((guide) => {
      setState({ ...state, orderGuide: guide, loading: false });
    });
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderGuideMetadata]);
  return loading ? (
    <div className={classes.center}>
      <CircularProgress size="5rem" />
    </div>
  ) : orderGuide && orderGuide.length ? (
    <ProductTable
      productMap={productMap}
      data={orderGuide}
      filterText={filterText}
      days={days}
    />
  ) : (
    <div className={classes.center}>
      <div>
        <FileLoader />
        <MockDataLink />
      </div>
    </div>
  );
};

export default SalesDashboardPage;
