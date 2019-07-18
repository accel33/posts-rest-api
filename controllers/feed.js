const { validationResult } = require("express-validator");
const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  //! The most important is to pass error code to the client on APIs.
  Post.find()
    .then(posts => {
      res.status(200).json({
        message: "Get data succesfully",
        posts: posts
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

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error("Could not find product");
        error.statusCode = 404; //* Not found!
        throw error; //todo When throw inside a then, the next catch block is reached
      }
      res.status(200).json({
        message: "Product was found",
        post: post
      });
    })
    .catch(err => {
      //! This catch server-side error
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
