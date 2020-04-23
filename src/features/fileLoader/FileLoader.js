import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
}));

const handleOnChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // dispatch(createOrderGuideData(file))
};

export default function IconLabelButtons() {
  const classes = useStyles();

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
          Load
        </Button>
      </label>
    </div>
  );
}
