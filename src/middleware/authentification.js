const jwt = require("jsonwebtoken");

const verifyTokenUser = (req, res, next) => {
  console.log("verifyToken");
  var tokenAnduser = { token: req.headers["authorization"] };
  switch (verifyToken(tokenAnduser)) {
    case -1: // No Token found
      return res.status(403).send("A token is required for authentication");
    case -2: // Invalid Token
      return res
        .status(401)
        .send("Invalid User Bearer Token, please login again");
    default: //Good Token
      global.email = tokenAnduser.email;
      global.type = tokenAnduser.type;
      return next();
  }
};