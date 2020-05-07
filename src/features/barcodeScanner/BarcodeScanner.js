import React, { useRef } from 'react';
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

import { BrowserQRCodeReader } from '@zxing/library';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function BarcodeScanner() {
  const videoEl = useRef(null);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  function handleStart() {
    console.log('ref', videoEl.current);
    const codeReader = new BrowserQRCodeReader();
    codeReader
      .decodeOnceFromVideoDevice(undefined, 'video')
      .then((result) => console.log(result.text))
      .catch((err) => console.error(err));
    console.log('HOW DO I GET THIS?');
  }

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

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
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Sound
            </Typography>
            <Button color="inherit" onClick={handleStart}>
              Start
            </Button>
          </Toolbar>
        </AppBar>
        <Paper>
          <div>test</div>
          <video
            ref={videoEl}
            id="video"
            width="300"
            height="200"
            style={{ border: '1px solid gray' }}
          ></video>
        </Paper>
      </Dialog>
    </div>
  );
}
