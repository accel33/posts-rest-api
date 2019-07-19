const { validationResult } = require("express-validator");
const Post = require("../models/post");
const fs = require("fs");
const path = require("path");

exports.getPosts = (req, res, next) => {
  //! The most important is to pass error code to the client on APIs.
  Post.find()
    .then(posts => {
      res.status(200).json({
        message: "Get data succesfully",
        posts: posts
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  //! Checking for multer files
  if (!req.file) {
    const error = new Error("No image provided.");
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path; //! path variable generate by multer
  const imagePosix = imageUrl.replace(/\\/g, "/");
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imagePosix, //path.resolve(imageUrl),
    creator: { name: "Accel" }
  });

  post // * Send and store the data to mongodb
    .save()
    .then(result => {
      res.status(201).json({
        message: "Post created successfully",
        post: result //! Result is the post we save on the db
      });
      console.log(imagePosix);
      console.log(result);
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
        const error = new Error("Could not find post.");
        error.statusCode = 404; //* Not found!
        throw error; //todo When throw inside a then, the next catch block is reached
      }
      res.status(200).json({
        message: "Post fetched",
        post: post
      });
      console.log(post);
    })
    .catch(err => {
      //! This catch server-side error
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error("No file picked.");
    error.statusCode = 422;
    return error;
  }
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404; //* Not found!
        throw error; //todo When throw inside a then, the next catch block is reached
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      const imagePosix = imageUrl.replace(/\\/g, "/");
      post.title = title;
      post.imageUrl = imagePosix;
      post.content = content;
      return post.save();
      // ! Overwriting the old post, but keeping the old ID
    })
    .then(result => {
      res.status(200).json({ message: "Post updated!", post: result });
      console.log(result);
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      //! Check logged in user
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404; //* Not found!
        throw error; //todo When throw inside a then, the next catch block is reached
      }
      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then(result => {
      console.log(result);
      res.status(200).json({ message: "Deleted post." });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
  //! Want to verify weather the user created the post before delete it
};

const clearImage = filePath => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, err => console.log(err)); //! Unlink delete the file on the filepath
};
