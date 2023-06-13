const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decodedToken;

    req.headers.userId = userId;

    next();
};
