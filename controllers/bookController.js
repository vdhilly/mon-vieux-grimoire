const { default: mongoose } = require("mongoose");
const Book = require("../models/Book");

exports.createBook = (req, res, next) => {
  try {
    const book = JSON.parse(req.body.book);
    book.userId = req.auth.userId;
    // resize
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

exports.getSingleBook = async (req, res, next) => {
  try {
    Book.findOne({ _id: req.params.id })
      .then((book) => res.status(200).json(book))
      .catch((error) => res.status(404).json({ error }));
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.modifyBook = (req, res, next) => {
  try {
    // resize
    const bookObject = req.file
      ? { ...JSON.parse(req.body.book), imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}` }
      : { ...req.body };

    Book.findOne({ _id: req.params.id }).then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "Requète non-autorisée" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];

        Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
          .then(() => {
            req.file &&
              fs.unlink(`images/${filename}`, (err) => {
                if (err) console.log(err);
              });
            res.status(200).json({ message: "Objet modifié !" });
          })
          .catch((error) => res.status(400).json({ error }));
      }
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.updateRatings = (req, res, next) => {
  try {
    Book.findOne({ _id: req.params.id })
      .then((book) => {
        const userId = req.auth.userId;
        const { rating } = req.body;

        if (book.ratings.some((rating) => rating.userId === userId)) {
          return res.status(401).json({ message: "Requête non-autorisée" });
        }

        book.ratings.push({ userId, grade: rating });

        const grades = book.ratings.map((r) => r.grade);
        const averageRating = getAverage(grades);

        book.averageRating = averageRating;

        const updatedBook = {
          ratings: book.ratings,
          averageRating,
          _id: req.params.id,
        };

        return Book.updateOne({ _id: req.params.id }, updatedBook)
          .then(() => res.status(200).json(book))
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  } catch (error) {
    res.status(500).json({ error });
  }
};

function getAverage(grades) {
  let sum = 0;
  for (let nb of grades) {
    sum += nb;
  }
  return (sum / grades.length).toFixed(1);
}
