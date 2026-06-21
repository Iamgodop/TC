const express = require("express");
const bcrypt = require("bcrypt");
const router = express().Router();

router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userAlrExists = await checkIfUserExists(email);
        if (!username || !email || !password) {
            res.status(422).json({"message": "Missing values!"})
            return;
        }
        if (userAlrExists) {
            res.status(409).json({"message": "User already exists!"});
            return;
        }
        const hashed = await bcrypt.hash(password, 10);
        const status = await registerUser(username, email, hashed);
        if (status) {
            res.status(200).json({"message": "User registered successfully!"});
            return;
        } else {
            res.status(500).json({"message": "Please try again"});
            return;
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({"message": err});
        return;
    }
});

router.post("/login", (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await getUser(email);
        if (!user) {
            res.status(404).json({"message": "User not found!"});
            return;
        }
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const token = jwt.sign(
                {
                email: user.email,
                id: user.id
                }, process.env.JWT_SECRET,
                {
                    expiresIn: "7d"
                }
            );
            res.status(200).json({"token": token});
            return;
        } else {
            res.status(401).json({"message": "Incorrect password!"});
            return;
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({"message": err});
    }
});

module.export = router;