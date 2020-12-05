import React from 'react';
import { useDispatch } from 'react-redux';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import { loadFile } from './salesLoaderSlice';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
}));

export default function SalesLoader() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleOnChange = (event) => {
    const { files } = event.target;
    for (let i = 0; i < files.length; i++) {
      dispatch(loadFile(files[i]));
    }
  };

  return (
    <div>
      <input
        accept=".xlsx"
        className={classes.input}
        id="SalesLoader-button"
        multiple
        type="file"
        onChange={handleOnChange}
      />
      <label htmlFor="SalesLoader-button">
        <Button
          variant="contained"
          color="default"
          className={classes.button}
          startIcon={<CloudUploadIcon />}
          component="span"
        >
          Load Sales Data
        </Button>
      </label>
    </div>
  );
}
