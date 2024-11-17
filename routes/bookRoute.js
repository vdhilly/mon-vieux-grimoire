const express = require("express");
const bookController = require("../controllers/bookController.js");
const multer = require("../middleware/multer.js");
const auth = require("../middleware/auth.js");
const router = express.Router();

router.post("/", auth, multer, bookController.createBook);
router.get("/", bookController.getBooks);
router.get("/:id", bookController.getSingleBook);
router.put("/:id", auth, bookController.modifyBook);

module.exports = router;
