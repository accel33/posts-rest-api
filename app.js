const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const feedRoutes = require("./routes/feed");
const app = express();

//todo app.use(bodyParser.urlencoded({ extended: true })); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json. // * Able to extraxt from body parser
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use("/feed", feedRoutes);
// We could do routes in here using, app.use / app.post / app.put('/path') etc. But we will use the express router again
mongoose
  .connect("mongodb://localhost/messages")
  .then(result => {
    app.listen(8080);
  })
  .catch(err => console.log(err));
