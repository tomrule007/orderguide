import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import RootRef from '@material-ui/core/RootRef';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PublishIcon from '@material-ui/icons/Publish';
import { loadFile } from 'reducers/fileStoreSlice';

const useStyles = makeStyles((theme) => ({
  dropContainer: {
    border: `4px dashed ${theme.palette.primary.light}`,
  },
}));

const FileDropzone = ({ text, loadingCallback }) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (loadingCallback && acceptedFiles) loadingCallback(true);
      acceptedFiles.forEach(async (file) => {
        dispatch(loadFile(file));
      });
      if (loadingCallback) loadingCallback(false);
    },
    [loadingCallback, dispatch]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  const { ref, ...rootProps } = getRootProps();
  return (
    <RootRef rootRef={ref}>
      <Box
        {...rootProps}
        className={classes.dropContainer}
        m={2}
        p={2}
        textAlign="center"
      >
        <input {...getInputProps()} />
        <PublishIcon />
        <Typography variant="subtitle2">{text}</Typography>
      </Box>
    </RootRef>
  );
};

export default FileDropzone;
