const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");

//add book to favourite
router.put("/add-book-to-favourite", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookFavourite = userData.favourites.includes(bookid);
    if (isBookFavourite) {
      return res
        .status(200)
        .json({ message: "Book is in already in favourites" });
    }
    await User.findByIdAndUpdate(id, { $push: { favourites: bookid } });
    return res.status(200).json({ message: "Book added to Favourites" });
  } catch (error) {
    console.error("Error during adding book to favourite :", error); // Log the actual error
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//remove book from favourite
router.put(
  "/remove-book-from-favourite",
  authenticateToken,
  async (req, res) => {
    try {
      const { bookid, id } = req.headers;
      const userData = await User.findById(id);
      const isBookFavourite = userData.favourites.includes(bookid);
      if (isBookFavourite) {
        await User.findByIdAndUpdate(id, { $pull: { favourites: bookid } });
      }

      return res.status(200).json({ message: "Book removed from Favourites" });
    } catch (error) {
      console.error("Error during removing book from favourites :", error); // Log the actual error
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

//get favourite books of a particular user
router.get("/get-favourite-books", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate("favourites"); //if populate is not used it returns only id of book
    const favouriteBooks = userData.favourites;
    return res.json({
      status: "Success",
      data: favouriteBooks,
    });
  } catch (error) {
    console.error("Error during getting favourites book of user :", error); // Log the actual error
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
