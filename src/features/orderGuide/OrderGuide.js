import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

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

const columns = [
  { id: 'brand', label: 'Brand' },
  { id: 'upc', label: 'UPC', format: highlightedText },
  { id: 'description', label: 'Description', format: highlightedText },
  { id: 'retail', label: 'Retail' },
  { id: 'caseRetail', label: 'Case Retail' },
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
    .some((value) => String(value).toLowerCase().includes(filterText));
};

export default function OrderGuideTable({ data, filterText }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const classes = useStyles();

  const filteredData = useMemo(
    () => (filterText ? data.filter(rowIncludes(filterText)) : data),
    [data, filterText]
  );
  return (
    <>
      <TableContainer className={classes.tableBody}>
        <Table stickyHeader size="small" aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover tabIndex={-1} key={row.upc}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id}>
                          {column.format
                            ? column.format(filterText, value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
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
