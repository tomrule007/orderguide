import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, Typography } from '@material-ui/core';
import OrderGuideTable from 'components/OrderguideTable/OrderguideTable';
import SearchIcon from '@material-ui/icons/Search';
import FileLoader from 'components/fileLoader/FileLoader';
import MockDataLink from 'components/mockDataLink/MockDataLink';
import { selectFilterText } from 'components/appBar/appBarSlice';
import {
  getOrderGuide,
  selectOrderGuideMetadata,
} from 'reducers/fileStoreSlice';
import {
  toDollars,
  toPercent,
  getHighlightedTextFormatter,
} from 'utilities/formatters';

const useStyles = makeStyles({
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '1 1 auto',
    flexDirection: 'column',
  },
});

const rowIncludes = (filterText) => (row) => {
  const columnsToSearch = ['upc', 'description'];

  return columnsToSearch
    .map((column) => row[column])
    .some((value) =>
      String(value)
        .toLowerCase()
        .includes(filterText)
    );
};

const OrderGuidePage = () => {
  const classes = useStyles();
  const orderGuideMetadata = useSelector(selectOrderGuideMetadata);
  const filterText = useSelector(selectFilterText);
  const [orderGuide, setOrderGuide] = useState(null);
  useEffect(() => {
    getOrderGuide().then(setOrderGuide);
    return () => {};
  }, [setOrderGuide]);

  const highlightText = useMemo(() => getHighlightedTextFormatter(filterText), [
    filterText,
  ]);

  const columns = useMemo(
    () => [
      { id: 'source', label: 'Source', hiddenOnSmall: true },
      { id: 'buyer', label: 'Buyer', hiddenOnSmall: true },
      { id: 'brand', label: 'Brand', hiddenOnSmall: true },
      { id: 'upc', label: 'UPC', format: highlightText },
      { id: 'description', label: 'Description', format: highlightText },
      { id: 'deliveryDays', label: 'Delivery Days', hiddenOnSmall: true },

      {
        id: 'unitCost',
        label: 'Unit Cost',
        format: toDollars,
        hiddenOnSmall: true,
      },
      { id: 'retail', label: 'Retail', format: toDollars },
      {
        id: 'grossMargin',
        label: 'Gross Margin',
        format: toPercent,
        hiddenOnSmall: true,
      },

      {
        id: 'caseCost',
        label: 'Case Cost',
        format: toDollars,
        hiddenOnSmall: true,
      },
    ],
    [highlightText]
  );

  const filteredData = React.useMemo(
    () =>
      filterText && orderGuide
        ? orderGuide.filter(rowIncludes(filterText.toLowerCase()))
        : orderGuide,
    [orderGuide, filterText]
  );

  return !orderGuide ? (
    <div className={classes.center}>
      <CircularProgress size="5rem" />
    </div>
  ) : orderGuide.length ? (
    filteredData.length === 0 ? (
      <div className={classes.center}>
        <SearchIcon fontSize="large" />
        <Typography>No Matching items found</Typography>
        <Typography variant="caption">Check the filter settings</Typography>
      </div>
    ) : (
      <>
        <Typography variant="subtitle2">
          {'Date Loaded: '}
          {new Date(orderGuideMetadata.dateLoaded).toLocaleDateString('en-US')}
          {' ( Last Modified: '}
          {new Date(orderGuideMetadata.lastModified).toLocaleDateString(
            'en-US'
          )}
          {')'}
        </Typography>
        <OrderGuideTable data={filteredData} columns={columns} />
      </>
    )
  ) : (
    <div className={classes.center}>
      <div>
        <FileLoader />
        <MockDataLink />
      </div>
    </div>
  );
};

export default OrderGuidePage;
