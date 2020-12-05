import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const InstructionalModal = () => {
  const [hideInstructions, setHideInstructions] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('hideInstructions')) return;
    setHideInstructions(false);
  }, []);

  const disableInstructionModal = () => {
    localStorage.setItem('hideInstructions', true); //TODO: Handle storage error situations.
    setHideInstructions(true);
  };
  const tempHideInstructions = () => setHideInstructions(true);

  return hideInstructions ? null : (
    <Dialog
      open={!hideInstructions}
      TransitionComponent={Transition}
      keepMounted
      onClose={tempHideInstructions}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">
        Welcome to orderguide.netlify.app
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          <p>
            A searchable web interface to our produce departments weekly excel
            spreadsheet price list to allow quick lookup of item prices and UPC.
          </p>
          <p>
            (If you don't have access to the spreadsheet you can test run the
            website with the included "load mock data" link.)
          </p>
          <p>
            *Installing a Progressive web app allows the website to operate
            while offline while still maintaining the security of a normal
            website.
          </p>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={disableInstructionModal} color="primary">
          Don't show this popup again
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InstructionalModal;
