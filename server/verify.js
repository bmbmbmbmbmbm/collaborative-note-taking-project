const jwt = require("jsonwebtoken");

async function verifyToken(req, res, next) {
    const token = req.headers["x-access-token"];
    if (!token) {
        res.status(400).json({ message: "invalid credentials" });
    } else {
        jwt.verify(token, "jwtSecret", function (err, decoded) {
            if (err) {
                res.status(400).json({ message: "Failed authentication" })
            } else {
                req.userId = decoded.id;
                next();
            }
        });
    }
}

module.exports = {
    verifyToken: verifyToken
}