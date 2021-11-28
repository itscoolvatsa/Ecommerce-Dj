const express = require("express");
const { currentUser } = require("../services/current-user");

const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req, res) => {
    res.send({ currentUser: req.currentUser || null });
});

module.exports = { currentUserRouter: router };
