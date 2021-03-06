import React, { useEffect, useMemo, useState } from 'react';

import ProductRow from './ProductRow';
import SalesHeaderCell from './SalesHeaderCell';
import SalesSubHeaderCell from './SalesSubHeaderCell';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { getLinkedSalesData } from 'reducers/productMapSlice';
import { getOrderGuide } from 'reducers/fileStoreSlice';
import { makeStyles } from '@material-ui/core/styles';
import { selectFilters } from 'reducers/filtersSlice';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useSelector } from 'react-redux';
import { useTheme } from '@material-ui/core/styles';

const highlightedText = (highlight, text) => {
  const parts = String(text).split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i}>{part}</mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
};

const toDollars = (filterText, displayText) =>
  '$'.concat(Number(displayText).toFixed(2));
const toPercent = (filterText, displayText) => String(displayText).concat('%');

const columns = [
  { id: 'brand', label: 'Brand', hiddenOnSmall: true },
  { id: 'upc', label: 'UPC', format: highlightedText },
  { id: 'description', label: 'Description', format: highlightedText },
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
];

const useStyles = makeStyles({
  tableBody: {
    flex: '1 1 auto',
    overflow: 'auto',
  },
  tableFooter: {
    flex: '0 0 auto',
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

export default function ProductTable({ data, filterText, productMap }) {
  //TODO: The zillion unnecessary rerenders
  console.count('Table Render');
  const { days } = useSelector(selectFilters);
  const [page, setPage] = React.useState(0);
  const [display, setDisplay] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [orderGuide, setOrderGuide] = useState(null);
  const [dataWithSales, setDataWithSales] = useState([]);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const classes = useStyles();

  const filteredData = useMemo(() => {
    const unlinkedItem = {
      brand: 'N/A',
      buyer: 'N/A',
      calculatedPack: 'N/A',
      caseCost: 0,
      caseRetail: 0,
      deliveryDays: 'N/A',
      grossMargin: 0,
      retail: 0,
      source: 'N/A',
      unitCost: 0,
      upc: 'unlinked',
      description: 'All unlinked items',
    };
    const dataWithUnlinkedItem = [unlinkedItem, ...data];

    const filteredData = filterText
      ? dataWithUnlinkedItem.filter(rowIncludes(filterText.toLowerCase()))
      : dataWithUnlinkedItem;

    return filteredData;
  }, [data, filterText]);

  useEffect(() => {
    getOrderGuide().then(setOrderGuide);
    return () => {};
  }, [setOrderGuide]);

  useEffect(() => {
    if (days && orderGuide && productMap)
      getLinkedSalesData(orderGuide, productMap, days).then(setDataWithSales);

    return () => {};
  }, [days, orderGuide, productMap]);

  return (
    <>
      <TableContainer className={classes.tableBody}>
        <Table stickyHeader size="small" aria-label="sticky table">
          <TableHead>
            {isLargeScreen && (
              <TableRow>
                <TableCell colSpan={8}></TableCell>
                <SalesHeaderCell
                  selectValue={display}
                  selectOnChange={(e) => setDisplay(e.target.value)}
                />
              </TableRow>
            )}
            <TableRow>
              {!isLargeScreen && <TableCell></TableCell>}
              {columns.map((column) =>
                !isLargeScreen && column.hiddenOnSmall ? null : (
                  <TableCell key={column.id}>{column.label}</TableCell>
                )
              )}
              {isLargeScreen &&
                days.map((day, i) => <SalesSubHeaderCell day={day} key={i} />)}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <ProductRow
                  days={days}
                  isLargeScreen={isLargeScreen}
                  row={row}
                  key={row.upc}
                  display={display}
                  setDisplay={setDisplay}
                  dataWithSales={dataWithSales}
                  columns={columns}
                  filterText={filterText}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        className={classes.tableFooter}
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  );
}
