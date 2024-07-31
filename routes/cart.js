const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");

//put book to a cart
router.put("/add-to-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookinCart = userData.cart.includes(bookid);
    if (isBookinCart) {
      return res.status(200).json({ message: "Book is in already in cart" });
    }
    await User.findByIdAndUpdate(id, { $push: { cart: bookid } });
    return res.status(200).json({
      status: "Success",
      message: "Book added to Cart",
    });
  } catch (error) {
    console.error("Error during adding book to cart :", error); // Log the actual error
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//remove book from cart
router.put(
    "/remove-from-cart/:bookid",
    authenticateToken,
    async (req, res) => {
      try {
        const { bookid } = req.params;
        const { id } = req.headers;
        await User.findByIdAndUpdate(id, {
            $pull: { cart: bookid },
        });
         
        return res.json({ 
            status: "Success",
            message: "Book removed from Cart" });
      } catch (error) {
        console.error("Error during removing book from favourites :", error); // Log the actual error
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  );

  //get cart of a particular user
  router.get("/get-user-cart", authenticateToken, async (req, res) => {
    try {
      const { id } = req.headers;
      const userData = await User.findById(id).populate("cart"); //if populate is not used it returns only id of book
      const cart = userData.cart.reverse();
      return res.json({
        status: "Success",
        data: cart,
      });
    } catch (error) {
      console.error("Error during getting book in the cart of user :", error); // Log the actual error
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

// router.get("/get-user-cart", authenticateToken, async (req, res) => {
//     try {
//       const { id } = req.headers;
//       if (!id) {
//         return res.status(400).json({ message: "User ID is required" });
//       }
  
//       const userData = await User.findById(id).populate("cart");
//       if (!userData) {
//         return res.status(404).json({ message: "User not found" });
//       }
  
//       console.log("User data with populated cart:", userData);
//       const cart = userData.cart.reverse();
//       return res.json({
//         status: "Success",
//         data: cart,
//       });
//     } catch (error) {
//       console.error("Error during getting book in the cart of user:", error); // Log the actual error
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   });
  

module.exports = router;
