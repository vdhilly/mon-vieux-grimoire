const express = require("express");
const bookController = require("../controllers/bookController.js");
const multer = require("../middleware/multer.js");
const auth = require("../middleware/auth.js");
const router = express.Router();

router.post("/", auth, multer, multer.resizeImage, bookController.createBook);
router.get("/", bookController.getBooks);
router.get("/bestrating", bookController.getBestRating);
router.get("/:id", bookController.getSingleBook);
router.put("/:id", auth, multer, multer.resizeImage, bookController.modifyBook);
router.post("/:id/rating", auth, bookController.updateRatings);
router.delete("/:id", auth, bookController.deleteBook);

module.exports = router;
