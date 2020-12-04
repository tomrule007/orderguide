import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import IconButton from '@material-ui/core/IconButton';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Tooltip from '@material-ui/core/Tooltip';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

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

  { id: 'caseCost', label: 'Case Cost', format: toDollars },
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

export default function OrderGuideTable({ data, filterText }) {
  const [page, setPage] = React.useState(0);
  const [display, setDisplay] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
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

  // TODO: Lift this date creation state to redux
  // Date Utilities
  function addDays(date, days) {
    const copy = new Date(Number(date));
    copy.setDate(date.getDate() + days);
    return copy;
  }
  const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  // Get Date & Day of week for previous 7 days, ending with yesterday
  const days = [-7, -6, -5, -4, -3, -2, -1].map((daysAgo) => {
    const date = addDays(today, daysAgo);
    const dayOfWeek = WEEKDAYS[date.getDay()];
    const dateString =
      String(date.getFullYear()) +
      '_' +
      String(date.getMonth() + 1).padStart(2, '0') +
      '_' +
      String(date.getDate()).padStart(2, '0');
    return {
      date,
      dateString,
      dayOfWeek,
    };
  });

  const SalesSubHeaderCell = (day) => (
    <Tooltip
      title={day.dateString.replace(/(\d+)_(\d+)_(\d+)/, '$2/$3/$1')}
      placement="top"
      arrow
    >
      <TableCell>{day.dayOfWeek}</TableCell>
    </Tooltip>
  );
  const SalesCell = (displayValue) => (salesData) => {
    if (salesData === 'n/a') return <TableCell> {'n/a'} </TableCell>;
    if (salesData === undefined) return <TableCell> {'0'}</TableCell>;

    const {
      description,
      size,
      pack,
      currentRetail,
      onSale,
      salesDollars,
      totalMovement,
    } = salesData;

    const caseCount = (totalMovement / pack).toFixed(1);
    const display = [
      Number(totalMovement).toFixed(1),
      caseCount,
      '$' + Number(salesDollars).toFixed(2),
    ][displayValue];
    return (
      <Tooltip
        title={
          <>
            <u>{description}</u>
            <br />
            <b>{'Retail $'}</b> {currentRetail} {onSale && <b> {'ONSALE!!'}</b>}
            <br />
            <b>{'Pack: '}</b>
            {pack} <b>{' x '}</b> {size}
            <br />
            <b>{'Units Sold: '}</b> {totalMovement}
            <br />
            <b>{'Total Income  $'}</b> {salesDollars}
          </>
        }
        placement="top"
        arrow
      >
        <TableCell>{display}</TableCell>
      </Tooltip>
    );
  };

  //TODO: Create custom css to also apply hover effect to sibling sales data row
  //TODO: Possibly make desktop version only have one row with sales data always visible
  // https://material-ui.com/components/use-media-query/
  const Row = (props) => {
    const { row, display, setDisplay } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();

    const salesHistory = days.map((day) => {
      const salesData = JSON.parse(localStorage.getItem(day.dateString));
      return salesData ? salesData[row.upc] : 'n/a';
    });

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
          {isLargeScreen && salesHistory.map(SalesCell(display))}
        </TableRow>
        {!isLargeScreen && (
          <TableRow hover>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box margin={1}>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <SalesHeaderCell
                        selectValue={display}
                        selectOnChange={(e) => setDisplay(e.target.value)}
                      />
                      <TableRow>{days.map(SalesSubHeaderCell)}</TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        {salesHistory.map(SalesCell(display))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        )}
      </>
    );
  };

  const SalesHeaderCell = ({ selectValue, selectOnChange }) => (
    <TableCell align={'center'} colSpan={7}>
      {'Sales History ('}
      <Select value={selectValue} onChange={selectOnChange}>
        <MenuItem value={0}>Units</MenuItem>
        <MenuItem value={1}>Cases</MenuItem>
        <MenuItem value={2}>$</MenuItem>
      </Select>
      {')'}
    </TableCell>
  );

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
              {isLargeScreen && days.map(SalesSubHeaderCell)}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <Row
                  row={row}
                  key={row.upc}
                  display={display}
                  setDisplay={setDisplay}
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
