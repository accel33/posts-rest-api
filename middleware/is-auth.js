const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization"); //! Bearer + token
  if (!authHeader) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1]; // split by space into array
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "somesupersecretsecret"); //! User Login data
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  //! If it didin't failed but it wasn't able to verify, then is undefined
  if (!decodedToken) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  //! Now we have a valid token
  req.userId = decodedToken.userId;
  next();
};
