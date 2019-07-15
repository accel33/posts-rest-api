exports.getPosts = (req, res, next) => {
  //! The most important is to pass error code to the client on APIs.
  res.status(200).json({
    // todo... Success
    posts: [{ title: "First Post", content: "This is a post about a story" }]
  });
};

exports.postPosts = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  // Create post in db
  res.status(201).json({
    // todo... Success a resource was created
    message: "Post created successfully",
    post: { id: new Date().toISOString(), title: title, content: content }
  });
};
