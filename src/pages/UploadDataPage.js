import {
  EXCEL_TYPE,
  deleteFile,
  getBlob,
  selectFileStore,
} from 'reducers/fileStoreSlice';
import {
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BackdropLoadingSpinner from 'components/loadingBackdrop/LoadingBackdrop';
import DeleteIcon from '@material-ui/icons/Delete';
import ErrorIcon from '@material-ui/icons/Error';
import FileDropzone from 'components/FileDropzone/FileDropzone';
import FileSaver from 'file-saver';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';

const UploadDataPage = () => {
  // TODO: fix this loading spinner
  // currently doesn't work because 'files' is changing and causing a lot of rerenders
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const files = useSelector(selectFileStore);
  console.log('loading', isLoading);
  return (
    <>
      <BackdropLoadingSpinner showBackdrop={isLoading} />
      <Typography variant="h2" align="center">
        Upload Files
      </Typography>
      <Typography variant="subtitle2" align="center">
        (Order Guides / Sales Reports)
      </Typography>
      <Grid container justify="center" spacing={3} p={3}>
        <Grid item xs={12} lg={8}>
          <FileDropzone
            text="Click or drag n' drop files here"
            loadingCallback={setIsLoading}
          />
        </Grid>
        <Grid item xs={12} lg={5}>
          <Typography variant="h4" align="center">
            Loaded Files
          </Typography>
          <Paper>
            <List>
              {Object.values(files).map((file) => (
                <ListItem>
                  <ListItemAvatar>
                    {file.error ? (
                      <ErrorIcon color="error" />
                    ) : file.type === EXCEL_TYPE ? (
                      <PictureAsPdfIcon color="primary" />
                    ) : null}
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      file.error ? (
                        file.name
                      ) : (
                        <Tooltip title="Download">
                          <Link
                            href="#"
                            onClick={(event) => {
                              event.preventDefault();
                              getBlob(file.id).then((blob) =>
                                FileSaver.saveAs(blob, file.name)
                              );
                            }}
                          >
                            {file.name}
                          </Link>
                        </Tooltip>
                      )
                    }
                    secondary={file.error ? file.error : file.status}
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Delete">
                      <IconButton
                        aria-label="delete"
                        onClick={() => dispatch(deleteFile(file.id))}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};
export default UploadDataPage;
