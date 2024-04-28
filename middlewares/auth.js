const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, resp, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    console.log(token);

    if (!token) {
      return resp.status(400).json({
        message: "Unauthorized",
      });
    }

    const payload = jwt.verify(token, process.env.SECRET);

    console.log(payload)

    req.user = payload.id;

    next();
  } catch (error) {
    console.log(error)
    resp.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};
