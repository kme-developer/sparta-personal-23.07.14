// app.js

const express = require('express');
const app = express();
const port = 3000;

const userRouter = require('./routes/users.routes.js');

// cookie parser
const cookieParser = require('cookie-parser');

// Middleware
app.use(express.json()); // req.body parser
app.use(cookieParser()); // cookie parser

// localhost:3000/api/
app.use('/api', userRouter);

app.listen(port, () => {
  console.log(port, '=> server open!');
});
