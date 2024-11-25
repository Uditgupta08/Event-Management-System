// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, "../uploads"));
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// function checkFileType(file, cb) {
//   const filetypes = /jpeg|jpg|png|mp4/;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     cb(null, true);
//   } else {
//     cb(new Error("Error: Images and Videos Only!"));
//   }
// }
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 100 * 1024 * 1024 },
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   },
// }).fields([
//   { name: "profilePhoto", maxCount: 1 },
//   { name: "photos", maxCount: 10 },
// ]);

// module.exports = upload;
const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "eventTrain",
    allowed_formats: ["jpeg", "jpg", "png", "webp", "mp4"],
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|mp4/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error("Error: Images and Videos Only!"));
    }
  },
}).fields([
  { name: "profilePhoto", maxCount: 1 },
  { name: "photos", maxCount: 10 },
]);

module.exports = upload;
