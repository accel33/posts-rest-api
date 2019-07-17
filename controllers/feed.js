const { validationResult } = require("express-validator");

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
    return res
      .status(422)
      .json({
        message: "Validation failed, entered data is incorrect",
        errors: errors.array()
      });
  }
  const title = req.body.title;
  const content = req.body.content;
  // Create post in db
  res.status(201).json({
    // todo... Success a resource was created
    message: "Post created successfully",
    post: {
      _id: new Date().toISOString(),
      title: title,
      content: content,
      creator: {
        name: "Accel"
      },
      createdAt: new Date()
    }
  });
};
