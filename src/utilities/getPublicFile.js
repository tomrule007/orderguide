import { EXCEL_TYPE, UNKNOWN_TYPE } from 'reducers/fileStoreSlice';

const getPublicFile = async (path, fileName) => {
  const extension = fileName.split('.')[1];

  let file = await fetch(process.env.PUBLIC_URL + path + fileName)
    .then((r) => r.blob())
    .then(
      (blob) =>
        new File([blob], fileName, {
          type: getFileType(extension),
        })
    );

  return file;
};

const extensionToType = {
  xlsx: EXCEL_TYPE,
};

const getFileType = (extension) => extensionToType[extension] || UNKNOWN_TYPE;

export default getPublicFile;
