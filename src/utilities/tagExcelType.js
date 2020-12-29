import allStoresSalesReportTemplate from 'utilities/documentValidationTemplates/allStoresSalesReportTemplate';
import linkTemplate from 'utilities/documentValidationTemplates/linkTemplate';
const ALPHABET = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
  F: 6,
  G: 7,
  H: 8,
  I: 9,
  J: 10,
  K: 11,
  L: 12,
  M: 13,
  N: 14,
  O: 15,
  P: 16,
  Q: 17,
  R: 18,
  S: 19,
  T: 20,
  U: 21,
  V: 22,
  W: 23,
  X: 24,
  Y: 25,
  Z: 26,
};

const templateEqualsArray = (template, b) => {
  // Input validation
  if (
    template == undefined ||
    b == undefined ||
    template.length === 0 ||
    b.length === 0
  )
    return false;

  // Only checks every key in template (b could have extra unchecked data)
  return template.every((rowTemplate, indexRowTemplate) =>
    Object.entries(rowTemplate).every(
      ([indexColumnTemplate, cellTemplate]) =>
        b[indexRowTemplate] !== undefined &&
        (b[indexRowTemplate][indexColumnTemplate] === cellTemplate ||
          cellTemplate === '*') // Support wildcard character '*'
    )
  );
};

const safeCellGetter = (twoDimensionArray) => (cell) => {
  if (typeof cell === 'string') {
    // Convert excel cords to array cords  'A1' -> [0][0], 'B
    const [_, alpha, numeric] = cell.match(/^(\w+)(\d+)$/);

    if (!alpha || !numeric) return null;

    const rowNum = Number(numeric);

    if (twoDimensionArray[rowNum - 1] === undefined) return null;

    const colNum = alpha
      .split('')
      .map((letter, index) => {
        const value = ALPHABET[letter.toUpperCase()];
        const placeValueMultiplier = 26 ** (index + 1 - alpha.length);
        return value * placeValueMultiplier;
      })
      .reduce((a, b) => a + b);

    return twoDimensionArray[rowNum - 1][colNum - 1];
  }
};

const allTrue = (array) => array.every((value) => value);

const tagExcelType = (excelDataArray) => {
  const getCell = safeCellGetter(excelDataArray);

  // Return null if empty excel sheet
  if (excelDataArray.length === 0) return [null, excelDataArray];

  //Link sheet
  if (
    excelDataArray.length > 1 &&
    allTrue([getCell('A1') === 'salesUPC', getCell('B1') === 'orderGuideUPC'])
  )
    return ['linkSheet', excelDataArray];

  // All stores cell sheet
  if (
    excelDataArray.length > 4 &&
    templateEqualsArray(allStoresSalesReportTemplate, excelDataArray)
  )
    return ['allStoresReport', excelDataArray];

  return ['tag', excelDataArray];
};

export default tagExcelType;
