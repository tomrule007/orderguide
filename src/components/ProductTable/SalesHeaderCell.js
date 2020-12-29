import React from 'react';
import { TableCell, MenuItem, Select } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { selectDays, selectFilters, setStore } from 'reducers/filtersSlice';

const SalesHeaderCell = ({ selectValue, selectOnChange }) => {
  const dispatch = useDispatch();
  const { store } = useSelector(selectFilters);

  const handleSelectStore = (e) => dispatch(setStore(e.target.value));

  return (
    <TableCell align={'center'} colSpan={7}>
      {'Sales History ( Display: '}
      <Select value={selectValue} onChange={selectOnChange}>
        <MenuItem value={0}>Units</MenuItem>
        <MenuItem value={1}>Cases</MenuItem>
        <MenuItem value={2}>$</MenuItem>
      </Select>
      {' Store: '}
      <Select value={store.selected} onChange={handleSelectStore}>
        {store.list.map((name, index) => (
          <MenuItem key={index} value={index}>
            {name}
          </MenuItem>
        ))}
      </Select>
      {')'}
    </TableCell>
  );
};

export default SalesHeaderCell;
