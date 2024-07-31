const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");
const Book = require("./book");
const Order = require("../models/order");

//place order
router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { order } = req.body;

    for (const orderData of order) {
      const newOrder = new Order({ user: id, book: orderData._id });
      const orderDataFromDb = await newOrder.save();

      //saving order in user model
      await User.findByIdAndUpdate(id, {
        $push: { orders: orderDataFromDb._id },
      });

      //clearing cart
      await User.findByIdAndUpdate(id, {
        $pull: { cart: orderData._id },
      });
    }
    return res.json({
      status: "Success",
      message: "Order Placed Successfully",
    });
  } catch {
    console.error("Error during placing a order :", error); // Log the actual error
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//get order history of particular user
router.get("/get-order-history", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate({
      path: "orders",
      populate: { path: "book" },
    });

    const orderData = userData.orders.reverse();
    return res.json({
      status: "Success",
      data: orderData,
    });
  } catch (error) {
    console.error("Error during getting a order history of a user :", error); // Log the actual error
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//admin roles
//get all orders --admin
router.get("/get-all-orders", authenticateToken, async (req, res) => {
  try {
    const userData = await Order.find()
      .populate({
        path: "book",
      })
      .populate({
        path: "user",
      })
      .sort({ createdAt: -1 });
    return res.json({
      status: "Success",
      data: userData,
    });
  } catch (error) {
    console.error("Error during getting a all orders :", error); // Log the actual error
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//updat oreder --admin
router.put("/update-order-status/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    //we can apply authenticate/ if else condition to check role is admin or not 
    await Order.findByIdAndUpdate(id, { status: req.body.status });
    return res.json({
      status: "Success",
      message: "Order Status Updated Successfully",
    });
  } catch (error) {
    console.error("Error during updating order status :", error); // Log the actual error
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
