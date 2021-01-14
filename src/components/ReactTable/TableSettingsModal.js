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
import PropTypes from 'prop-types';
import React from 'react';
import { setHiddenColumns } from 'reducers/settingsSlice';
import { useDispatch } from 'react-redux';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const TableSettingsModal = ({
  open,
  onClose,
  getToggleHideAllColumnsProps,
  allColumns,
  tableId,
}) => {
  const dispatch = useDispatch();

  const onCloseWithPersist = () => {
    const hiddenColumnIds = allColumns.filter(({isVisible}) => !isVisible).map(({id})=> id);
    dispatch(
      setHiddenColumns({
        tableId,
        columns: hiddenColumnIds
      }));
    onClose();
  }
  return (
    <Dialog open={open} TransitionComponent={Transition} onClose={onCloseWithPersist}>
      <DialogTitle align="center">Set Visible Columns</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <label>
            <IndeterminateCheckbox {...getToggleHideAllColumnsProps()} /> Toggle
            All
          </label>
          {allColumns.map((column) => {
            return (
              <div key={column.id}>
                <label>
                  <input
                    type="checkbox"  {...column.getToggleHiddenProps()}
                  />
                  {column.Header}
                </label>
              </div>
            );
          })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseWithPersist} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

TableSettingsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  getToggleHideAllColumnsProps: PropTypes.func.isRequired,
  allColumns: PropTypes.array.isRequired,
  tableId: PropTypes.string.isRequired,
};

export default TableSettingsModal;
