const express = require('express');
const path = require('path');

const app = express();
const publicPath = path.join(__dirname, '../public');
let port = process.env.PORT || 3000;

app.use(express.static(publicPath));

app.listen(port,() => {
    console.log(`Started up at port ${port}`)
});