const express = require('express');
const app = express();
const port = 3000;

// root => halamam utama
app.get('/', (req, res) => {
    res.send('Halo gais, ini submission Challenge Gold dari Prananda Yoga');
})

app.get('/about', (req, res) => {
    res.send('Ini adalah halaman about');
})

app.listen(port, () => {
    console.log(`This app listening at http://localhost:${port}`);
})