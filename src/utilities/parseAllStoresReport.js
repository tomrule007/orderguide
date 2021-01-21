const twoDecimal = (input) => {
  return Number(Number(input).toFixed(2));
};
// Used to convert the header row cell values into an index lookup map  ie. 'Brand Name' -> [0]
const valueToIndexMap = (values) =>
  values.reduce((indexMap, value, index) => {
    indexMap[value] = [...(indexMap[value] || []), index];
    return indexMap;
  }, {});

const labelSalesColumns = (columnLookupMap) => (row) => {
  const getColumns = (label) =>
    (columnLookupMap[label] &&
      columnLookupMap[label].map((column) => row[column])) ||
    [];

  const upcWithCheckDigit = getColumns('UPC w/Check Digit')[0];
  const pack = getColumns('Pack')[0];
  const totalMovement = getColumns('Total Movement');
  return {
    brand: getColumns('Brand Name')[0],
    description: getColumns('Description')[0],
    //skipping: UPC
    // Making upc match more closely match orderguide UPCs
    // using 'Price Link' if it exists or upc w/ check digit (removing check digit if less than 7 characters)
    upcWithCheckDigit,
    priceLink: getColumns('Price Link')[0],
    // Righthand 5 digit code excluding check digit (remove leading zeros)
    productCode: parseInt(upcWithCheckDigit.slice(-6, -1), 10),
    // Remove leading zeros
    upc: parseInt(upcWithCheckDigit, 10),
    size: getColumns('Size')[0],
    pack,
    reportRank: getColumns('Report Rank')[0],
    //Skipping: Current Cost, Current Reg Retail
    currentRetail: twoDecimal(getColumns('Current Retail')[0]),
    onSale:
      getColumns('Current Retail')[0] !== getColumns('Current Reg Retail')[0],
    currentCaseCost: twoDecimal(getColumns('CurrentCaseCost')[0]),
    majorCategoryName: getColumns('Major Catg Name')[0],
    minorCategoryName: getColumns('Minor Catg Name')[0],
    isOrganic: getColumns('Organic')[0] === 'Y',
    //skipping: Vendor Name, 'UPC w/Check Digit'
    priceLinkName: getColumns('Price Link Name')[0],
    vendorName: getColumns('Vendor Name')[0],
    totalMovement,
    salesDollars: getColumns('Sales $'),
    // Calculated Columns
    totalCases: totalMovement.map((units) => twoDecimal(units / pack)),
    storeRank: totalMovement
      .slice(0, -1) // Remove grand total
      .map((movement, index) => [movement, index]) // Tag movement with index which corresponds to store lookup map
      .sort(([a], [b]) => b - a) // sort in descending order
      .reduce((acc, cur, curIndex) => {
        const storeIndex = cur[1];
        acc[storeIndex] = curIndex + 1; // Rank is index + 1
        return acc;
      }, []),
  };
};

const normalizeByUPCReducer = (acc, item) => {
  acc[item.upc] = {
    ...item,
  };
  return acc;
};

const parseAllStoresReport = ([tag, excelDataArray]) => {
  const columnLookupMap = valueToIndexMap(excelDataArray[3]);
  // Example Input: '12/21/2020 to 12/21/2020'  desired output: YYYY_MM_DD
  const date = excelDataArray[1][17].replace(
    /^(\d+)\/(\d+)\/(\d+).+/g,
    '$3_$1_$2'
  );
  // Remove empty values from stores row
  const stores = excelDataArray[2].reduce((acc, cur) => [...acc, cur], []);

  const data = excelDataArray
    .slice(5, -2) //Remove header rows and total rows
    .map(labelSalesColumns(columnLookupMap))
    .reduce(normalizeByUPCReducer, {});

  return { date, stores, data };
};

export default parseAllStoresReport;
