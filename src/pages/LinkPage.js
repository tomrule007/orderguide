import { Box, Button, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import {
  addLinks,
  exportProductMapFile,
  getLinkedSalesData,
  removeLink,
  selectProductMap,
} from 'reducers/productMapSlice';
import { useDispatch, useSelector } from 'react-redux';

import FilterSelect from 'components/FilterSelect/FilterSelect';
import LinkDataLoader from 'components/linkDataLoader/LinkDataLoader';
import { getOrderGuide } from 'reducers/fileStoreSlice';
import localForage from 'localforage';
import { makeStyles } from '@material-ui/core/styles';
import { selectFilters } from 'reducers/filtersSlice';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: '1 1 auto',
    overflow: 'auto',
  },
  horizontal: {
    display: 'flex',
  },
  margin: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

//TODO:
// 1) Prevent item selects from causing all 3 lists to be repaint themselves
// 2) Component shouldn't handle any of the data persisting (remove localforage)
// 3) Improve responsiveness
//      * horizontal flex should turn vertical on small screens instead of just wrapping
//      * Linked Item list should fill more width of the screen
//      * export, remove, import buttons on single line or moved else were
// 4) Fix react-window to use real element height (SelectFilter component issue)
export default function LinkPage({ salesDataId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { store } = useSelector(selectFilters);
  const [salesItems, setSalesItems] = useState(null);
  const [orderGuide, setOrderGuide] = useState([]);
  const [unlinkedSalesItemList, setUnlinkedSalesItemList] = useState([]);
  const [selectedSalesItem, setSelectedSalesItem] = useState(null);
  const [selectedOrderGuideItem, setSelectedOrderGuideItem] = useState(null);
  const [selectedLinkedItem, setSelectedLinkedItem] = useState(null);
  // const { data } = useSelector((state) => state.orderGuide);
  const productMap = useSelector(selectProductMap);

  useEffect(() => {
    getOrderGuide().then((guide) => {
      setOrderGuide(guide);
    });
    return () => {};
  }, [setOrderGuide]);
  useEffect(() => {
    if (!salesDataId || !orderGuide || !productMap || !store) return;
    if (Object.keys(productMap).length !== 0) {
      localStorage.setItem('links', JSON.stringify(productMap));
    }

    const attachSalesData = async () => {
      const [{ unlinked }] = await getLinkedSalesData(orderGuide, productMap, [
        { dateString: salesDataId },
      ]);
      const soldItems = await localForage.getItem(salesDataId);

      setUnlinkedSalesItemList(
        unlinked.filter(
          ({ totalMovement }) => totalMovement[store.selected] > 0
        )
      );
      setSalesItems(soldItems);
    };
    if (orderGuide.length === 0) {
      return;
    } else {
      attachSalesData();
    }

    return () => {};
  }, [salesDataId, orderGuide, productMap, store]);

  const handleLinkOnClick = () => {
    if (selectedSalesItem && selectedOrderGuideItem) {
      dispatch(
        addLinks({ [selectedSalesItem]: String(selectedOrderGuideItem) })
      );
    }
  };
  const linkedItemsDisplay =
    salesItems && orderGuide
      ? Object.entries(productMap).map(([saleUPC, orderGuideUPC]) => ({
          display: `${saleUPC} ${salesItems[saleUPC] &&
            salesItems[saleUPC].description}  <-> ${orderGuideUPC} ${orderGuide[
            orderGuideUPC
          ] && orderGuide[orderGuideUPC].description} `,
          value: saleUPC,
        }))
      : [];
  return (
    <div className={classes.root}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="row"
        flexWrap="wrap"
      >
        <Box m={2}>
          {orderGuide.length && (
            <FilterSelect
              title={'Unlinked Sales Items'}
              data={unlinkedSalesItemList
                .filter((item) => !productMap[item.upc])
                .map((item) => {
                  const {
                    description,
                    currentRetail,
                    onSale,
                    pack,
                    size,
                    totalMovement,
                    salesDollars,
                    upc,
                  } = item;
                  return {
                    display: `${upc} ${description}`,
                    getTooltip: () => (
                      <p>
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
                        <b>{'Total Income  $'}</b>{' '}
                        {salesDollars[store.selected]}
                      </p>
                    ),
                    value: item.upc,
                  };
                })}
              selectedValue={selectedSalesItem}
              onSelect={setSelectedSalesItem}
            />
          )}
        </Box>
        <Box m={2}>
          <Button variant="contained" onClick={handleLinkOnClick}>
            Link
          </Button>
          <br />
          <Typography variant="caption">select two items to link</Typography>
        </Box>
        {orderGuide.length && (
          <Box m={2}>
            <FilterSelect
              title={'OrderGuide'}
              data={orderGuide.map((item) => ({
                display: `${item.upc} ${item.description}`,
                value: item.upc,
              }))}
              selectedValue={selectedOrderGuideItem}
              onSelect={setSelectedOrderGuideItem}
            />
          </Box>
        )}
      </Box>
      {orderGuide.length && (
        <Box
          m={2}
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <FilterSelect
            width={800}
            title={'Manually Linked Items'}
            data={linkedItemsDisplay}
            selectedValue={selectedLinkedItem}
            onSelect={setSelectedLinkedItem}
          />
          <Box className={classes.margin}>
            <Button
              variant="contained"
              onClick={() => {
                exportProductMapFile(productMap);
              }}
            >
              Export
            </Button>
            <Button
              variant="contained"
              onClick={() => dispatch(removeLink(selectedLinkedItem))}
            >
              Remove
            </Button>
            <LinkDataLoader />
          </Box>
        </Box>
      )}
    </div>
  );
}
