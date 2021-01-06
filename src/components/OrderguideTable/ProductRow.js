import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  TableCell,
  TableRow,
  IconButton,
  Collapse,
  Typography,
  Divider,
} from '@material-ui/core';
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
  const { row, isLargeScreen, columns } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  return (
    <>
      <TableRow
        hover
        tabIndex={-1}
        className={isLargeScreen ? null : classes.noBottomBorder}
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
              {column.format ? column.format(value) : value}
            </TableCell>
          );
        })}
      </TableRow>
      {!isLargeScreen && (
        <TableRow hover>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Typography variant="body2">
                {'Case Retail: '} <b>{`$${row['caseRetail']}`}</b>
                {'(UPC 5001)'}
                <br />
                {`Savings: $${(
                  row['calculatedPack'] * row['retail'] -
                  row['caseRetail']
                ).toFixed(2)}
                `}
                <br />
                {`Calculated Pack Size: ${row['calculatedPack']}`}
                <Divider />
                {`Buyer: ${row['buyer']}`}
                <br />
                {`Source: ${row['source']}`}
                <br />
                {`Brand: ${row['brand']}`}
                <br />
                {`Day: ${row['deliveryDays']}`}
                <br />
                {`Unit Cost: $${row['unitCost']}`}
                <br />
                {`Gross Margin: ${row['grossMargin']}%`}
                <br />
                {`Case Cost: $${row['caseCost']}`}
                <br />
              </Typography>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default ProductRow;
