const express = require("express");
const app = express();
const cors = require("cors");//used to transfer data from backend to frontend
require("dotenv").config();
require("./conn/conn");
const user = require("./routes/user");
const Books = require("./routes/book");
const Favourite = require("./routes/favourite");
const Cart = require("./routes/cart");
const Order = require("./routes/order");

app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());

//routes
app.use("/api/v1", user);
app.use("/api/v1", Books);
app.use("/api/v1", Favourite);
app.use("/api/v1", Cart);
app.use("/api/v1", Order);





//checking the server
app.get("/", (req, res) => {
    res.send("Hello from backend site");
});

//creating port
app.listen(process.env.PORT, () => {
    console.log(`Server Started on ${process.env.PORT}`);
});

 