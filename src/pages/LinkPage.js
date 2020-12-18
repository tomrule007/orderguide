import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectProductMap,
  addLinks,
  removeLink,
} from 'reducers/productMapSlice';
import localForage from 'localforage';
import FilterSelect from 'components/FilterSelect/FilterSelect';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Box, Typography } from '@material-ui/core';
import LinkDataLoader from 'components/linkDataLoader/LinkDataLoader';
import { exportProductMapFile } from 'reducers/productMapSlice';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: '1 1 auto',
    overflow: 'auto',
    border: '5px solid purple',
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
  const [salesItems, setSalesItems] = useState(null);
  const [orderGuide, setOrderGuide] = useState(null);
  const [unlinkedSalesItemList, setUnlinkedSalesItemList] = useState([]);
  const [selectedSalesItem, setSelectedSalesItem] = useState(null);
  const [selectedOrderGuideItem, setSelectedOrderGuideItem] = useState(null);
  const [selectedLinkedItem, setSelectedLinkedItem] = useState(null);

  const { data } = useSelector((state) => state.orderGuide);
  const productMap = useSelector(selectProductMap);

  useEffect(() => {
    if (Object.keys(productMap).length !== 0) {
      localStorage.setItem('links', JSON.stringify(productMap));
    }
    if (data.length === 0) return; // do not run if orderguide is empty
    const attachSalesData = async () => {
      const normalizedOrderGuide = Object.fromEntries(
        data.map((item) => [item.upc, item])
      );

      const soldItems = await localForage.getItem(salesDataId);
      const unlinkedItems = Object.values(soldItems || {})
        .filter(({ totalMovement }) => totalMovement > 0)
        .filter(({ upc }) => !normalizedOrderGuide[upc]);
      setUnlinkedSalesItemList(unlinkedItems);
      setSalesItems(soldItems);
      setOrderGuide(normalizedOrderGuide);
    };
    attachSalesData();

    return () => {};
  }, [salesDataId, data, productMap]);

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
          {data.length && (
            <FilterSelect
              title={'Unlinked Sales Items'}
              data={unlinkedSalesItemList
                .filter((item) => !productMap[item.upc])
                .map((item) => ({
                  display: `${item.upc} ${item.description}`,
                  value: item.upc,
                }))}
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
        {data.length && (
          <Box m={2}>
            <FilterSelect
              title={'OrderGuide'}
              data={data.map((item) => ({
                display: `${item.upc} ${item.description}`,
                value: item.upc,
              }))}
              selectedValue={selectedOrderGuideItem}
              onSelect={setSelectedOrderGuideItem}
            />
          </Box>
        )}
      </Box>
      {data.length && (
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
      <div></div>
    </div>
  );
}
