const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");
const Book = require("../models/book");

//below apis for admin
//add book --admin
router.post("/add-book", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);
    if (user.role !== "admin") {
      return res
        .status(400)
        .json({ message: "You are not having access to perform admin work" });
    }
    const book = new Book({
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language,
    });
    await book.save();
    res.status(200).json({ message: "Book Created Sucessfully" });
  } catch (error) {
    console.error("Error during sign-up:", error); // Log the actual error
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//update book
router.put("/update-book", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;
    await Book.findByIdAndUpdate(bookid, {
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language,
    });

    return res.status(200).json({
      message: "Book Updated Successfully",
    });
  } catch (error) {
    console.error("Error during Book-Updating:", error); // Log the actual error
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//delete book
router.delete("/delete-book", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;
    await Book.findByIdAndDelete(bookid);
    return res.status(200).json({
      message: "Book Deleted Successfully",
    });
  } catch (error) {
    console.error("Error during Book-Deleting:", error); // Log the actual error
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//below all public apis
//get all books
router.get("/get-all-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    return res.json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    console.error("Error during getting all books:", error); // Log the actual error
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//get recently added books limit 4
router.get("/get-recent-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(4);
    return res.json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    console.error("Error during getting recent books:", error); // Log the actual error
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//get book by id
router.get("/get-book-by-id/:id", async(req, res) => {
    try {
        const { id } = req.params;//params means parameters url
        const book = await Book.findById(id);
        return res.json({
            status: "Success",
            data: book,
        });
    } catch (error) {
        console.error("Error during getting book by id :", error); // Log the actual error
    res.status(500).json({ message: "Internal Server Error" });
    }
})

module.exports = router;
