const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
const userRouter = require('./router/userRouter.js')
const itemRouter = require('./router/itemRouter.js')

// root => halamam utama
app.get('/', (req, res) => {
    res.send('Hello World!!');
})

app.use('/users', userRouter);
app.use('/items', itemRouter);

app.listen(port, () => {
    console.log(`This app listening at http://localhost:${port}`);
})