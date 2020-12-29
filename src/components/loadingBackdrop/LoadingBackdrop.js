import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function LoadingBackdrop({ showBackdrop }) {
  const classes = useStyles();

  return (
    <Backdrop className={classes.backdrop} open={showBackdrop}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
