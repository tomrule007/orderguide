import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ProductRow from './ProductRow';

const useStyles = makeStyles({
  tableBody: {
    flex: '1 1 auto',
    overflow: 'auto',
  },
  tableFooter: {
    flex: '0 0 auto',
  },
});
// TODO: Switch to react-table hooks and move mainHeader to columns object
export default function ProductTable({ columns, data, mainHeader }) {
  //TODO: The zillion unnecessary rerenders
  console.count('Table Render');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const classes = useStyles();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Add one to account for expansion icon column
  const columnsVisibleOnSmallCount =
    columns.filter(({ hiddenOnSmall }) => !hiddenOnSmall).length + 1;

  // Todo: determine if this is actually necessary (does it improve performance?)
  const dataPage = React.useMemo(
    () => data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [data, page, rowsPerPage]
  );

  return (
    <>
      <TableContainer className={classes.tableBody}>
        <Table stickyHeader size="small" aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell
                align="left"
                colSpan={
                  isLargeScreen ? columns.length : columnsVisibleOnSmallCount
                }
              >
                {mainHeader}
              </TableCell>
            </TableRow>
            <TableRow>
              {!isLargeScreen && <TableCell></TableCell>}
              {columns.map((column) =>
                !isLargeScreen && column.hiddenOnSmall ? null : (
                  <TableCell key={column.id}>{column.label}</TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataPage.map((row) => (
              <ProductRow
                isLargeScreen={isLargeScreen}
                row={row}
                key={row.upc}
                columns={columns}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        className={classes.tableFooter}
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  );
}
