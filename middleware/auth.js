const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log("oui");
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.HASH);
    console.log(decodedToken);
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
