import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import ProductTable from 'components/ProductTable/ProductTable';
import FileLoader from 'components/fileLoader/FileLoader';
import MockDataLink from 'components/mockDataLink/MockDataLink';
import { selectFilterText } from 'components/appBar/appBarSlice';
import { selectDays } from 'reducers/filtersSlice';
import { selectProductMap } from 'reducers/productMapSlice';
import { getOrderGuide } from 'reducers/fileStoreSlice';
import { toDollars, toPercent, highlightedText } from 'utilities/formatters';

const useStyles = makeStyles({
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '1 1 auto',
  },
});

const columns = [
  { id: 'brand', label: 'Brand', hiddenOnSmall: true },
  { id: 'upc', label: 'UPC', format: highlightedText },
  { id: 'description', label: 'Description', format: highlightedText },
  { id: 'deliveryDays', label: 'Delivery Days', hiddenOnSmall: true },

  {
    id: 'unitCost',
    label: 'Unit Cost',
    format: toDollars,
    hiddenOnSmall: true,
  },
  { id: 'retail', label: 'Retail', format: toDollars },
  {
    id: 'grossMargin',
    label: 'Gross Margin',
    format: toPercent,
    hiddenOnSmall: true,
  },

  {
    id: 'caseCost',
    label: 'Case Cost',
    format: toDollars,
    hiddenOnSmall: true,
  },
];
const rowIncludes = (filterText) => (row) => {
  const columnsToSearch = ['upc', 'description'];

  return columnsToSearch
    .map((column) => row[column])
    .some((value) =>
      String(value)
        .toLowerCase()
        .includes(filterText)
    );
};

const ProductList = () => {
  const classes = useStyles();
  const { data } = useSelector((state) => state.orderGuide);
  const filterText = useSelector(selectFilterText);
  const isLoading = useSelector((state) => state.fileLoader.isLoading);
  const productMap = useSelector(selectProductMap);
  const [orderGuide, setOrderGuide] = useState([]);
  useEffect(() => {
    getOrderGuide().then(setOrderGuide);
    return () => {};
  }, [setOrderGuide]);
  const filteredData = React.useMemo(
    () =>
      filterText
        ? orderGuide.filter(rowIncludes(filterText.toLowerCase()))
        : orderGuide,
    [orderGuide, filterText]
  );

  return isLoading ? (
    <div className={classes.center}>
      <CircularProgress size="5rem" />
    </div>
  ) : data.length ? (
    <ProductTable
      productMap={productMap}
      data={filteredData}
      filterText={filterText}
      columns={columns}
    />
  ) : (
    <div className={classes.center}>
      <div>
        <FileLoader />
        <MockDataLink />
      </div>
    </div>
  );
};

export default ProductList;
