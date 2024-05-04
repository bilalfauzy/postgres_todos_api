const jwt = require("jsonwebtoken");
require("dotenv").config();

//middleware will continue if the token is inside the local storage
module.exports = function (req, res, next) {
  // Get token from header
  const {authorization} = req.headers

  // return if there is no token
  if (!authorization) {
    return res.status(403).json({
      message: "Authorization denied."
    })
  }
  
  // Verify token
  try {
    const token = authorization.split(' ')[1]
    //it is going to give the user id (user:{id: user.id})
    const verify = jwt.verify(token, process.env.JWT_SECRET);

    req.user = verify.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};