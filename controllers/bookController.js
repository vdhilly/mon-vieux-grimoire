const Book = require("../models/Book");

exports.createBook = (req, res, next) => {
  res.status(201).json({ message: "Bravo" });
};
