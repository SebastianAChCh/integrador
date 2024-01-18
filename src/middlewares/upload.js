<<<<<<< Updated upstream
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

let exceed = 1;
const storeImages = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, './public/uploads');
  },
  filename: (_req, file, cb) => {
    cb(null, uuidv4() + file.originalname);
  },
});

const handleErrorsImgs = (req, file, cb) => {
  const types = ['jpg', 'jpeg', 'png', 'gif', 'blend'];
  const mimeType = file.mimetype.toString().split('/');

  for (let i = 0; i < types.length; i++) {
    if (
      mimeType[1] == types[i] ||
      (mimeType[1] === 'octet-stream' && exceed === 1)
    ) {
      if (mimeType[1] === 'octet-stream' && exceed === 1) exceed++;
      return cb(null, true);
    } else if (i == types.length - 1 && mimeType[1] != types[i]) {
      cb(new Error('error'), false);
      exceed = 1;
    }
  }
};

export const uploadImages = multer({
  storage: storeImages,
  fileFilter: handleErrorsImgs,
}).array('files', 10);
=======
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

let exceed = 1;
const storeImages = multer.diskStorage({
  destination: (_req, file, cb) => {
    cb(null, './public/uploads');
  },
  filename: (_req, file, cb) => {
    cb(null, uuidv4() + file.originalname);
  },
});

const storeAvatarImgs = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/avatar');
  },
  filename: (_req, file, cb) => {
    cb(null, uuidv4() + file.originalname);
  },
});

const storeFiles = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, './public/files');
  },

  filename: (_req, file, cb) => {
    cb(null, uuidv4() + file.originalname);
  },
});

const handleErrorsImgs = (req, file, cb) => {
  const types = ['jpg', 'jpeg', 'png', 'gif', 'blend'];
  const mimeType = file.mimetype.toString().split('/');

  console.log(file);

  for (let i = 0; i < types.length; i++) {
    if (
      mimeType[1] == types[i] ||
      (mimeType[1] === 'octet-stream' && exceed === 1)
    ) {
      if (mimeType[1] === 'octet-stream' && exceed === 1) exceed++;
      return cb(null, true);
    } else if (i == types.length - 1 && mimeType[1] != types[i]) {
      cb(new Error('error'), false);
      exceed = 1;
    }
  }
};

export const uploadImages = multer({
  fileFilter: handleErrorsImgs,
  storage: storeImages,
  // limits: {
  //   fileSize: 1000000000000000,
  //   fieldNameSize: 1000000000000000,
  // },
}).array('postImages', 10);

export const uploadFiles = multer({
  storage: storeFiles,
}).single('file');

export const uploadAvatars = multer({
  storage: storeAvatarImgs,
}).single('file');
>>>>>>> Stashed changes
