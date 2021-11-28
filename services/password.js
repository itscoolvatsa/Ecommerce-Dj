const { scryptSync, randomBytes } = require("crypto");

const toHash = async (password) => {
    const salt = randomBytes(8).toString("hex");
    const buf = await scryptSync(password, salt, 64);

    return `${buf.toString("hex")}.${salt}`;
};

const compare = async (storedPassword, suppliedPassword) => {
    const [hashedPassword, salt] = storedPassword.split(".");
    const buf = await scryptSync(suppliedPassword, salt, 64);

    return buf.toString("hex") === hashedPassword;
};

module.exports = {
    toHash,
    compare,
};
