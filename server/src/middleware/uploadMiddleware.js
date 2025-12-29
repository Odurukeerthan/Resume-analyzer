import multer from "multer";
import path from "path";
// nothing
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "src/uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname);
  if (ext !== ".pdf") {
    return cb(new Error("Only PDF files are allowed"));
  }
  cb(null, true);
}

const upload = multer({ storage, fileFilter });

export default upload;
