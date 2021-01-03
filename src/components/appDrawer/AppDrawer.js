import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  List,
  Divider,
  SwipeableDrawer,
  Typography,
} from '@material-ui/core';
import ListItemLink from 'components/ListItemLink/ListItemLink';
import AssessmentIcon from '@material-ui/icons/Assessment';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import TimelineIcon from '@material-ui/icons/Timeline';

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
      <Box m={2}>
        <Typography variant="h6">Retail Insight</Typography>
        <Typography variant={'caption'}>v0.1</Typography>
      </Box>
      <Divider />
      <List
        onkeyDown={handleToggleDrawer(false)}
        onClick={handleToggleDrawer(false)}
      >
        <ListItemLink
          to="/"
          text={'Sales Dashboard'}
          icon={<TimelineIcon />}
        ></ListItemLink>
        <Divider />
        <ListItemLink
          to="orderguide"
          text={'Order Guide'}
          icon={<AssignmentIcon />}
        ></ListItemLink>
        <ListItemLink
          to="dailysales"
          text={'Daily Sales'}
          icon={<AssessmentIcon />}
        ></ListItemLink>
        <Divider />
        <ListItemLink
          to="upload"
          text={'Upload Data'}
          icon={<CloudUploadIcon />}
        ></ListItemLink>
      </List>
    </SwipeableDrawer>
  );
}
