import { createSlice } from '@reduxjs/toolkit';
import localForage from 'localforage';
import md5 from 'md5';
import getExcelData from 'utilities/getExcelData';
import tagExcelType from 'utilities/tagExcelType';
import parseAllStoresReport from 'utilities/parseAllStoresReport';
import parseOrderGuide from 'utilities/parseOrderGuide';

export const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const SUPPORTED_FILE_TYPES = [EXCEL_TYPE];
const FILE_SIZE_LIMIT = 500000; // 500kB

export const fileStoreSlice = createSlice({
  name: 'fileStore',
  initialState: {
    files: {},
    salesDataFiles: {},
    orderGuideMetadata: {
      id: null,
      lastModified: null,
      dateLoaded: null,
    },
  },
  reducers: {
    updateOrderGuideMetadata: (state, action) => {
      console.log('SETTING ACTION', action.payload);
      state.orderGuideMetadata = action.payload;
    },
    addFile: (state, action) => {
      state.files[action.payload.id] = action.payload;
    },
    updateFile: (state, action) => {
      const file = state.files[action.payload.id];
      if (file) {
        const updatedFile = { ...file, ...action.payload };
        state.files[action.payload.id] = updatedFile;
      }
    },
    removeFile: (state, action) => {
      delete state.files[action.payload];
    },
  },
});

export const {
  addFile,
  updateFile,
  removeFile,
  updateOrderGuideMetadata,
} = fileStoreSlice.actions;
export const selectFileStore = (state) => state.fileStore.files;
export const selectOrderGuideMetadata = (state) =>
  state.fileStore.orderGuideMetadata;

export default fileStoreSlice.reducer;
export const getBlob = (id) => localForage.getItem(id);

export const loadFile = (file) => async (dispatch) => {
  console.log(file);
  const fileMetadata = {
    id: file.name.concat(file.lastModified),
    status: 'loading',
    name: file.name,
    lastModified: file.lastModified,
    dateLoaded: Date.now(),
    type: file.type,
    size: file.size,
  };
  dispatch(addFile(fileMetadata));
  try {
    if (file.size > FILE_SIZE_LIMIT)
      throw Error(
        `FILE IS LARGER THAN ${(FILE_SIZE_LIMIT / 1000).toFixed(
          0
        )}kB limit --> ${(file.size / 1000).toFixed(0)}kB`
      );
    console.log(file.type);
    if (!SUPPORTED_FILE_TYPES.some((type) => file.type === type))
      throw Error(`UNSUPPORTED FILE TYPE --> ${file.type || 'UNKNOWN'}`);

    const fileBuffer = await file.arrayBuffer();
    // TODO: use md5 hash to check for duplicate data or prevent uploads of same data.
    const hash = md5(fileBuffer);

    await localForage.setItem(fileMetadata.id, file);
    dispatch(updateFile({ id: fileMetadata.id, status: 'identifying', hash }));

    // TODO: get rid of this messy nested switch logic
    switch (file.type) {
      case EXCEL_TYPE:
        const taggedExcelData = tagExcelType(getExcelData(fileBuffer));
        switch (taggedExcelData[0]) {
          case 'allStoresReport':
            const parsedAllStoresReport = parseAllStoresReport(taggedExcelData);
            const { date, data } = parsedAllStoresReport;
            console.log(parsedAllStoresReport);
            await localForage.setItem(date, data);

            // Update Raw File Reference
            dispatch(
              updateFile({
                id: fileMetadata.id,
                status: `All Stores Sales Report: ${date}`,
              })
            );
            // TODO: create dispatch action to add file to saleDataFiles (bettername? ParsedData? )
            break;
          case 'orderGuide':
            const parsedOrderGuide = parseOrderGuide(taggedExcelData[1]);
            await localForage.setItem('orderGuide', parsedOrderGuide);
            // Update Raw File Reference
            dispatch(
              updateFile({
                id: fileMetadata.id,
                status: `ORDER GUIDE: ${file.lastModified}`,
              })
            );
            // Update OrderGuide Metadata (currently only support one file)
            dispatch(
              updateOrderGuideMetadata({
                id: fileMetadata.id,
                lastModified: fileMetadata.lastModified,
                dateLoaded: fileMetadata.dateLoaded,
              })
            );
            break;

          default:
            throw Error(`Unidentified excel file`);
        }
        break;
      default:
        break;
    }
  } catch (error) {
    dispatch(
      updateFile({
        id: fileMetadata.id,
        status: 'error',
        error: error.toString(),
      })
    );
  }
};

// TODO: decide how to handle error states, currently always removes file ref
export const deleteFile = (fileId) => async (dispatch) => {
  try {
    await localForage.removeItem(fileId);
    dispatch(removeFile(fileId));
  } catch (error) {
    console.log('DELETE FILE ERROR: -->', error.toString());
  }
};

export const getOrderGuide = () => localForage.getItem('orderGuide');
