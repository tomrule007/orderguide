import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import ProductTable from 'components/ProductTable/ProductTable';
import FileLoader from 'components/fileLoader/FileLoader';
import MockDataLink from 'components/mockDataLink/MockDataLink';
import { selectFilterText } from 'components/appBar/appBarSlice';
import { selectDays } from 'reducers/daysSlice';
import { selectProductMap } from 'reducers/productMapSlice';

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

const ProductList = () => {
  const classes = useStyles();
  const { data } = useSelector((state) => state.orderGuide);
  const filterText = useSelector(selectFilterText);
  const isLoading = useSelector((state) => state.fileLoader.isLoading);
  const days = useSelector(selectDays);
  const productMap = useSelector(selectProductMap);
  return isLoading ? (
    <div className={classes.center}>
      <CircularProgress size="5rem" />
    </div>
  ) : data.length ? (
    <ProductTable
      productMap={productMap}
      data={data}
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

export default ProductList;
