const express = require("express"),
	app = express(),
	port = 3000,
	morgan = require("morgan");

app.use(express.json()); // built in middleware to parsing to json
app.use(morgan("short"));

const userRouter = require("./router/userRouter.js"),
	itemRouter = require("./router/itemRouter.js");

// root => main page
app.get("/", (req, res) => {
	res.send("Hello World!!");
});

app.use("/users", userRouter);

// method 1. Register New Customer
app.use("/users/register", userRouter);

// method 2. Login Customer => return value login
app.use("/users/login", userRouter);

// method 3. display Data Item
app.use("/items", itemRouter);

// method 4. create new order
// ....

// method 5. update order status
// ....

app.listen(port, () => {
	console.log(`This app listening at http://localhost:${port}`);
});
