import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
  Collapse,
} from '@material-ui/core';
import SalesCell from './SalesCell';
import SalesHeaderCell from './SalesHeaderCell';
import SalesSubHeaderCell from './SalesSubHeaderCell';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const useStyles = makeStyles({
  noBottomBorder: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

//TODO: Create custom css to also apply hover effect to sibling sales data row
//TODO: Possibly make desktop version only have one row with sales data always visible
// https://material-ui.com/components/use-media-query/
const ProductRow = (props) => {
  const {
    row,
    display,
    setDisplay,
    days,
    dataWithSales,
    isLargeScreen,
    filterText,
    columns,
  } = props;
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
                {`Brand: ${row['brand']}`}
                <br />
                {`Case Retail: $${(row['caseCost'] * 1.25).toFixed(
                  2
                )} (UPC 5001)`}
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

export default ProductRow;
