import AutoSizer from 'react-virtualized-auto-sizer';
import Chart from 'react-apexcharts';
import React from 'react';

const ChartCard = ({ title, ...rest }) => {
  return (
    <AutoSizer>
      {({ height, width }) => (
        <Chart {...rest} width={width} height={height - 2} />
      )}
    </AutoSizer>
  );
};

export default ChartCard;
