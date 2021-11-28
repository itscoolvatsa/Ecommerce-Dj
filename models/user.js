const mongoose = require("mongoose");
const { toHash } = require("../services/password");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

userSchema.pre("save", async function (done) {
    if (this.isModified("password")) {
        const hashed = await toHash(this.get("password"));
        this.set("password", hashed);
    }
    done();
});

userSchema.statics.build = (attrs) => {
    return new User(attrs);
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
