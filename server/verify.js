const jwt = require("jsonwebtoken");

async function verifyToken(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) {
        res.status(400).json({ message: "invalid credentials" });
    } else {
        jwt.verify(token, "aISxTgwXv6COzRBj4xK34NVvhe7PTqBjP7Tfh0ORcHTxuaAPWRtw2nCZCruQPq4NyxqMcIhPG1Nyq6skY4RXCkPrXQOkvcwEBxuD008mZlkCF4QXT38QqPpFHiQOSDGF",
            function (err, decoded) {
                if (err) {
                    console.log(err);
                    res.status(400).json({ message: "Failed authentication" });
                } else {
                    console.log("poopies");
                    req.userId = decoded.id;
                    req.username = decoded.username;
                    next();
                }
            });
    }
}

module.exports = {
    verifyToken: verifyToken
}