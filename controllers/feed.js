const { validationResult } = require("express-validator");
const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  //! The most important is to pass error code to the client on APIs.
  Post.find()
    .then(result => {
      res.status(200).json({
        message: "Get data succesfully",
        posts: result
      });
    })
    .catch(err => console.log(err));
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    throw error;
    // return res.status(422).json({
    //   message: "Validation failed, entered data is incorrect",
    //   errors: errors.array()
    // });
  }
  const title = req.body.title;
  const content = req.body.content;
  // * Declare db field
  const post = new Post({
    title: title,
    content: content,
    imageUrl: "images/duca.jpg",
    creator: {
      name: "Accel"
    }
  });
  post // * Send and store the data to mongodb
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Post created successfully",
        post: result //! Result is the post we save on the db
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
