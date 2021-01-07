import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import ProductTable from 'components/ProductTable/ProductTable';
import FileLoader from 'components/fileLoader/FileLoader';
import MockDataLink from 'components/mockDataLink/MockDataLink';
import { selectFilterText } from 'components/appBar/appBarSlice';
import { selectDays } from 'reducers/filtersSlice';
import { selectProductMap } from 'reducers/productMapSlice';
import {
  getOrderGuide,
  selectOrderGuideMetadata,
} from 'reducers/fileStoreSlice';
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
  const [orderGuide, setOrderGuide] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!isLoading) setIsLoading(true);
    getOrderGuide().then((guide) => {
      setOrderGuide(guide);
      setIsLoading(false);
    });
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderGuideMetadata]);
  return isLoading ? (
    <div className={classes.center}>
      <CircularProgress size="5rem" />
    </div>
  ) : orderGuide.length ? (
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
