import multer, { Multer } from 'multer';
import path from 'path';



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(path.dirname);
    cb(null,  path.join(__dirname, '../../uploads/'));
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, file.originalname);
  }

});

const upload: Multer = multer({ storage:storage });
export default upload;