const express = require("express");
const { signupRouter } = require("./auth/signup");
const { signinRouter } = require("./auth/signin");
const { currentUserRouter } = require("./auth/current");
const { signoutRouter } = require("./auth/signout");
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();

// variables
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

// DB
try {
    mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("connected to mongodb");
} catch (err) {
    console.log(err);
}

// middlewares
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(
    session({
        secret: process.env.JWT_KEY,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({ mongoUrl: MONGO_URI, dbName: "session-db" }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, //Equals to 1 day
        },
    })
);

// Routes
app.use(signupRouter);
app.use(signinRouter);
app.use(currentUserRouter);
app.use(signoutRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
