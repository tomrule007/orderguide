import React, { useMemo, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Collapse from '@material-ui/core/Collapse';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import IconButton from '@material-ui/core/IconButton';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import localForage from 'localforage';
import SalesSubHeaderCell from './SalesSubHeaderCell';
import SalesCell from './SalesCell';
import SalesHeaderCell from './SalesHeaderCell';
// import ProductRow from './ProductRow';

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
  noBottomBorder: {
    '& > *': {
      borderBottom: 'unset',
    },
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

export default function OrderGuideTable({ data, filterText, days }) {
  const [page, setPage] = React.useState(0);
  const [display, setDisplay] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
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

  const filteredData = useMemo(
    () =>
      filterText ? data.filter(rowIncludes(filterText.toLowerCase())) : data,
    [data, filterText]
  );

  useEffect(() => {
    const attachSalesData = async () => {
      const salesHistory = await Promise.all(
        days.map((day) => localForage.getItem(day.dateString))
      );

      setDataWithSales(salesHistory);
    };
    attachSalesData();

    return () => {};
  }, [data]);

  const ProductRow = (props) => {
    const { row, display, setDisplay, days, dataWithSales } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();

    const salesHistory = dataWithSales.map((dayData) =>
      dayData ? dayData[row.upc] : 'n/a'
    );

    return (
      <>
        <TableRow
          hover
          tabIndex={-1}
          className={classes.noBottomBorder}
          onClick={() => setOpen(!open)}
        >
          {!isLargeScreen && (
            <TableCell>
              <IconButton aria-label="expand row" size="small">
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </TableCell>
          )}
          {columns.map((column) => {
            const value = row[column.id];
            return !isLargeScreen && column.hiddenOnSmall ? null : (
              <TableCell key={column.id}>
                {column.format ? column.format(filterText, value) : value}
              </TableCell>
            );
          })}
          {isLargeScreen &&
            salesHistory.map((salesData, i) => (
              <SalesCell salesData={salesData} displayValue={display} key={i} />
            ))}
        </TableRow>
        {!isLargeScreen && (
          <TableRow hover>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <p>
                  {' '}
                  {`UPC: ${row['upc']}       Case Cost: $${row['caseCost']}`}
                </p>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <SalesHeaderCell
                      selectValue={display}
                      selectOnChange={(e) => setDisplay(e.target.value)}
                    />
                    <TableRow>
                      {days.map((day, i) => {
                        return <SalesSubHeaderCell day={day} key={i} />;
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      {salesHistory.map((salesData, i) => (
                        <SalesCell
                          salesData={salesData}
                          displayValue={display}
                          key={i}
                        />
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </Collapse>
            </TableCell>
          </TableRow>
        )}
      </>
    );
  };

  return (
    <>
      <TableContainer className={classes.tableBody}>
        <Table stickyHeader size="small" aria-label="sticky table">
          <TableHead>
            {isLargeScreen && (
              <TableRow display={{ xs: 'none', md: 'block' }}>
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
