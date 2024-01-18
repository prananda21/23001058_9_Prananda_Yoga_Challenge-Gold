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
app.use((req, res, next) => {
  if (
    req.method !== "GET" &&
    req.method !== "POST" &&
    req.method !== "DELETE"
  ) {
    res.status(405).json("Method Not Allowed!");
  }
  next();
});

// method 3. display Data Item
app.use("/items", itemRouter);
app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "POST") {
    res.status(405).json("Method Not Allowed!");
  }
  next();
});

// method 4. create new order & method 5. update order status
app.use("/order", orderRouter);
app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "POST" && req.method !== "PUT") {
    res.status(405).json("Method Not Allowed!");
  }
  next();
});

app.use((req, res, next) => {
  if (req.method !== "GET") {
    res.status(405).json("Method Not Allowed!");
  }
  next();
});

app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    errors: "Not Found",
  });
});

app.listen(port, () => {
  console.log(`This app listening at http://localhost:${port}`);
});
