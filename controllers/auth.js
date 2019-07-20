const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Valitation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  //! After all this validation we can start storing User on db
  //.. To store password we should Hash it
  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email: email,
        password: hashedPassword,
        name: name
      });
      return user.save();
    })
    .then(result => {
      res.status(201).json({ message: "User created.", userId: result._id });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  //! Get this info/data from the front-end
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  //! Search if there is a user with that email to login if true
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        const error = new Error("A user with this email could not be found.");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error("Wrong password");
        error.statusCode = 401;
        throw error;
      }
      //! Now we generate the JSON web Token
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString()
          //! The raw password is not stored here, because this would be return to the front-end, to the user to which the password belong. Even tho, it is not ideal
        },
        "somesupersecretsecret",
        { expiresIn: "1h" }
      );
      //! Now we have a token that we can return to the client
      //! Also in React we will be looking for that ID
      res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
