// parseOrderGuide :: [[]] -> [{}]
// Remove header/total rows and map remaining rows to column keys
const parseOrderGuide = (excelDataArray) =>
  excelDataArray.slice(1, -1).map((row) => {
    const caseCost = Number(Number(row[16]).toFixed(2));
    return {
      brand: String(row[2]).trim(),
      upc: row[3],
      description: String(row[4]).trim(),
      deliveryDays: row[5],
      retail: Number(row[14]),
      grossMargin: Number((row[15] * 100).toFixed(2)),
      unitCost: Number(row[13]),
      caseCost,
      caseRetail: Number((caseCost * 1.25).toFixed(2)),
    };
  });

export default parseOrderGuide;
