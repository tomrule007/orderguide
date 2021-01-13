import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from '@material-ui/core';

import IndeterminateCheckbox from 'components/IndeterminateCheckbox/IndeterminateCheckbox';
import React from 'react';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const TableSettingsModal = ({
  open,
  onClose,
  getToggleHideAllColumnsProps,
  allColumns,
}) => {
  return (
    <Dialog open={open} TransitionComponent={Transition} onClose={onClose}>
      <DialogTitle align="center">Set Visible Columns</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <label>
            <IndeterminateCheckbox {...getToggleHideAllColumnsProps()} /> Toggle
            All
          </label>
          {allColumns.map((column) => (
            <div key={column.id}>
              <label>
                <input type="checkbox" {...column.getToggleHiddenProps()} />
                {console.log(column)}
                {column.Header}
              </label>
            </div>
          ))}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TableSettingsModal;
