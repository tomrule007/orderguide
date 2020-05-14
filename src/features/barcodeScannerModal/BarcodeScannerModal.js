import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import BarcodeScanner from '../barcodeScanner/BarcodeScanner';
import './BarcodeScannerModal.css';

const useStyles = makeStyles((theme) => ({
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function BarcodeScannerModal() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [scannerEnabled, setScannerEnabled] = useState(false);

  function handleClickOpen() {
    console.log('OPEN AND SET SCANNER TO ENABLED MODE');
    setOpen(true);
    setScannerEnabled(true);
  }

  function handleClose() {
    console.log('CLOSE AND SET SCANNER TO DISABLED MODE');
    setOpen(false);
    setScannerEnabled(false);
  }

  const onDetected = (results) => {
    console.log('results', results);
    setScannerEnabled(false);
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open full-screen dialog
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar color="transparent" elevation={0}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <BarcodeScanner onDetected={onDetected} enabled={scannerEnabled} />
      </Dialog>
    </div>
  );
}
