import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import { setFilterText } from '../appBar/appBarSlice';
import {
  setOpen,
  setEnableScanner,
  selectOpen,
  selectEnableScanner,
} from './barcodeScannerModalSlice';
import BarcodeScanner from '../barcodeScanner/BarcodeScanner';
import './BarcodeScannerModal.css';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function BarcodeScannerModal() {
  const open = useSelector(selectOpen);
  const enableScanner = useSelector(selectEnableScanner);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setEnableScanner(false));
    dispatch(setOpen(false));
  };
  const onDetected = (results) => {
    dispatch(setFilterText(results));
    handleClose();
  };

  return (
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
      <BarcodeScanner onDetected={onDetected} enabled={enableScanner} />
    </Dialog>
  );
}
