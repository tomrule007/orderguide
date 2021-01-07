import React from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';

import { loadFile } from 'reducers/fileStoreSlice';
import { mockOrderGuideFile } from './mockOrderGuideFile';

const useStyles = makeStyles({
  container: {
    textAlign: 'center',
    marginTop: '2rem',
  },
});

function MockDataLink() {
  const dispatch = useDispatch();

  const loadMockData = () => {
    dispatch(loadFile(mockOrderGuideFile));
  };
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Link component="button" variant="subtitle1" onClick={loadMockData}>
        (Load mock data *Missing some fields)
      </Link>
    </div>
  );
}

export default MockDataLink;
