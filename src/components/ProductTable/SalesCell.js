import React from 'react';
import { TableCell, Tooltip } from '@material-ui/core';

const SalesCell = ({ displayValue, salesData }) => {
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

export default SalesCell;
