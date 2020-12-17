import React from 'react';
import { TableCell, Tooltip } from '@material-ui/core';

const SalesCell = ({ displayValue, salesData }) => {
  if (salesData === 'n/a') return <TableCell> {'n/a'} </TableCell>;
  if (salesData === undefined) return <TableCell> {'0'}</TableCell>;

  // TODO: Improve performance by either memoizing entire component
  //       or better yet adding total properties to salesData object at creation
  const { totalMovement, caseCount, salesDollars } = salesData.reduce(
    (acc, cur) => ({
      totalMovement: acc.totalMovement + Number(cur.totalMovement),
      caseCount: acc.caseCount + cur.totalMovement / cur.pack,
      salesDollars: acc.salesDollars + Number(cur.salesDollars),
    }),
    { totalMovement: 0, caseCount: 0, salesDollars: 0 }
  );

  const display = [
    Number(totalMovement).toFixed(1),
    caseCount.toFixed(1),
    '$' + Number(salesDollars).toFixed(2),
  ][displayValue];

  return (
    <Tooltip
      title={
        <>
          {salesData.map(
            (
              {
                description,
                currentRetail,
                onSale,
                pack,
                size,
                totalMovement,
                salesDollars,
              },
              index
            ) => (
              <p key={index}>
                <u>{description}</u>
                <br />
                <b>{'Retail $'}</b> {currentRetail}{' '}
                {onSale && <b> {'ONSALE!!'}</b>}
                <br />
                <b>{'Pack: '}</b>
                {pack} <b>{' x '}</b> {size}
                <br />
                <b>{'Units Sold: '}</b> {totalMovement}
                <br />
                <b>{'Cases Sold: '}</b> {(totalMovement / pack).toFixed(1)}
                <br />
                <b>{'Total Income  $'}</b> {salesDollars}
              </p>
            )
          )}
        </>
      }
      placement="top"
      arrow
    >
      <TableCell>
        {display}
        {salesData.length > 1 ? '*' : null}
      </TableCell>
    </Tooltip>
  );
};

export default SalesCell;
