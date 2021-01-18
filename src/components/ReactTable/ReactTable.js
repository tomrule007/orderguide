import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  makeStyles,
} from '@material-ui/core';
import React, { useState } from 'react';
import { usePagination, useSortBy, useTable } from 'react-table';

import PropTypes from 'prop-types';
import TableSettingsModal from './TableSettingsModal';

const useStyles = makeStyles({
  tableContainer: {
    flex: '1 1 auto',
    overflow: 'auto',
  },
  tableFooter: {
    flex: '0 0 auto',
  },
});

const ReactTable = ({ columns, data, initialState, tableId }) => {
  const classes = useStyles();
  const {
    getTableProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    setPageSize,
    allColumns,
    getToggleHideAllColumnsProps,

    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState,
    },
    useSortBy,
    usePagination
  );

  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const handleChangePage = (event, newPage) => {
    gotoPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(Number(event.target.value));
  };

  return (
    <>
      <Box align="right">
        <Button onClick={() => setSettingsModalOpen(true)} color="primary">
          Edit
        </Button>
      </Box>
      <TableSettingsModal
        open={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        getToggleHideAllColumnsProps={getToggleHideAllColumnsProps}
        allColumns={allColumns}
        tableId={tableId}
      />

      <TableContainer className={classes.tableContainer}>
        <Table stickyHeader size="small" {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell
                    {...(column.id === 'selection'
                      ? column.getHeaderProps()
                      : column.getHeaderProps(column.getSortByToggleProps()))}
                  >
                    {column.render('Header')}
                    {column.id !== 'selection' ? (
                      <TableSortLabel
                        active={column.isSorted}
                        // react-table has a unsorted state which is not treated here
                        direction={column.isSortedDesc ? 'desc' : 'asc'}
                      />
                    ) : null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <TableCell {...cell.getCellProps()}>
                        {cell.render('Cell')}
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
        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: data.length }]}
        count={data.length}
        rowsPerPage={pageSize}
        page={pageIndex}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  );
};

ReactTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  tableId: PropTypes.string.isRequired,
  initalState: PropTypes.object,
};

export default ReactTable;
