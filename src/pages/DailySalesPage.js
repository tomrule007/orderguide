import {
  CircularProgress,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import {
  getHighlightedTextFormatter,
  toDollars,
  toPercent,
} from 'utilities/formatters';
import {
  getOrderGuide,
  getSalesData,
  selectOrderGuideMetadata,
} from 'reducers/fileStoreSlice';
import { selectFilters, setStore } from 'reducers/filtersSlice';
import { useDispatch, useSelector } from 'react-redux';

import FileLoader from 'components/fileLoader/FileLoader';
import MockDataLink from 'components/mockDataLink/MockDataLink';
import ReactTable from 'components/ReactTable/ReactTable';
import { makeStyles } from '@material-ui/core/styles';
import { selectFilterText } from 'components/appBar/appBarSlice';

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

// Cell Formatters
const cellToDollars = ({ value }) => toDollars(value);
const cellToYesNo = ({ value }) => (value ? 'Y' : 'N');
const cellToUPCString = ({ value }) =>
  value.replace(/(.+)(.{5})(.{5})(.)$/g, '$1-$2-$3-$4');

// Todo: Fix half done refactor.
//       -> Product table should only get data passed in via props
//       -> Remove unused data processing code
const SalesDashboardPage = ({ salesDataId }) => {
  const classes = useStyles();
  const filterText = useSelector(selectFilterText);
  const { store } = useSelector(selectFilters);
  const [salesData, setSalesData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const handleSelectStore = (e) => dispatch(setStore(e.target.value));
  const [display, setDisplay] = React.useState(0);
  useEffect(() => {
    if (!isLoading) setIsLoading(true);
    getSalesData(salesDataId).then((results) => {
      setSalesData(Object.values(results));
      setIsLoading(false);
    });
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salesDataId]);

  const columns = useMemo(
    () => [
      { accessor: 'brand', Header: 'Brand' },
      { accessor: 'description', Header: 'Description' },
      // { accessor: 'upc', Header: 'UPC' },
      { accessor: 'upcWithCheckDigit', Header: 'UPC', Cell: cellToUPCString },

      { accessor: 'size', Header: 'Size', Show: false },
      { accessor: 'pack', Header: 'Pack' },
      { accessor: 'reportRank', Header: 'Report Rank' },
      {
        accessor: 'currentRetail',
        Header: 'Current Retail',
        Cell: cellToDollars,
      },
      { accessor: 'onSale', Header: 'On Sale', Cell: cellToYesNo },
      { accessor: 'currentCaseCost', Header: 'Case Cost', Cell: cellToDollars },
      { accessor: 'minorCatagoryName', Header: 'Minor Category Name' },
      { accessor: 'isOrganic', Header: 'Organic', Cell: cellToYesNo },
      { accessor: 'priceLink', Header: 'Price Link' },

      { accessor: 'priceLinkName', Header: 'Price Link Name' },
      { accessor: 'vendorName', Header: 'Vendor Name' },
      { accessor: `totalMovement.${store.selected}`, Header: 'Total Movement' },
      { accessor: `totalCases.${store.selected}`, Header: 'Total Cases' },

      { accessor: `salesDollars.${store.selected}`, Header: 'Sales Dollars' },
      { accessor: `storeRank.${store.selected}`, Header: 'Store Rank' },
    ],
    []
  );

  // Todo: Should Move this logic to sales data upload processing to only be done once
  const dailyTotal = useMemo(
    () =>
      !salesData
        ? ''
        : salesData.reduce(
            (total, { salesDollars }) => total + salesDollars[store.selected],
            0
          ),
    [salesData, store]
  );

  return isLoading ? (
    <div className={classes.center}>
      <CircularProgress size="5rem" />
    </div>
  ) : salesData ? (
    <>
      <div>
        {' Store: '}
        <Select value={store.selected} onChange={handleSelectStore}>
          {store.list.map((name, index) => (
            <MenuItem key={index} value={index}>
              {name}
            </MenuItem>
          ))}
        </Select>
        {')'}
      </div>
      <Typography variant="h4" align="center">
        {toDollars(dailyTotal)}
      </Typography>
      <ReactTable data={salesData} columns={columns} skipPageReset={true} />
    </>
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
