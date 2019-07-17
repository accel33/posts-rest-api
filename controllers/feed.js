const { validationResult } = require("express-validator");
const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  //! The most important is to pass error code to the client on APIs.
  res.status(200).json({
    // todo... Success
    posts: [
      {
        _id: "1234qwer",
        title: "First Post",
        content: "This is a post about a story",
        imageUrl: "images/duca.jpg",
        creator: {
          name: "Accel"
        },
        createdAt: new Date()
      }
    ]
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed, entered data is incorrect",
      errors: errors.array()
    });
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
    .catch(err => console.log(err));
};
