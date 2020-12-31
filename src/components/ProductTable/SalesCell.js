import React from 'react';
import { useSelector } from 'react-redux';
import { TableCell, Tooltip } from '@material-ui/core';
import { selectFilters } from 'reducers/filtersSlice';

const SalesCell = ({ displayValue, salesData }) => {
  const { store } = useSelector(selectFilters);
  if (salesData === 'n/a') return <TableCell> {'n/a'} </TableCell>;
  if (salesData === undefined) return <TableCell> {'0'}</TableCell>;

  // TODO: Improve performance by either memoizing entire component
  //       or better yet adding total properties to salesData object at creation
  const {
    totalMovement,
    caseCount,
    salesDollars,
    storeRank,
  } = salesData.reduce(
    (acc, cur) => ({
      totalMovement:
        acc.totalMovement + Number(cur.totalMovement[store.selected]),
      caseCount: acc.caseCount + cur.totalMovement[store.selected] / cur.pack,
      salesDollars: acc.salesDollars + Number(cur.salesDollars[store.selected]),
      storeRank: [...acc.storeRank, cur.storeRank[store.selected]],
    }),
    { totalMovement: 0, caseCount: 0, salesDollars: 0, storeRank: [] }
  );

  const display = [
    totalMovement ? Number(totalMovement).toFixed(1) : 0,
    caseCount ? caseCount.toFixed(1) : 0,
    salesDollars ? '$' + Number(salesDollars).toFixed(2) : 0,
    storeRank,
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
                <b>{'Retail $'}</b> {currentRetail.toFixed(2)}{' '}
                {onSale && <b> {'ONSALE!!'}</b>}
                <br />
                <b>{'Pack: '}</b>
                {pack} <b>{' x '}</b> {size}
                <br />
                <b>{'Units Sold: '}</b> {totalMovement[store.selected]}
                <br />
                <b>{'Cases Sold: '}</b>{' '}
                {(totalMovement[store.selected] / pack).toFixed(1)}
                <br />
                <b>{'Total Income  $'}</b> {salesDollars[store.selected]}
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
