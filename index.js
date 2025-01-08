const express = require('express');

const app = express();
const bookRoute = require('./routes/books.route');
app.use(express.json());

app.use("/api/books", bookRoute);

const PORT = 8080;

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})