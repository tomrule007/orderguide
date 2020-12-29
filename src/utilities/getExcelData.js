import XLSX from 'xlsx';
const getExcelData = (fileData) => {
  const isBase64 = typeof fileData === 'string';
  const wb = XLSX.read(isBase64 ? fileData : fileData, {
    type: isBase64 ? 'base64' : 'array',
  });

  /* Get first worksheet */
  const wsname = wb.SheetNames[0];
  const ws = wb.Sheets[wsname];

  /* Convert array of arrays */
  return XLSX.utils.sheet_to_json(ws, { header: 1 });
};

export default getExcelData;
