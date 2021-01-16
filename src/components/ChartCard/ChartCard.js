import React, { useState } from 'react';

import AutoSizer from 'react-virtualized-auto-sizer';
import Chart from 'react-apexcharts';

const ChartCard = ({ title }) => {
  const [state, setState] = useState({
    options: {
      chart: {
        id: 'basic-bar',
      },
      xaxis: {
        categories: [
          1991,
          1992,
          1993,
          1994,
          1995,
          1996,
          1997,
          1998,
          1999,
          2000,
          2001,
          2002,
          2003,
          2004,
          2005,
          2006,
        ],
      },
    },
    series: [
      {
        name: 'TY',
        data: [
          30,
          40,
          45,
          50,
          49,
          60,
          70,
          91,
          30,
          40,
          45,
          50,
          49,
          60,
          70,
          91,
          30,
          40,
          45,
          50,
          49,
          60,
          70,
          49,
          60,
          70,
          91,
          30,
          40,
          45,
          50,
          49,
          60,
          70,
          91,
          49,
          60,
          70,
          91,
          30,
          40,
          45,
          50,
          49,
          60,
          70,
          91,
          91,
        ],
      },
      {
        name: 'LY',
        data: [40, 45, 500, 49, 60, 70, 91, 30],
      },
    ],
  });
  const { options, series } = state;
  return (
    <AutoSizer>
      {({ height, width }) => (
        <Chart
          title="Sales Catagories"
          options={options}
          series={series}
          type="bar"
          width={width}
          height={height - 2}
        />
      )}
    </AutoSizer>
  );
};

export default ChartCard;
