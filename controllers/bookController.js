const Book = require("../models/Book");

exports.createBook = (req, res, next) => {
  try {
    const book = JSON.parse(req.body.book);
    book.userId = req.auth.userId;
    book.imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

    const bookModel = new Book({
      ...book,
    });

    bookModel
      .save()
      .then((response) => {
        res.status(201).json({ message: "Livre ajouté avec succès !" });
      })
      .catch((error) => {
        console.log(error);
        res.status(400).json({ error });
      });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.getBooks = (req, res, next) => {
  try {
    Book.find()
      .then((books) => {
        res.status(200).json(books);
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  } catch (error) {
    res.status(500).json({ error });
  }
};
