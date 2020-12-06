import React from 'react';
import { TableCell, Tooltip } from '@material-ui/core';

const SalesSubHeaderCell = ({ day }) => (
  <Tooltip
    title={day.dateString.replace(/(\d+)_(\d+)_(\d+)/, '$2/$3/$1')}
    placement="top"
    arrow
  >
    <TableCell>{day.dayOfWeek}</TableCell>
  </Tooltip>
);

export default SalesSubHeaderCell;
