import { Box, Button, Container, Typography } from '@material-ui/core';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import Link from '@material-ui/core/Link';
import React from 'react';
import getPublicFile from 'utilities/getPublicFile';
import { loadFile } from 'reducers/fileStoreSlice';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  centerImage: {
    verticalAlign: 'middle',
  },
  link: {
    textAlign: 'center',
    marginTop: '1rem',
    marginLeft: '1rem',
    display: 'inline-block',
  },
  button: {
    margin: theme.spacing(2),
  },
}));

const mockFiles = [
  'MockOrderGuide.xlsx',
  'MockSalesReport1.xlsx',
  'MockSalesReport2.xlsx',
  'MockSalesReport3.xlsx',
  'MockSalesReport4.xlsx',
  'MockSalesReport5.xlsx',
  'MockSalesReport6.xlsx',
  'MockSalesReport7.xlsx',
  'MockSalesReport8.xlsx',
];

const PublicExcelLink = ({ file, title }) => {
  const classes = useStyles();

  return (
    <Link
      className={classes.link}
      variant="subtitle1"
      href={process.env.PUBLIC_URL + '/mockData/' + file}
    >
      <img
        className={classes.centerImage}
        alt="excel file icon"
        width="16"
        height="16"
        src={process.env.PUBLIC_URL + '/excelIcon.svg'}
      />
      {title}
    </Link>
  );
};

const MissingDataPage = ({ navigate }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const loadMockData = () => {
    mockFiles.forEach((fileName) =>
      getPublicFile('/mockData/', fileName).then((file) =>
        dispatch(loadFile(file))
      )
    );
  };
  const handleGotoUploadClick = () => navigate(`/upload`);
  return (
    <Box
      flex="1 1 auto"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="center"
    >
      <Typography variant="h2" align="center">
        No Data Loaded...
      </Typography>

      <Box textAlign="center" m={2}>
        <Button
          variant="contained"
          color="default"
          className={classes.button}
          startIcon={<CloudUploadIcon />}
          onClick={handleGotoUploadClick}
        >
          Goto Upload Page
        </Button>

        <Typography variant="body1" align="center">
          or
        </Typography>

        <Button
          variant="contained"
          color="default"
          className={classes.button}
          startIcon={<FlashOnIcon />}
          onClick={loadMockData}
        >
          Autoload Mock Data
        </Button>
      </Box>

      <Container maxWidth="md">
        <Box textAlign="center" m={2}>
          <Typography variant="subtitle2" align="center" marginTop={1}>
            Mock Source Files
          </Typography>

          {mockFiles.map((fileName) => (
            <PublicExcelLink file={fileName} title={fileName} />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default MissingDataPage;
