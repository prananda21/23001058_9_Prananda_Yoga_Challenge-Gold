const express = require("express");
const app = express();
const port = 3000;
const morgan = require("morgan");
const bodyParser = require("body-parser");

app.use(express.json()); // built in middleware to parsing to json
app.use(morgan("short"));
app.use(bodyParser.json());

const [userRouter, userLogRouter] = require("./router/userRouter.js");
const itemRouter = require("./router/itemRouter.js");

// root => main page
app.get("/", (req, res) => {
  res.send("Hello World!!");
});

// method 1. Register New Customer
app.use("/users/", userRouter);

// method 2. Login & Logout Customer
app.use("/users/", userLogRouter);

// method 3. display Data Item
app.use("/items", itemRouter);

// method 4. create new order
// ....

// method 5. update order status
// ....

app.listen(port, () => {
  console.log(`This app listening at http://localhost:${port}`);
});
