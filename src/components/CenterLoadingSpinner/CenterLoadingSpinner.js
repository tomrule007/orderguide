import { CircularProgress } from '@material-ui/core';
import React from 'react'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    center: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: '1 1 auto',
    }
  });
  
export default function CenterLoadingSpinner() {
    const classes = useStyles();
    return (
       <div className={classes.center}>
        <CircularProgress size="5rem" />
      </div>
    )
}
