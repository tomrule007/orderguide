import * as R from 'ramda';

import {
  Box,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import {
  addDays,
  dateToSalesId,
  dateWithDayString,
  salesIdToDate,
} from 'utilities/date';
import { selectFilters, setStore } from 'reducers/filtersSlice';
import { useDispatch, useSelector } from 'react-redux';

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import CenterLoadingSpinner from 'components/CenterLoadingSpinner/CenterLoadingSpinner';
import ChartCard from 'components/ChartCard/ChartCard';
import MissingDataPage from './MissingDataPage';
import ReactTable from 'components/ReactTable/ReactTable';
import { getSalesData } from 'reducers/fileStoreSlice';
import { makeStyles } from '@material-ui/core/styles';
// TODO: Enable Global filter or remove search box from page
// import { selectFilterText } from 'components/appBar/appBarSlice';
import { selectSettings } from 'reducers/settingsSlice';
import { toDollars } from 'utilities/formatters';
import { useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
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
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    minHeight: 240,
    overflow: 'auto',
    flexDirection: 'column',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  fixedHeight: {
    height: 240,
  },
  button: {
    marginRight: theme.spacing(1),

    marginLeft: theme.spacing(1),
  },
}));

// Cell Formatters
const cellToDollars = ({ value }) => toDollars(value);
const cellToYesNo = ({ value }) => (value ? 'Y' : 'N');
const cellToUPCString = ({ value }) =>
  value.replace(/(.+)(.{5})(.{5})(.)$/g, '$1-$2-$3-$4');

// Chart Formatters
const chartToDollars = (val, opts) => '$' + val;

// IMPORTANT! This constant is used to persist ReactTable settings.
//            Using this id allows the component to be reusable.
const TABLE_ID = 'dailySalesTable';

// Todo: Fix half done refactor.
//       -> Product table should only get data passed in via props
//       -> Remove unused data processing code
const SalesDashboardPage = ({ salesDataId, navigate }) => {
  const classes = useStyles();
  const theme = useTheme();
  // Question: Maybe I should move this into redux to share between pages/components
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  const { store } = useSelector(selectFilters);
  const settings = useSelector(selectSettings);
  const [state, setState] = useState({ loading: true, salesData: null });
  const { loading, salesData } = state;

  const dispatch = useDispatch();

  const handleSelectStore = (e) => dispatch(setStore(e.target.value));

  useEffect(() => {
    getSalesData(salesDataId).then((results) => {
      const salesData = results ? Object.values(results) : null;

      setState({ loading: false, salesData });
    });
    return () => {};
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
      { accessor: 'minorCategoryName', Header: 'Minor Category Name' },
      { accessor: 'isOrganic', Header: 'Organic', Cell: cellToYesNo },
      { accessor: 'priceLink', Header: 'Price Link' },

      { accessor: 'priceLinkName', Header: 'Price Link Name' },
      { accessor: 'vendorName', Header: 'Vendor Name' },
      { accessor: `totalMovement.${store.selected}`, Header: 'Total Movement' },
      { accessor: `totalCases.${store.selected}`, Header: 'Total Cases' },

      {
        accessor: `salesDollars.${store.selected}`,
        Header: 'Sales Dollars',
        Cell: cellToDollars,
      },
      { accessor: `storeRank.${store.selected}`, Header: 'Store Rank' },
    ],
    [store]
  );

  const defaultHidden = useMemo(() => {
    const showOnSmall = ['description', 'totalCases', 'salesDollars'];
    const showOnLarge = ['description', 'totalCases', 'salesDollars'];

    const columnsToShow = isLargeScreen ? showOnLarge : showOnSmall;

    const columnsToHide = columns
      .filter(
        ({ accessor }) => !columnsToShow.some((col) => accessor.includes(col))
      )
      .map(({ accessor }) => accessor);
    return columnsToHide;
  }, [isLargeScreen, columns]);

  const tableSettings = settings.table[TABLE_ID];
  const initialState = useMemo(
    () => ({ hiddenColumns: tableSettings || defaultHidden }),

    [tableSettings, defaultHidden]
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

  // Todo: Decide were this data should be processed and possibly persisted.
  const minorCatagoriesAndTotals = useMemo(() => {
    if (!salesData) return null;

    // Helper function
    const zipAdd = R.zipWith(R.add);
    const unzipBinary = (a) =>
      a.reduce(
        (acc, cur) => [
          [...acc[0], cur[0]],
          [...acc[1], cur[1]],
        ],
        [[], []]
      );
    const totalsByCategory = salesData.reduce((acc, item) => {
      const itemCategory = item['minorCategoryName'] || 'No Minor Category';

      const { totalCases, totalMovement, salesDollars } = item;

      const categoryAcc = acc[itemCategory];

      const newTotalCases = categoryAcc
        ? zipAdd(categoryAcc.totalCases, totalCases)
        : totalCases;

      const newTotalMovement = categoryAcc
        ? zipAdd(categoryAcc.totalMovement, totalMovement)
        : totalMovement;

      const newSalesDollars = categoryAcc
        ? zipAdd(categoryAcc.salesDollars, salesDollars)
        : salesDollars;

      return {
        ...acc,
        [itemCategory]: {
          totalCases: newTotalCases,
          totalMovement: newTotalMovement,
          salesDollars: newSalesDollars,
        },
      };
    }, {});

    const sortedTotalsByCategory = Object.entries(totalsByCategory).sort(
      (a, b) =>
        b[1].salesDollars[store.selected] - a[1].salesDollars[store.selected]
    );
    const [categories, totals] = unzipBinary(sortedTotalsByCategory);
    return {
      categories,
      totals,
    };
  }, [salesData, store]);

  const primaryColor = useTheme().palette.primary.main;
  const salesDataDate = salesIdToDate(salesDataId);
  const dateString = dateWithDayString(salesDataDate);

  const handleNextDayClick = () =>
    navigate(`../${dateToSalesId(addDays(salesDataDate, 1))}`);
  const handlePreviousDayClick = () =>
    navigate(`../${dateToSalesId(addDays(salesDataDate, -1))}`);

  // Category Sales Chart Data

  const { options, series } = useMemo(() => {
    if (!minorCatagoriesAndTotals) return { options: null, series: null };
    // TODO: Update hardcoded title, subtitle to be provided from data or set as props.
    //       Link style settings to material ui theme.
    return {
      options: {
        dataLabels: {
          enabled: true,
          enabledOnSeries: undefined,
          // TODO: data source needs to provide formatter
          formatter: chartToDollars,
          textAnchor: 'middle',
          style: {
            // TODO: Use
            colors: ['black'],
          },
        },
        colors: [primaryColor],
        chart: {
          id: 'basic-bar',
          events: {
            dataPointSelection: function(event, chartContext, config) {
              // TODO: Clicking category sets path to category and show drilled down view
              //      --> table filter to category
              //      --> Chart show top 10 items in category
              // console.log('Clicked', { event, chartContext, config });
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: 'black',
            },
            formatter: chartToDollars,
          },
        },
        title: {
          text: 'Top 10 Categories',
        },
        subtitle: {
          text: `${dateString} - ${store.list[store.selected]}`,
        },
        xaxis: {
          labels: {
            style: {
              colors: 'black',
            },
          },
          categories: minorCatagoriesAndTotals.categories.slice(0, 10),
        },
      },
      series: [
        {
          name: 'Sales $',
          data: minorCatagoriesAndTotals.totals
            .slice(0, 10)
            .map(({ salesDollars }) =>
              Number(salesDollars[store.selected].toFixed(0))
            ),
        },
      ],
    };
  }, [minorCatagoriesAndTotals, store, dateString, primaryColor]);

  if (!loading && !salesData) navigate('/missingData');

  return (
    <>
      {/* Loading */}
      {loading && <CenterLoadingSpinner />}

      {/* Sales Data */}
      {!loading && salesData && (
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={3}>
              <Paper className={classes.paper}>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <IconButton
                    className={classes.button}
                    onClick={handlePreviousDayClick}
                  >
                    <ArrowBackIosIcon color="primary" />
                  </IconButton>
                  <Typography component="span" variant="h5">
                    {dateString}
                  </Typography>
                  <IconButton
                    className={classes.button}
                    onClick={handleNextDayClick}
                  >
                    <ArrowForwardIosIcon color="primary" />
                  </IconButton>
                </Box>
                <br />
                <Select value={store.selected} onChange={handleSelectStore}>
                  {store.list.map((name, index) => (
                    <MenuItem key={index} value={index}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
                <br />
                <Typography variant="body1">
                  {'Sales: '}
                  <Typography component="span" variant="h6">
                    {toDollars(dailyTotal)}
                  </Typography>
                  <br />
                  {'Comp: '}
                  <Typography component="span" variant="h6">
                    {'PlaceHolder'}
                  </Typography>
                  <br />
                  {'Diff: '}
                  <Typography component="span" variant="h6">
                    {'PlaceHolder'}
                  </Typography>
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} lg={9}>
              <Paper className={classes.paper} style={{ height: 400 }}>
                <ChartCard
                  title="Top 10 Catagories"
                  type="bar"
                  options={options}
                  series={series}
                />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography
                  background="inherit"
                  variant="h6"
                  color="primary"
                  gutterBottom
                >
                  Sales Data
                </Typography>
                <ReactTable
                  data={salesData}
                  columns={columns}
                  skipPageReset={true}
                  tableId={TABLE_ID}
                  initialState={initialState}
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      )}
    </>
  );
};

export default SalesDashboardPage;
