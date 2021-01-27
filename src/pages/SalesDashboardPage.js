import React, { useEffect, useState } from 'react';
import {
  getOrderGuide,
  selectOrderGuideMetadata,
} from 'reducers/fileStoreSlice';

import CenterLoadingSpinner from 'components/CenterLoadingSpinner/CenterLoadingSpinner';
import ProductTable from 'components/ProductTable/ProductTable';
import { selectDays } from 'reducers/filtersSlice';
import { selectFilterText } from 'components/appBar/appBarSlice';
import { selectProductMap } from 'reducers/productMapSlice';
import { useSelector } from 'react-redux';

// Todo: Fix half done refactor.
//       -> Product table should only get data passed in via props
//       -> Remove unused data processing code
const SalesDashboardPage = ({ navigate }) => {
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

  if (!loading && !orderGuide) navigate('/missingData');

  return (
    <>
      {/* Loading */}
      {loading && <CenterLoadingSpinner />}

      {/* Sales dashboard */}
      {orderGuide && orderGuide.length && (
        <ProductTable
          productMap={productMap}
          data={orderGuide}
          filterText={filterText}
          days={days}
        />
      )}
    </>
  );
};

export default SalesDashboardPage;
