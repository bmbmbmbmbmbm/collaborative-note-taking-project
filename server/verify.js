import JWT from "jsonwebtoken";
const verify = JWT.verify

async function verifyToken(req, res, next) {
    const token = req.headers["authorization"];
    
    if (!token) {
        res.status(400).json({ message: "invalid credentials" });
    } else {
        verify(token, "aISxTgwXv6COzRBj4xK34NVvhe7PTqBjP7Tfh0ORcHTxuaAPWRtw2nCZCruQPq4NyxqMcIhPG1Nyq6skY4RXCkPrXQOkvcwEBxuD008mZlkCF4QXT38QqPpFHiQOSDGF",
            function (err, decoded) {
                if (err) {

                    res.status(400).json({ message: "Failed authorisation" });
                } else {
                    req.userId = decoded.id;
                    req.username = decoded.username;
                    next();
                }
            });
    }
}

export default verifyToken