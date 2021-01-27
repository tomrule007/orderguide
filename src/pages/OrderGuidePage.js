import React, { useEffect, useMemo, useState } from 'react';
import { Snackbar, Typography } from '@material-ui/core';
import {
  getHighlightedTextFormatter,
  toDollars,
  toPercent,
} from 'utilities/formatters';
import {
  getOrderGuide,
  selectOrderGuideMetadata,
} from 'reducers/fileStoreSlice';

import Alert from '@material-ui/lab/Alert';
import CenterLoadingSpinner from 'components/CenterLoadingSpinner/CenterLoadingSpinner';
import OrderGuideTable from 'components/OrderguideTable/OrderguideTable';
import SearchIcon from '@material-ui/icons/Search';
import { getRecentDay } from 'utilities/date';
import { makeStyles } from '@material-ui/core/styles';
import { selectFilterText } from 'components/appBar/appBarSlice';
import { useSelector } from 'react-redux';

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

const OrderGuidePage = ({ navigate }) => {
  const classes = useStyles();
  const orderGuideMetadata = useSelector(selectOrderGuideMetadata);
  const filterText = useSelector(selectFilterText);
  const [orderGuide, setOrderGuide] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showOldGuideAlert, setShowOldGuideAlert] = useState(false);
  useEffect(() => {
    if (!isLoading) setIsLoading(true);
    getOrderGuide().then((guide) => {
      setOrderGuide(guide);
      setIsLoading(false);
    });
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderGuideMetadata]);

  // Show Alert if loaded order guide is older than weekly monday release.
  useEffect(() => {
    const { lastModified } = orderGuideMetadata;
    // Do not run if no order guide is loaded
    if (!lastModified) return;

    const lastReleaseDate = getRecentDay(1, new Date());

    if (lastReleaseDate > lastModified) {
      setShowOldGuideAlert(true);
    }
    return () => {};
  }, [orderGuideMetadata]);

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
  const OrderGuideDates = () => (
    <Typography variant="subtitle2">
      {'Date Loaded: '}
      {new Date(orderGuideMetadata.dateLoaded).toLocaleDateString('en-US')}
      {' ( Created: '}
      {new Date(orderGuideMetadata.lastModified).toLocaleDateString('en-US')}
      {')'}
    </Typography>
  );

  const filteredData = React.useMemo(
    () =>
      filterText && orderGuide
        ? orderGuide.filter(rowIncludes(filterText.toLowerCase()))
        : orderGuide,
    [orderGuide, filterText]
  );

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowOldGuideAlert(false);
  };

  if (!isLoading && !orderGuide) {
    navigate('/missingData');
  }

  return (
    <>
      {/* Loading */}
      {isLoading && <CenterLoadingSpinner />}

      {/* Order Guide */}
      {orderGuide && orderGuide.length && (
        <>
          <Snackbar
            open={showOldGuideAlert}
            autoHideDuration={6000}
            onClose={handleClose}
          >
            <Alert
              elevation={6}
              variant="filled"
              onClose={handleClose}
              severity="warning"
            >
              Order Guide is out of date
            </Alert>
          </Snackbar>
          {filteredData.length === 0 ? (
            <div className={classes.center}>
              <SearchIcon fontSize="large" />
              <Typography>No Matching items found</Typography>
              <Typography variant="caption">
                Check the filter settings
              </Typography>
            </div>
          ) : (
            <>
              <OrderGuideTable
                data={filteredData}
                columns={columns}
                mainHeader={<OrderGuideDates />}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default OrderGuidePage;
