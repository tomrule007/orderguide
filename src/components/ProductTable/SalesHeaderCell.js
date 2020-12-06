import React from 'react';
import { TableCell, MenuItem, Select } from '@material-ui/core';

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

export default SalesHeaderCell;
