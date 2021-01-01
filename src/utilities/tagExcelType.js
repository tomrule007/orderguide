import allStoresSalesReportTemplate from 'utilities/documentValidationTemplates/allStoresSalesReportTemplate';
import linkTemplate from 'utilities/documentValidationTemplates/linkTemplate';
import orderGuideTemplate from 'utilities/documentValidationTemplates/orderGuideTemplate';
// dataMatchesTemplate :: [{}] -> [[]] -> Boolean
const dataMatchesTemplate = (template, data) =>
  template.every((rowTemplate, indexRowTemplate) =>
    Object.entries(rowTemplate).every(
      ([indexColumnTemplate, cellTemplate]) =>
        data[indexRowTemplate] !== undefined &&
        (data[indexRowTemplate][indexColumnTemplate] === cellTemplate ||
          cellTemplate === '*') // Support wildcard character '*'
    )
  );

const tagExcelType = (excelDataArray) => {
  // Return null if empty excel sheet
  if (excelDataArray.length === 0) return [null, excelDataArray];

  //Link sheet
  if (
    excelDataArray.length > 1 &&
    dataMatchesTemplate(linkTemplate, excelDataArray)
  )
    return ['linkSheet', excelDataArray];

  // All stores cell sheet
  if (
    excelDataArray.length > 4 &&
    dataMatchesTemplate(allStoresSalesReportTemplate, excelDataArray)
  )
    return ['allStoresReport', excelDataArray];
  // All stores cell sheet
  if (
    excelDataArray.length > 1 &&
    dataMatchesTemplate(orderGuideTemplate, excelDataArray)
  )
    return ['orderGuide', excelDataArray];

  console.log('unknown', excelDataArray);
  return ['unknown', excelDataArray];
};

export default tagExcelType;
