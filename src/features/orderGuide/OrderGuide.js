import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const columns = [
  { id: 'brand', label: 'Brand' },
  { id: 'upc', label: 'UPC' },
  { id: 'description', label: 'Description' },
  { id: 'retail', label: 'Retail' },
  { id: 'caseRetail', label: 'Case Retail' },
];

function createData([brand, upc, description, retail, caseCost]) {
  const caseRetail = (caseCost * 1.25).toFixed(2);
  return { brand, upc, description, retail, caseRetail };
}

const rows = [
  ['WA', 94178, 'APPLE "LUNCHBOX" SMALL SIZE MISC', 1.91, 36.86],
  ['WA', 93616, 'APPLE ENVY OG 27#', 2.57, 45.41],
  ['WA', 93231, 'APPLE ENVY OG 38# "LUNCHBOX"', 1.14, 29.76],
  ['ORWA', 94131, 'APPLE FUJI OG', 2.44, 30.67],
  ['ORWA', 93229, 'APPLE FUJI OG 38# "LUNCHBOX"', 2.01, 47.91],
  ['ORWA', 94174, 'APPLE GALA OG 38#', 3.3, 33.85],
  ['CAWA', 94017, 'APPLE GRANNY SMITH OG', 2.69, 37.37],
  ['WA', 93232, 'APPLE HONEYCRISP OG  "LUNCHBOX', 2.01, 44.41],
  ['ORWA', 93283, 'APPLE HONEYCRISP OG 38#', 4.51, 45.57],
  ['WA', 94115, 'APPLE JAZZ OG', 2.22, 45.32],
  ['WA', 93618, 'APPLE OPAL OG', 2.79, 26.26],
  ['WA', 94130, 'APPLE PINK LADY OG 38#', 2.16, 49.54],
  ['NEWZE', 94210, 'APPLE PREMIER STAR OG', 1.81, 32.58],
  ['CHILE', 3603, 'APPLE TANGO UNWAXED "NEWCROP"', 3.36, 40.21],
  ['CA', 94218, 'APRICOT OG 2LAYER', 4.72, 24.78],
  ['CA', 94221, 'AVOCADO FUERTE OG 48CT', 5.56, 66.95],
  ['MEX', 76101098146, 'AVOCADO HASS BAG OG MINI 14X6', 4.32, 52.25],
  ['MEX', 7074014570, 'AVOCADO HASS BAGS OG', 4.22, 40.32],
  ['CA', 94228, 'AVOCADO HASS BAGS OG 18X4CT', 5.56, 48.16],
  ['MEX', 4221, 'AVOCADO HASS NOG  #2 48CT/LG VA ONLY', 2.31, 45.04],
  ['CA', 94046, 'AVOCADO HASS OG 70CT', 2.91, 40.02],
  ['CA', 86174700002, 'AVOCADO HASS OG 8X4 GATOR EGGS', 5.65, 31.94],
  ['CA', 94225, 'AVOCADO HASS OG LARGE 32/40CT', 3.0, 71.34],
  ['HAWAC', 94771, 'AVOCADO SHARWIL OG 30# WA ONLY', 4.0, 95.41],
  ['EC', 4234, 'BANANA BABY 15#', 1.97, 14.23],
  ['EC', 94234, 'BANANA BABY OG 15#', 2.22, 16.61],
  ['EC', 4235, 'BANANA PLANTAIN 50#', 0.9, 38.69],
  ['MEX', 94235, 'BANANA PLANTAINS OG 50#', 1.48, 49.72],
  ['ECM', 94011, 'BANANAS OG', 0.77, 20.04],
  ['MEX', 94251, 'BERRY BLACKBERRIES OG 6OZ', 4.06, 32.16],
  ['MEX', 4239, 'BERRY BLACKBERRY NOG 12X12OZ', 4.43, 49.52],
].map(createData);

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

export default function OrderGuideTable() {
  const classes = useStyles();

  return (
    <TableContainer className={classes.root}>
      <Table stickyHeader size="small" aria-label="sticky table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            return (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.upc}>
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {value}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
