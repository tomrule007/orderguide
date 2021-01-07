import React from 'react';
import { useDispatch } from 'react-redux';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import { loadFile } from 'reducers/fileStoreSlice';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
}));

export default function IconLabelButtons() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleOnChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    dispatch(loadFile(file));
  };

  return (
    <div>
      <input
        accept=".xlsx"
        className={classes.input}
        id="fileLoader-button"
        multiple
        type="file"
        onChange={handleOnChange}
      />
      <label htmlFor="fileLoader-button">
        <Button
          variant="contained"
          color="default"
          className={classes.button}
          startIcon={<CloudUploadIcon />}
          component="span"
        >
          Load Order Guide
        </Button>
      </label>
    </div>
  );
}
