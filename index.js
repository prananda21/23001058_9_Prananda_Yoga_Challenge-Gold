const express = require("express");
const app = express();
const port = 3000;
const morgan = require("morgan");

app.use(express.json());
app.use(morgan("short"));

const userRouter = require("./router/userRouter.js");
const itemRouter = require("./router/itemRouter.js");
const orderRouter = require("./router/orderRouter.js");

app.get("/", (req, res) => {
  res.send("Welcome to Bingle!");
});

// method 1. Register New Customer and method 2. Login & Logout Customer
app.use("/users", userRouter);

// method 3. display Data Item
app.use("/items", itemRouter);

// method 4. create new order & method 5. update order status
app.use("/order", orderRouter);

app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `The requested endpoint "${req.method} ${req.url}" does not exist.`,
  });
});

app.listen(port, () => {
  console.log(`This app listening at http://localhost:${port}`);
});
