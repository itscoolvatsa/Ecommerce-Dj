const express = require("express");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const { compare } = require("../services/password");
const { User } = require("../models/user");

const router = express.Router();

router.post(
    "/api/users/signin",
    [
        body("email").isEmail().withMessage("Email Must be Valid"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("You must supply password"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json(errors);
            return;
        }

        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            console.log("Invalid credentials");
            return;
        }

        const passwordMatch = await compare(existingUser.password, password);

        if (!passwordMatch) {
            console.log("Invalid credentials");
            return;
        }

        // Generate JWT
        const userJwt = jwt.sign(
            {
                id: existingUser.id,
                email: existingUser.email,
            },
            process.env.JWT_KEY
        );

        // Store it on session object
        req.session.jwt = userJwt;

        res.status(200).send(existingUser.email);
    }
);

module.exports = { signinRouter: router };
