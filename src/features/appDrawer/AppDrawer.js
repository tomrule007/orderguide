import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import FileLoader from '../fileLoader/FileLoader';
import SalesLoader from '../salesLoader/SalesLoader';

import { toggleDrawer } from './appDrawerSlice';

export default function AppDrawer() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.appDrawer.isOpen);

  const handleToggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    dispatch(toggleDrawer(open));
  };

  return (
    <SwipeableDrawer
      anchor="left"
      open={isOpen}
      onClose={handleToggleDrawer(false)}
      onOpen={handleToggleDrawer(true)}
    >
      <List>
        <ListItem>
          <FileLoader />
        </ListItem>
        <ListItem>
          <SalesLoader />
        </ListItem>
      </List>
    </SwipeableDrawer>
  );
}
