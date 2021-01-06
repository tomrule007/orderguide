import React from 'react';
import { Link } from '@reach/router';
import { TableCell, Tooltip } from '@material-ui/core';

const SalesSubHeaderCell = ({ day }) => (
  <Tooltip
    title={day.dateString.replace(/(\d+)_(\d+)_(\d+)/, '$2/$3/$1')}
    placement="top"
    arrow
  >
    <TableCell>
      <Link to={`links/${day.dateString}`}>{day.dayOfWeek}</Link>
    </TableCell>
  </Tooltip>
);

export default SalesSubHeaderCell;
