import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const columns = [
  { id: 'brand', label: 'Brand' },
  { id: 'upc', label: 'UPC' },
  { id: 'description', label: 'Description' },
  { id: 'retail', label: 'Retail' },
  { id: 'caseRetail', label: 'Case Retail' },
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

const rowIncludes = (filterText) => (row) => {
  const columnsToSearch = ['upc', 'description'];

  return columnsToSearch
    .map((column) => row[column])
    .some((value) => String(value).toLowerCase().includes(filterText));
};

export default function OrderGuideTable() {
  const classes = useStyles();
  const data = useSelector((state) => state.orderGuide.data);
  const filterText = useSelector((state) => state.orderGuide.filterText);
  const filteredData = useMemo(
    () => (filterText ? data.filter(rowIncludes(filterText)) : data),
    [data, filterText]
  );
  return (
    <TableContainer className={classes.root}>
      <Table stickyHeader size="small" aria-label="sticky table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.map((row) => {
            return (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.upc}>
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {value}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
