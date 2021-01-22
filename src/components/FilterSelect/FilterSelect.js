import { ListItem, ListItemText } from '@material-ui/core';
import { Paper, Tooltip, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';

import InputBase from '@material-ui/core/InputBase';
import { FixedSizeList as List } from 'react-window';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'inline-block',
    backgroundColor: theme.palette.background.paper,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },

  center: {
    textAlign: 'center',
  },
}));

const FilterSelect = ({ title, data, onSelect, selectedValue, width }) => {
  const classes = useStyles();
  const [filterText, setFilterText] = useState('');

  const filteredData = data.filter(({ display }) =>
    display.toLowerCase().includes(filterText)
  );

  const Item = ({ data, index, style }) => {
    return data[index].getTooltip ? (
      <Tooltip title={data[index].getTooltip()}>
        <ListItem
          style={style}
          key={data[index].value}
          button
          selected={data[index].value === selectedValue}
          onClick={() => onSelect(data[index].value)}
        >
          <ListItemText primary={data[index].display} />
        </ListItem>
      </Tooltip>
    ) : (
      <ListItem
        style={style}
        key={data[index].value}
        button
        selected={data[index].value === selectedValue}
        onClick={() => onSelect(data[index].value)}
      >
        <ListItemText primary={data[index].display} />
      </ListItem>
    );
  };

  return (
    <Paper className={classes.root} elevation={3}>
      <Typography className={classes.center} variant="h6">
        {title + ' (' + filteredData.length + ' of ' + data.length + ')'}
      </Typography>
      <List
        className="List"
        height={300}
        itemCount={filteredData.length}
        itemSize={35}
        width={width}
        overscanCount={4}
        itemData={filteredData}
      >
        {Item}
      </List>
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder="Search…"
          value={filterText}
          onChange={(event) => {
            setFilterText(event.target.value);
            onSelect(null); // Clear currently selected item if there is one
          }}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search' }}
        />
      </div>
    </Paper>
  );
};

FilterSelect.defaultProps = {
  width: 500,
};

export default FilterSelect;
