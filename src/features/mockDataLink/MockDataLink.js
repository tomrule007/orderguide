import React from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';

import { loadFile } from '../fileLoader/fileLoaderSlice';
import { mockData } from './mockData';

const useStyles = makeStyles({
  container: {
    textAlign: 'center',
    marginTop: '2rem',
  },
});

function MockDataLink() {
  const dispatch = useDispatch();

  const loadMockData = () => {
    dispatch(loadFile(mockData));
  };
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Link component="button" variant="subtitle1" onClick={loadMockData}>
        (Load mock data)
      </Link>
    </div>
  );
}

export default MockDataLink;
