const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../database");

const router = express.Router();

router.post("/", async function (req, res) {
    try {
        const { email, password } = req.body;
        const select = `SELECT * FROM users WHERE email='${email}'`
        const record = await db.promise().query(select);
        
        if(record[0].length === 1) {
            bcrypt.compare(password, record[0][0].password, (err, result) => {
                if(err) {
                    console.log(err)
                } else {
                    if(result === true) {
                        const id = record[0][0].user_id
                        const token = jwt.sign({id}, "jwtSecret", {
                            expiresIn: 300,
                        })
                        req.session.user = record[0][0];
                        res.status(200).json({auth: true, token: token, result: record[0][0]});
                    } else {
                        res.status(400).json({message: "Invalid credentials"})
                    }
                }
            })
        } else {
            res.status(400).json({ msg: "Invalid credentials" })
        }
    } catch (err) {
        console.log(err);
        res.status(404);
    }
});

function verifyJWT(req, res, next) {
    const token = req.headers["x-access-token"];
    if(!token) {
        res.status(400).json({message: "No token"});
    } else {
        jwt.verify(token, "jwtSecret", function(err, decoded){
            if(err) {
                res.status(400).json({message: "Failed authentication"})
            } else {
                req.userId = decoded.id;
                next();
            }
        })
    }
}

router.get("/isAuth/", verifyJWT, function(req, res) {

});

module.exports = router;
