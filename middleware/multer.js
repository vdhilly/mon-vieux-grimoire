const multer = require("multer");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("image");

module.exports.resizeImage = (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }
    const filePath = req.file.path;
    const fileName = req.file.filename;

    const newFilePath = path.join("images", "resized_" + fileName);

    sharp.cache(false);
    sharp(filePath)
      .resize({ width: 400, fit: sharp.fit.contain })
      .toFile(newFilePath)
      .then(() => {
        fs.unlink(filePath, (error) => {
          req.file.path = newFilePath;
          next();
        });
      })
      .catch((error) => {
        console.log(error);
        return next();
      });
  } catch (error) {
    res.status(500).json({ error });
  }
};
